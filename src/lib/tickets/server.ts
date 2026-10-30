import "server-only";
import { z } from "zod";
import { createClient } from "../supabase/server";
import { isSupabaseConfigured } from "../supabase/env";
import { COMMITTEES } from "../constants";
import {
  eventSchema,
  registrationSchema,
  ticketSummarySchema,
  uuidSchema,
  type TicketResult,
  type TicketState,
  type TicketSummary,
} from "./contracts";

export const EVENT_FIELDS =
  "id, title, starts_at, ends_at, location, category, committee_id, description, rsvp_enabled, rsvp_closes_at, capacity";
export const REGISTRATION_FIELDS =
  "id, event_id, ticket_number, status, issued_at";

export async function ticketSession() {
  if (!isSupabaseConfigured)
    return { state: "unconfigured" as const, client: null, user: null };
  try {
    const client = await createClient({ timeoutMs: 8000 });
    const {
      data: { user },
      error,
    } = await client.auth.getUser();
    if (!user)
      return {
        state:
          error &&
          error.name !== "AuthSessionMissingError" &&
          error.status !== 401
            ? ("unavailable" as const)
            : ("unauthenticated" as const),
        client,
        user: null,
      };
    return { state: "ready" as const, client, user };
  } catch {
    return { state: "unavailable" as const, client: null, user: null };
  }
}

export async function getTicketEvent(id: string) {
  if (!uuidSchema.safeParse(id).success)
    return { state: "invalid-ticket" as const, event: null };
  if (!isSupabaseConfigured)
    return { state: "unconfigured" as const, event: null };
  try {
    const client = await createClient({ timeoutMs: 8000 });
    const { data, error } = await client
      .from("events")
      .select(EVENT_FIELDS)
      .eq("id", id)
      .maybeSingle();
    if (error) return { state: "unavailable" as const, event: null };
    if (!data) return { state: "invalid-ticket" as const, event: null };
    const parsed = eventSchema.safeParse(data);
    return parsed.success
      ? { state: "ready" as const, event: parsed.data }
      : { state: "unavailable" as const, event: null };
  } catch {
    return { state: "unavailable" as const, event: null };
  }
}

export async function getOwnTicket(id: string): Promise<TicketResult> {
  if (!uuidSchema.safeParse(id).success)
    return { state: "invalid-ticket", ticket: null };
  const session = await ticketSession();
  if (!session.user || !session.client)
    return { state: session.state, ticket: null };
  try {
    const { client, user } = session;
    const [registration, profile, memberships] = await Promise.all([
      client
        .from("event_registrations")
        .select(REGISTRATION_FIELDS)
        .eq("id", id)
        .eq("profile_id", user.id)
        .maybeSingle(),
      client
        .from("profiles")
        .select("full_name, is_officer, membership_number, grad_year")
        .eq("id", user.id)
        .maybeSingle(),
      client
        .from("committee_members")
        .select("committee_id")
        .eq("profile_id", user.id),
    ]);
    if (registration.error || profile.error || memberships.error)
      return { state: "unavailable", ticket: null };
    if (!profile.data) return { state: "member-not-found", ticket: null };
    if (!registration.data) return { state: "invalid-ticket", ticket: null };
    const parsed = registrationSchema.safeParse(registration.data);
    const member = z
      .object({
        full_name: z.string().nullable(),
        is_officer: z.boolean(),
        membership_number: z.number().int().positive().safe(),
        grad_year: z.number().int().nullable(),
      })
      .safeParse(profile.data);
    if (!parsed.success || !member.success)
      return { state: "unavailable", ticket: null };
    const event = await getTicketEvent(parsed.data.event_id);
    if (!event.event) return { state: event.state, ticket: null };
    return {
      state: "ready",
      ticket: {
        ...parsed.data,
        event: event.event,
        member: {
          fullName: member.data.full_name,
          role: member.data.is_officer ? "Officer" : "Member",
          membershipNumber: member.data.membership_number,
          graduationYear: member.data.grad_year,
          committees: (memberships.data ?? []).map(
            (row) =>
              COMMITTEES.find((c) => c.id === row.committee_id)?.shortName ??
              row.committee_id,
          ),
        },
      },
    };
  } catch {
    return { state: "unavailable", ticket: null };
  }
}

export async function listOwnTickets(): Promise<{
  state: TicketState;
  tickets: TicketSummary[];
}> {
  const { state, client, user } = await ticketSession();
  if (!client || !user) return { state, tickets: [] };
  try {
    const { data: profile, error: profileError } = await client
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();
    if (profileError) return { state: "unavailable", tickets: [] };
    if (!profile) return { state: "member-not-found", tickets: [] };
    const tickets: TicketSummary[] = [];
    const pageSize = 500;
    for (let offset = 0; ; offset += pageSize) {
      const { data, error } = await client
        .from("event_registrations")
        .select(
          "id, event_id, ticket_number, status, event:events(title, starts_at, ends_at, location, category, committee_id)",
        )
        .eq("profile_id", user.id)
        .order("issued_at", { ascending: false })
        .order("id")
        .range(offset, offset + pageSize - 1);
      if (error) return { state: "unavailable", tickets: [] };
      const parsed = z.array(ticketSummarySchema).safeParse(data);
      if (!parsed.success) return { state: "unavailable", tickets: [] };
      tickets.push(...parsed.data);
      if (parsed.data.length < pageSize) break;
    }
    return { state: "ready", tickets };
  } catch {
    return { state: "unavailable", tickets: [] };
  }
}
