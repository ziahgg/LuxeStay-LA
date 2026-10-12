"use server";

import { readContactForm, validateContact, type ContactState } from "@/lib/contact";

/**
 * Contact / inquiry submission.
 *
 * Delivery is configured with CONTACT_WEBHOOK_URL (server-side only): the
 * validated inquiry is POSTed as JSON to that endpoint — e.g. a CRM, a form
 * service, an email relay, or a RentCafe lead endpoint once verified.
 *
 * If no destination is configured:
 *  - in development, the inquiry is logged and a success state is shown with a
 *    note that nothing was delivered;
 *  - in production, the form reports an error rather than pretending the
 *    message was sent.
 */
export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field.
  if (typeof formData.get("company") === "string" && formData.get("company") !== "") {
    return { status: "success" };
  }

  const values = readContactForm(formData);
  const errors = validateContact(values);
  if (Object.keys(errors).length > 0) return { status: "invalid", errors, values };

  const payload = {
    ...values,
    submittedAt: new Date().toISOString(),
    source: "luxestay-website",
  };

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] CONTACT_WEBHOOK_URL not set — inquiry not delivered (development):", {
        ...payload,
        email: "[redacted]",
        phone: payload.phone ? "[redacted]" : "",
      });
      return {
        status: "success",
        note: "Development mode: no delivery endpoint is configured, so this inquiry was not sent anywhere.",
      };
    }
    console.error("[contact] CONTACT_WEBHOOK_URL is not configured in production.");
    return {
      status: "error",
      message: "Our inquiry form is temporarily unavailable. Please try again later.",
      values,
    };
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CONTACT_WEBHOOK_SECRET && {
          Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_SECRET}`,
        }),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return { status: "success" };
  } catch (error) {
    console.error("[contact] Delivery failed", error);
    return {
      status: "error",
      message: "We couldn't send your message just now. Please try again in a few minutes.",
      values,
    };
  }
}
