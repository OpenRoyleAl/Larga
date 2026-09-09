import { messagesFrom, route, type ProviderCall } from "../../shared/src/route";
import type { CompleteRequest } from "../../shared/src/types";

export interface Env {
  AI?: Ai;
  DEX_URL: string;
  SERVICE_SECRET: string;
  GROQ_API_KEY?: string;
  OPENROUTER_API_KEY?: string;
  OPENAI_API_KEY?: string;
  GEMINI_API_KEY?: string;
}

function providers(env: Env): ProviderCall[] {
  const list: ProviderCall[] = [];
  if (env.AI) {
    for (const model of [
      "@cf/meta/llama-3.2-1b-instruct",
      "@cf/meta/llama-3.1-8b-instruct-fast",
    ] as const) {
      const id = model.split("/").pop()!;
      list.push({
        name: `workers-ai:${id}`,
        run: async (messages) => {
          const r = (await env.AI!.run(model, { messages })) as { response?: string };
          const text = r.response ?? JSON.stringify(r);
          return { text: String(text) };
        },
      });
    }
  }
  if (env.GROQ_API_KEY) {
    list.push(openaiCompat("groq", "https://api.groq.com/openai/v1/chat/completions", env.GROQ_API_KEY, "llama-3.1-8b-instant"));
  }
  if (env.OPENROUTER_API_KEY) {
    list.push(openaiCompat("openrouter", "https://openrouter.ai/api/v1/chat/completions", env.OPENROUTER_API_KEY, "meta-llama/llama-3.1-8b-instruct:free"));
  }
  if (env.OPENAI_API_KEY) {
    list.push(openaiCompat("openai", "https://api.openai.com/v1/chat/completions", env.OPENAI_API_KEY, "gpt-4o-mini"));
  }
  if (env.GEMINI_API_KEY) {
    list.push({
      name: "gemini",
      run: async (messages) => {
        const prompt = messages.map((m) => `${m.role}: ${m.content}`).join("\n");
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
          signal: AbortSignal.timeout(20_000),
        });
        if (!res.ok) throw new Error(`${res.status} gemini ${await res.text().then((t) => t.slice(0, 80))}`);
        const j = (await res.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
        const text = j.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        return { text };
      },
    });
  }
  return list;
}

function openaiCompat(name: string, url: string, key: string, model: string): ProviderCall {
  return {
    name,
    run: async (messages) => {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            authorization: `Bearer ${key}`,
            "content-type": "application/json",
            "http-referer": "https://github.com/OpenRoyleAl/Larga",
            "x-title": "Larga Drive",
          },
          body: JSON.stringify({ model, messages }),
          signal: AbortSignal.timeout(20_000),
        });
        const raw = await res.text();
        if (!res.ok) throw new Error(`${res.status} ${name} ${raw.slice(0, 120)}`);
        const j = JSON.parse(raw) as {
          choices?: Array<{ message?: { content?: string } }>;
          usage?: { prompt_tokens?: number; completion_tokens?: number };
        };
        return {
          text: j.choices?.[0]?.message?.content ?? "",
          tokensIn: j.usage?.prompt_tokens,
          tokensOut: j.usage?.completion_tokens,
        };
    },
  };
}

async function reportDex(env: Env, userId: string | undefined, hops: unknown, tokensIn?: number, tokensOut?: number) {
  if (!env.DEX_URL || !userId) return;
  await fetch(new URL("/v1/facts", env.DEX_URL), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.SERVICE_SECRET}`,
    },
    body: JSON.stringify({
      userId,
      kind: "drive.complete",
      detail: JSON.stringify({ hops, tokensIn, tokensOut }),
      tokensIn: tokensIn ?? 0,
      tokensOut: tokensOut ?? 0,
    }),
  }).catch(() => {});
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    return fetchDrive(req, env);
  },
} satisfies ExportedHandler<Env>;

export async function fetchDrive(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (req.method === "GET" && (url.pathname === "/health" || url.pathname === "/drive/health")) {
      const names = providers(env).map((p) => p.name);
      return Response.json({ ok: true, primitive: "drive", providers: names });
    }
    if (req.method === "GET" && url.pathname === "/") {
      return new Response(
        "Larga Drive — POST /v1/complete { prompt | messages, userId }\nGET /health\n",
        { headers: { "content-type": "text/plain; charset=utf-8" } },
      );
    }
    if (req.method === "POST" && url.pathname === "/v1/complete") {
      let body: CompleteRequest;
      try {
        body = (await req.json()) as CompleteRequest;
      } catch {
        return Response.json({ error: "invalid json" }, { status: 400 });
      }
      const messages = messagesFrom(body);
      if (!messages) return Response.json({ error: "prompt or messages required" }, { status: 400 });
      const list = providers(env);
      if (!list.length) {
        return Response.json({ error: "no providers — bind Workers AI or set a provider API key" }, { status: 503 });
      }
      try {
        const out = await route(list, messages);
        await reportDex(env, body.userId, out.hops, out.tokensIn, out.tokensOut);
        if (env.DEX_URL && body.userId) {
          fetch(new URL("/v1/presence", env.DEX_URL), {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${env.SERVICE_SECRET}`,
            },
            body: JSON.stringify({ userId: body.userId, state: "waving" }),
          }).catch(() => {});
        }
        return Response.json(out);
      } catch (e) {
        const hops = (e as { hops?: unknown }).hops ?? [];
        if (env.DEX_URL && body.userId) {
          fetch(new URL("/v1/presence", env.DEX_URL), {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${env.SERVICE_SECRET}`,
            },
            body: JSON.stringify({ userId: body.userId, state: "failed" }),
          }).catch(() => {});
        }
        return Response.json({ error: e instanceof Error ? e.message : "drive failed", hops }, { status: 502 });
      }
    }
    return new Response("not found", { status: 404 });
}
