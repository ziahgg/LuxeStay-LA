import "server-only";
import { IntegrationNotConfiguredError, type PropertyDataAdapter } from "./adapter";
import type { Property } from "./types";

/**
 * Yardi / RentCafe adapter — NOT YET IMPLEMENTED.
 *
 * The integration method has not been verified: no API documentation,
 * credentials or account permissions were available when this site was built.
 * Rather than guess at endpoints, this adapter refuses to run and reports a
 * clear "not configured" state, which the site handles gracefully (listing
 * pages show a notice and, when RENTCAFE_PORTAL_URL is set, link guests to the
 * official leasing portal).
 *
 * To complete the integration, follow docs/INTEGRATION.md:
 *   1. Confirm with the client / Yardi which product is licensed (e.g. a
 *      RentCafe API token, a Yardi Voyager data feed, or an ILS/XML export).
 *   2. Implement `fetchFromRentCafe` below using the documented endpoints,
 *      reading credentials only from server-side environment variables.
 *   3. Map the response into `Property` in `mapToProperty`, leaving fields
 *      undefined when the source does not supply them (never invent data).
 *   4. Set PROPERTY_DATA_SOURCE=rentcafe.
 */

/** Set to true once the verified integration below has been implemented. */
const IMPLEMENTED = false;

interface RentCafeConfig {
  apiBaseUrl: string;
  apiToken: string;
  companyCode?: string;
  propertyCodes: string[];
}

function readConfig(): RentCafeConfig | null {
  const apiBaseUrl = process.env.RENTCAFE_API_BASE_URL;
  const apiToken = process.env.RENTCAFE_API_TOKEN;
  if (!apiBaseUrl || !apiToken) return null;
  return {
    apiBaseUrl,
    apiToken,
    companyCode: process.env.RENTCAFE_COMPANY_CODE,
    propertyCodes: (process.env.RENTCAFE_PROPERTY_CODES ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

function notImplemented(): never {
  const configured = readConfig() !== null;
  throw new IntegrationNotConfiguredError(
    configured
      ? "RentCafe credentials are present, but the adapter mapping has not been implemented yet. See docs/INTEGRATION.md."
      : "RentCafe is selected as the data source, but the integration has not been configured. See docs/INTEGRATION.md.",
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars -- placeholders documented above */
async function fetchFromRentCafe(_config: RentCafeConfig): Promise<unknown[]> {
  return notImplemented();
}

function mapToProperty(_record: unknown): Property {
  return notImplemented();
}
/* eslint-enable @typescript-eslint/no-unused-vars */

export const rentCafeAdapter: PropertyDataAdapter = {
  source: "rentcafe",

  isConfigured() {
    // Ready only once the integration is implemented and credentials are present.
    return IMPLEMENTED && readConfig() !== null;
  },

  async listProperties() {
    const config = readConfig();
    if (!config) notImplemented();
    const records = await fetchFromRentCafe(config);
    return records.map(mapToProperty);
  },

  async getPropertyBySlug(slug) {
    const all = await this.listProperties();
    return all.find((p) => p.slug === slug) ?? null;
  },

  async listNeighborhoods() {
    const all = await this.listProperties();
    const map = new Map(all.map((p) => [p.neighborhood.slug, p.neighborhood]));
    return [...map.values()];
  },
};
