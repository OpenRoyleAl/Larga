import type { Hop } from "./types";

export type ProviderCall = {
  name: string;
  run: (messages: Array<{ role: string; content: string }>) => Promise<{ text: string; tokensIn?: number; tokensOut?: number }>;
};

const HOP_ERR =
  /timeout|network|abort|429|5\d\d|402|408|529|rate.?limit|quota|overloaded|capacity|resource.?exhausted|too many requests|empty( response)?|no content|temporarily unavailable|try again/i;

export function statusFromError(err: string): number | undefined {
  const m = err.match(/\b([45]\d\d)\b/);
  return m ? Number(m[1]) : undefined;
}

export function shouldFailover(status: number | undefined, err: string | undefined): boolean {
  if (status === 402 || status === 408 || status === 429 || status === 529) return true;
  if (status !== undefined && status >= 500) return true;
  if (status === 401 || status === 403 || status === 404) return false;
  if (err && HOP_ERR.test(err)) return true;
  return false;
}

export async function route(
  providers: ProviderCall[],
  messages: Array<{ role: string; content: string }>,
): Promise<{ text: string; provider: string; hops: Hop[]; tokensIn?: number; tokensOut?: number }> {
  const hops: Hop[] = [];
  if (providers.length === 0) {
    throw new Error("no providers configured");
  }
  for (const p of providers) {
    const t0 = Date.now();
    try {
      const out = await p.run(messages);
      const text = (out.text ?? "").trim();
      if (!text) {
        hops.push({ provider: p.name, ok: false, status: 200, ms: Date.now() - t0, error: "empty response" });
        continue;
      }
      hops.push({ provider: p.name, ok: true, status: 200, ms: Date.now() - t0 });
      return { text, provider: p.name, hops, tokensIn: out.tokensIn, tokensOut: out.tokensOut };
    } catch (e) {
      const err = e instanceof Error ? e.message : String(e);
      const status = statusFromError(err);
      hops.push({ provider: p.name, ok: false, status, ms: Date.now() - t0, error: err.slice(0, 200) });
      if (!shouldFailover(status, err)) {
        throw Object.assign(new Error(err), { hops });
      }
    }
  }
  throw Object.assign(new Error("all providers failed"), { hops });
}

export function messagesFrom(req: { prompt?: string; messages?: Array<{ role: string; content: string }> }) {
  if (req.messages?.length) return req.messages;
  if (req.prompt) return [{ role: "user", content: req.prompt }];
  return null;
}
