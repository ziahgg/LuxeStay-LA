import { MAINTENANCE_CATEGORIES, type LeaseStatus, type MaintenanceCategory } from "./types.ts";

const day = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const dayTime = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/Los_Angeles",
  timeZoneName: "short",
});

/** Calendar date (YYYY-MM-DD or full ISO) → "Oct 6, 2026". */
export const formatDay = (iso: string) => day.format(new Date(`${iso.slice(0, 10)}T00:00:00Z`));

/** Timestamp in Los Angeles time → "Oct 6, 2026, 9:20 AM PDT". */
export const formatDayTime = (iso: string) => dayTime.format(new Date(iso));

export const categoryLabel = (c: MaintenanceCategory) => MAINTENANCE_CATEGORIES.find((x) => x.value === c)?.label ?? c;

export const leaseStatusLabel: Record<LeaseStatus, string> = {
  upcoming: "Upcoming",
  active: "Active",
  "ending-soon": "Ending soon",
  "month-to-month": "Month-to-month",
  ended: "Ended",
};

/** Whole days from `now` until a calendar date (negative when past). */
export function daysUntil(isoDate: string, now: number) {
  const target = Date.parse(`${isoDate.slice(0, 10)}T00:00:00Z`);
  return Math.ceil((target - now) / 86_400_000);
}
