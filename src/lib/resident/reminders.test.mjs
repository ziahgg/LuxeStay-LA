import assert from "node:assert/strict";
import { test } from "node:test";
import { buildReminders } from "./reminders.ts";

const NOW = Date.parse("2026-10-12T12:00:00Z");
const residence = (o = {}) => ({ propertyName: "P", unit: "1", amenities: [], ...o });

test("lease ending within 90 days produces a reminder", () => {
  const r = buildReminders(residence({ leaseEndDate: "2026-12-31" }), [], NOW);
  assert.equal(r.length, 1);
  assert.match(r[0].text, /Dec 31, 2026 \(80 days\)/);
});

test("lease ending later, or already ended, produces nothing", () => {
  assert.equal(buildReminders(residence({ leaseEndDate: "2027-06-01" }), [], NOW).length, 0);
  assert.equal(buildReminders(residence({ leaseEndDate: "2026-01-01" }), [], NOW).length, 0);
});

test("future move-in and requests awaiting the resident produce reminders", () => {
  const r = buildReminders(
    residence({ moveInDate: "2026-11-01" }),
    [
      { id: "a", title: "Leak", status: "awaiting-resident" },
      { id: "b", title: "Light", status: "scheduled" },
    ],
    NOW,
  );
  assert.equal(r.length, 2);
  assert.equal(r[1].href, "/dashboard/maintenance/a");
});

test("no data means no invented reminders", () => {
  assert.deepEqual(buildReminders(null, [], NOW), []);
});
