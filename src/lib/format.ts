import type { Availability, Property } from "@/lib/properties/types";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

// Dates are stored as calendar days; format in UTC so server and client agree.
const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export const formatPrice = (usd: number) => currency.format(usd);

export const formatDate = (iso: string) => dateFmt.format(new Date(`${iso}T00:00:00Z`));

export function formatBedrooms(n: number) {
  if (n === 0) return "Studio";
  return `${n} Bedroom${n === 1 ? "" : "s"}`;
}

export function formatBathrooms(n: number) {
  return `${n} Bath${n === 1 ? "" : "s"}`;
}

export function formatLayout(p: Pick<Property, "bedrooms" | "bathrooms">) {
  return `${formatBedrooms(p.bedrooms)} · ${formatBathrooms(p.bathrooms)}`;
}

export function availabilityLabel(a: Availability): { label: string; tone: "open" | "soon" | "closed" | "unknown" } {
  switch (a.status) {
    case "available":
      return {
        label: a.availableFrom ? `Available ${formatDate(a.availableFrom)}` : "Available",
        tone: "open",
      };
    case "upcoming":
      return {
        label: a.availableFrom ? `Opens ${formatDate(a.availableFrom)}` : "Opening soon",
        tone: "soon",
      };
    case "waitlist":
      return { label: "Join the waitlist", tone: "closed" };
    default:
      return { label: "Availability on request", tone: "unknown" };
  }
}
