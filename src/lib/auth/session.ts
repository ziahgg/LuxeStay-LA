import "server-only";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, createSessionToken, verifySessionToken, type SessionPayload } from "./token";

/** Reads and verifies the session cookie. Request-time only (wrap callers in <Suspense>). */
export async function readSession(): Promise<SessionPayload | null> {
  // Expiry is checked against the current time, so this must run at request time.
  await connection();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/** Issues a new session cookie. Call only from a Server Action or Route Handler. */
export async function startSession(residentId: string, provider: string) {
  (await cookies()).set(SESSION_COOKIE, createSessionToken(residentId, provider), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}
