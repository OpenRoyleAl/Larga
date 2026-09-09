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
  <p class="tag">Your phone. Your AiCloud. Your agents. <em>Larga na</em> — let’s go (Cebuano).</p>
  <nav>
    <a href="/install">Install</a>
    <a href="/grid">Grid</a>
    <a href="/board">Board</a>
    <a href="/me">Profile</a>
    <a href="/certify">Tape</a>
  </nav>
  <div class="panel">
    <strong>Pick your name</strong>
    <p class="meta">This is your Pilot handle. You can change it later. Your id stays the same so companies still find you.</p>
    <form method="post" action="/v1/claim" class="row">
      <input name="handle" placeholder="suki-sa-molo" required minlength="3" maxlength="24">
      <button type="submit">Larga</button>
    </form>
  </div>
  <div class="panel">
    <p class="meta">Sponsor kettle — extra AI juice anyone on the Board can sip. Same rules for every Pilot.</p>
    <p class="rank">${kettle} units left</p>
  </div>
  <h2>Live board</h2>
  ${boardHtml}
  <footer>Larga · OpenRoyleAl · ${escapeHtml(cup)}</footer>
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
  <p class="tag">${escapeHtml(cup)} — phone first, then a real laptop if you can. AI is the point. We like that here.</p>

  <div class="panel">
    <h2>Phone or tablet</h2>
    <ol>
      <li>Open this Larga site in Chrome or Safari.</li>
      <li>Claim a handle on the home page.</li>
      <li>Share → <strong>Add to Home Screen</strong>.</li>
      <li>Open <a href="/grid">Grid</a>, add a node, run your first agent.</li>
    </ol>
    <p class="meta">Portrait mode. One thumb. That’s a full Pilot setup.</p>
  </div>

  <div class="panel">
    <h2>Laptop — install Omarchy</h2>
    <p>Omarchy is the Linux we want you on: fast, pretty, built for people who live in terminals and agents. Download the ISO, USB stick, boot, five questions. Manual: <a href="https://omarchy.org/manual/getting-started/">omarchy.org</a></p>
    ${snip("omarchy-url", "https://omarchy.org/")}
    <p>Then open this same Larga URL in the browser — or put Larga on <strong>your</strong> AiCloud with one deploy (next panel).</p>
  </div>

  <div class="panel">
    <h2>Your own AiCloud — one deploy</h2>
    <p>AiCloud is your free AI computer in the sky. One button. One Larga. Grid, Drive, Profile, Board, Tape — all together.</p>
    <p><a class="btn" href="https://deploy.workers.cloudflare.com/?url=https://github.com/OpenRoyleAl/larga">Put Larga on my AiCloud</a></p>
    <p class="meta">Sign up free when it asks. After it goes live, copy your new URL and use it on your phone too.</p>
    <p>From Omarchy / any laptop, same thing in the terminal (tap Copy):</p>
    ${snip(
      "clone",
      "git clone https://github.com/OpenRoyleAl/larga\ncd larga\nnpm install\nnpx wrangler login\nnpx wrangler d1 create larga\n# paste database_id into wrangler.jsonc\nnpx wrangler d1 migrations apply larga\nnpm run deploy",
    )}
  </div>

  <p><a href="/">← home</a></p>
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
