export type PetState =
  | "idle"
  | "running"
  | "failed"
  | "review"
  | "waving"
  | "jump";

export type PetPack = {
  id: string;
  displayName: string;
  description?: string;
  spritesheetUrl?: string;
  spriteVersionNumber?: 1 | 2;
  source?: string;
};

export type HandleHistory = {
  handle: string;
  from: string;
  to: string | null;
};

export type TapeLenses = {
  github?: { login: string; htmlUrl: string; publicRepos?: number };
  cursor?: { profileUrl: string };
  drive?: {
    tokensIn: number;
    tokensOut: number;
    hops: number;
    providers: string[];
    failovers: number;
  };
  grid?: { graphs: number; lastGraphId?: string };
};

export type CertifyTape = {
  schema: "larga.tape.v1";
  userId: string;
  handle: string;
  issuedAt: string;
  cup: string;
  lenses: TapeLenses;
  facts: Array<{ kind: string; at: string; detail: string }>;
  pet?: PetPack;
  signature?: string;
};

export type CompleteRequest = {
  prompt?: string;
  messages?: Array<{ role: string; content: string }>;
  userId?: string;
};

export type Hop = {
  provider: string;
  ok: boolean;
  status?: number;
  ms: number;
  error?: string;
};

export type CompleteResponse = {
  text: string;
  provider: string;
  hops: Hop[];
  tokensIn?: number;
  tokensOut?: number;
};
