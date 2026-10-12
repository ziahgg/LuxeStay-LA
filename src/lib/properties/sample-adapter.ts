import "server-only";
import type { PropertyDataAdapter } from "./adapter";
import { neighborhoods, sampleProperties } from "./sample-data";

/**
 * Development adapter backed by clearly-labelled sample data.
 * Selected when PROPERTY_DATA_SOURCE is unset or "sample".
 */
export const sampleAdapter: PropertyDataAdapter = {
  source: "sample",

  isConfigured() {
    return true;
  },

  async listProperties() {
    return sampleProperties;
  },

  async getPropertyBySlug(slug) {
    return sampleProperties.find((p) => p.slug === slug) ?? null;
  },

  async listNeighborhoods() {
    const used = new Set(sampleProperties.map((p) => p.neighborhood.slug));
    return neighborhoods.filter((n) => used.has(n.slug));
  },
};
