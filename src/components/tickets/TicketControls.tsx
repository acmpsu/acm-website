"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { cancelRsvp } from "@/app/(calendar)/tickets/actions";
import { googleCalendarUrl } from "@/lib/tickets/calendar";
import type { MemberTicket, TicketActionState } from "@/lib/tickets/contracts";
import styles from "./tickets.module.css";

const empty: TicketActionState = {};
export function TicketControls({ ticket }: { ticket: MemberTicket }) {
  const [confirm, setConfirm] = useState(false);
  const [state, action, pending] = useActionState(cancelRsvp, empty);
  const [now] = useState(() => Date.now());
  return (
    <div className={styles.controls}>
      <div className={styles.actions}>
        {ticket.status === "confirmed" ? (
          <details
            className={styles.calendarMenu}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.currentTarget.open = false;
                event.currentTarget.querySelector("summary")?.focus();
              }
            }}
          >
            <summary className={styles.primary}>Add to calendar</summary>
            <ul>
              <li>
                <a
                  href={googleCalendarUrl(ticket.event)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Calendar
                </a>
              </li>
              <li>
                <a href={`/tickets/${ticket.id}/calendar.ics`}>
                  Apple / Outlook (.ics)
                </a>
              </li>
            </ul>
          </details>
        ) : (
          <Link href={`/events/${ticket.event_id}`} className={styles.primary}>
            RSVP again
          </Link>
        )}
        <Link href="/my-events" className={styles.secondary}>
          My events
        </Link>
      </div>
      {ticket.status === "confirmed" &&
        Date.parse(ticket.event.starts_at) > now &&
        (!confirm ? (
          <button
            type="button"
            onClick={() => setConfirm(true)}
            className={styles.textButton}
          >
            Cancel RSVP
          </button>
        ) : (
          <form
            action={action}
            className={styles.cancelForm}
            aria-busy={pending}
          >
            <input type="hidden" name="ticket_id" value={ticket.id} />
            <p>Cancel your place at this event?</p>
            <div className={styles.actions}>
              <button disabled={pending} className={styles.secondary}>
                {pending ? "Cancelling…" : "Confirm cancellation"}
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => setConfirm(false)}
                className={styles.secondary}
              >
                Keep my RSVP
              </button>
            </div>
          </form>
        ))}
      {state.error && (
        <p role="alert" className={styles.feedback}>
          {state.error}
        </p>
      )}
      {state.message && <p role="status">{state.message}</p>}
    </div>
  );
}
