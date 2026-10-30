import { z } from "zod";
import { EVENT_CATEGORIES } from "../events";

export const uuidSchema = z.string().uuid();
export const eventSchema = z.object({
  id: uuidSchema,
  title: z.string().min(1),
  starts_at: z.string().datetime({ offset: true }),
  ends_at: z.string().datetime({ offset: true }).nullable(),
  location: z.string().nullable(),
  category: z.enum(EVENT_CATEGORIES).nullable(),
  committee_id: z.string().nullable(),
  description: z.string().nullable(),
  rsvp_enabled: z.boolean(),
  rsvp_closes_at: z.string().datetime({ offset: true }).nullable(),
  capacity: z.number().int().positive().nullable(),
});
export type TicketEvent = z.infer<typeof eventSchema>;
export const registrationSchema = z.object({
  id: uuidSchema,
  event_id: uuidSchema,
  ticket_number: z.number().int().positive().safe(),
  status: z.enum(["confirmed", "cancelled"]),
  issued_at: z.string().datetime({ offset: true }),
});
export type Registration = z.infer<typeof registrationSchema>;
export type TicketMember = {
  fullName: string | null;
  role: "Officer" | "Member";
  membershipNumber: number;
  graduationYear: number | null;
  committees: string[];
};
export type MemberTicket = Registration & {
  event: TicketEvent;
  member: TicketMember;
};
export type TicketState =
  | "ready"
  | "unconfigured"
  | "unauthenticated"
  | "member-not-found"
  | "invalid-ticket"
  | "unavailable";
export type TicketResult = { state: TicketState; ticket: MemberTicket | null };
export const ticketSummarySchema = registrationSchema
  .pick({ id: true, event_id: true, ticket_number: true, status: true })
  .extend({
    event: eventSchema.pick({
      title: true,
      starts_at: true,
      ends_at: true,
      location: true,
      category: true,
      committee_id: true,
    }),
  });
export type TicketSummary = z.infer<typeof ticketSummarySchema>;
export type TicketActionState = { error?: string; message?: string };

export function registrationOpen(event: TicketEvent, now: number) {
  return (
    event.rsvp_enabled &&
    now < Date.parse(event.rsvp_closes_at ?? event.starts_at)
  );
}
export function ticketStatus(
  ticket: Pick<MemberTicket, "status" | "event">,
  now: number,
) {
  if (ticket.status === "cancelled") return "Cancelled";
  if (now >= Date.parse(ticket.event.ends_at ?? ticket.event.starts_at))
    return "Past event";
  return "Confirmed";
}

export function ticketError(code?: string, message?: string) {
  if (code === "PT401") return "Sign in to continue with your ticket.";
  if (code === "PT404")
    return "We couldn’t find that event, ticket, or membership profile.";
  if (code === "PT410") return "This ticket has expired.";
  // Only known database messages may be shown; never surface arbitrary errors.
  if (code === "PT409") {
    const safe = [
      "Registration is closed",
      "This event is full",
      "This ticket can no longer be cancelled",
    ];
    return safe.includes(message ?? "")
      ? `${message}.`
      : "This ticket cannot be changed right now. Refresh and try again.";
  }
  return "The ticket service is unavailable. Please try again; repeated RSVPs will not create duplicate tickets.";
}
