// Run with `npm test` (Node's built-in test runner; Node 22.18+ strips TS types natively).
import assert from "node:assert/strict";
import { test } from "node:test";
import { applyPropertyQuery, parsePropertyQuery } from "./query.ts";

const make = (id, overrides = {}) => ({
  id,
  slug: id,
  name: id,
  neighborhood: { slug: "venice", name: "Venice" },
  bedrooms: 1,
  bathrooms: 1,
  featured: false,
  availability: { status: "available", availableFrom: "2026-11-01" },
  pricing: { monthlyFrom: 5000, currency: "USD" },
  ...overrides,
});

const items = [
  make("studio", { bedrooms: 0, pricing: { monthlyFrom: 3500, currency: "USD" } }),
  make("one", { featured: true }),
  make("two", { bedrooms: 2, neighborhood: { slug: "silver-lake", name: "Silver Lake" }, pricing: { monthlyFrom: 7000, currency: "USD" } }),
  make("three", { bedrooms: 3, availability: { status: "upcoming", availableFrom: "2027-01-05" }, pricing: { monthlyFrom: 12000, currency: "USD" } }),
  make("unpriced", { pricing: undefined, availability: { status: "unknown" } }),
  make("waitlist", { availability: { status: "waitlist" } }),
];

const slugs = (q) => applyPropertyQuery(items, q).items.map((p) => p.slug);

test("parses and sanitises untrusted search params", () => {
  const q = parsePropertyQuery({ bedrooms: "abc", page: "-2", sort: "drop table", moveIn: "2026-13-45", maxPrice: ["6000", "1"] });
  assert.equal(q.bedrooms, undefined);
  assert.equal(q.page, 1);
  assert.equal(q.sort, "featured");
  assert.equal(q.moveIn, undefined);
  assert.equal(q.maxPrice, 6000);
});

test("bedrooms: 0 means studio only, N means at least N", () => {
  assert.deepEqual(slugs({ bedrooms: 0 }), ["studio"]);
  assert.deepEqual(slugs({ bedrooms: 2 }).sort(), ["three", "two"]);
});

test("price filters exclude residences without published pricing", () => {
  assert.ok(!slugs({ maxPrice: 100000 }).includes("unpriced"));
  assert.deepEqual(slugs({ minPrice: 6000, maxPrice: 8000 }), ["two"]);
});

test("move-in filter only keeps confirmed dates on or before the request", () => {
  assert.deepEqual(slugs({ moveIn: "2026-11-01" }).sort(), ["one", "studio", "two"]);
  assert.ok(slugs({ moveIn: "2027-02-01" }).includes("three"));
});

test("sorting by price puts unpriced residences last", () => {
  const asc = slugs({ sort: "price-asc" });
  assert.equal(asc[0], "studio");
  assert.equal(asc.at(-1), "unpriced");
  assert.equal(slugs({ sort: "price-desc" })[0], "three");
});

test("availability sort ranks available, upcoming, waitlist, unknown", () => {
  const order = slugs({ sort: "availability" });
  assert.ok(order.indexOf("three") > order.indexOf("one"));
  assert.ok(order.indexOf("waitlist") > order.indexOf("three"));
  assert.equal(order.at(-1), "unpriced");
});

test("pagination clamps out-of-range pages", () => {
  const page = applyPropertyQuery(items, { page: 99, pageSize: 4 });
  assert.equal(page.page, 2);
  assert.equal(page.pageCount, 2);
  assert.equal(page.items.length, 2);
  assert.equal(page.total, 6);
});
