# FreeLLMAPI — optional laptop `/v1` (exported guide)

> **Attribution:** This doc extracts the **student-actionable** parts of [FreeLLMAPI](https://github.com/tashfeenahmed/freellmapi) by [tashfeenahmed](https://github.com/tashfeenahmed). Upstream is MIT-licensed. We do **not** vendor the FreeLLMAPI runtime inside Larga — install it separately when you want a local router.
>
> **Trust but verify:** Free tiers, model lists, and quotas **rot weekly**. Numbers below came from upstream docs and [freellmapi.co/models](https://freellmapi.co/models.html) — check upstream before you depend on them.
>
> **Larga primary path:** [RESOURCES.md](../RESOURCES.md) Steps 0–2 — CloudFlare Workers Ai + Drive on **your** Worker. FreeLLMAPI is for **optional** laptop tooling (Codex, Claude Code, Cursor, scripts), not the Cup Board.

---

## What FreeLLMAPI is

One **OpenAI-compatible** endpoint (`http://localhost:3001/v1`) that:

- Stores **your** vendor keys encrypted (AES-256-GCM in local SQLite)
- Routes each request to the best available **free** model
- **Fails over** on 429/5xx to the next model in your chain
- Tracks per-key RPM/RPD/TPM/TPD so you stay under caps
- Gives you one **unified** bearer token (`freellmapi-…`) for all clients

Upstream stacks many free tiers (Groq, Google, Cerebras, OpenRouter, CloudFlare, Hugging Face, Mistral, …). The live catalog lists hundreds of free model endpoints — browse at **[freellmapi.co/models](https://freellmapi.co/models.html)**.

**Use it or lose them:** each provider’s free quota resets on its own clock. The router hops when one mint naps — same spirit as Larga Drive, but on your machine.

---

## When to use FreeLLMAPI vs Larga Drive

| You want | Use |
|---|---|
| Enter the Cup, Board, Tape on a phone | [larga.openroyleal.com](https://larga.openroyleal.com) or your Larga deploy — **0 keys** on shared Cup |
| Hop on CloudFlare without a laptop server | Larga Drive (`npm run deploy`) — Workers Ai + optional `wrangler secret put` |
| Point Codex / Claude Code / Cursor at one local `/v1` | FreeLLMAPI on laptop (this doc) |
| Keep keys off Discord/GitHub/Grid | Both: Larga uses `wrangler secret put`; FreeLLMAPI uses its **Keys** dashboard — never paste vendor keys into chat |

---

## Quick start (thin path — Docker one-liner)

**Prerequisites:** Docker installed.

```bash
curl -fsSL https://freellmapi.co/install.sh | bash
```

Re-running is safe — your `.env` and encryption key are preserved. Read the script first if you prefer: [freellmapi.co/install.sh](https://freellmapi.co/install.sh).

1. Open **http://localhost:3001**
2. **Keys** page → add provider keys (Groq, Google, OpenRouter, CloudFlare, … — same mints as [RESOURCES.md](../RESOURCES.md))
3. Reorder the **Fallback Chain**
4. Copy the **unified API key** from the Keys header

**Desktop (no Docker):** [Releases `.exe` / `.dmg`](https://github.com/tashfeenahmed/freellmapi/releases/latest) — tray app, no password on desktop builds.

Full install matrix (Compose, dev, LAN, Android Termux): [upstream install doc](https://github.com/tashfeenahmed/freellmapi/blob/main/docs/en/install/01-install.md).

---

## Add your free mints (Keys page)

Mint keys at the same places as Larga RESOURCES Step 2–3:

| Platform | Mint link |
|---|---|
| Groq | [console.groq.com](https://console.groq.com/) |
| Google Ai Studio | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| OpenRouter | [openrouter.ai](https://openrouter.ai/) |
| CloudFlare | Workers Ai / API token per upstream dashboard |
| Hugging Face | [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) |
| Cerebras | [cloud.cerebras.ai](https://cloud.cerebras.ai/) |
| Mistral | [console.mistral.ai](https://console.mistral.ai/) |

Paste each key into FreeLLMAPI’s **Keys** UI — **not** into Grid, GitHub, or Discord. FreeLLMAPI encrypts them at rest; your apps only see the unified `freellmapi-…` token.

**Leaked a vendor key?** Revoke at the vendor, mint new, update Keys page. Same rule as Larga.

---

## Call the API (`auto` routing)

Point any OpenAI SDK at your local base URL:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:3001/v1",
    api_key="freellmapi-your-unified-key",
)

resp = client.chat.completions.create(
    model="auto",  # or "auto:fast", "auto:smart", a profile, or a model id
    messages=[{"role": "user", "content": "Summarise the fall of Rome in one sentence."}],
)
print(resp.choices[0].message.content)
print("Routed via:", resp.headers.get("x-routed-via"))
```

**Routing idea:** `auto` lets the router pick the best healthy model under quota. Named models pin to one entry; profiles (e.g. coding chain) switch fallback order. Responses include `X-Routed-Via` so you see which provider actually served.

curl, streaming, tools, vision, embeddings: [upstream API reference](https://github.com/tashfeenahmed/freellmapi/blob/main/docs/en/api/01-rest-api.md).

---

## Coding agents (one command setup)

With FreeLLMAPI running locally:

```bash
npx freellmapi setup-claude --url http://localhost:3001 --api-key <unified-key>
```

Other generators: `setup-codex`, `setup-aider`, `setup-cursor` (guide), `setup-continue`, … — full list in [upstream clients doc](https://github.com/tashfeenahmed/freellmapi/blob/main/docs/en/clients/01-agent-clients.md).

| Agent | Setup command | Base URL |
|---|---|---|
| Claude Code | `setup-claude` | root |
| Codex CLI | `setup-codex` | `/v1` |
| Continue / Aider / Cline | `setup-continue` / `setup-aider` / `setup-cline` | `/v1` |

Launchers (`freellmapi launch`, `launch-codex`) inject credentials without writing them to config files.

---

## Model catalog (live feed)

Upstream maintains a **signed catalog** synced twice daily — new free models, quota changes, compatibility fixes.

- **Browse live:** [freellmapi.co/models](https://freellmapi.co/models.html)
- **Free installs** pull a monthly snapshot (~30 days behind live feed)
- **Premium** ($19/yr upstream) gets same-day catalog updates — optional; Larga docs do not require it

Example provider families in the catalog (verify live): NavyAI, HuggingFace Router, CloudFlare Workers AI, Cohere, AI Horde, Groq, Google, Cerebras, Mistral, OpenRouter, …

**Do not treat listed “7.4B tokens/month” as unlimited forever** — it is the sum of **metered free tiers**, each with its own reset and nap behavior.

---

## Limitations (honest)

From upstream — still true for students:

- No frontier models; latency varies; no SLA
- Top models hit daily caps late in the UTC day, then reset
- Free tiers are for **learning and prototyping**, not production
- Comply with each vendor’s Terms of Service when traffic is proxied

Full upstream disclaimer: [FreeLLMAPI README § Disclaimer](https://github.com/tashfeenahmed/freellmapi#disclaimer).

---

## Uninstall / data location

| OS | Data folder |
|---|---|
| Windows | `%APPDATA%\FreeLLMAPI\` |
| macOS | `~/Library/Application Support/FreeLLMAPI/` |
| Linux | `~/.config/FreeLLMAPI/` |

Docker: `docker compose down -v` drops the volume. Uninstalling the app does **not** delete keys until you remove the data folder.

---

## Link back

- **Repo:** [github.com/tashfeenahmed/freellmapi](https://github.com/tashfeenahmed/freellmapi)
- **Site:** [freellmapi.co](https://freellmapi.co/)
- **Models:** [freellmapi.co/models](https://freellmapi.co/models.html)
- **Larga Cup path:** [RESOURCES.md](../RESOURCES.md)

If this exported guide drifts from upstream, trust the repo and site — open an issue on Larga if our steps are wrong, or PR upstream if FreeLLMAPI itself changed.
