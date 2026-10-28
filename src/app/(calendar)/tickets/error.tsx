"use client";
import Link from "next/link";

export default function TicketError({ reset }: { reset: () => void }) {
  return <section className="mx-auto max-w-xl space-y-6 px-6 py-16"><h1 className="text-3xl font-semibold">We couldn’t prepare your ticket</h1><p>Your RSVP may already have been saved. Check My tickets before trying again.</p><div className="flex flex-wrap gap-4"><button onClick={reset} className="min-h-12 rounded-xl border border-[var(--border)] px-6 focus-visible:outline-2">Try again</button><Link href="/tickets" className="inline-flex min-h-12 items-center underline">My tickets</Link></div></section>;
}
