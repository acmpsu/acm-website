import { getOwnTicket } from "@/lib/tickets/server";
import { TicketBackdrop } from "@/components/tickets/TicketBackdrop";
import { TicketEmpty } from "@/components/tickets/TicketEmpty";
import { BoardingPass } from "@/components/tickets/BoardingPass";
import { TicketControls } from "@/components/tickets/TicketControls";
import styles from "@/components/tickets/tickets.module.css";

export const metadata = {
  title: "Your boarding pass — Penn State ACM",
  robots: { index: false },
  referrer: "no-referrer",
};
export const dynamic = "force-dynamic";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  const { state, ticket } = await getOwnTicket(ticketId);
  if (!ticket)
    return <TicketEmpty state={state} next={`/tickets/${ticketId}`} />;
  return (
    <TicketBackdrop>
      <h1 className={styles.sceneHeading}>
        {ticket.status === "cancelled"
          ? "Your RSVP has been cancelled."
          : "You’re on the list. Here’s your boarding pass."}
      </h1>
      <BoardingPass ticket={ticket} />
      <TicketControls ticket={ticket} />
    </TicketBackdrop>
  );
}
