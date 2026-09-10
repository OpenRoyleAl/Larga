import { handleFromLogin, newUserId, normalizeHandle } from "../../shared/src/handle";

export type OauthEnv = {
  DB: D1Database;
  CERT_SECRET: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
};

type UserRow = { user_id: string; handle: string };

function enc(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

function hex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmac(secret: string, msg: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc(secret || "larga-dev"), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  return hex(await crypto.subtle.sign("HMAC", key, enc(msg)));
}

function cookieFlags(req: Request): string {
  const https = new URL(req.url).protocol === "https:";
  return `Path=/; HttpOnly; SameSite=Lax${https ? "; Secure" : ""}`;
}

function setState(req: Request, state: string): string {
  return `larga_oauth=${encodeURIComponent(state)}; ${cookieFlags(req)}; Max-Age=600`;
}

function readState(req: Request): string | null {
  const m = req.headers.get("cookie")?.match(/(?:^|; )larga_oauth=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

function originOf(req: Request): string {
  return new URL(req.url).origin;
}

export function oauthButtons(env: Pick<OauthEnv, "GITHUB_CLIENT_ID" | "GOOGLE_CLIENT_ID">): string {
  const bits: string[] = [];
  if (env.GITHUB_CLIENT_ID) bits.push(`<a class="btn" href="/v1/oauth/github">Continue with GitHub</a>`);
  if (env.GOOGLE_CLIENT_ID) bits.push(`<a class="btn ghost" href="/v1/oauth/google">Continue with Google</a>`);
  if (!bits.length) return "";
  return `<div class="row" style="margin:.75rem 0">${bits.join("")}</div>`;
}

async function uniqueHandle(db: D1Database, want: string | null, id: string): Promise<string> {
  let base = want && normalizeHandle(want) ? want : handleFromLogin("pilot", id.replace(/-/g, "")) || `p${id.slice(0, 8)}`;
  if (!normalizeHandle(base)) base = `p${id.replace(/-/g, "").slice(0, 10)}`;
  for (let i = 0; i < 40; i++) {
    const h = i === 0 ? base : `${base.slice(0, 20)}-${i + 1}`.slice(0, 24);
    const n = normalizeHandle(h);
    if (!n) continue;
    const taken = await db.prepare(`SELECT user_id FROM users WHERE handle = ?`).bind(n).first();
    if (!taken) return n;
  }
  return `p${id.replace(/-/g, "").slice(0, 12)}`;
}

export async function fetchOauth(
  req: Request,
  env: OauthEnv,
  session: { cookieUid: string | null; setUid: (id: string) => string; redirect: (loc: string, cookies?: string[]) => Response },
): Promise<Response | null> {
  const url = new URL(req.url);
  const { pathname } = url;
  if (!pathname.startsWith("/v1/oauth/")) return null;

  if (pathname === "/v1/oauth/github" && req.method === "GET") {
    if (!env.GITHUB_CLIENT_ID) return new Response("GitHub sign-in is not wired", { status: 503 });
    const nonce = crypto.randomUUID();
    const state = `${nonce}.${await hmac(env.CERT_SECRET, `github:${nonce}`)}`;
    const redir = `${originOf(req)}/v1/oauth/github/callback`;
    const dest = new URL("https://github.com/login/oauth/authorize");
    dest.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
    dest.searchParams.set("redirect_uri", redir);
    dest.searchParams.set("scope", "read:user user:email");
    dest.searchParams.set("state", state);
    const h = new Headers({ location: dest.toString() });
    h.append("Set-Cookie", setState(req, state));
    return new Response(null, { status: 303, headers: h });
  }

  if (pathname === "/v1/oauth/google" && req.method === "GET") {
    if (!env.GOOGLE_CLIENT_ID) return new Response("Google sign-in is not wired", { status: 503 });
    const nonce = crypto.randomUUID();
    const state = `${nonce}.${await hmac(env.CERT_SECRET, `google:${nonce}`)}`;
    const redir = `${originOf(req)}/v1/oauth/google/callback`;
    const dest = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    dest.searchParams.set("client_id", env.GOOGLE_CLIENT_ID);
    dest.searchParams.set("redirect_uri", redir);
    dest.searchParams.set("response_type", "code");
    dest.searchParams.set("scope", "openid email profile");
    dest.searchParams.set("state", state);
    dest.searchParams.set("access_type", "online");
    dest.searchParams.set("prompt", "select_account");
    const h = new Headers({ location: dest.toString() });
    h.append("Set-Cookie", setState(req, state));
    return new Response(null, { status: 303, headers: h });
  }

  if (pathname === "/v1/oauth/github/callback") {
    return finishGithub(req, env, session, url);
  }
  if (pathname === "/v1/oauth/google/callback") {
    return finishGoogle(req, env, session, url);
  }
  return new Response("no", { status: 404 });
}

async function checkState(req: Request, env: OauthEnv, provider: string, state: string | null): Promise<boolean> {
  if (!state || state !== readState(req)) return false;
  const [nonce, sig] = state.split(".");
  if (!nonce || !sig) return false;
  return sig === (await hmac(env.CERT_SECRET, `${provider}:${nonce}`));
}

async function finishGithub(
  req: Request,
  env: OauthEnv,
  session: { cookieUid: string | null; setUid: (id: string) => string; redirect: (loc: string, cookies?: string[]) => Response },
  url: URL,
): Promise<Response> {
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) return session.redirect("/login");
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  if (!code || !(await checkState(req, env, "github", state))) return session.redirect("/login");
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${originOf(req)}/v1/oauth/github/callback`,
    }),
  });
  const tok = (await tokenRes.json()) as { access_token?: string };
  if (!tok.access_token) return session.redirect("/login");
  const gh = await fetch("https://api.github.com/user", {
    headers: { authorization: `Bearer ${tok.access_token}`, "user-agent": "larga", accept: "application/vnd.github+json" },
  });
  if (!gh.ok) return session.redirect("/login");
  const u = (await gh.json()) as { id: number; login: string; html_url: string; public_repos?: number; email?: string | null };
  const githubId = String(u.id);
  return upsertOauth(req, env, session, {
    githubId,
    googleSub: null,
    email: u.email || null,
    login: u.login,
    githubLogin: u.login,
    githubUrl: u.html_url,
    githubRepos: u.public_repos ?? 0,
  });
}

async function finishGoogle(
  req: Request,
  env: OauthEnv,
  session: { cookieUid: string | null; setUid: (id: string) => string; redirect: (loc: string, cookies?: string[]) => Response },
  url: URL,
): Promise<Response> {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) return session.redirect("/login");
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  if (!code || !(await checkState(req, env, "google", state))) return session.redirect("/login");
  const redir = `${originOf(req)}/v1/oauth/google/callback`;
  const body = new URLSearchParams({
    code,
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: redir,
    grant_type: "authorization_code",
  });
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const tok = (await tokenRes.json()) as { access_token?: string };
  if (!tok.access_token) return session.redirect("/login");
  const info = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { authorization: `Bearer ${tok.access_token}` },
  });
  if (!info.ok) return session.redirect("/login");
  const u = (await info.json()) as { sub: string; email?: string; name?: string };
  if (!u.sub) return session.redirect("/login");
  const login = (u.email || u.name || "pilot").split("@")[0] || "pilot";
  return upsertOauth(req, env, session, {
    githubId: null,
    googleSub: u.sub,
    email: u.email || null,
    login,
    githubLogin: null,
    githubUrl: null,
    githubRepos: null,
  });
}

async function upsertOauth(
  req: Request,
  env: OauthEnv,
  session: { cookieUid: string | null; setUid: (id: string) => string; redirect: (loc: string, cookies?: string[]) => Response },
  p: {
    githubId: string | null;
    googleSub: string | null;
    email: string | null;
    login: string;
    githubLogin: string | null;
    githubUrl: string | null;
    githubRepos: number | null;
  },
): Promise<Response> {
  let row: UserRow | null = null;
  if (p.githubId) {
    row = await env.DB.prepare(`SELECT user_id, handle FROM users WHERE github_id = ?`).bind(p.githubId).first<UserRow>();
  }
  if (!row && p.googleSub) {
    row = await env.DB.prepare(`SELECT user_id, handle FROM users WHERE google_sub = ?`).bind(p.googleSub).first<UserRow>();
  }
  const cookie = session.cookieUid;
  if (!row && cookie) {
    const mine = await env.DB.prepare(`SELECT user_id, handle FROM users WHERE user_id = ?`).bind(cookie).first<UserRow>();
    if (mine) row = mine;
  }
  const now = new Date().toISOString();
  if (!row) {
    const uid = newUserId();
    const handle = await uniqueHandle(env.DB, handleFromLogin(p.login, uid), uid);
    await env.DB.prepare(
      `INSERT INTO users (user_id, handle, created_at, github_id, google_sub, email, github_login, github_url, github_repos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(uid, handle, now, p.githubId, p.googleSub, p.email, p.githubLogin, p.githubUrl, p.githubRepos)
      .run();
    await env.DB.prepare(`INSERT INTO handle_history (user_id, handle, from_at) VALUES (?, ?, ?)`).bind(uid, handle, now).run();
    return session.redirect("/grid", [session.setUid(uid)]);
  }
  await env.DB.prepare(
    `UPDATE users SET github_id = COALESCE(?, github_id), google_sub = COALESCE(?, google_sub), email = COALESCE(?, email), github_login = COALESCE(?, github_login), github_url = COALESCE(?, github_url), github_repos = COALESCE(?, github_repos) WHERE user_id = ?`,
  )
    .bind(p.githubId, p.googleSub, p.email, p.githubLogin, p.githubUrl, p.githubRepos, row.user_id)
    .run();
  return session.redirect("/grid", [session.setUid(row.user_id)]);
}
