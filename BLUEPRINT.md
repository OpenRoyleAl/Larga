# Blueprint

One Worker. One deploy. **`npm run deploy` from repo root only** (`wrangler.jsonc`). `packages/` is source.

```
phone / tablet / Omarchy Super+L
        │
        ▼
     Larga (Grid UI + Drive + Profile + Board + Tape)
        │
        ├─ Grid rooms (Durable Object)
        ├─ Drive → Workers Ai, then Groq / OpenRouter / Gemini keys
        └─ Profile DB + live presence + HMAC tape
```

Pets are skins. Tape is the product.

Crew notes (host wiring): see `wrangler.jsonc`. Database `larga`, classes `GraphRoom` and `Presence`.

## Identity

- Forever id in cookie `larga_uid`.
- Handle unique right now; history kept.
- Pet JSON: `{ id, displayName, spritesheetUrl? }`.
- Rank: graphs, then failovers, then tokens out.

## Certify (`larga.tape.v1`)

HMAC with `CERT_SECRET`. Public JSON at `/u/{handle}/tape`.

## Kettle

`POST /v1/kettle/draw` sips the pot and writes a fact. It does not fake Drive tokens.

```sql
UPDATE kettle SET remaining = remaining + 1000 WHERE id = 1;
```

## Dock (later)

School MOA / OJT berth after Tenant. ROADMAP season 2.
