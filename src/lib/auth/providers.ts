import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { FIXTURE_RESIDENTS } from "@/lib/resident/fixtures";
import { fixturesAllowed } from "@/lib/resident/config";
import { isSessionSecretConfigured } from "./token";

/**
 * Identity providers for resident sign-in.
 *
 * - "fixtures": development-only provider for the fictional fixture residents.
 *   Requires RESIDENT_AUTH_PROVIDER=fixtures, a DEV_RESIDENT_PASSWORD of at
 *   least 12 characters, and is disabled in production builds unless
 *   ALLOW_RESIDENT_FIXTURES_IN_PRODUCTION=true. It is real authentication
 *   (a secret must be presented) — never an open door.
 * - "rentcafe": placeholder. Resident identity should ultimately come from the
 *   client's Yardi / RentCafe setup (e.g. SSO or an approved resident API).
 *   Not implemented until that method is verified — see docs/DASHBOARD.md.
 */
export interface IdentityProvider {
  id: "fixtures" | "rentcafe";
  /** Returns the resident id on success, null on invalid credentials. */
  authenticate(email: string, password: string): Promise<string | null>;
}

const digest = (value: string) => createHash("sha256").update(value).digest();

const fixturesProvider: IdentityProvider = {
  id: "fixtures",
  async authenticate(email, password) {
    const expected = process.env.DEV_RESIDENT_PASSWORD ?? "";
    // Compare fixed-length digests in constant time.
    const passwordOk = timingSafeEqual(digest(password), digest(expected));
    const resident = FIXTURE_RESIDENTS.find((r) => r.email.toLowerCase() === email.toLowerCase());
    return passwordOk && resident ? resident.id : null;
  },
};

/** The active provider, or null when resident sign-in is not available. */
export function getIdentityProvider(): IdentityProvider | null {
  if (!isSessionSecretConfigured()) return null;
  const choice = process.env.RESIDENT_AUTH_PROVIDER;
  if (choice === "fixtures") {
    const passwordOk = (process.env.DEV_RESIDENT_PASSWORD ?? "").length >= 12;
    return fixturesAllowed() && passwordOk ? fixturesProvider : null;
  }
  // "rentcafe" is intentionally unavailable until a verified integration exists.
  return null;
}
