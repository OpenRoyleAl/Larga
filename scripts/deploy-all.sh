#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

if grep -q REPLACE_AFTER_CREATE packages/dex/wrangler.jsonc; then
  echo "Create D1 first: npx wrangler d1 create larga-dex"
  echo "Put database_id in packages/dex/wrangler.jsonc"
  exit 1
fi

npx wrangler d1 migrations apply larga-dex --config packages/dex/wrangler.jsonc
npx wrangler deploy --config packages/dex/wrangler.jsonc
npx wrangler deploy --config packages/drive/wrangler.jsonc
npx wrangler deploy --config packages/grid/wrangler.jsonc
echo "Set DEX_URL / DRIVE_URL / SERVICE_SECRET / CERT_SECRET on each worker if you have not."
