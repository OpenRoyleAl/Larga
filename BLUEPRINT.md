# Blueprint

Student-owned Workers. Path A. No Workers for Platforms.

```
phone ──► GRID (DO graphs)
            │
            ▼
          DRIVE (Workers AI → Groq → OpenRouter → …)
            │ hops + tokens
            ▼
          DEX (D1 users/facts + DO presence + tape HMAC)
```

## Bindings

| Worker | Binding | Purpose |
|---|---|---|
| Drive | `AI` | Default provider |
| Drive | secrets | Optional vendor keys |
| Drive | `DEX_URL`, `SERVICE_SECRET` | Facts + presence |
| Grid | `GRAPHS` DO | Persist nodes |
| Grid | `DRIVE_URL`, `DEX_URL` | Run + report |
| Dex | `DB` D1 `larga-dex` | Users, facts, kettle |
| Dex | `PRESENCE` DO | Live pet states (~45s idle) |
| Dex | `CERT_SECRET` | HMAC-SHA256 on tape |
| Dex | `SERVICE_SECRET` | Drive/Grid ingest |

## Identity

- `user_id` UUID, cookie `larga_uid`, immortal.
- `handle` unique now, history in `handle_history`.
- Pet JSON: `{ id, displayName, spritesheetUrl? }` — compatible with Petdex packs.
- Rank: `graphs`, then `failovers`, then `tokens_out`. Battle-tested before loud.

## Certify (`larga.tape.v1`)

Unsigned if `CERT_SECRET` is empty (dev). Production must set the secret. Verify with `packages/shared/src/certify.ts`.

## Kettle

`POST /v1/kettle/draw` decrements the public pot and writes a fact. It does **not** increment Drive tokens. Fill the pot in D1:

```sql
UPDATE kettle SET remaining = remaining + 1000 WHERE id = 1;
```

## Dock (not in this release)

Cloudflare Tenant / Workers for Platforms. School MOA, OJT berth, company pool. See ROADMAP.
