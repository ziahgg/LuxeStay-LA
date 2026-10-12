"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef, useState, type FocusEvent, type ReactNode } from "react";
import { submitContact } from "@/app/(site)/contact/actions";
import { Button } from "@/components/ui/button";
import {
  INQUIRY_TYPES,
  LIMITS,
  readContactForm,
  validateContact,
  type ContactErrors,
  type ContactState,
  type ContactValues,
} from "@/lib/contact";

interface Props {
  defaults: { inquiryType?: string; residence?: string; moveIn?: string; name?: string; email?: string };
  residences: { slug: string; name: string; neighborhood: string }[];
}

const FIELD_ORDER: (keyof ContactValues)[] = ["name", "email", "phone", "inquiryType", "residence", "moveIn", "message", "consent"];

export function ContactForm({ defaults, residences }: Props) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, { status: "idle" });
  const [clientErrors, setClientErrors] = useState<ContactErrors>({});
  const [showSummary, setShowSummary] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const serverErrors = state.status === "invalid" ? state.errors : {};
  const errors: ContactErrors = { ...serverErrors, ...clientErrors };
  const values = state.status === "invalid" || state.status === "error" ? state.values : null;
  const errorList = FIELD_ORDER.filter((k) => errors[k]);

  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
    if (state.status === "invalid") summaryRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="border border-line bg-paper px-8 py-14 text-center outline-none sm:px-12">
        <p className="eyebrow text-olive-ink">Inquiry received</p>
        <h2 className="mt-4 font-serif text-title">Thank you — we&rsquo;ll be in touch.</h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">
          A member of our team will review your message and reply by email.
        </p>
        {state.note && <p className="mx-auto mt-6 max-w-md border-t border-line pt-4 text-xs text-taupe-ink">{state.note}</p>}
        <div className="mt-8">
          <Link href="/residences" className="eyebrow underline-offset-[6px] hover:underline">
            Continue exploring residences
          </Link>
        </div>
      </div>
    );
  }

  const fieldProps = (name: keyof ContactValues) => ({
    id: `${id}-${name}`,
    name,
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
    onBlur: (e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      // Re-validate a field once it already has an error, so messages clear as the user fixes them.
      const form = e.currentTarget.form;
      if (!errors[name] || !form) return;
      const next = validateContact(readContactForm(new FormData(form)));
      setClientErrors((prev) => ({ ...prev, [name]: next[name] }));
    },
  });

  return (
    <form
      action={action}
      noValidate
      aria-describedby={`${id}-privacy`}
      onSubmit={(e) => {
        const found = validateContact(readContactForm(new FormData(e.currentTarget)));
        setClientErrors(found);
        if (Object.keys(found).length > 0) {
          e.preventDefault();
          setShowSummary(true);
          requestAnimationFrame(() => summaryRef.current?.focus());
        }
      }}
      className="space-y-7"
    >
      {state.status === "error" && (
        <div role="alert" className="border-l-2 border-error bg-paper px-5 py-4 text-sm text-error">
          {state.message}
        </div>
      )}

      {(showSummary || state.status === "invalid") && errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby={`${id}-summary`}
          className="border-l-2 border-error bg-paper px-5 py-4 outline-none"
        >
          <h2 id={`${id}-summary`} className="text-sm font-semibold text-error">
            Please review {errorList.length === 1 ? "1 field" : `${errorList.length} fields`}:
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-error">
            {errorList.map((k) => (
              <li key={k}>
                <a href={`#${id}-${k}`} className="underline underline-offset-2">
                  {errors[k]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Honeypot */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-7 sm:grid-cols-2">
        <Field label="Full name" required id={`${id}-name`} error={errors.name}>
          <input type="text" autoComplete="name" maxLength={LIMITS.name} defaultValue={values?.name ?? defaults.name} className="field" {...fieldProps("name")} />
        </Field>
        <Field label="Email" required id={`${id}-email`} error={errors.email}>
          <input type="email" autoComplete="email" inputMode="email" maxLength={LIMITS.email} defaultValue={values?.email ?? defaults.email} className="field" {...fieldProps("email")} />
        </Field>
        <Field label="Phone" hint="Optional" id={`${id}-phone`} error={errors.phone}>
          <input type="tel" autoComplete="tel" maxLength={LIMITS.phone} defaultValue={values?.phone} className="field" {...fieldProps("phone")} />
        </Field>
        <Field label="Inquiry type" required id={`${id}-inquiryType`} error={errors.inquiryType}>
          <select defaultValue={values?.inquiryType ?? defaults.inquiryType ?? ""} className="field" {...fieldProps("inquiryType")}>
            <option value="" disabled>
              Select one
            </option>
            {INQUIRY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        {residences.length > 0 && (
        <Field label="Residence of interest" hint="Optional" id={`${id}-residence`} error={errors.residence}>
          <select defaultValue={values?.residence ?? defaults.residence ?? ""} className="field" {...fieldProps("residence")}>
            <option value="">No preference</option>
            {residences.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.name} — {r.neighborhood}
              </option>
            ))}
          </select>
        </Field>
        )}
        <Field label="Preferred move-in" hint="Optional" id={`${id}-moveIn`} error={errors.moveIn}>
          <input type="date" defaultValue={values?.moveIn ?? defaults.moveIn} className="field" {...fieldProps("moveIn")} />
        </Field>
      </div>

      <Field label="Message" required id={`${id}-message`} error={errors.message}>
        <textarea
          rows={6}
          maxLength={LIMITS.message}
          defaultValue={values?.message}
          placeholder="Your dates, who will be staying, and anything else that would help us."
          className="field resize-y"
          {...fieldProps("message")}
        />
      </Field>

      <div>
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            defaultChecked={values?.consent}
            className="mt-1 h-5 w-5 shrink-0 accent-charcoal"
            {...fieldProps("consent")}
          />
          <label htmlFor={`${id}-consent`} className="text-sm leading-relaxed text-muted">
            I agree that LuxeStay LA may use the details I&rsquo;ve provided to respond to my inquiry, as described in
            the{" "}
            <Link href="/privacy" className="text-charcoal underline underline-offset-2">
              Privacy Policy
            </Link>
            . <span className="text-error" aria-hidden="true">*</span>
          </label>
        </div>
        <FieldError id={`${id}-consent-error`} message={errors.consent} />
      </div>

      <div className="flex flex-col gap-5 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p id={`${id}-privacy`} className="max-w-sm text-xs leading-relaxed text-muted">
          We use your information only to respond to this inquiry. We never sell your personal data. Fields marked{" "}
          <span className="text-error">*</span> are required.
        </p>
        <Button type="submit" size="lg" disabled={pending} aria-disabled={pending} arrow={!pending}>
          {pending ? "Sending…" : "Send Inquiry"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  id,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {required && (
          <span className="ml-1 text-error" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
        {hint && <span className="ml-2 font-normal tracking-normal normal-case text-muted">{hint}</span>}
      </label>
      {children}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm text-error">
      {message}
    </p>
  );
}
