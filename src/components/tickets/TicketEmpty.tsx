import Link from "next/link";
import type { TicketState } from "@/lib/tickets/contracts";
import { BoardingPass } from "./BoardingPass";
import { TicketBackdrop } from "./TicketBackdrop";
import styles from "./tickets.module.css";

const copy: Record<Exclude<TicketState, "ready">, string> = {
  unconfigured: "Your next stop is coming soon. Event invitations and your tickets will appear here when registration opens.",
  unauthenticated: "Sign in to see your private tickets and RSVP for ACM events.",
  "member-not-found": "We couldn’t find your membership profile. Please complete your profile or contact an ACM officer.",
  "invalid-ticket": "We couldn’t find this event or ticket in your account. You can browse events or return to My events.",
  unavailable: "We couldn’t load your ticket just now. Please refresh the page in a moment.",
};
export function TicketEmpty({ state, next = "/my-events" }: { state: TicketState; next?: string }) {
  return <TicketBackdrop>
    <h1 className={styles.sceneHeading}>Your boarding pass</h1>
    <p role="status" className={styles.sceneMessage}>{state === "ready" ? "No tickets yet. RSVP for an upcoming event to receive your boarding pass." : copy[state]}</p>
    <BoardingPass />
    <div className={styles.controls}><div className={styles.actions}>
      {state === "unauthenticated" && <Link href={`/login?next=${encodeURIComponent(next)}`} className={styles.primary}>Sign in</Link>}
      <Link href="/events" className={styles.secondary}>Explore events</Link>
    </div></div>
  </TicketBackdrop>;
}
