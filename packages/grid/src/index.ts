import { page } from "../../shared/src/hud";

export interface Env {
  GRAPHS: DurableObjectNamespace;
  DRIVE_URL: string;
  DEX_URL: string;
  SERVICE_SECRET: string;
}

type Node = { id: string; prompt: string; output?: string; provider?: string };

export class GraphRoom implements DurableObject {
  constructor(private readonly ctx: DurableObjectState, private readonly env: Env) {}

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    if (req.method === "GET") {
      const graph = (await this.ctx.storage.get<Node[]>("nodes")) ?? [];
      return Response.json({ nodes: graph });
    }
    if (req.method === "PUT") {
      const body = (await req.json()) as { nodes: Node[] };
      await this.ctx.storage.put("nodes", body.nodes.slice(0, 40));
      return Response.json({ ok: true });
    }
    if (req.method === "POST" && url.pathname.endsWith("/run")) {
      const body = (await req.json()) as { userId?: string; nodeId?: string };
      const nodes = (await this.ctx.storage.get<Node[]>("nodes")) ?? [];
      const targets = body.nodeId ? nodes.filter((n) => n.id === body.nodeId) : nodes;
      if (!this.env.DRIVE_URL) return Response.json({ error: "DRIVE_URL not set" }, { status: 503 });
      if (this.env.DEX_URL && body.userId) {
        fetch(new URL("/v1/presence", this.env.DEX_URL), {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${this.env.SERVICE_SECRET}`,
          },
          body: JSON.stringify({ userId: body.userId, state: "running" }),
        }).catch(() => {});
      }
      for (const n of targets) {
        const res = await fetch(new URL("/v1/complete", this.env.DRIVE_URL), {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ prompt: n.prompt, userId: body.userId }),
        });
        const j = (await res.json()) as { text?: string; provider?: string; error?: string };
        n.output = j.text ?? j.error ?? "empty";
        n.provider = j.provider;
      }
      await this.ctx.storage.put("nodes", nodes);
      if (this.env.DEX_URL && body.userId) {
        fetch(new URL("/v1/facts", this.env.DEX_URL), {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${this.env.SERVICE_SECRET}`,
          },
          body: JSON.stringify({
            userId: body.userId,
            kind: "grid.run",
            detail: JSON.stringify({ graphId: this.ctx.id.toString(), nodes: nodes.length }),
          }),
        }).catch(() => {});
      }
      return Response.json({ nodes });
    }
    return new Response("no", { status: 404 });
  }
}

function ui(driveSet: boolean): string {
  return page(
    "Larga Grid",
    `
<header class="brand wrap" style="max-width:none">
  <h1>Grid</h1>
  <span>chain AI here</span>
</header>
<div class="wrap">
  <p class="tag">Add a node. Type a prompt. Run. Your pet on the Board moves while Drive is working.</p>
  <p class="meta">Drive ${driveSet ? "ready" : "still waking up"}</p>
  <div class="row">
    <input id="uid" placeholder="your Larga id (Profile page)" style="flex:1">
    <button type="button" id="add">+ node</button>
    <button type="button" id="run" class="ghost">run all</button>
  </div>
  <div class="nodes" id="nodes"></div>
  <p class="meta">Graph id: <code id="gid"></code></p>
</div>
<script>
const gid = localStorage.largaGraph || (localStorage.largaGraph = crypto.randomUUID());
document.getElementById('gid').textContent = gid;
document.getElementById('uid').value = localStorage.largaUserId || '';
let nodes = [];
function render() {
  document.getElementById('nodes').innerHTML = nodes.map((n,i) => \`
    <div class="node panel">
      <textarea data-i="\${i}">\${n.prompt || ''}</textarea>
      <p class="meta">\${n.provider || ''} \${n.id}</p>
      <pre>\${n.output ? n.output : ''}</pre>
    </div>\`).join('');
  document.querySelectorAll('textarea').forEach(t => t.oninput = e => { nodes[+e.target.dataset.i].prompt = e.target.value; save(); });
}
async function load() {
  const r = await fetch('/api/graphs/' + gid);
  const j = await r.json();
  nodes = j.nodes || [];
  render();
}
async function save() {
  await fetch('/api/graphs/' + gid, { method: 'PUT', headers: {'content-type':'application/json'}, body: JSON.stringify({ nodes }) });
}
document.getElementById('add').onclick = () => {
  nodes.push({ id: crypto.randomUUID().slice(0,8), prompt: '' });
  render(); save();
};
document.getElementById('run').onclick = async () => {
  localStorage.largaUserId = document.getElementById('uid').value;
  await save();
  const r = await fetch('/api/graphs/' + gid + '/run', { method: 'POST', headers: {'content-type':'application/json'},
    body: JSON.stringify({ userId: document.getElementById('uid').value || undefined }) });
  const j = await r.json();
  nodes = j.nodes || nodes;
  render();
};
load();
</script>
<footer class="wrap">Larga · Grid · Cebu AI Agent Cup</footer>
`,
  );
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    return fetchGrid(req, env);
  },
} satisfies ExportedHandler<Env>;

export async function fetchGrid(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  if ((url.pathname === "/" || url.pathname === "/grid" || url.pathname === "/grid/") && req.method === "GET") {
    return new Response(ui(!!env.DRIVE_URL), { headers: { "content-type": "text/html; charset=utf-8" } });
  }
  const m = url.pathname.match(/^\/api\/graphs\/([^/]+)(\/run)?$/);
  if (m) {
    const id = env.GRAPHS.idFromName(m[1]);
    const stub = env.GRAPHS.get(id);
    const path = m[2] ? "https://graph/run" : "https://graph/";
    return stub.fetch(
      new Request(path, { method: req.method, headers: req.headers, body: req.body }),
    );
  }
  return new Response("not found", { status: 404 });
}
