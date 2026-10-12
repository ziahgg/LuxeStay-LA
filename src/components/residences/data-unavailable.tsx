import Link from "next/link";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/button";
import { site } from "@/lib/site";

/**
 * Shown when the property management system is unreachable or not yet
 * connected. Keeps the site useful: offers the official leasing portal (when
 * configured) and the inquiry form.
 */
export function DataUnavailable({ message, compact = false }: { message: string; compact?: boolean }) {
  return (
    <div
      role="status"
      className={`border border-line bg-paper text-center ${compact ? "px-6 py-10" : "px-6 py-16 sm:px-12 sm:py-20"}`}
    >
      <p className="eyebrow text-taupe-ink">Residences</p>
      <h2 className="mx-auto mt-4 max-w-xl font-serif text-title text-charcoal">{message}</h2>
      <p className="mx-auto mt-4 max-w-md text-[0.9375rem] leading-relaxed text-muted">
        Our team can still help you find a residence that suits your dates — send an inquiry and we&rsquo;ll be in
        touch.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/contact?type=availability" arrow>
          Send an Inquiry
        </ButtonLink>
        {site.leasingPortalUrl && (
          <ExternalButtonLink href={site.leasingPortalUrl} variant="secondary">
            Official Leasing Portal
          </ExternalButtonLink>
        )}
      </div>
      {!compact && (
        <p className="mt-6 text-xs text-muted">
          Or <Link href="/residences" className="underline underline-offset-4">try again</Link>.
        </p>
      )}
    </div>
  );
}
