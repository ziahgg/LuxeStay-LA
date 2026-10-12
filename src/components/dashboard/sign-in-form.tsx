"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { signIn, type SignInState } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";

export function SignInForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<SignInState, FormData>(signIn, { status: "idle" });
  const errorRef = useRef<HTMLParagraphElement>(null);
  const id = useId();

  useEffect(() => {
    if (state.status === "error") errorRef.current?.focus();
  }, [state]);

  return (
    <form action={action} className="space-y-6" noValidate>
      <input type="hidden" name="next" value={next} />
      {state.status === "error" && (
        <p
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="border-l-2 border-error bg-paper px-4 py-3 text-sm text-error outline-none"
        >
          {state.message}
        </p>
      )}
      <div>
        <label htmlFor={`${id}-email`} className="field-label">
          Email address
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          required
          defaultValue={state.status === "error" ? state.email : undefined}
          className="field"
          aria-invalid={state.status === "error" ? true : undefined}
        />
      </div>
      <div>
        <label htmlFor={`${id}-password`} className="field-label">
          Password
        </label>
        <input
          id={`${id}-password`}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="field"
          aria-invalid={state.status === "error" ? true : undefined}
        />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={pending} arrow={!pending}>
        {pending ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  );
}
