"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef, type ReactNode } from "react";
import {
  submitMaintenanceRequest,
  type MaintenanceFormState,
} from "@/app/dashboard/(portal)/maintenance/actions";
import { Button } from "@/components/ui/button";
import { MAINTENANCE_CATEGORIES } from "@/lib/resident/types";

export function MaintenanceForm({ attachmentsSupported, portalUrl }: { attachmentsSupported: boolean; portalUrl: string | null }) {
  const [state, action, pending] = useActionState<MaintenanceFormState, FormData>(submitMaintenanceRequest, {
    status: "idle",
  });
  const alertRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const errors = state.status === "invalid" ? state.errors : {};
  const values = state.status === "invalid" || state.status === "error" ? state.values : null;

  useEffect(() => {
    if (state.status !== "idle") alertRef.current?.focus();
  }, [state]);

  const describedBy = (name: string) => (errors[name as keyof typeof errors] ? `${id}-${name}-error` : undefined);

  return (
    <form action={action} noValidate className="space-y-7">
      {state.status !== "idle" && (
        <div ref={alertRef} tabIndex={-1} role="alert" className="border-l-2 border-error bg-paper px-5 py-4 text-sm text-error outline-none">
          {state.status === "error" ? state.message : "Please review the highlighted fields."}
        </div>
      )}

      <Field id={`${id}-category`} label="Category" error={errors.category}>
        <select
          id={`${id}-category`}
          name="category"
          defaultValue={values?.category ?? ""}
          className="field"
          aria-invalid={errors.category ? true : undefined}
          aria-describedby={describedBy("category")}
        >
          <option value="" disabled>
            Select a category
          </option>
          {MAINTENANCE_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>

      <Field id={`${id}-title`} label="Summary" error={errors.title}>
        <input
          id={`${id}-title`}
          name="title"
          type="text"
          maxLength={120}
          defaultValue={values?.title}
          placeholder="e.g. Bathroom tap is dripping"
          className="field"
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={describedBy("title")}
        />
      </Field>

      <Field id={`${id}-description`} label="Details" error={errors.description}>
        <textarea
          id={`${id}-description`}
          name="description"
          rows={6}
          maxLength={2000}
          defaultValue={values?.description}
          placeholder="Where is the issue, when did it start, and anything we should know before visiting?"
          className="field resize-y"
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={describedBy("description")}
        />
      </Field>

      <div className="flex items-start gap-3">
        <input
          id={`${id}-pte`}
          name="permissionToEnter"
          type="checkbox"
          defaultChecked={values?.permissionToEnter}
          className="mt-1 h-5 w-5 shrink-0 accent-charcoal"
        />
        <label htmlFor={`${id}-pte`} className="text-[0.9375rem] leading-relaxed">
          Maintenance may enter my residence if I&rsquo;m not home
          <span className="block text-sm text-muted">Leave unchecked if you&rsquo;d like the team to arrange a time with you.</span>
        </label>
      </div>

      {!attachmentsSupported && (
        <p className="border-l-2 border-taupe bg-stone-soft px-4 py-3 text-sm leading-relaxed text-muted">
          Photo attachments aren&rsquo;t supported here yet.
          {portalUrl ? (
            <>
              {" "}
              To include photos, submit your request through the{" "}
              <a href={portalUrl} target="_blank" rel="noopener noreferrer" className="text-charcoal underline underline-offset-4">
                resident portal<span className="sr-only"> (opens in a new tab)</span>
              </a>
              .
            </>
          ) : (
            " Describe the issue in detail and the team will follow up if photos would help."
          )}
        </p>
      )}

      <p className="text-sm leading-relaxed text-muted">
        For emergencies such as flooding, gas smells, fire or no heat, contact building management by phone
        immediately — do not submit an online request.
      </p>

      <div className="flex flex-wrap items-center gap-6 border-t border-line pt-7">
        <Button type="submit" size="lg" disabled={pending} arrow={!pending}>
          {pending ? "Submitting…" : "Submit Request"}
        </Button>
        <Link href="/dashboard/maintenance" className="text-sm underline-offset-4 hover:underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
