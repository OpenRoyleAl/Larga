/** Retro HUD. Jeepney chrome + scanlines. */
export const HUD_CSS = `
:root {
  --bg: #07080d;
  --panel: #10131c;
  --chrome: #d4af37;
  --jeep: #e85d04;
  --hud: #3df0ff;
  --mag: #ff2d95;
  --ok: #5cff9a;
  --fail: #ff4d6d;
  --text: #e8ecf4;
  --dim: #8b93a7;
}
* { box-sizing: border-box; }
html, body { margin: 0; background: var(--bg); color: var(--text);
  font-family: ui-monospace, "IBM Plex Mono", "Cascadia Mono", monospace;
  min-height: 100%; }
body::before {
  content: ""; pointer-events: none; position: fixed; inset: 0; z-index: 9;
  background: repeating-linear-gradient(180deg, transparent 0 2px, rgba(0,0,0,.12) 2px 3px);
  opacity: .35;
}
a { color: var(--hud); }
.wrap { max-width: 720px; margin: 0 auto; padding: 1rem 1rem 4rem; }
.brand { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; border-bottom: 2px solid var(--chrome); padding-bottom: .5rem; }
.brand h1 { margin: 0; font-size: 1.4rem; letter-spacing: .12em; color: var(--chrome); }
.snip { position: relative; margin: .5rem 0 1rem; }
.snip pre { margin: 0; padding: .8rem 5.5rem .8rem .8rem; background: #0b0e16; border: 1px solid #3a4258; color: var(--ok); }
.snip .copy { position: absolute; top: .45rem; right: .45rem; z-index: 2; font-size: .7rem; padding: .35rem .55rem; }
.brand span { color: var(--jeep); font-size: .75rem; }
.tag { color: var(--dim); font-size: .85rem; margin: .75rem 0 1.25rem; }
.panel { background: var(--panel); border: 1px solid #2a3144; padding: 1rem; margin: .75rem 0; }
.row { display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; }
input, textarea, button {
  font: inherit; background: #0b0e16; color: var(--text);
  border: 1px solid #3a4258; padding: .55rem .7rem; border-radius: 2px;
}
textarea { width: 100%; min-height: 90px; }
button, .btn {
  background: var(--jeep); color: #140800; border: 0; font-weight: 700;
  cursor: pointer; text-decoration: none; display: inline-block;
}
button.ghost { background: transparent; color: var(--hud); border: 1px solid var(--hud); }
.pilot { display: grid; grid-template-columns: 56px 1fr auto; gap: .75rem; align-items: center;
  padding: .6rem 0; border-bottom: 1px solid #22283a; }
.pet {
  width: 48px; height: 52px; image-rendering: pixelated;
  background: var(--hud); border: 2px solid var(--chrome);
  clip-path: polygon(20% 0, 80% 0, 100% 30%, 80% 100%, 20% 100%, 0 30%);
}
.pet.running { animation: bounce .35s infinite alternate; background: var(--ok); }
.pet.failed { animation: shake .2s infinite; background: var(--fail); }
.pet.idle { opacity: .55; }
.pet.waving { animation: bounce .5s infinite alternate; background: var(--mag); }
.pet.jump { animation: bounce .2s infinite alternate; }
.pet.has-sheet { clip-path: none; background-size: cover; background-color: transparent; border: 0; }
@keyframes bounce { from { transform: translateY(0) } to { transform: translateY(-6px) } }
@keyframes shake { from { transform: translateX(-2px) } to { transform: translateX(2px) } }
.meta { font-size: .75rem; color: var(--dim); }
.rank { color: var(--chrome); font-weight: 700; }
nav a { margin-right: 1rem; }
.nodes { display: flex; flex-direction: column; gap: .5rem; }
.node { border-left: 3px solid var(--hud); padding-left: .6rem; }
pre { white-space: pre-wrap; word-break: break-word; font-size: .8rem; color: var(--ok); }
footer { margin-top: 2rem; color: var(--dim); font-size: .75rem; }
@media (max-width: 480px) { .brand h1 { font-size: 1.1rem; letter-spacing: .12em; } }
`;

export function page(title: string, body: string, extraHead = ""): string {
  return `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>${HUD_CSS}</style>
${extraHead}
<body>
${body}
<script>
document.addEventListener("click", async (e) => {
  const b = e.target.closest("[data-copy]");
  if (!b) return;
  const el = document.getElementById(b.getAttribute("data-copy"));
  if (!el) return;
  try {
    await navigator.clipboard.writeText(el.innerText);
    const old = b.textContent;
    b.textContent = "Copied";
    setTimeout(() => { b.textContent = old; }, 1200);
  } catch (err) {}
});
</script>
</body>
</html>`;
}

export function snip(id: string, code: string): string {
  return `<div class="snip"><pre id="${id}">${escapeHtml(code)}</pre><button type="button" class="copy" data-copy="${id}">Copy</button></div>`;
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
