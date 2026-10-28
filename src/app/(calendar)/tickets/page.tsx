import Link from "next/link";
import { listOwnTickets } from "@/lib/tickets/server";
import { ticketNumber } from "@/lib/tickets/format";
import { TicketBackdrop } from "@/components/tickets/TicketBackdrop";
import { TicketEmpty } from "@/components/tickets/TicketEmpty";
import styles from "@/components/tickets/tickets.module.css";

export const metadata = { title: "My tickets — Penn State ACM", robots: { index: false }, referrer: "no-referrer" };
export const dynamic = "force-dynamic";

export default async function TicketsPage() {
  const { state, tickets } = await listOwnTickets();
  if (state !== "ready" || tickets.length === 0) return <TicketEmpty state={state} />;
  return <TicketBackdrop>
    <h1 className={styles.sceneHeading}>Your next stops.</h1>
    <ul className={styles.ticketList}>{tickets.map((ticket) => <li key={ticket.id}>
      <Link href={`/tickets/${ticket.id}`}>
        <span className={styles.eyebrow}>{ticketNumber(ticket.ticket_number)} · {ticket.status === "confirmed" ? "RSVP confirmed" : "Cancelled"}</span>
        <strong>{ticket.event.title}</strong>
        <span>{new Date(ticket.event.starts_at).toLocaleDateString("en-US", { timeZone: "America/New_York", dateStyle: "long" })}</span>
        <span>View boarding pass →</span>
      </Link>
    </li>)}</ul>
    <div className={styles.controls}><Link href="/events" className={styles.secondary}>Explore events</Link></div>
  </TicketBackdrop>;
}
