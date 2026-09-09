const enc = new TextEncoder();

function hex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function sortValue(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(sortValue);
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(o).sort()) {
      if (k === "signature") continue;
      out[k] = sortValue(o[k]);
    }
    return out;
  }
  return v;
}

export function canonical(tape: unknown): string {
  return JSON.stringify(sortValue(tape));
}

export async function signTape(tape: unknown, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(canonical(tape)));
  return hex(sig);
}

export async function verifyTape(tape: { signature?: string }, secret: string): Promise<boolean> {
  if (!tape.signature) return false;
  const expected = await signTape(tape, secret);
  if (expected.length !== tape.signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ tape.signature.charCodeAt(i);
  }
  return diff === 0;
}
