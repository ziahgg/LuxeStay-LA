"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getIdentityProvider } from "@/lib/auth/providers";
import { clearFailures, isRateLimited, recordFailure } from "@/lib/auth/rate-limit";
import { endSession, startSession } from "@/lib/auth/session";

export type SignInState = { status: "idle" } | { status: "error"; message: string; email: string };

/** Only allow redirects back into the dashboard (no open redirects). */
function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/dashboard") && !next.startsWith("//") && !next.includes("\\") && !next.startsWith("/dashboard/login")
    ? next
    : "/dashboard";
}

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim().slice(0, 254);
  const password = String(formData.get("password") ?? "").slice(0, 256);

  if (!email || !password) {
    return { status: "error", message: "Please enter your email address and password.", email };
  }

  const provider = getIdentityProvider();
  if (!provider) {
    return { status: "error", message: "Online resident sign-in is not available yet.", email };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const keys = [`email:${email.toLowerCase()}`, `ip:${ip}`];
  if (keys.some((k) => isRateLimited(k))) {
    return { status: "error", message: "Too many sign-in attempts. Please wait 15 minutes and try again.", email };
  }

  const residentId = await provider.authenticate(email, password);
  if (!residentId) {
    keys.forEach((k) => recordFailure(k));
    // Generic message: don't reveal whether the email exists.
    return { status: "error", message: "The email address or password is incorrect.", email };
  }

  keys.forEach((k) => clearFailures(k));
  await startSession(residentId, provider.id);
  redirect(safeNext(formData.get("next")));
}

export async function signOut() {
  await endSession();
  redirect("/dashboard/login?signedOut=1");
}
