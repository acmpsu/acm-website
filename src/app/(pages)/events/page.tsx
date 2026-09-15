import Link from "next/link";

import { getCalendarEvents } from "@/lib/events.server";

import { EventsCalendar } from "./EventsCalendar";

export default async function EventsPage() {
  const events = await getCalendarEvents();

  return (
    <main className="border-b border-[var(--border)] bg-white">
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto flex w-full max-w-[1160px] flex-col px-8 py-[72px]">
          <h1 className="mb-3 text-[clamp(28px,3vw,42px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[var(--navy-dk)]">
            Upcoming Events
          </h1>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--navy)]">
            Join Us
          </p>
          <p className="max-w-3xl text-[15px] leading-[1.75] text-[var(--slate)]">
            Join us for workshops, hackathons, and networking events. Click on any date to see what's happening that day
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto flex w-full max-w-[1160px] flex-col px-8 py-[72px]">
          <EventsCalendar events={events} />
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--bg-alt)]">
        <div className="mx-auto flex w-full max-w-[1160px] flex-col px-8 py-[72px] text-center">
          <h2 className="mb-3 text-[clamp(24px,2vw,32px)] font-extrabold leading-[1.1] text-[var(--navy-dk)]">
            Want to host an event?
          </h2>
          <p className="mb-6 max-w-2xl mx-auto text-[15px] leading-[1.75] text-[var(--slate)]">
            If you have an idea for an event, we'd love to hear it
          </p>
          <div className="flex justify-center">
            <Link
              href="/#contact"
              className="inline-block rounded-md bg-[var(--navy)] px-[18px] py-[7px] text-[13px] font-semibold text-white transition hover:bg-[var(--navy-dk)]"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
