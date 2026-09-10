const enc = new TextEncoder();

function hexBytes(b: Uint8Array): string {
  return [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

/** 16 random bytes → larga-xxxx-… (8 groups). This is the Pilot password. */
export function newLoginCode(): string {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  const h = hexBytes(b);
  const parts = h.match(/.{4}/g);
  if (!parts || parts.length !== 8) throw new Error("login code");
  return `larga-${parts.join("-")}`;
}

export function normalizeLoginCode(raw: string): string | null {
  let s = raw.trim().toLowerCase();
  s = s.replace(/^larga[\s-:]*/, "");
  const hexOnly = s.replace(/[^0-9a-f]/g, "");
  if (hexOnly.length !== 32) return null;
  const parts = hexOnly.match(/.{4}/g);
  if (!parts) return null;
  return `larga-${parts.join("-")}`;
}

export async function hashLoginCode(code: string): Promise<string> {
  const n = normalizeLoginCode(code);
  if (!n) throw new Error("bad login code");
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(n));
  return hexBytes(new Uint8Array(buf));
}
