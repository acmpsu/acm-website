import type { TicketState, TicketSummary } from "./contracts";
import { ticketNumber } from "./format";
export const COLLECTION_TABS = [
  "all",
  "upcoming",
  "past",
  "cancelled",
] as const;
export type CollectionTab = (typeof COLLECTION_TABS)[number];
export function ticketBucket(
  ticket: TicketSummary,
  now: number,
): Exclude<CollectionTab, "all"> {
  if (ticket.status === "cancelled") return "cancelled";
  return Date.parse(ticket.event.ends_at ?? ticket.event.starts_at) > now
    ? "upcoming"
    : "past";
}
export function filterTickets(
  tickets: TicketSummary[],
  tab: CollectionTab,
  search: string,
  now: number,
) {
  const query = search.trim().toLowerCase();
  return tickets
    .filter(
      (ticket) =>
        (tab === "all" || ticketBucket(ticket, now) === tab) &&
        [
          ticket.event.title,
          ticket.event.location,
          ticket.event.category,
          ticketNumber(ticket.ticket_number),
        ].some((value) => value?.toLowerCase().includes(query)),
    )
    .sort((a, b) => {
      const order = { upcoming: 0, past: 1, cancelled: 2 };
      const bucketA = ticketBucket(a, now),
        bucketB = ticketBucket(b, now);
      return (
        order[bucketA] - order[bucketB] ||
        (Date.parse(a.event.starts_at) - Date.parse(b.event.starts_at)) *
          (bucketA === "upcoming" ? 1 : -1)
      );
    });
}
export function collectionMode(state: TicketState) {
  return state === "unconfigured" ? "preview" : "account";
}
