import type { Property } from "@/lib/properties/types";
import { formatPrice } from "@/lib/format";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/button";
import { AvailabilityBadge } from "./availability-badge";

function inquiryHref(p: Property, type: "leasing" | "availability") {
  return `/contact?${new URLSearchParams({ type, residence: p.slug }).toString()}`;
}

/** Primary leasing CTA: the official leasing flow when available, otherwise an inquiry. */
function PrimaryCta({ property: p, className = "" }: { property: Property; className?: string }) {
  if (p.leasing.applyUrl) {
    return (
      <ExternalButtonLink href={p.leasing.applyUrl} size="lg" className={className}>
        Apply to Lease
      </ExternalButtonLink>
    );
  }
  const label = p.availability.status === "waitlist" ? "Join the Waitlist" : "Inquire About This Residence";
  return (
    <ButtonLink href={inquiryHref(p, "leasing")} size="lg" className={className}>
      {label}
    </ButtonLink>
  );
}

export function InquiryPanel({ property: p }: { property: Property }) {
  const isSample = p.source === "sample";
  return (
    <aside aria-labelledby="inquiry-heading" className="border border-line bg-paper p-7 lg:p-8">
      <h2 id="inquiry-heading" className="sr-only">
        Pricing and availability
      </h2>
      <AvailabilityBadge availability={p.availability} className="bg-stone-soft!" />
      <p className="mt-6 text-sm text-muted">
        {p.pricing ? (
          <>
            From
            <span className="mx-2 font-serif text-[2.5rem] leading-none text-charcoal">
              {formatPrice(p.pricing.monthlyFrom)}
            </span>
            / month
          </>
        ) : (
          <span className="font-serif text-3xl text-charcoal">Pricing on request</span>
        )}
      </p>
      {p.pricing?.note && <p className="mt-2 text-sm text-muted">{p.pricing.note}</p>}

      <dl className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
        {p.availability.minimumStayNights && (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Minimum stay</dt>
            <dd>{p.availability.minimumStayNights} nights</dd>
          </div>
        )}
        {p.maxGuests && (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Sleeps</dt>
            <dd>Up to {p.maxGuests}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Furnished</dt>
          <dd>Yes</dd>
        </div>
      </dl>

      <div className="mt-7 flex flex-col gap-3">
        <PrimaryCta property={p} className="w-full" />
        <ButtonLink href={inquiryHref(p, "availability")} variant="secondary" className="w-full">
          Ask a Question
        </ButtonLink>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-muted">
        {isSample
          ? "Sample listing for development. Rates and dates shown are illustrative only and are not an offer to lease."
          : "Rates and availability are provided by our property management system and are confirmed at the time of leasing."}
      </p>
    </aside>
  );
}

/** Compact bottom bar for small screens; keeps the CTA reachable without covering content. */
export function MobileInquiryBar({ property: p }: { property: Property }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ivory/95 px-5 py-3 backdrop-blur pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
        <p className="text-xs text-muted">
          {p.pricing ? (
            <>
              From <span className="font-serif text-xl text-charcoal">{formatPrice(p.pricing.monthlyFrom)}</span>/mo
              {p.source === "sample" && <span className="block text-[0.625rem] tracking-[0.12em] uppercase">Sample rate</span>}
            </>
          ) : (
            <span className="font-serif text-lg text-charcoal">Pricing on request</span>
          )}
        </p>
        <ButtonLink
          href={p.leasing.applyUrl ?? inquiryHref(p, "leasing")}
          className="min-h-11! px-5!"
          {...(p.leasing.applyUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {p.leasing.applyUrl ? "Apply" : "Inquire"}
        </ButtonLink>
      </div>
    </div>
  );
}
