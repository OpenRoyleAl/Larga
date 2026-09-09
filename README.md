# LARGA

Your phone. Your Cloudflare. Your Grid.

**LARGA** is Cebuano for *cast off / let’s go* (from Spanish *largar*, pay out the line). It is not a longsword. That would be a kampilan.

Three primitives on **your** Cloudflare account. No swarm. No school quests. No Tenant required.

| Primitive | Job |
|---|---|
| **GRID** | Mobile canvas. Nodes in, Drive out. |
| **DRIVE** | Provider-agnostic edge router. Dies, hops, tells Dex. |
| **DEX** | Capability ledger + living profile + live board. |

Dex profile = GitHub ⊔ Cursor ⊔ Drive/Grid tape ⊔ optional pet. **Certify** exports that as one signed tape — resume, case study, cover letter, CV.

Pets (Petdex format or your own family) are optional skins. The board animates the **active** companion only when Drive is actually in flight.

Season 0: **Cebu Cup**. Rank keys off `user_id`. Handles are nicknames.

## Deploy (student account)

You need a [Cloudflare](https://dash.cloudflare.com/sign-up) account. Free tier is enough.

```sh
git clone https://github.com/OpenRoyleAl/larga
cd larga
npm install
npx wrangler login
```

### 1. Dex (identity, board, tape)

```sh
npx wrangler d1 create larga-dex
# paste database_id into packages/dex/wrangler.jsonc
npx wrangler d1 migrations apply larga-dex --config packages/dex/wrangler.jsonc
npx wrangler secret put CERT_SECRET --config packages/dex/wrangler.jsonc
npx wrangler secret put SERVICE_SECRET --config packages/dex/wrangler.jsonc
npm run deploy:dex
```

### 2. Drive (router)

Optional: `GROQ_API_KEY`, `OPENROUTER_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`. Workers AI is bound by default.

```sh
npx wrangler secret put SERVICE_SECRET --config packages/drive/wrangler.jsonc
# same value as Dex
npx wrangler deploy --config packages/drive/wrangler.jsonc
```

Set `DEX_URL` to your Dex worker URL (`wrangler.jsonc` vars or `wrangler secret` / dashboard).

### 3. Grid (canvas)

```sh
npx wrangler deploy --config packages/grid/wrangler.jsonc
```

Set `DRIVE_URL`, `DEX_URL`, `SERVICE_SECRET`.

Deploy buttons (Workers):

[![Deploy Dex](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/OpenRoyleAl/larga/tree/main/packages/dex)
[![Deploy Drive](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/OpenRoyleAl/larga/tree/main/packages/drive)
[![Deploy Grid](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/OpenRoyleAl/larga/tree/main/packages/grid)

Monorepo buttons still need D1 id and secrets. Prefer the CLI the first time.

## Local

```sh
cp .dev.vars.example packages/dex/.dev.vars
cp .dev.vars.example packages/drive/.dev.vars
cp .dev.vars.example packages/grid/.dev.vars
npx wrangler d1 migrations apply larga-dex --local --config packages/dex/wrangler.jsonc
npm run dev:dex    # 8787
npm run dev:drive  # another terminal
npm run dev:grid
npm test
```

## What this is not

Not Cloudflare OS. Not a classroom LMS. Not pay-to-win tokens for leaders. Sponsors fill the **kettle** (public pot) or hire from the tape. See [MANIFESTO.md](MANIFESTO.md), [BLUEPRINT.md](BLUEPRINT.md), [ROADMAP.md](ROADMAP.md).

Dock (School MOA / Tenant / OJT berth) is **roadmap**, not v0.

Apache-2.0 · OpenRoyleAl · born in Sugbo.
