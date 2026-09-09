export const HANDLE_RE = /^[a-z0-9][a-z0-9-]{1,22}[a-z0-9]$/;

export function normalizeHandle(raw: string): string | null {
  const h = raw.trim().toLowerCase();
  if (!HANDLE_RE.test(h)) return null;
  return h;
}

export function newUserId(): string {
  return crypto.randomUUID();
}
