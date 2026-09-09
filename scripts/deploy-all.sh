#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

if grep -q REPLACE_AFTER_CREATE wrangler.jsonc; then
  echo "Create the database: npx wrangler d1 create larga"
  echo "Put database_id in wrangler.jsonc"
  exit 1
fi

npx wrangler d1 migrations apply larga
npx wrangler deploy
echo "Set CERT_SECRET and SERVICE_SECRET if you have not: npx wrangler secret put CERT_SECRET"
