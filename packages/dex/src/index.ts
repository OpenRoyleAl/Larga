import { signTape } from "../../shared/src/certify";
import { page } from "../../shared/src/hud";
import { newUserId, normalizeHandle } from "../../shared/src/handle";
import type { CertifyTape, PetPack, PetState } from "../../shared/src/types";
import { boardPage, installPage, landing, profilePage, rowHtml } from "./pages";

export interface Env {
  DB: D1Database;
  PRESENCE: DurableObjectNamespace;
  CUP_NAME: string;
  CERT_SECRET: string;
  SERVICE_SECRET: string;
}

type UserRow = {
  user_id: string;
  handle: string;
  created_at: string;
  github_login: string | null;
  github_url: string | null;
  github_repos: number | null;
  cursor_url: string | null;
  pet_json: string | null;
  tokens_in: number;
  tokens_out: number;
  hops: number;
  failovers: number;
  graphs: number;
};

function cookieUid(req: Request): string | null {
  const m = req.headers.get("cookie")?.match(/(?:^|; )larga_uid=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

function setUid(id: string): string {
  return `larga_uid=${encodeURIComponent(id)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=315360000`;
}

function json(data: unknown, status = 200, headers?: HeadersInit): Response {
  return Response.json(data, { status, headers });
}

function wantHtml(req: Request): boolean {
  return (req.headers.get("accept") || "").includes("text/html");
}

function serviceOk(req: Request, env: Env): boolean {
  const a = req.headers.get("authorization") || "";
  return !!env.SERVICE_SECRET && a === `Bearer ${env.SERVICE_SECRET}`;
}

function parsePet(raw: string | null): PetPack | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PetPack;
  } catch {
    return null;
  }
}

export class Presence implements DurableObject {
  constructor(private readonly ctx: DurableObjectState) {}

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const map = (await this.ctx.storage.get<Record<string, { handle: string; state: PetState; at: number }>>("m")) ?? {};
    const now = Date.now();
    for (const [k, v] of Object.entries(map)) {
      if (now - v.at > 45_000) map[k] = { ...v, state: "idle" };
    }
    if (req.method === "GET") {
      return Response.json(map);
    }
    if (req.method === "POST") {
      const b = (await req.json()) as { userId: string; handle?: string; state: PetState };
      map[b.userId] = { handle: b.handle || map[b.userId]?.handle || "", state: b.state, at: now };
      await this.ctx.storage.put("m", map);
      return Response.json({ ok: true });
    }
    if (url.pathname.includes("handle") && req.method === "PUT") {
      const b = (await req.json()) as { userId: string; handle: string };
      if (map[b.userId]) map[b.userId].handle = b.handle;
      await this.ctx.storage.put("m", map);
      return Response.json({ ok: true });
    }
    return json({ error: "no" }, 404);
  }
}

async function presenceStub(env: Env) {
  return env.PRESENCE.get(env.PRESENCE.idFromName("board"));
}

async function boardRows(env: Env): Promise<string> {
  const users = await env.DB.prepare(
    `SELECT * FROM users ORDER BY graphs DESC, failovers DESC, tokens_out DESC LIMIT 50`,
  ).all<UserRow>();
  const pres = (await (await presenceStub(env)).fetch("https://p/")) as Response;
  const map = (await pres.json()) as Record<string, { state: PetState }>;
  return (users.results || [])
    .map((u) =>
      rowHtml({
        handle: u.handle,
        userId: u.user_id,
        tokensOut: u.tokens_out,
        failovers: u.failovers,
        graphs: u.graphs,
        state: map[u.user_id]?.state,
        pet: parsePet(u.pet_json),
      }),
    )
    .join("");
}

async function userById(env: Env, id: string) {
  return env.DB.prepare(`SELECT * FROM users WHERE user_id = ?`).bind(id).first<UserRow>();
}

async function userByHandle(env: Env, handle: string) {
  return env.DB.prepare(`SELECT * FROM users WHERE handle = ?`).bind(handle).first<UserRow>();
}

async function buildTape(env: Env, u: UserRow): Promise<CertifyTape> {
  const facts = await env.DB.prepare(`SELECT kind, detail, at FROM facts WHERE user_id = ? ORDER BY id DESC LIMIT 40`)
    .bind(u.user_id)
    .all<{ kind: string; detail: string; at: string }>();
  const tape: CertifyTape = {
    schema: "larga.tape.v1",
    userId: u.user_id,
    handle: u.handle,
    issuedAt: new Date().toISOString(),
    cup: env.CUP_NAME,
    lenses: {
      github: u.github_login
        ? { login: u.github_login, htmlUrl: u.github_url || "", publicRepos: u.github_repos || 0 }
        : undefined,
      cursor: u.cursor_url ? { profileUrl: u.cursor_url } : undefined,
      drive: {
        tokensIn: u.tokens_in,
        tokensOut: u.tokens_out,
        hops: u.hops,
        providers: [],
        failovers: u.failovers,
      },
      grid: { graphs: u.graphs },
    },
    facts: (facts.results || []).map((f) => ({ kind: f.kind, at: f.at, detail: f.detail })),
    pet: parsePet(u.pet_json) || undefined,
  };
  if (env.CERT_SECRET) tape.signature = await signTape(tape, env.CERT_SECRET);
  return tape;
}

async function form(req: Request): Promise<URLSearchParams> {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("json")) {
    const j = (await req.json()) as Record<string, string>;
    return new URLSearchParams(j);
  }
  return new URLSearchParams(await req.text());
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    return fetchProfile(req, env);
  },
} satisfies ExportedHandler<Env>;

export async function fetchProfile(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const { pathname } = url;

    if (pathname === "/health") {
      return json({ ok: true, app: "larga", cup: env.CUP_NAME });
    }

    if (pathname === "/install" && req.method === "GET") {
      return html(installPage(env.CUP_NAME));
    }

    if (pathname === "/" && req.method === "GET") {
      const kettle = await env.DB.prepare(`SELECT remaining FROM kettle WHERE id = 1`).first<{ remaining: number }>();
      return html(landing(env.CUP_NAME, await boardRows(env), kettle?.remaining ?? 0));
    }

    if (pathname === "/board" && req.method === "GET") {
      return html(boardPage(env.CUP_NAME, await boardRows(env)));
    }

    if (pathname === "/v1/board/stream") {
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      const enc = new TextEncoder();
      (async () => {
        try {
          for (let i = 0; i < 90; i++) {
            const rows = await boardRows(env);
            await writer.write(enc.encode(`data: ${JSON.stringify(rows)}\n\n`));
            await new Promise((r) => setTimeout(r, 2000));
          }
        } finally {
          await writer.close();
        }
      })();
      return new Response(readable, {
        headers: { "content-type": "text/event-stream", "cache-control": "no-cache" },
      });
    }

    if (pathname === "/v1/claim" && req.method === "POST") {
      const f = await form(req);
      const handle = normalizeHandle(f.get("handle") || "");
      if (!handle) return json({ error: "bad handle" }, 400);
      const taken = await userByHandle(env, handle);
      let uid = cookieUid(req);
      if (uid && (await userById(env, uid))) {
        return json({ error: "already claimed — rename on /me" }, 409);
      }
      if (taken) return json({ error: "handle taken" }, 409);
      uid = newUserId();
      const now = new Date().toISOString();
      await env.DB.prepare(
        `INSERT INTO users (user_id, handle, created_at) VALUES (?, ?, ?)`,
      )
        .bind(uid, handle, now)
        .run();
      await env.DB.prepare(
        `INSERT INTO handle_history (user_id, handle, from_at) VALUES (?, ?, ?)`,
      )
        .bind(uid, handle, now)
        .run();
      if (wantHtml(req) || (req.headers.get("content-type") || "").includes("form")) {
        return new Response(null, { status: 302, headers: { location: "/me", "set-cookie": setUid(uid) } });
      }
      return json({ userId: uid, handle }, 201, { "set-cookie": setUid(uid) });
    }

    if (pathname === "/me" && req.method === "GET") {
      const uid = cookieUid(req);
      if (!uid) return new Response(null, { status: 302, headers: { location: "/" } });
      const u = await userById(env, uid);
      if (!u) return new Response(null, { status: 302, headers: { location: "/" } });
      const hist = await env.DB.prepare(`SELECT handle FROM handle_history WHERE user_id = ? ORDER BY id`)
        .bind(uid)
        .all<{ handle: string }>();
      return html(
        profilePage({
          handle: u.handle,
          userId: u.user_id,
          github: u.github_login || undefined,
          cursor: u.cursor_url || undefined,
          petName: parsePet(u.pet_json)?.displayName,
          history: (hist.results || []).map((h) => h.handle),
          mine: true,
        }),
      );
    }

    if (pathname.startsWith("/u/") && req.method === "GET") {
      const parts = pathname.split("/").filter(Boolean);
      const handle = parts[1];
      const u = await userByHandle(env, handle);
      if (!u) return json({ error: "gone" }, 404);
      if (parts[2] === "tape") {
        return json(await buildTape(env, u), 200, { "access-control-allow-origin": "*" });
      }
      const hist = await env.DB.prepare(`SELECT handle FROM handle_history WHERE user_id = ? ORDER BY id`)
        .bind(u.user_id)
        .all<{ handle: string }>();
      return html(
        profilePage({
          handle: u.handle,
          userId: u.user_id,
          github: u.github_login || undefined,
          cursor: u.cursor_url || undefined,
          petName: parsePet(u.pet_json)?.displayName,
          history: (hist.results || []).map((h) => h.handle),
          mine: false,
        }),
      );
    }

    if (pathname === "/v1/handle" && req.method === "POST") {
      const uid = cookieUid(req);
      if (!uid) return json({ error: "no session" }, 401);
      const f = await form(req);
      const handle = normalizeHandle(f.get("handle") || "");
      if (!handle) return json({ error: "bad handle" }, 400);
      const u = await userById(env, uid);
      if (!u) return json({ error: "no user" }, 401);
      if (await userByHandle(env, handle)) return json({ error: "taken" }, 409);
      const now = new Date().toISOString();
      await env.DB.prepare(`UPDATE handle_history SET to_at = ? WHERE user_id = ? AND to_at IS NULL`)
        .bind(now, uid)
        .run();
      await env.DB.prepare(`UPDATE users SET handle = ? WHERE user_id = ?`).bind(handle, uid).run();
      await env.DB.prepare(`INSERT INTO handle_history (user_id, handle, from_at) VALUES (?, ?, ?)`)
        .bind(uid, handle, now)
        .run();
      await (await presenceStub(env)).fetch(
        new Request("https://p/handle", {
          method: "PUT",
          body: JSON.stringify({ userId: uid, handle }),
        }),
      );
      if (wantHtml(req) || (req.headers.get("content-type") || "").includes("form")) {
        return new Response(null, { status: 302, headers: { location: "/me" } });
      }
      return json({ handle, userId: uid });
    }

    if (pathname === "/v1/github" && req.method === "POST") {
      const uid = cookieUid(req);
      if (!uid) return json({ error: "no session" }, 401);
      const f = await form(req);
      const login = (f.get("login") || "").replace(/^@/, "").trim();
      if (!login) return json({ error: "login required" }, 400);
      const gh = await fetch(`https://api.github.com/users/${encodeURIComponent(login)}`, {
        headers: { "user-agent": "larga-dex", accept: "application/vnd.github+json" },
      });
      if (!gh.ok) return json({ error: "github user not found" }, 404);
      const j = (await gh.json()) as { login: string; html_url: string; public_repos: number };
      await env.DB.prepare(
        `UPDATE users SET github_login = ?, github_url = ?, github_repos = ? WHERE user_id = ?`,
      )
        .bind(j.login, j.html_url, j.public_repos, uid)
        .run();
      await env.DB.prepare(`INSERT INTO facts (user_id, kind, detail, at) VALUES (?, ?, ?, ?)`)
        .bind(uid, "lens.github", j.html_url, new Date().toISOString())
        .run();
      return redirectOrJson(req, "/me", { ok: true, github: j });
    }

    if (pathname === "/v1/cursor" && req.method === "POST") {
      const uid = cookieUid(req);
      if (!uid) return json({ error: "no session" }, 401);
      const f = await form(req);
      const cursorUrl = (f.get("url") || "").trim();
      await env.DB.prepare(`UPDATE users SET cursor_url = ? WHERE user_id = ?`).bind(cursorUrl, uid).run();
      await env.DB.prepare(`INSERT INTO facts (user_id, kind, detail, at) VALUES (?, ?, ?, ?)`)
        .bind(uid, "lens.cursor", cursorUrl, new Date().toISOString())
        .run();
      return redirectOrJson(req, "/me", { ok: true });
    }

    if (pathname === "/v1/pet" && req.method === "POST") {
      const uid = cookieUid(req);
      if (!uid) return json({ error: "no session" }, 401);
      const f = await form(req);
      const raw = f.get("pet") || "";
      const pet = parsePet(raw);
      if (!pet?.id || !pet.displayName) return json({ error: "pet.json needs id and displayName" }, 400);
      await env.DB.prepare(`UPDATE users SET pet_json = ? WHERE user_id = ?`).bind(JSON.stringify(pet), uid).run();
      return redirectOrJson(req, "/me", { ok: true, pet });
    }

    if (pathname === "/v1/facts" && req.method === "POST") {
      if (!serviceOk(req, env)) return json({ error: "unauthorized" }, 401);
      const b = (await req.json()) as {
        userId: string;
        kind: string;
        detail: string;
        tokensIn?: number;
        tokensOut?: number;
      };
      const u = await userById(env, b.userId);
      if (!u) return json({ error: "no user" }, 404);
      const hops = b.kind === "drive.complete" ? 1 : 0;
      let failovers = 0;
      try {
        const d = JSON.parse(b.detail) as { hops?: Array<{ ok: boolean }> };
        failovers = (d.hops || []).filter((h) => !h.ok).length;
      } catch {
        /* ignore */
      }
      const graphs = b.kind === "grid.run" ? 1 : 0;
      await env.DB.prepare(`INSERT INTO facts (user_id, kind, detail, at) VALUES (?, ?, ?, ?)`)
        .bind(b.userId, b.kind, b.detail, new Date().toISOString())
        .run();
      await env.DB.prepare(
        `UPDATE users SET tokens_in = tokens_in + ?, tokens_out = tokens_out + ?, hops = hops + ?, failovers = failovers + ?, graphs = graphs + ? WHERE user_id = ?`,
      )
        .bind(b.tokensIn ?? 0, b.tokensOut ?? 0, hops, failovers, graphs, b.userId)
        .run();
      return json({ ok: true });
    }

    if (pathname === "/v1/presence" && req.method === "POST") {
      if (!serviceOk(req, env)) return json({ error: "unauthorized" }, 401);
      const b = (await req.json()) as { userId: string; state: PetState };
      const u = await userById(env, b.userId);
      await (await presenceStub(env)).fetch(
        new Request("https://p/", {
          method: "POST",
          body: JSON.stringify({ userId: b.userId, handle: u?.handle, state: b.state }),
        }),
      );
      return json({ ok: true });
    }

    if ((pathname === "/certify" || pathname === "/v1/certify") && req.method === "GET") {
      const uid = cookieUid(req);
      if (!uid) return json({ error: "no session" }, 401);
      const u = await userById(env, uid);
      if (!u) return json({ error: "no user" }, 404);
      const tape = await buildTape(env, u);
      if (pathname === "/certify" && wantHtml(req)) {
        return html(
          page(
            "Larga Tape",
            `<div class="wrap"><header class="brand"><h1>Tape</h1></header>
          <p class="tag">Resume + case study + cover letter. user_id is the contract.</p>
          <pre>${escapePre(JSON.stringify(tape, null, 2))}</pre>
          <p><a href="/v1/certify">raw json</a></p></div>`,
          ),
        );
      }
      return json(tape);
    }

    if (pathname === "/v1/kettle" && req.method === "GET") {
      const k = await env.DB.prepare(`SELECT remaining, note FROM kettle WHERE id = 1`).first();
      return json(k);
    }

    if (pathname === "/v1/kettle/draw" && req.method === "POST") {
      const uid = cookieUid(req);
      if (!uid) return json({ error: "no session" }, 401);
      const k = await env.DB.prepare(`SELECT remaining FROM kettle WHERE id = 1`).first<{ remaining: number }>();
      if (!k || k.remaining < 1) return json({ error: "kettle empty" }, 409);
      await env.DB.prepare(`UPDATE kettle SET remaining = remaining - 1 WHERE id = 1`).run();
      await env.DB.prepare(`INSERT INTO facts (user_id, kind, detail, at) VALUES (?, ?, ?, ?)`)
        .bind(uid, "kettle.draw", "1", new Date().toISOString())
        .run();
      return json({ ok: true, remaining: k.remaining - 1 });
    }

    return json({ error: "not found" }, 404);
}

function html(s: string): Response {
  return new Response(s, { headers: { "content-type": "text/html; charset=utf-8" } });
}

function escapePre(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]!));
}

function redirectOrJson(req: Request, loc: string, data: unknown): Response {
  if (wantHtml(req) || (req.headers.get("content-type") || "").includes("form")) {
    return new Response(null, { status: 302, headers: { location: loc } });
  }
  return json(data);
}
