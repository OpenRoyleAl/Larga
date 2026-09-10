import { test } from "node:test";
import assert from "node:assert/strict";
import { signTape, verifyTape, canonical } from "./certify.ts";
import { handleFromLogin, normalizeHandle } from "./handle.ts";
import { shouldFailover, route, messagesFrom } from "./route.ts";

test("handle accepts student nicknames", () => {
  assert.equal(normalizeHandle("Drive-Goblin"), "drive-goblin");
  assert.equal(normalizeHandle("x"), null);
  assert.equal(normalizeHandle("Suki_sa_molo"), null);
});

test("handleFromLogin slugs github names", () => {
  assert.equal(handleFromLogin("Drive-Goblin", "1"), "drive-goblin");
  assert.ok(handleFromLogin("ab", "deadbeef01"));
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

test("failover on 429 5xx 529 quota empty — not 401", () => {
  assert.equal(shouldFailover(429, undefined), true);
  assert.equal(shouldFailover(503, undefined), true);
  assert.equal(shouldFailover(529, undefined), true);
  assert.equal(shouldFailover(402, undefined), true);
  assert.equal(shouldFailover(401, undefined), false);
  assert.equal(shouldFailover(403, "forbidden"), false);
  assert.equal(shouldFailover(undefined, "timeout"), true);
  assert.equal(shouldFailover(undefined, "rate_limit_exceeded"), true);
  assert.equal(shouldFailover(undefined, "quota exhausted"), true);
  assert.equal(shouldFailover(undefined, "overloaded"), true);
  assert.equal(shouldFailover(200, "empty response"), true);
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

test("route hops past empty 200 then ugly 429", async () => {
  const out = await route(
    [
      { name: "blank", run: async () => ({ text: "   " }) },
      {
        name: "busy",
        run: async () => {
          throw new Error("503 groq {\"error\":\"overloaded\"}");
        },
      },
      { name: "live", run: async () => ({ text: "hello from mint 3" }) },
    ],
    [{ role: "user", content: "hi" }],
  );
  assert.equal(out.provider, "live");
  assert.equal(out.hops.length, 3);
  assert.deepEqual(
    out.hops.map((h) => h.ok),
    [false, false, true],
  );
});

test("route stops on 401 so a bad key does not burn the next mint", async () => {
  await assert.rejects(
    () =>
      route(
        [
          {
            name: "bad",
            run: async () => {
              throw new Error("401 groq unauthorized");
            },
          },
          { name: "live", run: async () => ({ text: "should not run" }) },
        ],
        [{ role: "user", content: "hi" }],
      ),
    /401/,
  );
});

test("all hops recorded when every mint dies", async () => {
  try {
    await route(
      [
        {
          name: "a",
          run: async () => {
            throw new Error("429 a");
          },
        },
        {
          name: "b",
          run: async () => {
            throw new Error("529 b");
          },
        },
      ],
      [{ role: "user", content: "hi" }],
    );
    assert.fail("expected throw");
  } catch (e) {
    const hops = (e as { hops?: { provider: string }[] }).hops;
    assert.equal(hops?.length, 2);
    assert.equal(hops?.[0].provider, "a");
    assert.equal(hops?.[1].provider, "b");
  }
});

test("messagesFrom prefers chat array", () => {
  const m = messagesFrom({ prompt: "a", messages: [{ role: "user", content: "b" }] });
  assert.equal(m?.[0].content, "b");
});
