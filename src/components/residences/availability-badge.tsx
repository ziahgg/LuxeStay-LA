import type { Availability } from "@/lib/properties/types";
import { availabilityLabel } from "@/lib/format";

const tones = {
  open: "bg-olive-ink",
  soon: "bg-taupe-ink",
  closed: "bg-charcoal/40",
  unknown: "bg-charcoal/25",
} as const;

export function AvailabilityBadge({ availability, className = "" }: { availability: Availability; className?: string }) {
  const { label, tone } = availabilityLabel(availability);
  return (
    <span
      className={`inline-flex items-center gap-2 bg-paper/95 px-2.5 py-1.5 text-[0.6875rem] font-semibold tracking-[0.06em] text-charcoal ${className}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${tones[tone]}`} />
      {label}
    </span>
  );
}
