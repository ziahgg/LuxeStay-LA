import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DataUnavailable } from "@/components/residences/data-unavailable";
import { Gallery } from "@/components/residences/gallery";
import { InquiryPanel, MobileInquiryBar } from "@/components/residences/inquiry-panel";
import { PropertyCard } from "@/components/residences/property-card";
import { Container, Eyebrow, PlaceholderNote, SampleTag } from "@/components/ui/layout";
import { formatBathrooms, formatBedrooms } from "@/lib/format";
import { getProperty, getPropertySlugs, getRelatedProperties, UNAVAILABLE_SLUG } from "@/lib/properties/service";
import type { Property } from "@/lib/properties/types";
import { site } from "@/lib/site";

export async function generateStaticParams() {
  const slugs = await getPropertySlugs();
  return (slugs.length > 0 ? slugs : [UNAVAILABLE_SLUG]).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/residences/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProperty(slug);
  if (!result.ok || !result.data) return { title: "Residence", robots: { index: false } };
  const p = result.data;
  const cover = p.images[0];
  return {
    title: `${p.name}, ${p.neighborhood.name}`,
    description: `${p.tagline} ${formatBedrooms(p.bedrooms)}, ${formatBathrooms(p.bathrooms).toLowerCase()} furnished ${p.propertyType.toLowerCase()} in ${p.neighborhood.name}, Los Angeles.`,
    alternates: { canonical: `/residences/${p.slug}` },
    // Sample listings must not be indexed as if they were real inventory.
    robots: p.source === "sample" ? { index: false, follow: true } : undefined,
    openGraph: cover
      ? { images: [{ url: `${cover.src}?w=1200&h=630&fit=crop&q=80`, width: 1200, height: 630, alt: cover.alt }] }
      : undefined,
  };
}

export default function ResidencePage(props: PageProps<"/residences/[slug]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <ResidenceDetail params={props.params} />
    </Suspense>
  );
}

async function ResidenceDetail({ params }: Pick<PageProps<"/residences/[slug]">, "params">) {
  const { slug } = await params;
  const result = await getProperty(slug);

  if (!result.ok) {
    return (
      <Container className="pt-36 pb-28 lg:pt-48">
        <DataUnavailable message={result.message} />
      </Container>
    );
  }
  if (!result.data) notFound();

  const p = result.data;
  const related = await getRelatedProperties(p);

  return (
    <article className="pb-24 lg:pb-0">
      <StructuredData property={p} />

      <Container className="pt-28 lg:pt-36">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/residences" className="hover:text-charcoal hover:underline underline-offset-4">
                Residences
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/residences?neighborhood=${p.neighborhood.slug}`}
                className="hover:text-charcoal hover:underline underline-offset-4"
              >
                {p.neighborhood.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-charcoal">
              {p.name}
            </li>
          </ol>
        </nav>

        <header className="mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <Eyebrow>{p.neighborhood.name}, Los Angeles</Eyebrow>
              {p.source === "sample" && <SampleTag />}
            </div>
            <h1 className="font-serif text-display font-normal">{p.name}</h1>
          </div>
          <p className="text-lg leading-relaxed text-muted lg:col-span-4">{p.tagline}</p>
        </header>
      </Container>

      <Container className="px-0! sm:px-8! lg:px-12!">
        <Gallery images={p.images} name={p.name} />
      </Container>

      <Container className="py-16 lg:py-24">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 space-y-16 lg:col-span-7 lg:space-y-20">
            <section aria-labelledby="overview">
              <h2 id="overview" className="eyebrow mb-6 text-olive-ink">
                Overview
              </h2>
              <div className="font-serif text-[1.625rem] leading-snug text-charcoal sm:text-3xl">
                {p.description[0]}
              </div>
              {p.description.slice(1).map((para) => (
                <p key={para} className="prose-editorial mt-6">
                  {para}
                </p>
              ))}

              <dl className="mt-10 grid grid-cols-2 border-t border-line sm:grid-cols-4">
                {[
                  ["Bedrooms", p.bedrooms === 0 ? "Studio" : String(p.bedrooms)],
                  ["Bathrooms", String(p.bathrooms)],
                  ["Type", p.propertyType],
                  ["Interior", p.squareFeet ? `${p.squareFeet.toLocaleString("en-US")} sq ft` : "—"],
                ].map(([k, v]) => (
                  <div key={k} className="border-b border-line py-5 pr-4">
                    <dt className="eyebrow text-muted">{k}</dt>
                    <dd className="mt-2 font-serif text-2xl">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {p.highlights.length > 0 && (
              <section aria-labelledby="highlights">
                <h2 id="highlights" className="font-serif text-title">
                  Highlights
                </h2>
                <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-4 border-b border-line py-4">
                      <span aria-hidden="true" className="h-px w-5 bg-olive" />
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section aria-labelledby="furnishing">
              <h2 id="furnishing" className="font-serif text-title">
                Furnishings &amp; amenities
              </h2>
              <div className="mt-8 grid gap-10 sm:grid-cols-2">
                {p.furnishings.length > 0 && (
                  <div>
                    <h3 className="eyebrow text-olive-ink">Furnished with</h3>
                    <ul className="mt-4 space-y-2.5 text-[0.9375rem] text-muted">
                      {p.furnishings.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {p.amenities.map((group) => (
                  <div key={group.label}>
                    <h3 className="eyebrow text-olive-ink">{group.label}</h3>
                    <ul className="mt-4 space-y-2.5 text-[0.9375rem] text-muted">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {p.floorPlans.length > 0 && (
              <section aria-labelledby="floorplans">
                <h2 id="floorplans" className="font-serif text-title">
                  Floor plan
                </h2>
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[28rem] text-left text-sm">
                    <caption className="sr-only">Floor plans for {p.name}</caption>
                    <thead>
                      <tr className="border-b border-charcoal">
                        <th scope="col" className="eyebrow py-3 pr-4 font-semibold">Plan</th>
                        <th scope="col" className="eyebrow py-3 pr-4 font-semibold">Bedrooms</th>
                        <th scope="col" className="eyebrow py-3 pr-4 font-semibold">Baths</th>
                        <th scope="col" className="eyebrow py-3 font-semibold">Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.floorPlans.map((fp) => (
                        <tr key={fp.name} className="border-b border-line">
                          <th scope="row" className="py-4 pr-4 font-medium">{fp.name}</th>
                          <td className="py-4 pr-4">{fp.bedrooms === 0 ? "Studio" : fp.bedrooms}</td>
                          <td className="py-4 pr-4">{fp.bathrooms}</td>
                          <td className="py-4">{fp.squareFeet ? `${fp.squareFeet.toLocaleString("en-US")} sq ft` : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-sm text-muted">Floor plan drawings available on request.</p>
              </section>
            )}

            <section aria-labelledby="neighborhood" className="bg-stone-soft p-8 sm:p-10">
              <Eyebrow>The neighborhood</Eyebrow>
              <h2 id="neighborhood" className="mt-4 font-serif text-title">
                {p.neighborhood.name}
              </h2>
              <p className="prose-editorial mt-4">{p.neighborhood.summary}</p>
              {p.nearby.length > 0 && (
                <>
                  <h3 className="eyebrow mt-8 text-olive-ink">Nearby</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {p.nearby.map((n) => (
                      <li key={n} className="border border-line bg-paper px-3 py-1.5 text-sm">
                        {n}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <p className="mt-6 text-xs text-muted">
                Exact address is shared during the leasing process.
              </p>
            </section>

            <section aria-labelledby="leasing">
              <h2 id="leasing" className="font-serif text-title">
                Leasing &amp; policies
              </h2>
              {p.leasing.requirements && p.leasing.requirements.length > 0 && (
                <ul className="mt-6 space-y-3 text-[0.9375rem] text-muted">
                  {p.leasing.requirements.map((r) => (
                    <li key={r} className="flex gap-4">
                      <span aria-hidden="true" className="mt-3 h-px w-4 shrink-0 bg-olive" />
                      {r}
                    </li>
                  ))}
                </ul>
              )}
              <PlaceholderNote className="mt-6">
                Leasing requirements, deposits, cancellation and extension terms are placeholders pending official
                policy from LuxeStay LA. Final terms are confirmed in your lease. See the{" "}
                <Link href="/faq" className="underline underline-offset-4">
                  FAQ
                </Link>{" "}
                for general guidance.
              </PlaceholderNote>
            </section>
          </div>

          {/* One panel: sticky beside the content on desktop, inline after it on mobile. */}
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              <InquiryPanel property={p} />
            </div>
          </div>
        </div>
      </Container>

      {related.ok && related.data.length > 0 && (
        <section aria-labelledby="related" className="border-t border-line bg-stone-soft py-20 lg:py-28">
          <Container>
            <div className="mb-12 flex items-end justify-between gap-6">
              <h2 id="related" className="font-serif text-headline">
                You may also like
              </h2>
              <Link
                href="/residences"
                className="eyebrow hidden shrink-0 underline-offset-[6px] hover:underline sm:inline"
              >
                All residences
              </Link>
            </div>
            <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.data.map((r) => (
                <li key={r.id}>
                  <PropertyCard property={r} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <MobileInquiryBar property={p} />
    </article>
  );
}

/**
 * JSON-LD is emitted only for live records — publishing structured data for
 * sample listings would misrepresent them to search engines.
 */
function StructuredData({ property: p }: { property: Property }) {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Residences", item: `${site.url}/residences` },
      { "@type": "ListItem", position: 2, name: p.name, item: `${site.url}/residences/${p.slug}` },
    ],
  };
  const listing =
    p.source === "sample"
      ? null
      : {
          "@context": "https://schema.org",
          "@type": "Apartment",
          name: p.name,
          description: p.description.join(" "),
          url: `${site.url}/residences/${p.slug}`,
          numberOfBedrooms: p.bedrooms,
          numberOfBathroomsTotal: p.bathrooms,
          ...(p.squareFeet && {
            floorSize: { "@type": "QuantitativeValue", value: p.squareFeet, unitCode: "FTK" },
          }),
          address: {
            "@type": "PostalAddress",
            addressLocality: p.neighborhood.name,
            addressRegion: "CA",
            addressCountry: "US",
          },
          image: p.images.map((i) => i.src),
        };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }}
      />
      {listing && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(listing).replace(/</g, "\\u003c") }}
        />
      )}
    </>
  );
}

function DetailSkeleton() {
  return (
    <Container className="pt-28 lg:pt-36">
      <div aria-hidden="true" className="h-4 w-48 animate-pulse bg-stone" />
      <div className="mt-10 h-16 w-2/3 animate-pulse bg-stone" />
      <div className="mt-10 aspect-[16/9] w-full animate-pulse bg-stone md:aspect-auto md:h-[min(72vh,44rem)]" />
    </Container>
  );
}
