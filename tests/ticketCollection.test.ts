import assert from "node:assert/strict";
import { test } from "node:test";
import {
  collectionMode,
  filterTickets,
  ticketBucket,
} from "../src/lib/tickets/collection";
import { previewCollection } from "../src/lib/tickets/preview";
import {
  eventSchema,
  registrationSchema,
  ticketSummarySchema,
  type TicketState,
} from "../src/lib/tickets/contracts";
const now = Date.parse("2026-10-28T12:00:00Z");
test("only an unconfigured site shows samples; connected account failures never fall back to samples", () => {
  assert.equal(collectionMode("unconfigured"), "preview");
  for (const state of [
    "ready",
    "unauthenticated",
    "unavailable",
    "member-not-found",
    "invalid-ticket",
  ] as TicketState[])
    assert.equal(collectionMode(state), "account");
});
test("preview uses the live ticket contracts and provides upcoming, past and cancelled records", () => {
  const { tickets, summaries } = previewCollection(now);
  for (const ticket of tickets) {
    assert.ok(eventSchema.safeParse(ticket.event).success);
    assert.ok(registrationSchema.safeParse(ticket).success);
  }
  for (const summary of summaries)
    assert.ok(ticketSummarySchema.safeParse(summary).success);
  assert.equal(filterTickets(summaries, "upcoming", "", now).length, 3);
  assert.equal(filterTickets(summaries, "past", "", now).length, 3);
  assert.equal(filterTickets(summaries, "cancelled", "", now).length, 1);
  assert.deepEqual(
    filterTickets(summaries, "all", "", now).map((t) => ticketBucket(t, now)),
    ["upcoming", "upcoming", "upcoming", "past", "past", "past", "cancelled"],
  );
});
test("search matches title, location, category and ticket number without mutating the collection", () => {
  const { summaries } = previewCollection(now);
  const original = JSON.stringify(summaries);
  assert.equal(
    filterTickets(summaries, "all", "  GENERAL BODY  ", now).length,
    1,
  );
  assert.equal(filterTickets(summaries, "past", "Westgate", now).length, 2);
  assert.equal(filterTickets(summaries, "all", "ACM-000026", now).length, 1);
  assert.equal(
    filterTickets(summaries, "upcoming", "nonexistent", now).length,
    0,
  );
  assert.equal(JSON.stringify(summaries), original);
});
test("ongoing events stay upcoming until the end; cancellation takes precedence", () => {
  const ticket = previewCollection(now).summaries[0];
  ticket.event.starts_at = new Date(now - 1000).toISOString();
  ticket.event.ends_at = new Date(now + 1000).toISOString();
  assert.equal(ticketBucket(ticket, now), "upcoming");
  assert.equal(ticketBucket(ticket, now + 1000), "past");
  ticket.status = "cancelled";
  assert.equal(ticketBucket(ticket, now), "cancelled");
});
