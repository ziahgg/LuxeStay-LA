import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getResidentAdapter } from "@/lib/resident/service";
import type { ResidentProfile } from "@/lib/resident/types";
import { getIdentityProvider } from "./providers";
import { readSession } from "./session";

/**
 * Data Access Layer for resident identity.
 *
 * `AuthenticatedResident` can only be produced here, from a verified session
 * whose resident still exists in the active data source. Every resident data
 * function requires one, so data can't be fetched for an id taken from the
 * request body, URL or any other client input.
 */
declare const verified: unique symbol;
export type AuthenticatedResident = ResidentProfile & { readonly [verified]: true };

export const getCurrentResident = cache(async (): Promise<AuthenticatedResident | null> => {
  const session = await readSession();
  if (!session) return null;

  // Sessions from a provider that has since been disabled are no longer valid.
  const provider = getIdentityProvider();
  if (!provider || provider.id !== session.provider) return null;

  const adapter = getResidentAdapter();
  if (!adapter) return null;
  try {
    const profile = await adapter.getProfile(session.sub);
    return profile ? (profile as AuthenticatedResident) : null;
  } catch (error) {
    console.error("[auth] Failed to load resident profile", error);
    return null;
  }
});

/** Use at the top of every private page, action and route handler. */
export async function requireResident(nextPath = "/dashboard"): Promise<AuthenticatedResident> {
  const resident = await getCurrentResident();
  if (!resident) redirect(`/dashboard/login?next=${encodeURIComponent(nextPath)}`);
  return resident;
}
