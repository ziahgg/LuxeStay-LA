"use client";

import { useRouter } from "next/navigation";
import { useId, useRef, useState, useTransition, type ReactNode } from "react";
import type { Neighborhood, PropertyQuery } from "@/lib/properties/types";
import { SORT_OPTIONS } from "@/lib/properties/query";
import { Button } from "@/components/ui/button";

interface Props {
  neighborhoods: Neighborhood[];
  query: PropertyQuery;
  activeCount: number;
  children: ReactNode;
}

const PRICE_STEPS = [3000, 4000, 5000, 6000, 8000, 10000, 12000, 15000];

/**
 * Filter bar + results wrapper for /residences.
 *
 * The filters are a GET form (works without JS). With JS, changes update the
 * URL immediately inside a transition and the results dim while the server
 * renders the new page — URLs stay shareable and indexable.
 */
export function ResidenceExplorer({ neighborhoods, query, activeCount, children }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [panelOpen, setPanelOpen] = useState(false);
  const id = useId();

  const navigate = (form: HTMLFormElement) => {
    const params = new URLSearchParams();
    for (const el of Array.from(form.elements)) {
      if (!(el instanceof HTMLInputElement || el instanceof HTMLSelectElement) || !el.name || !el.value) continue;
      // Skip duplicate controls hidden at this breakpoint (e.g. mobile vs desktop sort).
      if (el.type !== "hidden" && el.offsetParent === null) continue;
      if (el.name === "sort" && el.value === "featured") continue;
      params.set(el.name, el.value);
    }
    const qs = params.toString();
    startTransition(() => router.push(qs ? `/residences?${qs}` : "/residences", { scroll: false }));
  };

  // Uncontrolled fields keyed by the URL so they reset correctly on navigation.
  const formKey = JSON.stringify(query);

  return (
    <div>
      <form
        key={formKey}
        ref={formRef}
        action="/residences"
        method="get"
        aria-label="Filter residences"
        onChange={(e) => navigate(e.currentTarget)}
        onSubmit={(e) => {
          e.preventDefault();
          navigate(e.currentTarget);
        }}
        className="border-y border-line py-5"
      >
        <div className="flex items-center justify-between gap-4 lg:hidden">
          <button
            type="button"
            aria-expanded={panelOpen}
            aria-controls={`${id}-panel`}
            onClick={() => setPanelOpen((v) => !v)}
            className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em]"
          >
            <svg aria-hidden="true" width="18" height="14" viewBox="0 0 18 14" fill="none">
              <path d="M0 3h18M0 11h18" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="6" cy="3" r="2.2" fill="var(--color-ivory)" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="12" cy="11" r="2.2" fill="var(--color-ivory)" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            Filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>
          <SortSelect id={`${id}-sort-m`} value={query.sort} className="w-auto max-w-[13rem]" />
        </div>

        <div
          id={`${id}-panel`}
          className={`${panelOpen ? "grid" : "hidden"} mt-5 gap-4 sm:grid-cols-2 lg:mt-0 lg:grid lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr_0.8fr_0.8fr_1fr] lg:items-end`}
        >
          <Field label="Neighborhood" htmlFor={`${id}-n`}>
            <select id={`${id}-n`} name="neighborhood" defaultValue={query.neighborhood ?? ""} className="field">
              <option value="">All neighborhoods</option>
              {neighborhoods.map((n) => (
                <option key={n.slug} value={n.slug}>
                  {n.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Bedrooms" htmlFor={`${id}-bd`}>
            <select id={`${id}-bd`} name="bedrooms" defaultValue={query.bedrooms?.toString() ?? ""} className="field">
              <option value="">Any</option>
              <option value="0">Studio</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
            </select>
          </Field>
          <Field label="Bathrooms" htmlFor={`${id}-ba`}>
            <select id={`${id}-ba`} name="bathrooms" defaultValue={query.bathrooms?.toString() ?? ""} className="field">
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
            </select>
          </Field>
          <Field label="Available by" htmlFor={`${id}-in`}>
            <input id={`${id}-in`} type="date" name="moveIn" defaultValue={query.moveIn ?? ""} className="field" />
          </Field>
          <Field label="Min / month" htmlFor={`${id}-min`}>
            <select id={`${id}-min`} name="minPrice" defaultValue={query.minPrice?.toString() ?? ""} className="field">
              <option value="">No min</option>
              {PRICE_STEPS.map((v) => (
                <option key={v} value={v}>
                  ${v.toLocaleString("en-US")}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Max / month" htmlFor={`${id}-max`}>
            <select id={`${id}-max`} name="maxPrice" defaultValue={query.maxPrice?.toString() ?? ""} className="field">
              <option value="">No max</option>
              {PRICE_STEPS.map((v) => (
                <option key={v} value={v}>
                  ${v.toLocaleString("en-US")}
                </option>
              ))}
            </select>
          </Field>
          <div className="hidden lg:block">
            <SortSelect id={`${id}-sort`} value={query.sort} label />
          </div>
          {query.moveOut && <input type="hidden" name="moveOut" value={query.moveOut} />}
          <div className="flex flex-wrap items-center gap-4 sm:col-span-2 lg:col-span-full">
            {/* Only needed without JavaScript; with JS, filters apply on change. */}
            <noscript>
              <Button type="submit">Apply filters</Button>
            </noscript>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={() => startTransition(() => router.push("/residences", { scroll: false }))}
                className="min-h-11 text-sm font-medium underline underline-offset-4 hover:text-olive-ink"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </form>

      <div
        aria-busy={isPending}
        className={`transition-opacity duration-300 ${isPending ? "pointer-events-none opacity-45" : ""}`}
      >
        <p role="status" className="sr-only">
          {isPending ? "Updating results…" : ""}
        </p>
        {children}
      </div>
    </div>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="field-label">
        {label}
      </label>
      {children}
    </div>
  );
}

function SortSelect({
  id,
  value,
  label = false,
  className = "",
}: {
  id: string;
  value: PropertyQuery["sort"];
  label?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={label ? "field-label" : "sr-only"}>
        Sort by
      </label>
      <select id={id} name="sort" defaultValue={value ?? "featured"} className="field">
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
