import { test } from "node:test";
import assert from "node:assert/strict";
import { signTape, verifyTape, canonical } from "./certify.ts";
import { normalizeHandle } from "./handle.ts";
import { shouldFailover, route, messagesFrom } from "./route.ts";

test("handle accepts student nicknames", () => {
  assert.equal(normalizeHandle("Drive-Goblin"), "drive-goblin");
  assert.equal(normalizeHandle("x"), null);
  assert.equal(normalizeHandle("Suki_sa_molo"), null);
});

test("canonical drops signature and sorts keys", () => {
  const j = canonical({ b: 1, a: 2, signature: "nope" });
  assert.equal(j, '{"a":2,"b":1}');
});

test("tape roundtrip", async () => {
  const tape = { schema: "larga.tape.v1", userId: "u1", handle: "suki" };
  const sig = await signTape(tape, "secret");
  assert.equal(await verifyTape({ ...tape, signature: sig }, "secret"), true);
  assert.equal(await verifyTape({ ...tape, signature: sig }, "other"), false);
});

test("failover on 429 and 5xx only", () => {
  assert.equal(shouldFailover(429, undefined), true);
  assert.equal(shouldFailover(503, undefined), true);
  assert.equal(shouldFailover(401, undefined), false);
  assert.equal(shouldFailover(undefined, "timeout"), true);
});

test("route skips dying providers", async () => {
  const out = await route(
    [
      {
        name: "dead",
        run: async () => {
          throw new Error("429 rate limit");
        },
      },
      {
        name: "live",
        run: async () => ({ text: "ok", tokensOut: 3 }),
      },
    ],
    [{ role: "user", content: "hi" }],
  );
  assert.equal(out.provider, "live");
  assert.equal(out.hops.length, 2);
  assert.equal(out.hops[0].ok, false);
  assert.equal(out.text, "ok");
});

test("messagesFrom prefers chat array", () => {
  const m = messagesFrom({ prompt: "a", messages: [{ role: "user", content: "b" }] });
  assert.equal(m?.[0].content, "b");
});
