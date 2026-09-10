<p align="center">
  <a href="https://github.com/OpenRoyleAl/Larga"><img alt="Larga" src="https://img.shields.io/badge/Larga-Cebu_Ai_Agent_Cup-e85d04?style=for-the-badge"></a>
  <a href="https://www.cloudflare.com/developer-platform/products/workers/"><img alt="CloudFlare Workers" src="https://img.shields.io/badge/CloudFlare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white"></a>
  <a href="https://omarchy.org/"><img alt="Omarchy" src="https://img.shields.io/badge/Omarchy-Super%2BL-24292F?style=for-the-badge"></a>
</p>
<p align="center">
  <a href="https://console.groq.com/"><img alt="Groq" src="https://img.shields.io/badge/Groq-free_tokens-f55066?style=flat-square"></a>
  <a href="https://aistudio.google.com/apikey"><img alt="Google Ai Studio" src="https://img.shields.io/badge/Google-Ai_Studio-4285F4?style=flat-square&logo=google&logoColor=white"></a>
  <a href="https://openrouter.ai/"><img alt="OpenRouter" src="https://img.shields.io/badge/OpenRouter-:free-6b4eff?style=flat-square"></a>
  <a href="https://huggingface.co/settings/tokens"><img alt="Hugging Face" src="https://img.shields.io/badge/Hugging%20Face-tokens-FFD21E?style=flat-square&logo=huggingface&logoColor=black"></a>
  <a href="https://education.github.com/pack"><img alt="GitHub Student Pack" src="https://img.shields.io/badge/GitHub-Student_Pack-181717?style=flat-square&logo=github"></a>
  <a href="https://cloud.cerebras.ai/"><img alt="Cerebras" src="https://img.shields.io/badge/Cerebras-free-orange?style=flat-square"></a>
  <a href="https://cloud.sambanova.ai/"><img alt="SambaNova" src="https://img.shields.io/badge/SambaNova-free-red?style=flat-square"></a>
  <a href="https://f-droid.org/packages/com.termux/"><img alt="Termux" src="https://img.shields.io/badge/Termux-F--Droid_only-00E676?style=flat-square"></a>
</p>

# Larga — Cebu Ai Agent Cup

![Larga — Cebu Ai Agent Cup. Student Ai tournament. Sign in, chain prompts, climb the Board. One CloudFlare Worker. Born in Cebu.](https://larga.openroyleal.com/og.jpg)

**A student tournament in Cebu, plus the kit that runs it.**

You already know APIs, HTTP, and deploying a service. Ai here is the same idea: you `POST` text in, you get text out. An **agent** is just your program calling that API (and maybe calling it again with the last answer). **Larga** is one CloudFlare Worker that lets you chain those calls from a phone, keeps score, and prints a resume companies can open.

*Larga na* = let’s go (Cebuano). Born in Cebu.

**Live Cup:** [larga.openroyleal.com](https://larga.openroyleal.com)

---

## If you have never used Ai

| Word you know | What we mean |
|---|---|
| HTTP API | An **Ai model** is a hosted function: prompt in, completion out. Groq, Google, CloudFlare Workers Ai, OpenRouter are vendors. |
| API quota / prepaid credits | **Tokens.** When they run out you get `429`. Free student keys die. Make three accounts. |
| Retry / failover | **Drive** tries the next vendor when one is busy or empty. |
| Username | **Handle** (you can rename). Your real id never changes. |
| Leaderboard | **Board.** Season 0 of the Cup. |
| Portfolio / CV | **Tape.** One JSON file: GitHub + what you actually ran. |
| Serverless function | A **Worker.** One `npm run deploy` = your copy of Larga. |

You do **not** need to train a model. You call other people’s models with free keys. That is enough to enter the Cup.

---

## Why it is called a Cup

**Cup = tournament.** Same as a football cup: a season, a table, later school and country brackets.

| Season 0 (now) | Later |
|---|---|
| **Pilot vs Pilot** — you vs other students | **Crew** — school vs school |
| Live **Board** | **Flag** — country vs country |
| Enter by claiming a handle and running **Grid** | Dock / OJT berth for companies |

### How you are ranked (Season 0)

The Board sorts, in order:

1. **Graphs** — how many times you actually ran a chain on Grid  
2. **Failovers** — how many times Drive had to hop (a mint died, you kept going)  
3. **Tokens out** — how much Ai you actually used  

Pets, nicknames, and skins do **not** change rank. The **kettle** is shared sponsor quota (same rules for everyone), not a boost for 1st place.

**How to enter:** open [larga.openroyleal.com](https://larga.openroyleal.com) → Continue with GitHub or Google → Grid → run. Tape: `/u/your-handle/tape`.

Season dates / brackets: still being posted on [ROADMAP.md](ROADMAP.md). The table is already live. That is Season 0.

---

## Need / skip

| You want | You need | Skip |
|---|---|---|
| Free Ai keys only (no tournament) | [RESOURCES.md](RESOURCES.md) | Omarchy, Larga, CloudFlare |
| A Linux laptop built for this | [Omarchy](https://omarchy.org/) | Larga until you want the Cup |
| **Enter the Cup** / Board / Tape | Open the live URL, or **1 CloudFlare deploy** of your own | extra keys until Drive 429s |
| Android terminal | **Termux from [F-Droid](https://f-droid.org/packages/com.termux/)** | Play Store Termux |
| iPhone terminal | — | Out of luck. Safari can still open the Cup site. |

---

## The kit (what you are deploying)

| Piece | In IT terms |
|---|---|
| **Grid** | A tiny workflow: nodes = prompts, Run = call Drive |
| **Drive** | Router: Workers Ai → Groq → OpenRouter → Gemini… hop on `429` / 5xx / empty. **401 does not** burn the next key |
| **Profile** | Your Pilot page + Board row + Tape |

Optional pixel **pet** ([Petdex](https://petdex.dev)): moves on the Board only while Drive is actually running. Skin, not score.

---

## Enter on a phone (fastest)

1. Open https://larga.openroyleal.com  
2. Continue with GitHub or Google (that **is** your account)  
3. Browser menu → Add to Home Screen  
4. **Grid** → + node → type a prompt → run all  
5. Check **Board**

---

## Omarchy laptop (not a browser tab)

App launcher name **Larga**. Hotkey **Super+L**.

1. [Install Omarchy](https://omarchy.org/manual/getting-started/)  
2. From this repo (writes the shared Cup URL; change `~/.config/larga/url` only for your own Worker):

```sh
chmod +x omarchy/install-app.sh omarchy/larga-app
./omarchy/install-app.sh
```

---

## Android

**Termux**, not Play Store: [f-droid.org/packages/com.termux](https://f-droid.org/packages/com.termux/)

```sh
pkg update && pkg upgrade
pkg install tmux git
```

---

## Your own copy (1 CloudFlare deploy)

You can play on the shared Cup with **no keys**. Deploying means **your** Worker, **your** Board.

**Only this.** Repo root. `npm run deploy`. `packages/` is source. Do not add `larga.openroyleal.com` to wrangler — that hostname is the shared Cup.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/OpenRoyleAl/Larga)

```sh
git clone https://github.com/OpenRoyleAl/Larga
cd Larga
npm install
npx wrangler login
npx wrangler d1 create larga
# paste database_id into wrangler.jsonc (repo root)
npx wrangler d1 migrations apply larga
npm run deploy
```

When Drive starts 429ing, add keys from [RESOURCES.md](RESOURCES.md) with **`wrangler secret put` only**:

```sh
npx wrangler secret put GROQ_API_KEY
npx wrangler secret put OPENROUTER_API_KEY
npx wrangler secret put GEMINI_API_KEY
```

**Safe:** the secret stays on CloudFlare. **Not safe:** pasting a key into Grid, GitHub, Discord, a screenshot, or any file you `git add`. If it leaked, revoke it and mint a new one.

More catalogs (verify dates, don’t fork): [Student-free-ai-packs](https://github.com/asbinthapa99/Student-free-ai-packs-) · [FreeLLMAPI](https://github.com/tashfeenahmed/freellmapi) (optional laptop `/v1`, not the Cup).

GitHub has **Copy** on code blocks. Live `/install` and `/resources` have **Copy** too.

---

[Manifesto](MANIFESTO.md) · [Blueprint](BLUEPRINT.md) · [Roadmap](ROADMAP.md) · [Changelog](CHANGELOG.md)

Apache-2.0 · OpenRoyleAl · Born in Cebu
