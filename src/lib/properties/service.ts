import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { IntegrationNotConfiguredError, type PropertyDataAdapter } from "./adapter";
import { applyPropertyQuery } from "./query";
import { rentCafeAdapter } from "./rentcafe-adapter";
import { sampleAdapter } from "./sample-adapter";
import type { DataResult, DataSource, Neighborhood, Property, PropertyPage, PropertyQuery } from "./types";

/**
 * Property service — the only module pages should import for property data.
 *
 * - Selects the adapter from PROPERTY_DATA_SOURCE (server-side only).
 * - Caches successful upstream reads ("use cache"); failures are thrown inside
 *   the cached function so they are never cached, then converted to a
 *   `DataResult` here so pages can render a graceful fallback.
 */

export function getDataSource(): DataSource {
  return process.env.PROPERTY_DATA_SOURCE === "rentcafe" ? "rentcafe" : "sample";
}

function getAdapter(): PropertyDataAdapter {
  return getDataSource() === "rentcafe" ? rentCafeAdapter : sampleAdapter;
}

async function cachedListProperties(source: DataSource): Promise<Property[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("properties");
  void source; // part of the cache key
  return getAdapter().listProperties();
}

async function cachedNeighborhoods(source: DataSource): Promise<Neighborhood[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("properties");
  void source;
  return getAdapter().listNeighborhoods();
}

function toFailure(error: unknown): DataResult<never> {
  if (error instanceof IntegrationNotConfiguredError) {
    console.warn(`[properties] ${error.message}`);
    return {
      ok: false,
      reason: "not-configured",
      message: "Residence listings are being connected and will be available shortly.",
    };
  }
  console.error("[properties] Upstream error", error);
  return {
    ok: false,
    reason: "unavailable",
    message: "We couldn't load residences right now. Please try again in a moment.",
  };
}

async function safely<T>(fn: () => Promise<T>): Promise<DataResult<T>> {
  const adapter = getAdapter();
  if (!adapter.isConfigured()) {
    return toFailure(
      new IntegrationNotConfiguredError(
        `Data source "${adapter.source}" is selected but not configured. See docs/INTEGRATION.md.`,
      ),
    );
  }
  try {
    return { ok: true, data: await fn(), source: getDataSource() };
  } catch (error) {
    return toFailure(error);
  }
}

export function searchProperties(query: PropertyQuery): Promise<DataResult<PropertyPage>> {
  return safely(async () => applyPropertyQuery(await cachedListProperties(getDataSource()), query));
}

export function getFeaturedProperties(limit = 4): Promise<DataResult<Property[]>> {
  return safely(async () => {
    const all = await cachedListProperties(getDataSource());
    return all.filter((p) => p.featured).slice(0, limit);
  });
}

export function getProperty(slug: string): Promise<DataResult<Property | null>> {
  return safely(async () => {
    const all = await cachedListProperties(getDataSource());
    return all.find((p) => p.slug === slug) ?? null;
  });
}

export function getRelatedProperties(property: Property, limit = 3): Promise<DataResult<Property[]>> {
  return safely(async () => {
    const all = await cachedListProperties(getDataSource());
    const others = all.filter((p) => p.id !== property.id);
    const sameArea = others.filter((p) => p.neighborhood.slug === property.neighborhood.slug);
    const rest = others.filter((p) => p.neighborhood.slug !== property.neighborhood.slug);
    return [...sameArea, ...rest].slice(0, limit);
  });
}

export function getNeighborhoods(): Promise<DataResult<Neighborhood[]>> {
  return safely(() => cachedNeighborhoods(getDataSource()));
}

/**
 * Reserved slug used when no listings can be fetched at build time. Cache
 * Components requires generateStaticParams to return at least one entry; this
 * one simply renders the "listings unavailable" state and is never linked to.
 */
export const UNAVAILABLE_SLUG = "listings-unavailable";

/** Slugs to prerender at build time. Returns [] if the source is unavailable. */
export async function getPropertySlugs(): Promise<string[]> {
  const result = await safely(() => cachedListProperties(getDataSource()));
  return result.ok ? result.data.map((p) => p.slug) : [];
}
