# Blueprint

One Worker. One deploy. Student-owned AiCloud.

```
phone / tablet / Omarchy
        │
        ▼
     Larga (Grid UI + Drive + Profile + Board + Tape)
        │
        ├─ Grid rooms (Durable Object)
        ├─ Drive → Workers Ai, then optional extra keys
        └─ Profile DB + live presence + HMAC tape
```

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
