"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Eye, EyeOff } from "lucide-react";

import { sendEmailCode, signIn, signUp, type AuthState } from "./actions";

const EMPTY: AuthState = {};

type Mode = "signin" | "signup" | "emailcode";

const COPY: Record<Mode, { title: string; subtitle: string; submit: string }> =
  {
    signin: {
      title: "Sign in",
      subtitle: "Welcome back. Sign in to your ACM account.",
      submit: "Sign in",
    },
    signup: {
      title: "Create account",
      subtitle: "Join Penn State ACM to track committees and events.",
      submit: "Create account",
    },
    emailcode: {
      title: "Email sign-in",
      subtitle: "We'll email you a secure link to sign in.",
      submit: "Email me a sign-in code",
    },
  };

/** Shared field + label styles from the Figma (48px tall, #c9d6d6 border, 10px radius). */
const fieldClass =
  "h-12 w-full rounded-[10px] border border-[var(--auth-input-border)] bg-white px-3.5 text-[14px] text-[var(--azure-12)] placeholder:text-[var(--auth-placeholder)] transition focus:border-[var(--azure-12)] focus:outline-none focus:ring-2 focus:ring-[var(--azure-12)]/40";

const labelClass =
  "block text-[11px] font-medium uppercase tracking-[1px] text-[var(--auth-muted)]";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="flex h-12 w-full items-center justify-center rounded-full bg-[var(--azure-12)] px-6 text-[14px] font-medium text-white transition hover:bg-[#013157] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--azure-12)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <Spinner />
          Working…
        </span>
      ) : (
        label
      )}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.37 0 0 5.37 0 12h4z"
      />
    </svg>
  );
}

function PasswordField({ mode }: { mode: Mode }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        {mode === "signin" && (
          <a
            href="/login/forgot"
            className="rounded text-[12px] font-medium text-[var(--azure-12)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--azure-12)]"
          >
            Forgot password?
          </a>
        )}
      </div>
      <div className="relative">
        <input
          id="password"
          name="password"
          type={visible ? "text" : "password"}
          required
          aria-required="true"
          minLength={mode === "signup" ? 8 : undefined}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          placeholder="Enter your password"
          className={`${fieldClass} pr-11`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-[var(--auth-muted)] transition hover:text-[var(--azure-12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--azure-12)]"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {mode === "signup" && (
        <p className="text-[12px] text-[var(--auth-muted)]">
          At least 8 characters.
        </p>
      )}
    </div>
  );
}

export function LoginForm({ next }: { next: string }) {
  const [mode, setMode] = useState<Mode>("signin");
  const action =
    mode === "signin" ? signIn : mode === "signup" ? signUp : sendEmailCode;
  const [state, formAction] = useActionState(action, EMPTY);
  const copy = COPY[mode];

  return (
    <div className="font-[family-name:var(--font-red-hat)] w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/60 bg-[var(--auth-card)] px-5 py-6 shadow-[0px_12px_46px_0px_rgba(10,28,41,0.1)]">
      {/* Identity + intro */}
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
          {copy.title}
        </h1>
        <p className="text-center text-[13px] leading-[20px] text-[var(--auth-muted)]">
          {copy.subtitle}
        </p>
      </div>

      {/* Form */}
      <form
        action={formAction}
        className="mt-6 flex flex-col gap-5"
        key={mode}
        noValidate
      >
        <input type="hidden" name="next" value={next} />

        {mode === "signup" && (
          <div className="flex flex-col gap-2">
            <label htmlFor="full_name" className={labelClass}>
              Full name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              className={fieldClass}
            />
          </div>
        )}

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

        {mode !== "emailcode" && <PasswordField mode={mode} />}

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

        <SubmitButton label={copy.submit} />

        {/* Alternative sign-in toggle */}
        {mode === "signin" && (
          <button
            type="button"
            onClick={() => setMode("emailcode")}
            className="mx-auto rounded text-[12px] font-medium text-[var(--azure-12)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--azure-12)]"
          >
            Email me a sign-in code
          </button>
        )}
        {mode === "emailcode" && (
          <button
            type="button"
            onClick={() => setMode("signin")}
            className="mx-auto rounded text-[12px] font-medium text-[var(--azure-12)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--azure-12)]"
          >
            Sign in with a password instead
          </button>
        )}
      </form>

      {/* New here? / Create account */}
      <div className="mt-6 flex flex-col gap-[18px]">
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-[var(--auth-divider)]" />
          <span className="text-[10px] font-medium uppercase tracking-[1px] text-[var(--auth-muted)]">
            {mode === "signup" ? "Already a member?" : "New here?"}
          </span>
          <span className="h-px flex-1 bg-[var(--auth-divider)]" />
        </div>

        <button
          type="button"
          onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          className="flex h-[46px] w-full items-center justify-center rounded-full border border-[var(--azure-12)] px-6 text-[14px] font-medium text-[var(--azure-12)] transition hover:bg-[var(--azure-12)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--azure-12)]"
        >
          {mode === "signup" ? "Sign in" : "Create an account"}
        </button>
      </div>
    </div>
  );
}
