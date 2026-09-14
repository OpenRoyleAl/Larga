# Free Student Ai Tokens — use them or lose them

**The viral sell:** every vendor gives you free Ai quota. It **resets on a schedule** — daily Neurons, monthly caps, RPM windows. **Use it today or it vanishes.** When one mint naps, hop to the next. When a key dies with **401**, Drive **stops** — so a dead key does not burn the next mint.

Play the shared Cup at [larga.openroyleal.com](https://larga.openroyleal.com) with **zero keys**. CloudFlare Workers Ai is already on the kettle.

Quotas die. Make three accounts. When one naps, use the next. Revoke + mint if a key leaked.

---

## Step 0 — Play the Cup with 0 keys (Workers Ai)

**Unli rice.** CloudFlare Workers Ai ships with every Larga deploy — including the shared Cup. No Groq. No Gemini paste box. Just Grid.

1. Open [larga.openroyleal.com](https://larga.openroyleal.com)
2. Continue with GitHub or Google
3. Grid → run a chain

**Drive** tries Workers Ai first (`@cf/meta/llama-3.2-1b-instruct`, then `@cf/meta/llama-3.1-8b-instruct-fast`). Free Neurons reset on CloudFlare’s schedule — **use them or lose them.** When Workers Ai 429s or empties, Drive hops (if you added keys in Step 2).

The shared Cup has **nowhere to paste your vendor keys** — on purpose. Your mints stay on **your** Worker.

---

## Step 1 — One CloudFlare account + `npm run deploy`

Your own Worker = your own Board + your own kettle secrets.

**Only from repo root.** `packages/` is source. Do **not** bind `larga.openroyleal.com` in your `wrangler.jsonc` — that hostname is the shared Cup (`npm run deploy:cup` is Agent OpenRoyleAl only).

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/OpenRoyleAl/Larga)

```sh
git clone https://github.com/OpenRoyleAl/Larga
cd Larga
npm install
npx wrangler login
npx wrangler d1 create larga
# paste database_id into wrangler.jsonc (repo root only)
npx wrangler d1 migrations apply larga
npm run deploy
```

Workers Ai is already wired (`"ai": { "binding": "AI" }` in root `wrangler.jsonc`). **No extra key** for the default kettle.

Smoke: `/health`, `/install`, `/grid`, `/resources` on your `*.workers.dev` URL.

---

## Step 2 — Wired hops (mint now, Drive uses them today)

When Workers Ai naps, add vendor keys with **`npx wrangler secret put` on your Worker only**:

```sh
npx wrangler secret put GROQ_API_KEY
npx wrangler secret put OPENROUTER_API_KEY
npx wrangler secret put GEMINI_API_KEY
```

| Secret | Mint where | Drive hop order (after Workers Ai) |
|---|---|---|
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com/) | Groq `llama-3.1-8b-instant` |
| `OPENROUTER_API_KEY` | [openrouter.ai](https://openrouter.ai/) | OpenRouter `meta-llama/llama-3.1-8b-instruct:free` |
| `GEMINI_API_KEY` | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | Gemini `gemini-2.0-flash` |

**Hop rules (Drive):** 429, 5xx, 529, empty body, quota text → try the next provider. **401 / 403 / 404 → stop.** Fix or revoke the bad key before the next mint runs.

Optional (same pattern, not required for Cup): `OPENAI_API_KEY` if you have paid or trial OpenAI credits.

Gmail works for Groq, Ai Studio, and OpenRouter. School email helps elsewhere (Step 5).

---

## Step 3 — More free mints (mint now; Drive wiring coming)

Stack free tiers **before** Drive knows about them — mint the keys, hold them safe, add to your Worker when we wire the hop.

| Mint | Where to mint | Planned `wrangler secret put` name | Drive today? |
|---|---|---|---|
| Hugging Face | [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) | `HUGGINGFACE_API_KEY` | mint only |
| Cerebras | [cloud.cerebras.ai](https://cloud.cerebras.ai/) | `CEREBRAS_API_KEY` | mint only |
| SambaNova | [cloud.sambanova.ai](https://cloud.sambanova.ai/) | `SAMBANOVA_API_KEY` | mint only |
| Mistral | [console.mistral.ai](https://console.mistral.ai/) | `MISTRAL_API_KEY` | mint only |
| GitHub Models | [github.com/marketplace/models](https://github.com/marketplace/models) | `GITHUB_MODELS_TOKEN` | mint only |

**Use it or lose them:** each vendor meters RPM/RPD/TPM/TPD. Free windows reset at UTC midnight or on a rolling clock — check the vendor dashboard, not this doc. When one account naps, use the next account you minted.

When Drive adds a hop, the secret name above is what you will run — same `wrangler secret put` rule as Step 2.

---

## Step 4 — FreeLLMAPI path (optional laptop `/v1`)

**Primary path stays Larga Drive on CloudFlare** (Steps 0–2). **FreeLLMAPI** is optional: one local OpenAI-compatible `/v1` that routes across many free mints on your laptop — useful for Codex, Claude Code, Cursor, or scripts **off** the Cup.

We exported the student how-to into the repo so you can follow offline:

→ **[docs/free-llm-api.md](docs/free-llm-api.md)** — install, keys, `auto` routing, trust-but-verify, link back to [upstream FreeLLMAPI](https://github.com/tashfeenahmed/freellmapi).

Live model catalog (deals rot): [freellmapi.co/models](https://freellmapi.co/models.html).

---

## Step 5 — Student Pack / Azure / AWS / JetBrains / Figma

Software and cloud **credits** — not Drive hops. Still **use it or lose them** (Pack renewals, credit expiry).

| Deal | Link | Good for |
|---|---|---|
| GitHub Student Pack | [education.github.com/pack](https://education.github.com/pack) | Copilot, Codespaces, whatever GitHub lists today |
| JetBrains Edu | [jetbrains.com/community/education](https://www.jetbrains.com/community/education/) | IDEs |
| Figma Education | [figma.com/education](https://www.figma.com/education/) | design |
| Azure for Students | [azure.microsoft.com/free/students](https://azure.microsoft.com/en-us/free/students/) | cloud credits |
| AWS Educate | [aws.amazon.com/education/awseducate](https://aws.amazon.com/education/awseducate/) | cloud credits |

Verify dates yourself. We link catalogs; we do not fork stale deal lists.

---

## Keep keys safe

A token is a password for Ai.

| Do | Don’t |
|---|---|
| `npx wrangler secret put GROQ_API_KEY` on **your** Worker | Paste keys into Grid prompts, Discord, GitHub, a screenshot, or `.dev.vars` you might commit |
| Play the shared Cup first (our kettle, no student keys) | Put your Groq/Gemini key on the shared Cup — there is nowhere to paste it, on purpose |
| Revoke + mint new if it leaked | Share a key with a classmate “just this once” |
| Hop on 429/5xx/529/empty; fix 401 before the next mint | Assume unlimited forever — quotas die |

`.dev.vars` is gitignored and is for **local fake secrets** (`CERT_SECRET`, `SERVICE_SECRET`), not vendor API keys you care about.

---

## Catalogs (trust but verify)

We **do not** fork these. We link them. Deals rot.

| Catalog | What it is | Use for |
|---|---|---|
| [Student-free-ai-packs](https://github.com/asbinthapa99/Student-free-ai-packs-) | Student software / cloud / Pack deals | Cross-check Step 5; **skip expired rows** |
| [GitHub Student Pack](https://education.github.com/pack) | The live Pack | Copilot / credits |
| [FreeLLMAPI upstream](https://github.com/tashfeenahmed/freellmapi) | Self-host one `/v1` that hops many free mints | Optional laptop path — see [docs/free-llm-api.md](docs/free-llm-api.md) |

---

## Android terminal

**Termux** from F-Droid, not Play Store: [f-droid.org/packages/com.termux](https://f-droid.org/packages/com.termux/)

```sh
pkg update && pkg upgrade
pkg install tmux git
```

Deploy Larga from Termux the same way as Step 1, or run FreeLLMAPI locally — see [docs/free-llm-api.md](docs/free-llm-api.md).

## iPhone

Play in Safari. Share → Add to Home Screen. There is no Termux. You do not need a terminal.

---

## Quick reference — mint → secret → Drive

| Kettle | Keys needed on shared Cup | Secret on your Worker |
|---|---|---|
| CloudFlare Workers Ai | **0** | already bound at deploy |
| Groq | mint yourself | `GROQ_API_KEY` ✓ wired |
| OpenRouter `:free` | mint yourself | `OPENROUTER_API_KEY` ✓ wired |
| Google Ai Studio | mint yourself | `GEMINI_API_KEY` ✓ wired |
| HF / Cerebras / SambaNova / Mistral / GitHub Models | mint yourself | names in Step 3 — mint only until Drive wires them |
| FreeLLMAPI | N/A (local `/v1`) | see [docs/free-llm-api.md](docs/free-llm-api.md) |

*Larga na.* Born in Cebu.
