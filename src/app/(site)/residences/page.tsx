import type { Metadata } from "next";
import { Suspense } from "react";
import { PropertyCard } from "@/components/residences/property-card";
import { DataUnavailable } from "@/components/residences/data-unavailable";
import { Pagination } from "@/components/residences/pagination";
import { ResidenceExplorer } from "@/components/residences/residence-explorer";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";
import { PageIntro } from "@/components/ui/page-intro";
import { formatDate } from "@/lib/format";
import { hasActiveFilters, parsePropertyQuery } from "@/lib/properties/query";
import { getDataSource, getNeighborhoods, searchProperties } from "@/lib/properties/service";
import type { PropertyQuery } from "@/lib/properties/types";

export const metadata: Metadata = {
  title: "Furnished Residences in Los Angeles",
  description:
    "Browse furnished apartments, lofts and townhomes for temporary stays across Los Angeles. Filter by neighborhood, bedrooms, availability and budget.",
  alternates: { canonical: "/residences" },
};

export default function ResidencesPage(props: PageProps<"/residences">) {
  return (
    <>
      <PageIntro eyebrow="Residences" title="Find your place in Los Angeles.">
        <p>
          Furnished homes across the city&rsquo;s most livable neighborhoods — ready for a month, a season or the
          length of a project.
        </p>
      </PageIntro>
      <Container className="pb-28 lg:pb-36">
        <Suspense fallback={<ResultsSkeleton />}>
          <Results searchParams={props.searchParams} />
        </Suspense>
      </Container>
    </>
  );
}

async function Results({ searchParams }: Pick<PageProps<"/residences">, "searchParams">) {
  const raw = await searchParams;
  const query = parsePropertyQuery(raw);
  const [result, neighborhoodsResult] = await Promise.all([searchProperties(query), getNeighborhoods()]);

  if (!result.ok) return <DataUnavailable message={result.message} />;

  const neighborhoods = neighborhoodsResult.ok ? neighborhoodsResult.data : [];
  const { items, total, page, pageCount } = result.data;
  const activeCount = countActive(query);
  const neighborhoodName = neighborhoods.find((n) => n.slug === query.neighborhood)?.name;

  return (
    <ResidenceExplorer neighborhoods={neighborhoods} query={query} activeCount={activeCount}>
      <div className="flex flex-col gap-2 py-8 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="text-sm text-muted" aria-live="polite">
          <span className="font-serif text-2xl text-charcoal">{total}</span>{" "}
          {total === 1 ? "residence" : "residences"}
          {neighborhoodName ? ` in ${neighborhoodName}` : ""}
          {query.moveIn ? ` available by ${formatDate(query.moveIn)}` : ""}
        </p>
        {getDataSource() === "sample" && (
          <p className="text-xs text-taupe-ink">Showing sample listings — not live availability or pricing.</p>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState filtered={hasActiveFilters(query)} />
      ) : (
        <>
          <ul className="grid gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((p, i) => (
              <li key={p.id}>
                <PropertyCard property={p} headingLevel="h2" priority={i < 2} />
              </li>
            ))}
          </ul>
          <Pagination page={page} pageCount={pageCount} params={serialize(query)} />
        </>
      )}
    </ResidenceExplorer>
  );
}

function countActive(q: PropertyQuery) {
  return [q.neighborhood, q.bedrooms, q.bathrooms, q.moveIn, q.minPrice, q.maxPrice].filter(
    (v) => v !== undefined && v !== "",
  ).length;
}

function serialize(q: PropertyQuery): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(q)) {
    if (k === "page" || v === undefined || v === "" || (k === "sort" && v === "featured")) continue;
    out[k] = String(v);
  }
  return out;
}

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div role="status" className="border border-line bg-paper px-6 py-16 text-center sm:py-20">
      <h2 className="font-serif text-title text-charcoal">
        {filtered ? "No residences match these filters." : "No residences are listed right now."}
      </h2>
      <p className="mx-auto mt-4 max-w-md text-[0.9375rem] leading-relaxed text-muted">
        {filtered
          ? "Try widening your dates, budget or neighborhood — or tell us what you need and we'll look for you."
          : "New residences are added regularly. Tell us your dates and we'll let you know what becomes available."}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {filtered && (
          <ButtonLink href="/residences" variant="secondary">
            Clear filters
          </ButtonLink>
        )}
        <ButtonLink href="/contact?type=availability" arrow>
          Ask our team
        </ButtonLink>
      </div>
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading residences">
      <div className="h-[5.5rem] border-y border-line" />
      <div className="py-8">
        <div className="h-8 w-48 animate-pulse bg-stone" />
      </div>
      <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i}>
            <div className="aspect-[4/5] animate-pulse bg-stone" />
            <div className="mt-6 h-3 w-24 animate-pulse bg-stone" />
            <div className="mt-4 h-7 w-2/3 animate-pulse bg-stone" />
            <div className="mt-3 h-4 w-full animate-pulse bg-stone-soft" />
          </div>
        ))}
      </div>
    </div>
  );
}
