import { test } from "node:test";
import assert from "node:assert/strict";
import { hashLoginCode, newLoginCode, normalizeLoginCode } from "./login.ts";

test("login code is 8 hex groups and normalizes junk", () => {
  const c = newLoginCode();
  assert.match(c, /^larga(-[0-9a-f]{4}){8}$/);
  assert.equal(normalizeLoginCode(c.toUpperCase()), c);
  assert.equal(normalizeLoginCode(c.replace(/-/g, " ")), c);
  assert.equal(normalizeLoginCode("nope"), null);
});

test("same code hashes the same; different codes do not", async () => {
  const a = "larga-aaaa-bbbb-cccc-dddd-eeee-ffff-0000-1111";
  const b = "larga-aaaa-bbbb-cccc-dddd-eeee-ffff-0000-1112";
  const ha = await hashLoginCode(a);
  assert.equal(ha, await hashLoginCode("  " + a.toUpperCase() + "  "));
  assert.notEqual(ha, await hashLoginCode(b));
  assert.equal(ha.length, 64);
});
