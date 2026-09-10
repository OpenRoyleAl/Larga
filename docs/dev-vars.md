Copy to `.dev.vars` in the repo root (same folder as wrangler.jsonc). Gitignored. Use dummy values only.

```
CERT_SECRET=dev-cert
SERVICE_SECRET=dev-service
CUP_NAME=Cebu Ai Agent Cup
```

Then `npm run db` and `npm run dev`.

Do **not** put Groq / OpenRouter / Gemini keys in this file if you might copy the folder, screenshot the editor, or paste into chat. For a live Worker use `npx wrangler secret put`.
