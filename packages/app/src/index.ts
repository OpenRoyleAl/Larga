import { fetchDrive } from "../../drive/src/index";
import { fetchGrid, GraphRoom } from "../../grid/src/index";
import { fetchProfile, Presence } from "../../dex/src/index";

export { GraphRoom, Presence };

export interface Env {
  AI?: Ai;
  DB: D1Database;
  GRAPHS: DurableObjectNamespace;
  PRESENCE: DurableObjectNamespace;
  CUP_NAME: string;
  CERT_SECRET: string;
  SERVICE_SECRET: string;
  DRIVE_URL: string;
  DEX_URL: string;
  GROQ_API_KEY?: string;
  OPENROUTER_API_KEY?: string;
  OPENAI_API_KEY?: string;
  GEMINI_API_KEY?: string;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const origin = new URL(req.url).origin;
    const wired = {
      ...env,
      DRIVE_URL: env.DRIVE_URL || origin,
      DEX_URL: env.DEX_URL || origin,
    };
    const path = new URL(req.url).pathname;
    if (path === "/v1/complete" || path === "/drive/health") {
      return fetchDrive(req, wired);
    }
    if (path === "/grid" || path === "/grid/" || path.startsWith("/api/graphs/")) {
      return fetchGrid(req, wired);
    }
    return fetchProfile(req, wired);
  },
} satisfies ExportedHandler<Env>;
