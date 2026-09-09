# Larga

Your phone. Your AiCloud. Your agents.

**Larga** (*larga na*) is Cebuano for let’s go — the [Cebu AI Agent Cup](ROADMAP.md) kit. You run AI from a phone, a tablet, or a laptop. Your **Profile** is the scoreboard plus the tape companies read (GitHub, Cursor, what your agents actually did).

| Piece | What you do with it |
|---|---|
| **Grid** | Chain prompts. That’s the canvas. |
| **Drive** | The AI brains. If one naps, Drive hops to the next. |
| **Profile** | Your name, pet, Board rank, and **tape** (resume in one file). |

Pets are optional pixel friends ([Petdex](https://petdex.dev) packs or your own). They move on the Board while Drive is running.

## Install

Full click-to-copy steps also live on the site at `/install` once Larga is up.

### Phone or tablet

1. Open your class Larga link (or your own AiCloud URL after deploy).
2. Claim a handle.
3. Browser menu → **Add to Home Screen**.
4. Open **Grid**, add a node, run.

### Laptop — Omarchy first

We want you on **[Omarchy](https://omarchy.org/)** — Linux that already feels like an agent cockpit. ISO → USB → boot → five questions. Guide: [Getting started](https://omarchy.org/manual/getting-started/).

```
https://omarchy.org/
```

Then use Larga in the browser like the phone, or put Larga on **your** AiCloud (one deploy below).

Windows/Mac still work in the browser. Omarchy is the setup we cheer for.

### Your AiCloud — one deploy

AiCloud is your free AI computer in the sky. **One** Larga. Grid, Drive, Profile, Board, Tape together.

[Put Larga on my AiCloud](https://deploy.workers.cloudflare.com/?url=https://github.com/OpenRoyleAl/larga)

From a terminal (copy the whole block):

```sh
git clone https://github.com/OpenRoyleAl/larga
cd larga
npm install
npx wrangler login
npx wrangler d1 create larga
# paste database_id into wrangler.jsonc
npx wrangler d1 migrations apply larga
npm run deploy
```

GitHub shows a **Copy** button on the right of each code block. On the live site, every snippet has **Copy** too.

## Play

1. Claim a handle → that’s your Pilot name.
2. Link GitHub (and Cursor if you have it) on **Profile**.
3. Run Grid. Watch the **Board**. Pets bounce when you’re live.
4. Open **Tape** — that’s the CV. Companies hit `/u/your-name/tape`.

Sponsors fill the **kettle** so the whole Board can keep running. Rank is still what you shipped.

More: [MANIFESTO](MANIFESTO.md) · [BLUEPRINT](BLUEPRINT.md) · [ROADMAP](ROADMAP.md) · [CHANGELOG](CHANGELOG.md)

Apache-2.0 · OpenRoyleAl · Sugbo
