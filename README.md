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

# Larga

Your phone. Your CloudFlare. Your agents.

**Larga** (*larga na*) = let’s go in Cebuano. **Cebu Ai Agent Cup** kit: Grid, Drive, Profile, Board, Tape.

Pets optional ([Petdex](https://petdex.dev)). They move on the Board while Drive is running.

## Need / skip

| You want | You need | Skip |
|---|---|---|
| Free Student Ai tokens only | [RESOURCES.md](RESOURCES.md) | Omarchy, Larga, CloudFlare |
| Agent laptop | [Omarchy](https://omarchy.org/) | Larga until you want the Cup |
| Cup / Board / Tape | Larga + **1 CloudFlare deploy** | nothing if you already have tokens |
| Android shell | **Termux from [F-Droid](https://f-droid.org/packages/com.termux/)** | Play Store Termux |
| iPhone shell | — | Out of luck. Safari can still open Larga web. |

## Free Student Ai

Straight to tokens: **[RESOURCES.md](RESOURCES.md)** — Groq, Google Ai Studio, OpenRouter, Hugging Face, GitHub Student Pack, Cerebras, SambaNova, Mistral, GitHub Models, CloudFlare Workers Ai.

## Omarchy (laptop)

Not a browser tab. App launcher name **Larga**. Hotkey **Super+L**.

1. Install Omarchy: [omarchy.org](https://omarchy.org/) · [getting started](https://omarchy.org/manual/getting-started/)
2. Deploy Larga once (below). Put the workers.dev URL in `~/.config/larga/url`
3. From this repo:

```sh
chmod +x omarchy/install-app.sh omarchy/larga-app
./omarchy/install-app.sh
```

Search **Larga** in the app go launcher. **Super+L** opens the app window (Chromium `--app`).

## Android

**Termux**, not Play Store: [f-droid.org/packages/com.termux](https://f-droid.org/packages/com.termux/)

```sh
pkg update && pkg upgrade
pkg install tmux git
```

## Phone / tablet (web)

Open your Larga URL → claim handle → Add to Home Screen → Grid.

## 1 deploy on CloudFlare

Runs on [CloudFlare Workers](https://developers.cloudflare.com/workers/). Free student tier is enough. One Worker = Grid + Drive + Profile.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/OpenRoyleAl/Larga)

```sh
git clone https://github.com/OpenRoyleAl/Larga
cd Larga
npm install
npx wrangler login
npx wrangler d1 create larga
# paste database_id into wrangler.jsonc
npx wrangler d1 migrations apply larga
npm run deploy
```

Then keep Drive fed: [RESOURCES.md](RESOURCES.md) → `wrangler secret put GROQ_API_KEY` (and friends). Drive hops when a mint 429s.

GitHub has **Copy** on code blocks. Live site `/install` and `/resources` have **Copy** too.

## Play (if you shipped Larga)

Claim handle → Profile (GitHub / Cursor) → Grid → Board → Tape at `/u/your-name/tape`.

Kettle = sponsor juice for the whole Board.

[Manifesto](MANIFESTO.md) · [Blueprint](BLUEPRINT.md) · [Roadmap](ROADMAP.md) · [Changelog](CHANGELOG.md)

Apache-2.0 · OpenRoyleAl · Born in Cebu
