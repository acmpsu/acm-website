import { TicketBackdrop } from "@/components/tickets/TicketBackdrop";
import styles from "@/components/tickets/tickets.module.css";

export default function LoadingTickets() {
  return <TicketBackdrop><div role="status"><h1 className={styles.sceneHeading}>Preparing your boarding pass…</h1><p className={styles.sceneMessage}>Loading your event and RSVP.</p></div></TicketBackdrop>;
}
