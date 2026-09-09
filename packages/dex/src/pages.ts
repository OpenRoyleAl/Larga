import { escapeHtml, page } from "../../shared/src/hud";
import type { PetPack, PetState } from "../../shared/src/types";

export function landing(cup: string, boardHtml: string, kettle: number): string {
  return page(
    "LARGA",
    `
<div class="wrap">
  <header class="brand">
    <h1>Larga</h1>
    <span>na · ${escapeHtml(cup)}</span>
  </header>
  <p class="tag">Your phone. Your Cloudflare. Your Grid. Cebuano for cast off — not a sword.</p>
  <nav>
    <a href="/board">Board</a>
    <a href="/me">Profile</a>
    <a href="/certify">Certify</a>
    <a href="/health">Health</a>
  </nav>
  <div class="panel">
    <strong>Claim a handle</strong>
    <p class="meta">user_id never changes. Nickname can. Pet is optional.</p>
    <form method="post" action="/v1/claim" class="row">
      <input name="handle" placeholder="suki-sa-molo" required minlength="3" maxlength="24">
      <button type="submit">Larga</button>
    </form>
  </div>
  <div class="panel">
    <p class="meta">Sponsor kettle (public pot, not a leader multiplier)</p>
    <p class="rank">${kettle} units left</p>
  </div>
  <h2>Live board</h2>
  ${boardHtml}
  <footer>GRID · DRIVE · DEX · OpenRoyleAl · Apache-2.0</footer>
</div>`,
  );
}

export function boardPage(cup: string, rows: string): string {
  return page(
    "LARGA Board",
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
    `${opts.handle} · LARGA`,
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
