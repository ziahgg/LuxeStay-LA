import type { DataSource, Neighborhood, Property } from "./types";

/**
 * Contract every property data source must implement.
 *
 * Adapters are server-only. They fetch from their source, map records into the
 * internal `Property` model, and throw on failure — the service layer turns
 * failures into user-friendly states. Keep vendor-specific logic (auth, field
 * mapping, pagination) inside the adapter.
 */
export interface PropertyDataAdapter {
  readonly source: DataSource;
  /**
   * Cheap, synchronous check that required configuration (credentials, base
   * URLs) is present. Checked outside the cache, because errors thrown inside
   * "use cache" functions are redacted in production builds.
   */
  isConfigured(): boolean;
  listProperties(): Promise<Property[]>;
  getPropertyBySlug(slug: string): Promise<Property | null>;
  listNeighborhoods(): Promise<Neighborhood[]>;
}

/** Thrown when a data source is selected but cannot be used yet. */
export class IntegrationNotConfiguredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IntegrationNotConfiguredError";
  }
}

/** Thrown when the upstream system errors or times out. */
export class IntegrationUnavailableError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "IntegrationUnavailableError";
  }
}
