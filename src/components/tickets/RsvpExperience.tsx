"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { rsvpForEvent } from "@/app/(calendar)/tickets/actions";
import { eventLabels } from "@/lib/tickets/format";
import { registrationOpen, type TicketEvent, type TicketActionState } from "@/lib/tickets/contracts";
import { BoardingPass } from "./BoardingPass";
import { StampSeal } from "./StampSeal";
import styles from "./tickets.module.css";

const empty: TicketActionState = {};
export function RsvpExperience({ event, canRsvp, existingTicketId = null }: { event: TicketEvent; canRsvp: boolean; existingTicketId?: string | null }) {
  const [stamped, setStamped] = useState(false);
  const [now] = useState(() => Date.now());
  const [state, action, pending] = useActionState(rsvpForEvent, empty);
  const confirmation = useRef<HTMLElement>(null);
  const labels = eventLabels(event);
  const open = registrationOpen(event, now);
  const loginHref = `/login?next=${encodeURIComponent(`/events/${event.id}`)}`;
  return <div className={styles.experience}>
    <h1 className={styles.sceneHeading}>{existingTicketId ? "Your next stop is reserved." : "Your boarding pass is here. Stamp the ticket to get started."}</h1>
    {!stamped && !existingTicketId ? <BoardingPass event={event} onStamp={() => {
      setStamped(true);
      requestAnimationFrame(() => confirmation.current?.focus());
    }} /> : <section ref={confirmation} tabIndex={-1} className={styles.reverse} aria-label="Choose your RSVP">
      <div className={styles.reverseMain}>
        <p className={styles.eyebrow}>{existingTicketId ? "YOU’RE ON THE LIST" : "TICKET ACKNOWLEDGED / ONE MORE THING"}</p>
        <h2 className={styles.confirmHeading}>{existingTicketId ? "See you there." : "See you there?"}</h2>
        {event.description && <p>{event.description}</p>}
        <div className={styles.summary}><strong>{event.title}</strong><p>{labels.date} · {labels.time} · {event.location ?? "Location to be announced"}</p></div>
        <div className={styles.actions}>
          {existingTicketId ? <Link href={`/tickets/${existingTicketId}`} className={styles.primary}>View your ticket</Link> : !canRsvp ? <Link href={loginHref} className={styles.primary}>Sign in to RSVP</Link> : <form action={action} aria-busy={pending}>
            <input type="hidden" name="event_id" value={event.id} />
            <button className={styles.primary} disabled={pending || !open}>{pending ? "Reserving your spot…" : open ? "Yes, I’ll be there" : "Registration closed"}</button>
          </form>}
          <Link href="/events" className={styles.secondary}>{existingTicketId ? "Back to events" : "Maybe next time"}</Link>
        </div>
        {state.error && <p role="alert" className={styles.feedback}>{state.error}</p>}
        {!open && !existingTicketId && <p role="status">Registration for this event is closed.</p>}
        <p className={styles.finePrint}>Stamping marks the invitation as seen. Your place is reserved only after you RSVP.</p>
      </div>
      <aside className={styles.reverseStub}><span className={styles.eyebrow}>ACM / PENN STATE</span><p>Your<br />next stop.</p><StampSeal label={existingTicketId ? "RSVP" : "SEEN"} date={labels.date} /></aside>
    </section>}
    <Link href="/events" className={styles.dismiss}>Not now <span aria-hidden="true">×</span></Link>
  </div>;
}
