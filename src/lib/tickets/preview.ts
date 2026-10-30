import type { MemberTicket, TicketSummary } from "./contracts";
const templates = [
  ["General body meeting", 8, "gbm", "Westgate E203"],
  ["Build something together", 15, "workshop", "Westgate E202"],
  ["Good company, great games", 22, "social", "HUB-Robeson Center"],
  ["Your first pull request", -6, "workshop", "Westgate E202"],
  ["An evening with ACM", -14, "social", "HUB-Robeson Center"],
  ["New semester, new start", -28, "gbm", "Westgate E203"],
  ["An introduction to AI", -20, "workshop", "Westgate E203"],
] as const;
// UI-only examples. Never seeded, saved, or returned for a configured account.
export function previewCollection(now = Date.now()) {
  const tickets: MemberTicket[] = templates.map(
    ([title, offset, category, location], index) => {
      const starts = new Date(now);
      starts.setUTCDate(starts.getUTCDate() + offset);
      starts.setUTCHours(23, 0, 0, 0);
      return {
        id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
        event_id: `00000000-0000-4000-8000-${String(index + 8001).padStart(12, "0")}`,
        ticket_number: 26 + index,
        status: index === 6 ? "cancelled" : "confirmed",
        issued_at: new Date(starts.getTime() - 3 * 86400000).toISOString(),
        event: {
          id: `00000000-0000-4000-8000-${String(index + 8001).padStart(12, "0")}`,
          title,
          category,
          location,
          starts_at: starts.toISOString(),
          ends_at: new Date(starts.getTime() + 3600000).toISOString(),
          committee_id: null,
          description:
            "A little curiosity. Good company. Your next ACM memory. This is a sample event for the ticket collection preview.",
          rsvp_enabled: false,
          rsvp_closes_at: null,
          capacity: null,
        },
        member: {
          fullName: null,
          role: "Member",
          membershipNumber: 1,
          graduationYear: null,
          committees: [],
        },
      };
    },
  );
  const summaries: TicketSummary[] = tickets.map(
    ({ id, event_id, ticket_number, status, event }) => ({
      id,
      event_id,
      ticket_number,
      status,
      event,
    }),
  );
  return { tickets, summaries, now };
}
