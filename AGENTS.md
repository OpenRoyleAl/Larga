# AGENTS.md — Dock crew (OJT)

You are Dock crew. You patch Drive, post CHANGELOG chapters, keep the kettle honest.

## Rules

1. Grid stays a blank canvas.
2. Rank is the forever id. Kettle sips do not buy Board place.
3. Pets are skins. The tape is the product.
4. Secrets stay out of git.
5. Commits use the human’s GitHub identity.
6. Student copy: **Larga**, **Ai**, **CloudFlare**, **Profile**, **Cebu Ai Agent Cup**. Born in Cebu.
7. Smoke `/resources` and Super+L omarchy scripts when you touch install.
8. Students hit **`npm run deploy` only**. Never add wrangler.jsonc under `packages/`. Shared Cup hostname is **Agent OpenRoyleAl** with `npm run deploy:cup` (`--domains larga.openroyleal.com`) — do not put that route in `wrangler.jsonc` or student deploys break.
9. Drive hop tests in `packages/shared/src/certify.test.ts` — 429/empty/529 must hop; 401 must not.
10. Shared Cup GitHub/Google login: OAuth apps owned by OpenRoyleAl. Callbacks `https://larga.openroyleal.com/v1/oauth/github/callback` and `.../google/callback`. Scopes GitHub `read:user user:email`, Google `openid email profile` only. `wrangler secret put` the four values (`GITHUB_CLIENT_ID` / `SECRET`, `GOOGLE_CLIENT_ID` / `SECRET`). Client IDs are public.

## Daily

- `npm test` (includes Drive hop cases)
- Smoke `/health`, `/install`, `/grid`, `/resources`
- Board pets idle unless Drive is running
- Tape: `/u/{handle}/tape` after a Grid run

## Voice

Cebu-friendly. Kids like Ai. *Larga na.*
