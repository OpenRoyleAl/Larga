# Free Student Ai

Skip Larga. Skip Omarchy. This page is the tokens.

Play the shared Cup at [larga.openroyleal.com](https://larga.openroyleal.com) with **no keys**. Workers Ai is already on.

Quotas die. Make three accounts. When one naps, use the next.

## Keep keys safe

A token is a password for Ai.

| Do | Don’t |
|---|---|
| `npx wrangler secret put GROQ_API_KEY` on **your** Worker | Paste keys into Grid, Discord, GitHub, a screenshot, or `.dev.vars` you might commit |
| Play the shared Cup first (our kettle, no student keys) | Put your Groq/Gemini key on the shared Cup — there is nowhere to paste it, on purpose |
| Revoke + mint new if it leaked | Share a key with a classmate “just this once” |

`.dev.vars` is gitignored and is for **local fake secrets** (`CERT_SECRET`), not vendor API keys you care about.

## Catalogs (trust but verify)

We do **not** fork these. We link them. Deals rot.

| Catalog | What it is | Use for |
|---|---|---|
| [Student-free-ai-packs](https://github.com/asbinthapa99/Student-free-ai-packs-) | Student software / cloud / Pack deals (~5 months old as of check) | GitHub Student Pack, JetBrains, Figma Education, Azure for Students, AWS Educate. **Skip expired rows** (e.g. Google One Gemini Advanced “before June 30 2025”). Heroku “free tier” is gone. |
| [GitHub Student Pack](https://education.github.com/pack) | The live Pack | Copilot / Codespaces / whatever GitHub still lists today |
| [FreeLLMAPI](https://github.com/tashfeenahmed/freellmapi) | Self-host one `/v1` that hops many free mints | Optional. Not required for Larga. Personal use. Live model list: [freellmapi.co/models](https://freellmapi.co/models.html) |

Larga Drive is our hop on CloudFlare. FreeLLMAPI is if you want a laptop `/v1` without deploying Larga.

## After you deploy Larga (`npm run deploy` from repo root)

Workers Ai is already on. Extra keys keep the Cup alive:

```sh
npx wrangler secret put GROQ_API_KEY
npx wrangler secret put OPENROUTER_API_KEY
npx wrangler secret put GEMINI_API_KEY
```

Drive hops on 429 / 5xx / 529 / empty / quota text. A **401** stops the hop so a dead key does not burn the next mint.

## Mints we wire or list

| Mint | Link | Drive? |
|---|---|---|
| CloudFlare Workers Ai | with Larga deploy | yes, default |
| Groq | [console.groq.com](https://console.groq.com/) | `GROQ_API_KEY` |
| Google Ai Studio | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | `GEMINI_API_KEY` |
| OpenRouter `:free` | [openrouter.ai](https://openrouter.ai/) | `OPENROUTER_API_KEY` |
| Hugging Face | [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) | mint only |
| Cerebras | [cloud.cerebras.ai](https://cloud.cerebras.ai/) | mint only |
| SambaNova | [cloud.sambanova.ai](https://cloud.sambanova.ai/) | mint only |
| Mistral | [console.mistral.ai](https://console.mistral.ai/) | mint only |
| GitHub Models | [github.com/marketplace/models](https://github.com/marketplace/models) | mint only |
| GitHub Student Pack | [education.github.com/pack](https://education.github.com/pack) | Copilot / credits, not Drive |
| JetBrains Edu | [jetbrains.com/community/education](https://www.jetbrains.com/community/education/) | IDEs |
| Figma Education | [figma.com/education](https://www.figma.com/education/) | design |
| Azure for Students | [azure.microsoft.com/free/students](https://azure.microsoft.com/en-us/free/students/) | cloud credits |
| AWS Educate | [aws.amazon.com/education/awseducate](https://aws.amazon.com/education/awseducate/) | cloud credits |

School email helps Pack / Azure / JetBrains. Gmail still works on Groq + Ai Studio + OpenRouter.

## Android terminal

**Termux** from F-Droid, not Play Store: [f-droid.org/packages/com.termux](https://f-droid.org/packages/com.termux/)

```sh
pkg update && pkg upgrade
pkg install tmux git
```

## iPhone

Play in Safari. Share → Add to Home Screen. There is no Termux. You do not need a terminal.
