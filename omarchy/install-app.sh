#!/bin/sh
# Put Larga on the Omarchy launcher (name: Larga) and Super+L.
set -e
ROOT=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
BIN="${HOME}/.local/bin"
APP="${HOME}/.local/share/applications"
CFG="${XDG_CONFIG_HOME:-$HOME/.config}/larga"
HYPR="${XDG_CONFIG_HOME:-$HOME/.config}/hypr"
mkdir -p "$BIN" "$APP" "$CFG" "$HYPR"
install -m 0755 "$ROOT/larga-app" "$BIN/larga-app"
install -m 0644 "$ROOT/larga.desktop" "$APP/larga.desktop"
install -m 0644 "$ROOT/hypr-larga.conf" "$HYPR/larga.conf"
if [ ! -f "$CFG/url" ]; then
  echo "https://YOUR-LARGA.workers.dev" > "$CFG/url"
  echo "Edit $CFG/url — your CloudFlare workers.dev URL after deploy."
fi
if [ -f "$HYPR/hyprland.conf" ] && ! grep -q 'hypr/larga.conf' "$HYPR/hyprland.conf"; then
  printf '\nsource = %s/larga.conf\n' "$HYPR" >> "$HYPR/hyprland.conf"
fi
update-desktop-database "$APP" 2>/dev/null || true
echo "Launcher: search Larga. Hotkey: Super+L (reload Hyprland)."
echo "URL file: $CFG/url"
