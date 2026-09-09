# Free Student Ai

Skip Larga. Skip Omarchy. This page is the tokens.

Quotas die. Make three accounts. When one naps, use the next.

## After you deploy Larga on CloudFlare

Drive already has CloudFlare Workers Ai. Extra keys keep the Cup alive:

```sh
npx wrangler secret put GROQ_API_KEY
npx wrangler secret put OPENROUTER_API_KEY
npx wrangler secret put GEMINI_API_KEY
```

Paste the key, enter, redeploy if the Worker was already live (`npm run deploy`). Drive hops on 429 / 5xx. When a key dies, come back here, mint another, put it in.

## Mints (free / student)

| Mint | Link | What you get |
|---|---|---|
| Groq | [console.groq.com](https://console.groq.com/) | Fast Llama / Mixtral. Daily free. |
| Google Ai Studio | [aistudio.google.com](https://aistudio.google.com/apikey) | Gemini key. Generous free. |
| OpenRouter | [openrouter.ai](https://openrouter.ai/) | One key, many free models (`:free`). |
| Hugging Face | [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) | Inference + student perks. |
| GitHub Student Pack | [education.github.com/pack](https://education.github.com/pack) | School email. Coupons, Copilot, more. |
| CloudFlare Workers Ai | included with Larga deploy | Default Drive brain. No extra key. |
| Cerebras | [cloud.cerebras.ai](https://cloud.cerebras.ai/) | Free tier, huge context. |
| SambaNova | [cloud.sambanova.ai](https://cloud.sambanova.ai/) | Free Llama. |
| Mistral | [console.mistral.ai](https://console.mistral.ai/) | Experiment / student credits. |
| GitHub Models | [github.com/marketplace/models](https://github.com/marketplace/models) | Playground + token via GitHub. |

School email helps on Pack, Google, GitHub. Personal Gmail still works on Groq + Ai Studio + OpenRouter.

## Android terminal

The app is **Termux**. Not the Play Store. Play Store Termux is a zombie.

1. Optional: install the [F-Droid client](https://f-droid.org/en/packages/org.fdroid.fdroid/).
2. Install Termux: [f-droid.org/packages/com.termux](https://f-droid.org/packages/com.termux/)
3. Open Termux, then:

```sh
pkg update && pkg upgrade
pkg install tmux git
```

Uninstall Play Store Termux first if you already have it.

## iPhone

No Termux. You're out of luck for a real terminal. Safari can still open a Larga site if someone deployed one.
