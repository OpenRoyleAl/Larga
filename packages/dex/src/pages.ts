import { TO_YOUR_AGENT } from "../../shared/src/agent-blurb";
import { escapeHtml, page, snip } from "../../shared/src/hud";
import type { PetPack, PetState } from "../../shared/src/types";

export function landing(cup: string, boardHtml: string, kettle: number, oauthHtml: string): string {
  return page(
    "Larga",
    `
<div class="hero">
  <img src="/og.jpg?v=2" width="1200" height="630" alt="Larga — Cebu Ai Agent Cup. Student Ai tournament. Chain prompts. One CloudFlare Worker. Born in Cebu.">
</div>
<div class="wrap">
  <header class="brand">
    <h1>Larga</h1>
    <span>${escapeHtml(cup)}</span>
  </header>
  <p class="tag">A <strong>student Ai tournament</strong> in Cebu. Sign in, run prompts on Grid, climb the Board. One CloudFlare Worker. No API keys to start. Born in Cebu.</p>
  <nav>
    <a href="/install">Install</a>
    <a href="/resources">Free Ai</a>
    <a href="/login">Sign in</a>
    <a href="/grid">Grid</a>
    <a href="/board">Board</a>
    <a href="/me">Profile</a>
    <a href="/certify">Tape</a>
  </nav>
  <div class="panel">
    <strong>Play</strong>
    <p class="meta">GitHub or Google is your account. Same login on a new phone. We never see your password.</p>
    ${oauthHtml || "<p class=\"meta\">Sign-in providers are still being attached to this Cup host.</p>"}
  </div>
  <div class="panel">
    <p class="meta">Need / skip</p>
    <p>Tokens only → <a href="/resources">Free Student Ai</a>.</p>
    <p>Your own Worker → <a href="/install">Install</a>.</p>
    <p>iPhone / iPad → Safari on this phone. Android → Chrome, or Termux from F-Droid for a shell.</p>
  </div>
  <details class="panel">
    <summary>Handle only (no Google / GitHub)</summary>
    <p class="meta">You must screenshot the recovery code. Lost code + lost phone = gone.</p>
    <form method="post" action="/v1/claim" class="row">
      <input name="handle" placeholder="suki-sa-molo" required minlength="3" maxlength="24">
      <button type="submit">Create Pilot</button>
    </form>
    <p class="meta"><a href="/login">I have a recovery code</a></p>
  </details>
  ${kettle > 0 ? `<div class="panel">
    <p class="meta">Sponsor kettle — extra Ai juice anyone on the Board can sip. Same rules for every Pilot.</p>
    <p class="rank">${kettle} units left</p>
  </div>` : ""}
  <h2>Cup Board — Season 0</h2>
  <p class="meta">Rank: graphs run, then failovers, then tokens. Pets are skins.</p>
  ${boardHtml}
  <footer>Larga · OpenRoyleAl · Born in Cebu · ${escapeHtml(cup)}</footer>
</div>`,
  );
}

export function welcomePage(handle: string, code: string): string {
  return page(
    "Save this code",
    `
<div class="wrap">
  <header class="brand"><h1>Pilot @${escapeHtml(handle)}</h1><span>save this</span></header>
  <p class="tag">This recovery code <strong>is</strong> your account if you did not use GitHub/Google. Stay on <strong>this phone</strong>: Share → Add to Home Screen, then Grid. You do not need another device.</p>
  <div class="panel">
    ${snip("recovery", code)}
    <p class="meta">Screenshot into Notes. Do not paste it into Grid or Discord.</p>
  </div>
  <p class="row">
    <a class="btn" href="/grid">Open Grid</a>
    <a href="/me">Profile</a>
  </p>
  <p class="meta">iPhone: Share (square with arrow) → Add to Home Screen. Then tap Larga.</p>
</div>`,
  );
}

export function loginPage(err?: string, oauthHtml = ""): string {
  return page(
    "Sign in · Larga",
    `
<div class="wrap">
  <header class="brand"><h1>Sign in</h1><span>your account</span></header>
  <p class="tag">Same Pilot on a new phone. GitHub or Google — we never see your password.</p>
  ${err ? `<p class="meta" style="color:var(--fail)">${escapeHtml(err)}</p>` : ""}
  <div class="panel">
    ${oauthHtml || "<p class=\"meta\">Providers not wired on this host.</p>"}
  </div>
  <details class="panel">
    <summary>Recovery code instead</summary>
    <form method="post" action="/v1/login">
      <textarea name="code" required placeholder="larga-xxxx-xxxx-…" autocomplete="off"></textarea>
      <button type="submit">Sign in with code</button>
    </form>
  </details>
  <p class="meta"><a href="/">Home</a></p>
</div>`,
  );
}

export function installPage(cup: string, oauthHtml: string): string {
  return page(
    "Install Larga",
    `
<div class="hero">
  <img src="/og.jpg?v=2" width="1200" height="630" alt="Larga — Cebu Ai Agent Cup">
</div>
<div class="wrap">
  <header class="brand">
    <h1>Larga</h1>
    <span>this phone</span>
  </header>
  <p class="tag">${escapeHtml(cup)} — finish here. iPhone and Android both play in the browser. No laptop hop.</p>

  <div class="panel">
    <h2>1. Your name</h2>
    <p class="meta">On this screen. Then screenshot the recovery code if you are not using GitHub/Google.</p>
    ${oauthHtml}
    <form method="post" action="/v1/claim" class="row">
      <input name="handle" placeholder="suki-sa-molo" required minlength="3" maxlength="24">
      <button type="submit">Claim handle</button>
    </form>
    <p class="meta"><a href="/login">Already a Pilot</a></p>
  </div>

  <div class="panel">
    <h2>2. Stay on this phone</h2>
    <p>iPhone / iPad: Safari → Share → <strong>Add to Home Screen</strong> → open Larga → <a href="/grid">Grid</a>.</p>
    <p>Android: Chrome → menu → Add to Home screen → <a href="/grid">Grid</a>.</p>
    <p class="meta">There is no iPhone Termux. You do not need one. The site is the game.</p>
  </div>

  <div class="panel">
    <h2>Give this to your agent</h2>
    <p class="meta">Cursor, Claude, Copilot, whatever. Copy once. They should not ask you for a second device.</p>
    ${snip("to-agent", TO_YOUR_AGENT)}
  </div>

  <details class="panel">
    <summary>Optional: own Worker / Omarchy / Termux</summary>
    <p>Shared Cup is already live. Deploy only if you want your own Board.</p>
    <p><a class="btn" href="https://deploy.workers.cloudflare.com/?url=https://github.com/OpenRoyleAl/Larga">Deploy to Cloudflare</a></p>
    ${snip(
      "clone",
      "git clone https://github.com/OpenRoyleAl/Larga\ncd Larga\nnpm install\nnpx wrangler login\nnpx wrangler d1 create larga\n# paste database_id into wrangler.jsonc (repo root)\nnpx wrangler d1 migrations apply larga\nnpm run deploy",
    )}
    <p class="meta">Android shell only: Termux from F-Droid, not Play Store.</p>
    ${snip("termux", "https://f-droid.org/packages/com.termux/")}
    ${snip("omarchy-app", "chmod +x omarchy/install-app.sh omarchy/larga-app\n./omarchy/install-app.sh")}
  </details>

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
  <p class="tag"><strong>Use it or lose them.</strong> Free quotas nap and reset. Step 0: play the Cup at <a href="https://larga.openroyleal.com">larga.openroyleal.com</a> with <strong>0 keys</strong> — Workers Ai is already on. Full guide: repo <a href="https://github.com/OpenRoyleAl/Larga/blob/main/RESOURCES.md">RESOURCES.md</a> · optional laptop <a href="https://github.com/OpenRoyleAl/Larga/blob/main/docs/free-llm-api.md">FreeLLMAPI</a>.</p>
  <div class="panel">
    <h2>Step 0 — 0 keys</h2>
    <p class="meta">Shared Cup = CloudFlare Workers Ai kettle. No paste box for your vendor keys — on purpose.</p>
  </div>
  <div class="panel">
    <h2>Keep keys safe</h2>
    <p>A token is a password for Ai. Treat it like one.</p>
    <p class="meta">Your Worker only: <code>npx wrangler secret put …</code>. Never git, Discord, Grid prompts, screenshots, or <code>.dev.vars</code> for real vendor keys. Leaked? Revoke + mint. 401 stops Drive hop — fix the dead key before the next mint.</p>
  </div>
  <div class="panel">
    <h2>Step 2 — wired hops</h2>
    ${snip("secrets", "npx wrangler secret put GROQ_API_KEY\nnpx wrangler secret put OPENROUTER_API_KEY\nnpx wrangler secret put GEMINI_API_KEY")}
    <p class="meta">Step 3 mints (HF, Cerebras, SambaNova, Mistral, GitHub Models): see RESOURCES.md — mint only until Drive wires them.</p>
  </div>
  <div class="panel">
    <p><a href="https://console.groq.com/">Groq</a> · <a href="https://aistudio.google.com/apikey">Google Ai Studio</a> · <a href="https://openrouter.ai/">OpenRouter</a> · <a href="https://huggingface.co/settings/tokens">Hugging Face</a> · <a href="https://education.github.com/pack">Student Pack</a></p>
  </div>
  <div class="panel">
    <h2>Android</h2>
    ${snip("fdroid", "https://f-droid.org/packages/com.termux/")}
    <p class="meta">iPhone: Safari. Add to Home Screen. You are not missing a terminal.</p>
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
  <p class="tag">Season 0 table. Rank = graphs, then failovers, then tokens out. Pets move only while Drive is running.</p>
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
  hasLogin?: boolean;
}): string {
  const edit = opts.mine
    ? `<div class="panel">
    <p><strong>Recovery code</strong></p>
    <p class="meta">${opts.hasLogin ? "You have a login code. Lost it? Mint a new one — the old code stops working." : "This Pilot has no recovery code yet (old cookie-only session). Mint one before you switch phones."}</p>
    <form method="post" action="/v1/recovery">
      <button type="submit">${opts.hasLogin ? "Replace recovery code" : "Create recovery code"}</button>
    </form>
  </div>
  <div class="panel">
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
  </div>
  <form method="post" action="/v1/logout"><button type="submit" class="ghost">Sign out</button></form>`
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
