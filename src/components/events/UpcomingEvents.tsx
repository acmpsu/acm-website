import Image from "next/image";
import Link from "next/link";

import { getCalendarEvents } from "@/lib/events.server";
import { EventsCalendar } from "./EventsCalendar";
import styles from "./upcomingEvents.module.css";

/** Figma 50:560: shared by the home page and the full calendar route. */
export async function UpcomingEvents({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const { events, status } = await getCalendarEvents();
  const Heading = headingLevel;
  return (
    <section aria-labelledby="events-heading" className={styles.section}>
      <Image src="/resources/events/background.png" alt="" fill sizes="100vw" loading={headingLevel === "h1" ? "eager" : "lazy"} className={styles.background} />
      <Image src="/resources/events/clouds.png" alt="" width={907} height={302} sizes="48vw" loading={headingLevel === "h1" ? "eager" : "lazy"} className={styles.clouds} />
      <div className={styles.content}>
        <header className={styles.header}>
          <Heading id="events-heading" className={styles.heading}>Upcoming Events</Heading>
        </header>
        <div className={styles.calendar}>
          <EventsCalendar events={events} />
          <p className={styles.notice}><Link href="/my-events" className="inline-flex min-h-11 items-center underline focus-visible:outline-2 focus-visible:outline-white">View my events →</Link></p>
          {status !== "ready" && (
            <p role="status" className={styles.notice}>
              {status === "unconfigured" ? "Our calendar is being set up. Please check back soon." : "We couldn’t load the calendar. Please refresh the page in a moment."}
            </p>
          )}
          {status === "ready" && events.length === 0 && (
            <p role="status" className={styles.notice}>No events are scheduled yet. Check back for our next workshop, social or general body meeting.</p>
          )}
        </div>
      </div>
    </section>
  );
}
