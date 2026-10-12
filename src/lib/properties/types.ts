/**
 * Internal property model.
 *
 * This is the website's own representation of a residence. Every data source
 * (sample data today, Yardi / RentCafe once verified) is mapped into this shape
 * by an adapter, so pages and components never depend on a vendor's schema.
 *
 * Optional fields are genuinely optional: the UI must render gracefully when a
 * source does not provide pricing, availability, floor plans or policies.
 */

export type DataSource = "sample" | "rentcafe";

export interface PropertyImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export type PropertyType = "Apartment" | "Loft" | "Townhome" | "Studio";

export type AvailabilityStatus = "available" | "upcoming" | "waitlist" | "unknown";

export interface Availability {
  status: AvailabilityStatus;
  /** ISO date (YYYY-MM-DD) the residence can be occupied from, when known. */
  availableFrom?: string;
  /** Minimum stay in nights, when provided by the source. */
  minimumStayNights?: number;
}

export interface Pricing {
  /** Lowest monthly rate in whole USD. */
  monthlyFrom: number;
  currency: "USD";
  /** Free-text qualifier from the source, e.g. "Varies by length of stay". */
  note?: string;
}

export interface FloorPlan {
  name: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
}

export interface AmenityGroup {
  label: string;
  items: string[];
}

export interface LeasingInfo {
  /**
   * Official leasing / application URL (e.g. a RentCafe property page).
   * When absent the site routes guests to the inquiry form instead.
   */
  applyUrl?: string;
  /** Leasing requirements or policy notes, when provided by the source. */
  requirements?: string[];
}

export interface Neighborhood {
  slug: string;
  name: string;
  summary: string;
}

export interface Property {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  neighborhood: Neighborhood;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  maxGuests?: number;
  squareFeet?: number;
  description: string[];
  highlights: string[];
  amenities: AmenityGroup[];
  furnishings: string[];
  floorPlans: FloorPlan[];
  images: PropertyImage[];
  pricing?: Pricing;
  availability: Availability;
  leasing: LeasingInfo;
  nearby: string[];
  featured: boolean;
  /** Where this record came from. Sample records must never be shown as live. */
  source: DataSource;
}

export type SortOption = "featured" | "price-asc" | "price-desc" | "availability";

export interface PropertyQuery {
  neighborhood?: string;
  bedrooms?: number;
  bathrooms?: number;
  /** ISO date — only include residences available on or before this date. */
  moveIn?: string;
  /** ISO date — informational; passed through to the leasing handoff. */
  moveOut?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface PropertyPage {
  items: Property[];
  total: number;
  page: number;
  pageCount: number;
}

/**
 * Result wrapper used at the page boundary so an outage in the property
 * management system degrades to a helpful message instead of a crash.
 */
export type DataResult<T> =
  | { ok: true; data: T; source: DataSource }
  | { ok: false; reason: "unavailable" | "not-configured"; message: string };
