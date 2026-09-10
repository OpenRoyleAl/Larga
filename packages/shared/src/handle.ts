export const HANDLE_RE = /^[a-z0-9][a-z0-9-]{1,22}[a-z0-9]$/;

export function normalizeHandle(raw: string): string | null {
  const h = raw.trim().toLowerCase();
  if (!HANDLE_RE.test(h)) return null;
  return h;
}

export function newUserId(): string {
  return crypto.randomUUID();
}

/** GitHub/Google login → legal handle; caller must uniquify if taken. */
export function handleFromLogin(raw: string, fallback: string): string | null {
  const stem = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 22);
  if (stem.length >= 3 && HANDLE_RE.test(stem)) return stem;
  const fb = `p-${fallback.replace(/[^a-z0-9]/g, "").slice(0, 20)}`;
  return HANDLE_RE.test(fb) ? fb : normalizeHandle(`${fb}x1`);
}
