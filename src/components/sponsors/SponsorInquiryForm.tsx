"use client";

import { useActionState } from "react";
import { AlertCircle } from "lucide-react";

import { submitSponsorInquiry, type InquiryState } from "@/app/(immersive)/sponsor/actions";
import styles from "./inquiry.module.css";

const INITIAL: InquiryState = { status: "idle" };

/** Figma "Sponsor message form" (494:201). */
export function SponsorInquiryForm() {
  const [state, formAction, pending] = useActionState(submitSponsorInquiry, INITIAL);

  if (state.status === "sent") {
    return (
      <p role="status" className={styles.sent}>
        Thanks — your message is on its way to our sponsorship team. We&apos;ll reply by email.
      </p>
    );
  }

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="inquiry-email" className={styles.label}>Your email <span aria-hidden="true">*</span></label>
        <input id="inquiry-email" name="email" type="email" autoComplete="email" required aria-required="true"
          maxLength={254} placeholder="you@company.com" defaultValue={state.values?.email} className={styles.input} />
      </div>

      <div className={styles.field}>
        <label htmlFor="inquiry-message" className={styles.label}>How would you like to partner? <span aria-hidden="true">*</span></label>
        <textarea id="inquiry-message" name="message" required aria-required="true" maxLength={5000} rows={7}
          placeholder={"Tell us about your organization, your ideas,\nand what you’d like to make possible together."}
          defaultValue={state.values?.message} className={`${styles.input} ${styles.textarea}`} />
      </div>

      {/* Honeypot: hidden from people and assistive tech. */}
      <div className={styles.trap} aria-hidden="true">
        <label htmlFor="inquiry-company-site">Company website</label>
        <input id="inquiry-company-site" name="company_site" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" ? (
        <p role="alert" className={styles.error}>
          <AlertCircle size={16} aria-hidden="true" /> {state.error}
        </p>
      ) : null}

      <div className={styles.actions}>
        <p className={styles.note}>Your message goes to our sponsorship team.</p>
        <button type="submit" disabled={pending} className={styles.send}>
          {pending ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
