import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/properties/types";
import { formatBathrooms, formatBedrooms, formatPrice } from "@/lib/format";
import { SampleTag } from "@/components/ui/layout";
import { AvailabilityBadge } from "./availability-badge";

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
  sizes?: string;
  headingLevel?: "h2" | "h3";
}

export function PropertyCard({
  property: p,
  priority = false,
  sizes = "(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw",
  headingLevel: Heading = "h3",
}: PropertyCardProps) {
  const cover = p.images[0];
  const href = `/residences/${p.slug}`;

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-stone">
        {cover && (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes={sizes}
            quality={70}
            preload={priority}
            className="object-cover transition-transform duration-[1.2s] ease-out-soft group-hover:scale-[1.04] motion-reduce:transform-none"
          />
        )}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <AvailabilityBadge availability={p.availability} />
        </div>
        {p.source === "sample" && <SampleTag className="absolute top-4 right-4" />}
      </div>

      <div className="flex flex-1 flex-col pt-6">
        <p className="eyebrow text-olive-ink">{p.neighborhood.name}</p>
        <Heading className="mt-3 font-serif text-[1.875rem] leading-tight text-charcoal">
          {/* Stretched link: the whole card is clickable, but only one tab stop. */}
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {p.name}
          </Link>
        </Heading>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{p.tagline}</p>

        <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-1 border-t border-line pt-4 text-sm text-charcoal">
          <div>
            <dt className="sr-only">Bedrooms</dt>
            <dd>{formatBedrooms(p.bedrooms)}</dd>
          </div>
          <div>
            <dt className="sr-only">Bathrooms</dt>
            <dd>{formatBathrooms(p.bathrooms)}</dd>
          </div>
          <div>
            <dt className="sr-only">Type</dt>
            <dd>{p.propertyType}</dd>
          </div>
        </dl>

        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <p className="text-sm text-muted">
            {p.pricing ? (
              <>
                From <span className="font-serif text-2xl text-charcoal">{formatPrice(p.pricing.monthlyFrom)}</span>
                <span className="text-muted"> / month</span>
              </>
            ) : (
              <span>Pricing on request</span>
            )}
          </p>
          <span
            aria-hidden="true"
            className="eyebrow inline-flex items-center gap-2 text-charcoal transition-colors group-hover:text-olive-ink"
          >
            View Residence
            <svg width="16" height="10" viewBox="0 0 18 10" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
              <path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </span>
        </div>
      </div>
      {/* Visible focus ring for the stretched link. */}
      <span aria-hidden="true" className="pointer-events-none absolute -inset-2 hidden outline-2 outline-offset-0 outline-charcoal group-has-[a:focus-visible]:block" />
    </article>
  );
}
