"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { signIn, signUp, type AuthState } from "./actions";

const EMPTY: AuthState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-11 w-full rounded-md bg-[var(--navy)] px-[22px] text-[13px] font-semibold text-white transition hover:bg-[var(--navy-dk)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--navy)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Working…" : label}
    </button>
  );
}

const fieldClass =
  "h-11 w-full rounded-md border border-[var(--border)] bg-white px-3 text-[14px] text-[var(--navy-dk)] transition focus:border-[var(--navy)] focus:outline focus:outline-2 focus:outline-offset-0 focus:outline-[var(--navy)]";

const labelClass = "mb-1.5 block text-[13px] font-semibold text-[var(--navy-dk)]";

export function LoginForm({ next }: { next: string }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const action = mode === "signin" ? signIn : signUp;
  const [state, formAction] = useActionState(action, EMPTY);

  return (
    <div className="w-full max-w-[420px]">
      <div
        role="tablist"
        aria-label="Sign in or create an account"
        className="mb-6 grid grid-cols-2 gap-1 rounded-md border border-[var(--border)] bg-[var(--bg-alt)] p-1"
      >
        {(["signin", "signup"] as const).map((value) => (
          <button
            key={value}
            role="tab"
            type="button"
            aria-selected={mode === value}
            onClick={() => setMode(value)}
            className={`h-9 rounded text-[13px] font-semibold transition ${
              mode === value
                ? "bg-white text-[var(--navy-dk)] shadow-sm"
                : "text-[var(--slate)] hover:text-[var(--navy-dk)]"
            }`}
          >
            {value === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <form action={formAction} className="space-y-4" key={mode}>
        <input type="hidden" name="next" value={next} />

        {mode === "signup" && (
          <div>
            <label htmlFor="full_name" className={labelClass}>
              Full name
            </label>
            <input id="full_name" name="full_name" type="text" autoComplete="name" className={fieldClass} />
          </div>
        )}

        <div>
          <label htmlFor="email" className={labelClass}>
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            aria-required="true"
            autoComplete="email"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Password <span aria-hidden="true">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            aria-required="true"
            minLength={8}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className={fieldClass}
          />
          {mode === "signup" && (
            <p className="mt-1.5 text-[12px] text-[var(--slate)]">At least 8 characters</p>
          )}
        </div>

        {state.error && (
          <p role="alert" className="text-[13px] font-medium text-rose-600">
            {state.error}
          </p>
        )}
        {state.message && (
          <p role="status" className="text-[13px] font-medium text-emerald-700">
            {state.message}
          </p>
        )}

        <SubmitButton label={mode === "signin" ? "Sign in" : "Create account"} />
      </form>
    </div>
  );
}
