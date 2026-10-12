/**
 * Contact form schema and validation, shared by the client (instant feedback)
 * and the server action (authoritative). Dependency-free on purpose.
 */

export const INQUIRY_TYPES = [
  { value: "leasing", label: "Leasing a residence" },
  { value: "availability", label: "Availability and pricing" },
  { value: "corporate", label: "Corporate or relocation stays" },
  { value: "resident", label: "Current resident support" },
  { value: "general", label: "General question" },
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number]["value"];

export interface ContactValues {
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  residence: string;
  moveIn: string;
  message: string;
  consent: boolean;
}

export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export type ContactState =
  | { status: "idle" }
  | { status: "invalid"; errors: ContactErrors; values: ContactValues }
  | { status: "error"; message: string; values: ContactValues }
  | { status: "success"; note?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const LIMITS = { name: 120, email: 254, phone: 40, message: 4000 } as const;

export function readContactForm(form: FormData): ContactValues {
  const str = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v.trim() : "";
  };
  return {
    name: str("name"),
    email: str("email"),
    phone: str("phone"),
    inquiryType: str("inquiryType"),
    residence: str("residence"),
    moveIn: str("moveIn"),
    message: str("message"),
    consent: form.get("consent") === "on",
  };
}

export function validateContact(v: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (!v.name) errors.name = "Please enter your name.";
  else if (v.name.length > LIMITS.name) errors.name = "Please shorten your name.";

  if (!v.email) errors.email = "Please enter your email address.";
  else if (v.email.length > LIMITS.email || !EMAIL_RE.test(v.email))
    errors.email = "Please enter a valid email address, like name@example.com.";

  if (v.phone && (v.phone.length > LIMITS.phone || !/^[+()\-.\s\d]{7,}$/.test(v.phone)))
    errors.phone = "Please enter a valid phone number, or leave this blank.";

  if (!INQUIRY_TYPES.some((t) => t.value === v.inquiryType)) errors.inquiryType = "Please choose an inquiry type.";

  if (v.moveIn && !/^\d{4}-\d{2}-\d{2}$/.test(v.moveIn)) errors.moveIn = "Please choose a valid date.";

  if (!v.message) errors.message = "Please tell us a little about your plans.";
  else if (v.message.length < 10) errors.message = "Please add a few more details (at least 10 characters).";
  else if (v.message.length > LIMITS.message) errors.message = `Please keep your message under ${LIMITS.message} characters.`;

  if (!v.consent) errors.consent = "Please confirm you agree to us using your details to respond.";
  return errors;
}
