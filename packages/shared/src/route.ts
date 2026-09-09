import type { Hop } from "./types";

export type ProviderCall = {
  name: string;
  run: (messages: Array<{ role: string; content: string }>) => Promise<{ text: string; tokensIn?: number; tokensOut?: number }>;
};

export function shouldFailover(status: number | undefined, err: string | undefined): boolean {
  if (err && /timeout|network|429|5\d\d/i.test(err)) return true;
  if (status === undefined) return !!err;
  return status === 429 || status >= 500;
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
      hops.push({ provider: p.name, ok: true, status: 200, ms: Date.now() - t0 });
      return { text: out.text, provider: p.name, hops, tokensIn: out.tokensIn, tokensOut: out.tokensOut };
    } catch (e) {
      const err = e instanceof Error ? e.message : String(e);
      const statusMatch = err.match(/\b(\d{3})\b/);
      const status = statusMatch ? Number(statusMatch[1]) : undefined;
      hops.push({ provider: p.name, ok: false, status, ms: Date.now() - t0, error: err.slice(0, 200) });
      if (!shouldFailover(status, err)) {
        const last = hops[hops.length - 1];
        throw Object.assign(new Error(err), { hops, last });
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
