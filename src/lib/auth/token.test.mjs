import assert from "node:assert/strict";
import { test } from "node:test";

process.env.AUTH_SECRET = "test-secret-test-secret-test-secret-0123";
const { createSessionToken, verifySessionToken, SESSION_TTL_SECONDS } = await import("./token.ts");

const NOW = Date.parse("2026-10-12T12:00:00Z");

test("valid token round-trips", () => {
  const t = createSessionToken("res-1", "fixtures", NOW);
  const p = verifySessionToken(t, NOW + 1000);
  assert.equal(p.sub, "res-1");
  assert.equal(p.provider, "fixtures");
});

test("expired token is rejected", () => {
  const t = createSessionToken("res-1", "fixtures", NOW);
  assert.equal(verifySessionToken(t, NOW + (SESSION_TTL_SECONDS + 1) * 1000), null);
});

test("tampered payload or signature is rejected", () => {
  const t = createSessionToken("res-1", "fixtures", NOW);
  const [body, sig] = t.split(".");
  const forged = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(body, "base64url")), sub: "res-2" })).toString("base64url");
  assert.equal(verifySessionToken(`${forged}.${sig}`, NOW), null);
  assert.equal(verifySessionToken(`${body}.${sig.slice(0, -2)}xx`, NOW), null);
  assert.equal(verifySessionToken(`${body}.${sig}.extra`, NOW), null);
  assert.equal(verifySessionToken("garbage", NOW), null);
  assert.equal(verifySessionToken(undefined, NOW), null);
});

test("token signed with a different secret is rejected", () => {
  const t = createSessionToken("res-1", "fixtures", NOW);
  process.env.AUTH_SECRET = "another-secret-another-secret-another-99";
  assert.equal(verifySessionToken(t, NOW), null);
});

test("missing or short secret disables sessions", () => {
  process.env.AUTH_SECRET = "short";
  assert.throws(() => createSessionToken("res-1", "fixtures", NOW));
  assert.equal(verifySessionToken("a.b", NOW), null);
});
