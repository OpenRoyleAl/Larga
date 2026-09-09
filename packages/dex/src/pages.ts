import { escapeHtml, page, snip } from "../../shared/src/hud";
import type { PetPack, PetState } from "../../shared/src/types";

export function landing(cup: string, boardHtml: string, kettle: number): string {
  return page(
    "Larga",
    `
<div class="wrap">
  <header class="brand">
    <h1>Larga</h1>
    <span>${escapeHtml(cup)}</span>
  </header>
  <p class="tag">Your phone. Your CloudFlare. Your agents. <em>Larga na</em> — let’s go (Cebuano).</p>
  <nav>
    <a href="/install">Install</a>
    <a href="/resources">Free Ai</a>
    <a href="/grid">Grid</a>
    <a href="/board">Board</a>
    <a href="/me">Profile</a>
    <a href="/certify">Tape</a>
  </nav>
  <div class="panel">
    <p class="meta">Need / skip</p>
    <p>Tokens only → <a href="/resources">Free Student Ai</a> (skip Larga).</p>
    <p>Laptop → Omarchy, then Super+L app named Larga.</p>
    <p>Cup / Tape → 1 CloudFlare deploy.</p>
    <p>Android shell → Termux on F-Droid. iPhone shell → out of luck.</p>
  </div>
  <div class="panel">
    <strong>Pick your name</strong>
    <p class="meta">This is your Pilot handle. You can change it later. Your id stays the same so companies still find you.</p>
    <form method="post" action="/v1/claim" class="row">
      <input name="handle" placeholder="suki-sa-molo" required minlength="3" maxlength="24">
      <button type="submit">Larga</button>
    </form>
  </div>
  <div class="panel">
    <p class="meta">Sponsor kettle — extra Ai juice anyone on the Board can sip. Same rules for every Pilot.</p>
    <p class="rank">${kettle} units left</p>
  </div>
  <h2>Live board</h2>
  ${boardHtml}
  <footer>Larga · OpenRoyleAl · Born in Cebu · ${escapeHtml(cup)}</footer>
</div>`,
  );
}

export function installPage(cup: string): string {
  return page(
    "Install Larga",
    `
<div class="wrap">
  <header class="brand">
    <h1>Larga</h1>
    <span>install</span>
  </header>
  <p class="tag">${escapeHtml(cup)}. Need / skip is on the home README. Tokens-only: <a href="/resources">Free Student Ai</a>.</p>

  <div class="panel">
    <h2>Phone / tablet</h2>
    <ol>
      <li>Open this Larga URL.</li>
      <li>Claim a handle.</li>
      <li>Add to Home Screen.</li>
      <li><a href="/grid">Grid</a>.</li>
    </ol>
  </div>

  <div class="panel">
    <h2>Android Termux</h2>
    <p>Play Store Termux is dead. Use F-Droid:</p>
    ${snip("termux", "https://f-droid.org/packages/com.termux/")}
    ${snip("termux-pkg", "pkg update && pkg upgrade\npkg install tmux git")}
    <p class="meta">iPhone: no Termux. Out of luck for a terminal. Safari can still open Larga.</p>
  </div>

  <div class="panel">
    <h2>Omarchy — Super+L app</h2>
    <p>Not a browser tab. Launcher name <strong>Larga</strong>. Hotkey <strong>Super+L</strong>.</p>
    ${snip("omarchy", "https://omarchy.org/")}
    ${snip(
      "omarchy-app",
      "chmod +x omarchy/install-app.sh omarchy/larga-app\n./omarchy/install-app.sh\n# then edit ~/.config/larga/url",
    )}
  </div>

  <div class="panel">
    <h2>1 deploy on CloudFlare</h2>
    <p>One Worker. Free student tier. <a class="btn" href="https://deploy.workers.cloudflare.com/?url=https://github.com/OpenRoyleAl/Larga">Deploy to Cloudflare</a></p>
    ${snip(
      "clone",
      "git clone https://github.com/OpenRoyleAl/Larga\ncd Larga\nnpm install\nnpx wrangler login\nnpx wrangler d1 create larga\n# paste database_id into wrangler.jsonc\nnpx wrangler d1 migrations apply larga\nnpm run deploy",
    )}
    <p class="meta">Keep running: <a href="/resources">Free Student Ai</a> then <code>npx wrangler secret put GROQ_API_KEY</code></p>
  </div>

  <p><a href="/">← home</a></p>
</div>`,
  );
}

export function resourcesPage(): string {
  return page(
    "Free Student Ai",
    `
<div class="wrap">
  <header class="brand">
    <h1>Larga</h1>
    <span>Free Student Ai</span>
  </header>
  <p class="tag">Skip Larga and Omarchy if you only want tokens. Full list + after-deploy secrets: the repo <a href="https://github.com/OpenRoyleAl/Larga/blob/main/RESOURCES.md">RESOURCES.md</a>.</p>
  <div class="panel">
    <p><a href="https://console.groq.com/">Groq</a> · <a href="https://aistudio.google.com/apikey">Google Ai Studio</a> · <a href="https://openrouter.ai/">OpenRouter</a> · <a href="https://huggingface.co/settings/tokens">Hugging Face</a></p>
    <p><a href="https://education.github.com/pack">GitHub Student Pack</a> · <a href="https://cloud.cerebras.ai/">Cerebras</a> · <a href="https://cloud.sambanova.ai/">SambaNova</a> · <a href="https://console.mistral.ai/">Mistral</a> · <a href="https://github.com/marketplace/models">GitHub Models</a></p>
    <p>CloudFlare Workers Ai ships with a Larga deploy (no extra key).</p>
  </div>
  <div class="panel">
    <h2>Keep Larga Drive alive</h2>
    ${snip("secrets", "npx wrangler secret put GROQ_API_KEY\nnpx wrangler secret put OPENROUTER_API_KEY\nnpx wrangler secret put GEMINI_API_KEY")}
  </div>
  <div class="panel">
    <h2>Android</h2>
    ${snip("fdroid", "https://f-droid.org/packages/com.termux/")}
    <p class="meta">iPhone terminal: out of luck.</p>
  </div>
  <p><a href="/install">install</a> · <a href="/">home</a></p>
</div>`,
  );
}

export function boardPage(cup: string, rows: string): string {
  return page(
    "Larga Board",
    `
<div class="wrap">
  <header class="brand"><h1>Board</h1><span>${escapeHtml(cup)}</span></header>
  <p class="tag">Pets move when Drive is in flight. Idle pets do not fake-run.</p>
  <p class="meta"><a href="/">home</a> · live via EventSource</p>
  <div id="board">${rows}</div>
</div>
<script>
const es = new EventSource('/v1/board/stream');
es.onmessage = (e) => {
  try { document.getElementById('board').innerHTML = JSON.parse(e.data); }
  catch (err) {}
};
</script>`,
  );
}

export function petClass(state: PetState | string | undefined): string {
  const s = state || "idle";
  return `pet ${s}`;
}

export function rowHtml(p: {
  handle: string;
  userId: string;
  tokensOut: number;
  failovers: number;
  graphs: number;
  state?: string;
  pet?: PetPack | null;
}): string {
  const style = p.pet?.spritesheetUrl
    ? ` style="background-image:url('${escapeHtml(p.pet.spritesheetUrl)}')"`
    : "";
  const sheet = p.pet?.spritesheetUrl ? " has-sheet" : "";
  const name = p.pet?.displayName ? escapeHtml(p.pet.displayName) : "no pet";
  return `<div class="pilot">
    <div class="${petClass(p.state)}${sheet}"${style} title="${name}"></div>
    <div>
      <a href="/u/${escapeHtml(p.handle)}">${escapeHtml(p.handle)}</a>
      <div class="meta">${name} · ${escapeHtml(p.state || "idle")}</div>
    </div>
    <div class="rank">${p.graphs}g ${p.failovers}fo ${p.tokensOut}tok</div>
  </div>`;
}

export function profilePage(opts: {
  handle: string;
  userId: string;
  github?: string;
  cursor?: string;
  petName?: string;
  history: string[];
  mine?: boolean;
}): string {
  const edit = opts.mine
    ? `<div class="panel">
    <form method="post" action="/v1/handle" class="row">
      <input name="handle" placeholder="new handle" minlength="3">
      <button type="submit">rename</button>
    </form>
    <p class="meta">Old handles stay on the tape.</p>
  </div>
  <div class="panel">
    <form method="post" action="/v1/github" class="row">
      <input name="login" placeholder="github login" value="${escapeHtml(opts.github || "")}">
      <button type="submit">link github</button>
    </form>
    <form method="post" action="/v1/cursor" class="row" style="margin-top:.5rem">
      <input name="url" placeholder="https://cursor.com/..." value="${escapeHtml(opts.cursor || "")}" style="flex:1">
      <button type="submit">link cursor</button>
    </form>
  </div>
  <div class="panel">
    <p>Active pet: ${escapeHtml(opts.petName || "none — optional Petdex pack")}</p>
    <form method="post" action="/v1/pet">
      <textarea name="pet" placeholder='{"id":"bangka","displayName":"Bangka","spritesheetUrl":"https://petdex.dev/..."}'></textarea>
      <button type="submit">set pet</button>
    </form>
  </div>`
    : `<div class="panel">
        <p>GitHub: ${escapeHtml(opts.github || "—")}</p>
        <p>Cursor: ${escapeHtml(opts.cursor || "—")}</p>
        <p>Pet: ${escapeHtml(opts.petName || "none")}</p>
      </div>`;
  return page(
    `${opts.handle} · Larga`,
    `
<div class="wrap">
  <header class="brand"><h1>@${escapeHtml(opts.handle)}</h1><span>pilot</span></header>
  <p class="meta">user_id <code>${escapeHtml(opts.userId)}</code></p>
  ${edit}
  <p class="meta">Was: ${opts.history.map(escapeHtml).join(" → ") || "—"}</p>
  <p><a href="/u/${escapeHtml(opts.handle)}/tape">tape</a>${opts.mine ? ' · <a href="/certify">my tape</a>' : ""} · <a href="/board">board</a></p>
</div>`,
  );
}
