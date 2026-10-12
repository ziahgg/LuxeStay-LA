import type { Property, PropertyPage, PropertyQuery, SortOption } from "./types";

/**
 * Pure filtering, sorting and pagination over the internal model.
 * Kept free of I/O so it can run on the server against any adapter's output.
 */

export const DEFAULT_PAGE_SIZE = 9;

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "availability", label: "Soonest available" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const STATUS_RANK = { available: 0, upcoming: 1, waitlist: 2, unknown: 3 } as const;

const isIsoDate = (v: string | undefined): v is string =>
  !!v && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

const toInt = (v: string | string[] | undefined) => {
  const s = Array.isArray(v) ? v[0] : v;
  if (!s) return undefined;
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

const toStr = (v: string | string[] | undefined) => {
  const s = Array.isArray(v) ? v[0] : v;
  return s?.trim() || undefined;
};

/** Parse untrusted URL search params into a validated query. */
export function parsePropertyQuery(
  params: Record<string, string | string[] | undefined>,
): PropertyQuery {
  const sortRaw = toStr(params.sort);
  const sort = SORT_OPTIONS.some((o) => o.value === sortRaw) ? (sortRaw as SortOption) : "featured";
  const moveIn = toStr(params.moveIn);
  const moveOut = toStr(params.moveOut);

  return {
    neighborhood: toStr(params.neighborhood),
    bedrooms: toInt(params.bedrooms),
    bathrooms: toInt(params.bathrooms),
    moveIn: isIsoDate(moveIn) ? moveIn : undefined,
    moveOut: isIsoDate(moveOut) ? moveOut : undefined,
    minPrice: toInt(params.minPrice),
    maxPrice: toInt(params.maxPrice),
    sort,
    page: Math.max(1, toInt(params.page) ?? 1),
  };
}

export function hasActiveFilters(q: PropertyQuery) {
  return Boolean(
    q.neighborhood || q.bedrooms !== undefined || q.bathrooms || q.moveIn || q.minPrice || q.maxPrice,
  );
}

export function applyPropertyQuery(all: Property[], q: PropertyQuery): PropertyPage {
  const pricingFilter = q.minPrice !== undefined || q.maxPrice !== undefined;

  const filtered = all.filter((p) => {
    if (q.neighborhood && p.neighborhood.slug !== q.neighborhood) return false;
    // Bedroom filter: 0 = studio exactly; N = at least N bedrooms.
    if (q.bedrooms !== undefined) {
      if (q.bedrooms === 0 ? p.bedrooms !== 0 : p.bedrooms < q.bedrooms) return false;
    }
    if (q.bathrooms && p.bathrooms < q.bathrooms) return false;
    if (q.moveIn) {
      // Only residences with a confirmed date on or before the requested move-in.
      const from = p.availability.availableFrom;
      const open = p.availability.status === "available" || p.availability.status === "upcoming";
      if (!open || !from || from > q.moveIn) return false;
    }
    if (pricingFilter) {
      // Residences without published pricing can't be matched to a price range.
      if (!p.pricing) return false;
      if (q.minPrice !== undefined && p.pricing.monthlyFrom < q.minPrice) return false;
      if (q.maxPrice !== undefined && p.pricing.monthlyFrom > q.maxPrice) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (q.sort) {
      case "price-asc":
        return (a.pricing?.monthlyFrom ?? Infinity) - (b.pricing?.monthlyFrom ?? Infinity);
      case "price-desc":
        return (b.pricing?.monthlyFrom ?? -Infinity) - (a.pricing?.monthlyFrom ?? -Infinity);
      case "availability": {
        const rank = STATUS_RANK[a.availability.status] - STATUS_RANK[b.availability.status];
        if (rank !== 0) return rank;
        return (a.availability.availableFrom ?? "9999").localeCompare(
          b.availability.availableFrom ?? "9999",
        );
      }
      default:
        return Number(b.featured) - Number(a.featured);
    }
  });

  const pageSize = q.pageSize ?? DEFAULT_PAGE_SIZE;
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const page = Math.min(Math.max(1, q.page ?? 1), pageCount);

  return {
    items: sorted.slice((page - 1) * pageSize, page * pageSize),
    total: sorted.length,
    page,
    pageCount,
  };
}
