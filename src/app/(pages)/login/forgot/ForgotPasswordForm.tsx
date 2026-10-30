"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { sendPasswordReset, type AuthState } from "../actions";

const EMPTY: AuthState = {};

const fieldClass =
  "h-12 w-full rounded-[10px] border border-[var(--auth-input-border)] bg-white px-3.5 text-[14px] text-[var(--azure-12)] placeholder:text-[var(--auth-placeholder)] transition focus:border-[var(--azure-12)] focus:outline-none focus:ring-2 focus:ring-[var(--azure-12)]/40";

const labelClass =
  "block text-[11px] font-medium uppercase tracking-[1px] text-[var(--auth-muted)]";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="flex h-12 w-full items-center justify-center rounded-full bg-[var(--azure-12)] px-6 text-[14px] font-medium text-white transition hover:bg-[#013157] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--azure-12)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Sending…" : "Send reset link"}
    </button>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(sendPasswordReset, EMPTY);

  return (
    <div className="font-[family-name:var(--font-red-hat)] w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/60 bg-[var(--auth-card)] px-5 py-6 shadow-[0px_12px_46px_0px_rgba(10,28,41,0.1)]">
      <div className="flex flex-col items-center gap-2">
        <Image
          src="/logos/acm.png"
          alt="Penn State ACM"
          width={52}
          height={52}
          priority
          className="h-auto w-[52px]"
        />
        <h1 className="font-[family-name:var(--font-instrument-serif)] text-[42px] italic leading-[50px] text-[var(--azure-12)]">
          Reset password
        </h1>
        <p className="text-center text-[13px] leading-[20px] text-[var(--auth-muted)]">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form action={formAction} className="mt-6 flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            aria-required="true"
            autoComplete="email"
            placeholder="you@psu.edu"
            className={fieldClass}
          />
        </div>

        {state.error && (
          <p
            role="alert"
            aria-live="assertive"
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] font-medium text-rose-700"
          >
            {state.error}
          </p>
        )}
        {state.message && (
          <p
            role="status"
            aria-live="polite"
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[13px] font-medium text-emerald-700"
          >
            {state.message}
          </p>
        )}

        <SubmitButton />

        <Link
          href="/login"
          className="mx-auto rounded text-[12px] font-medium text-[var(--azure-12)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--azure-12)]"
        >
          Back to sign in
        </Link>
      </form>
    </div>
  );
}
