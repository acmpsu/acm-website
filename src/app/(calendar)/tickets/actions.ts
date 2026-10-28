"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ticketSession } from "@/lib/tickets/server";
import { ticketError, uuidSchema, type TicketActionState } from "@/lib/tickets/contracts";

function refreshTickets() {
  revalidatePath("/my-events"); revalidatePath("/tickets", "layout"); revalidatePath("/dashboard");
  revalidatePath("/events", "layout"); revalidatePath("/");
}

export async function rsvpForEvent(_previous: TicketActionState, form: FormData): Promise<TicketActionState> {
  const eventId = uuidSchema.safeParse(form.get("event_id"));
  if (!eventId.success) return { error: "Choose a valid event before you RSVP." };
  const { client, user } = await ticketSession();
  if (!client || !user) return { error: "Sign in to RSVP for this event." };
  let ticketId: string;
  try {
    const { data, error } = await client.rpc("rsvp_for_event", { p_event_id: eventId.data });
    if (error) return { error: ticketError(error.code, error.message) };
    const parsed = uuidSchema.safeParse(data);
    if (!parsed.success) return { error: "We couldn’t load your ticket. Check My events before retrying." };
    ticketId = parsed.data;
  } catch { return { error: ticketError() }; }
  refreshTickets();
  redirect(`/tickets/${ticketId}`);
}

export async function cancelRsvp(_previous: TicketActionState, form: FormData): Promise<TicketActionState> {
  const id = uuidSchema.safeParse(form.get("ticket_id"));
  if (!id.success) return { error: "Choose a valid ticket." };
  const { client, user } = await ticketSession();
  if (!client || !user) return { error: "Sign in to manage your ticket." };
  try {
    const { data, error } = await client.rpc("cancel_event_rsvp", { p_ticket_id: id.data });
    if (error || data !== true) return { error: ticketError(error?.code, error?.message) };
    refreshTickets();
    return { message: "Your RSVP has been cancelled. You can RSVP again while registration is open." };
  } catch { return { error: ticketError() }; }
}
