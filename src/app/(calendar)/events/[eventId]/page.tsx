import { getTicketEvent, ticketSession } from "@/lib/tickets/server";
import { TicketBackdrop } from "@/components/tickets/TicketBackdrop";
import { TicketEmpty } from "@/components/tickets/TicketEmpty";
import { RsvpExperience } from "@/components/tickets/RsvpExperience";

export const metadata = { title: "Your event invitation — Penn State ACM", robots: { index: false }, referrer: "no-referrer" };
export const dynamic = "force-dynamic";

export default async function EventInvitationPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const [result, session] = await Promise.all([getTicketEvent(eventId), ticketSession()]);
  if (!result.event) return <TicketEmpty state={result.state} next={`/events/${eventId}`} />;
  if (session.state === "unavailable") return <TicketEmpty state="unavailable" next={`/events/${eventId}`} />;
  let existingTicketId: string | null = null;
  if (session.client && session.user) {
    const { data, error } = await session.client.from("event_registrations").select("id").eq("event_id", eventId)
      .eq("profile_id", session.user.id).eq("status", "confirmed").maybeSingle();
    if (error) return <TicketEmpty state="unavailable" next={`/events/${eventId}`} />;
    existingTicketId = data?.id ?? null;
  }
  return <TicketBackdrop><RsvpExperience event={result.event} canRsvp={session.state === "ready"} existingTicketId={existingTicketId} /></TicketBackdrop>;
}
