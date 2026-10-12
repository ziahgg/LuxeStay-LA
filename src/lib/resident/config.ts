import type { ResidentDataSource } from "./types";

/**
 * Development fixtures are never available in production unless explicitly
 * allowed (e.g. a password-protected staging deployment for client review).
 */
export function fixturesAllowed() {
  return process.env.NODE_ENV !== "production" || process.env.ALLOW_RESIDENT_FIXTURES_IN_PRODUCTION === "true";
}

/** Selected resident data source, or null when none is usable. */
export function getResidentDataSource(): ResidentDataSource | null {
  const value = process.env.RESIDENT_DATA_SOURCE;
  if (value === "fixtures") return fixturesAllowed() ? "fixtures" : null;
  if (value === "rentcafe") return "rentcafe";
  return null;
}

/** Official RentCafe resident portal (payments, maintenance, documents). */
export const residentPortalUrl = process.env.NEXT_PUBLIC_RESIDENT_PORTAL_URL || null;
