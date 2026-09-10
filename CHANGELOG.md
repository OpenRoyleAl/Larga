# Changelog

## 0.2.7 — 2026-09-10

### Changed

- Share card (title, description, `/og.jpg`) explains the Cup without a pitch.
- Sign in with GitHub or Google on the shared host (OAuth). Handle+code remains a fallback.

## 0.2.6 — 2026-09-10

### Changed

- Pilot login is a recovery code (`larga-…`), not the browser cookie. Cookie is a shortcut. Sign in at `/login`. Agent OpenRoyleAl ships the shared Cup with `npm run deploy:cup`.

## 0.2.5 — 2026-09-10

### Changed

- Canonical Cup URL: https://larga.openroyleal.com (`workers.dev` stays as fallback).
- Students `npm run deploy` without our hostname. Agent OpenRoyleAl: `npm run deploy:cup`.
- Grid reads the Pilot cookie (`/v1/whoami`). Prompts only — keys stay in Wrangler secrets.

## 0.2.4 — 2026-09-10

### Changed

- README explains Ai for IT students and spells the **Cup** as Season 0 tournament (rules + Board rank).

## 0.2.3 — 2026-09-09

### Shipped

- Live: https://larga.alfred-89f.workers.dev
- D1 `larga`, SQLite Durable Objects, Workers Ai default `@cf/meta/llama-3.2-1b-instruct` (3.1-8b was deprecated 2026-05-30).

## 0.2.2 — 2026-09-09

### Changed

- Linked [Student-free-ai-packs](https://github.com/asbinthapa99/Student-free-ai-packs-) and [FreeLLMAPI](https://github.com/tashfeenahmed/freellmapi) as catalogs to verify, not forks. Flagged expired pack rows.
- Removed per-package wrangler configs. Root `npm run deploy` is the only path.
- Drive hop: empty 200, 529, quota text; 401 does not burn the next mint. Harder unit tests.

## 0.2.1 — 2026-09-09

### Changed

- Repo **Larga**. **Ai** spelling. **Cebu Ai Agent Cup**. Born in Cebu.
- One CloudFlare deploy button. Free Student Ai list you can use without Larga.
- Omarchy: Super+L + launcher name Larga (app window).
- Android: Termux from F-Droid. iPhone terminal: out of luck.

## 0.2.0 — 2026-09-09

### Changed

- Student name is **Larga**. Season name is **Cebu AI Agent Cup**.
- Host story is **AiCloud**. Profile / Board / Tape replace the old internal “dex” word in the UI.
- One Worker, one deploy, one Put-Larga-on-AiCloud button.
- `/install` for phone, tablet, and Omarchy, with Copy on every snippet.

## 0.1.0 — 2026-09-09

### Added

- First Grid, Drive, and Profile kit, tape, live Board, kettle.
