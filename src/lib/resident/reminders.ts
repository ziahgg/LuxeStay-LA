import { daysUntil, formatDay } from "./format.ts";
import type { MaintenanceRequest, Residence } from "./types";

export interface Reminder {
  text: string;
  href: string;
  cta: string;
}

/**
 * Derives reminders strictly from data the source provided — nothing is
 * invented. Pure: pass `now` explicitly (request time) so it's testable.
 */
export function buildReminders(
  residence: Residence | null,
  requests: MaintenanceRequest[],
  now: number = Date.now(),
): Reminder[] {
  const reminders: Reminder[] = [];

  if (residence?.leaseEndDate) {
    const days = daysUntil(residence.leaseEndDate, now);
    if (days >= 0 && days <= 90) {
      reminders.push({
        text: `Your lease ends on ${formatDay(residence.leaseEndDate)} (${days} ${days === 1 ? "day" : "days"}). Let us know if you'd like to discuss an extension.`,
        href: "/dashboard/support",
        cta: "Contact the team",
      });
    }
  }

  if (residence?.moveInDate && daysUntil(residence.moveInDate, now) > 0) {
    reminders.push({
      text: `Your move-in is on ${formatDay(residence.moveInDate)}. Review the move-in instructions before you arrive.`,
      href: "/dashboard/guide#move-in",
      cta: "Read move-in guide",
    });
  }

  for (const r of requests.filter((x) => x.status === "awaiting-resident")) {
    reminders.push({ text: `Your request "${r.title}" needs a reply.`, href: `/dashboard/maintenance/${r.id}`, cta: "View request" });
  }

  return reminders;
}
