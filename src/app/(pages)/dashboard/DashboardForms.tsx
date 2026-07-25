"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { checkIn, updateProfile, type ActionState } from "./actions";

const EMPTY: ActionState = {};

const fieldClass =
  "h-11 w-full rounded-md border border-[var(--border)] bg-white px-3 text-[14px] text-[var(--navy-dk)] transition focus:border-[var(--navy)] focus:outline focus:outline-2 focus:outline-offset-0 focus:outline-[var(--navy)]";

const labelClass = "mb-1.5 block text-[13px] font-semibold text-[var(--navy-dk)]";

function Submit({ label, variant = "primary" }: { label: string; variant?: "primary" | "secondary" }) {
  const { pending } = useFormStatus();
  const styles =
    variant === "primary"
      ? "bg-[var(--navy)] text-white hover:bg-[var(--navy-dk)]"
      : "border border-[var(--border)] bg-white text-[var(--navy-dk)] hover:border-[#b0bdd4] hover:bg-[var(--bg-alt)]";

  return (
    <button
      type="submit"
      disabled={pending}
      className={`h-11 shrink-0 rounded-md px-[22px] text-[13px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--navy)] disabled:cursor-not-allowed disabled:opacity-50 ${styles}`}
    >
      {pending ? "Working…" : label}
    </button>
  );
}

function Feedback({ state }: { state: ActionState }) {
  if (state.error) {
    return (
      <p role="alert" className="text-[13px] font-medium text-rose-600">
        {state.error}
      </p>
    );
  }
  if (state.message) {
    return (
      <p role="status" className="text-[13px] font-medium text-emerald-700">
        {state.message}
      </p>
    );
  }
  return null;
}

type ProfileFields = {
  full_name: string | null;
  major: string | null;
  grad_year: number | null;
};

export function ProfileForm({ profile }: { profile: ProfileFields }) {
  const [state, formAction] = useActionState(updateProfile, EMPTY);

  return (
    <form action={formAction} className="max-w-[520px] space-y-4">
      <div>
        <label htmlFor="full_name" className={labelClass}>
          Full name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          defaultValue={profile.full_name ?? ""}
          autoComplete="name"
          className={fieldClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="major" className={labelClass}>
            Major
          </label>
          <input
            id="major"
            name="major"
            type="text"
            defaultValue={profile.major ?? ""}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="grad_year" className={labelClass}>
            Graduation year
          </label>
          <input
            id="grad_year"
            name="grad_year"
            type="number"
            inputMode="numeric"
            min={2024}
            max={2035}
            defaultValue={profile.grad_year ?? ""}
            className={fieldClass}
          />
        </div>
      </div>

      <Feedback state={state} />
      <Submit label="Save profile" />
    </form>
  );
}

export function CheckInForm() {
  const [state, formAction] = useActionState(checkIn, EMPTY);

  return (
    <form action={formAction} className="max-w-[520px] space-y-3">
      <div>
        <label htmlFor="code" className={labelClass}>
          Check-in code
        </label>
        <div className="flex gap-3">
          <input
            id="code"
            name="code"
            type="text"
            required
            aria-required="true"
            autoComplete="off"
            placeholder="Shared at the event"
            className={fieldClass}
          />
          <Submit label="Check in" variant="secondary" />
        </div>
      </div>
      <Feedback state={state} />
    </form>
  );
}
