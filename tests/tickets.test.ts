import assert from "node:assert/strict";
import { test } from "node:test";
import { calendarFile, googleCalendarUrl } from "../src/lib/tickets/calendar";
import { eventSchema, registrationOpen, registrationSchema, ticketError, ticketStatus, type TicketEvent } from "../src/lib/tickets/contracts";
import { eventLabels } from "../src/lib/tickets/format";
import { safeNextPath } from "../src/lib/authRedirect";

const event: TicketEvent = {
  id: "11111111-1111-4111-8111-111111111111", title: "Computing workshop",
  starts_at: "2026-11-10T23:00:00Z", ends_at: "2026-11-11T00:00:00Z", location: "Westgate",
  category: "workshop", committee_id: "acm-web", description: "Build something together.",
  rsvp_enabled: true, capacity: null, rsvp_closes_at: null,
};

test("ticket and event models reject malformed database responses", () => {
  assert.equal(eventSchema.safeParse(event).success, true);
  assert.equal(eventSchema.safeParse({ ...event, starts_at: "bad" }).success, false);
  assert.equal(eventSchema.safeParse({ ...event, capacity: -1 }).success, false);
  assert.equal(registrationSchema.safeParse({ id: "other-member", event_id: event.id }).success, false);
});
test("RSVP readiness and ticket status reflect database fields and lifecycle", () => {
  const before = Date.parse(event.starts_at) - 60000;
  assert.equal(registrationOpen(event, before), true);
  assert.equal(registrationOpen({ ...event, rsvp_enabled: false }, before), false);
  assert.equal(registrationOpen(event, Date.parse(event.starts_at)), false);
  assert.equal(registrationOpen({ ...event, rsvp_closes_at: "2026-11-10T22:00:00Z" }, before), false);
  assert.equal(ticketStatus({ event, status: "confirmed" }, before), "Confirmed");
  assert.equal(ticketStatus({ event, status: "cancelled" }, before), "Cancelled");
  assert.equal(ticketStatus({ event, status: "confirmed" }, Date.parse(event.ends_at!) + 1), "Past event");
});
test("blank states contain no invented dates; real ticket times are Eastern", () => {
  assert.ok(Object.values(eventLabels(null)).every((value) => value === "—"));
  assert.equal(eventLabels(event).time, "6:00 PM–7:00 PM ET");
  assert.equal(eventLabels(event).term, "Fall 2026");
});
test("calendar exports use UTC and exclude all member and ticket-identifying data", () => {
  const output = calendarFile({ event, issued_at: "2026-10-28T12:00:00Z" });
  assert.match(output, /DTSTART:20261110T230000Z\r\n/);
  assert.match(output, /DTEND:20261111T000000Z\r\n/);
  assert.match(output, /UID:11111111-1111-4111-8111-111111111111@psuacm.com/);
  for (const forbidden of ["PASSENGER", "profile_id", "membership", "ticket_number"]) assert.equal(output.includes(forbidden), false);
  const link = new URL(googleCalendarUrl(event));
  assert.equal(link.origin, "https://calendar.google.com");
  assert.equal(link.searchParams.get("text"), event.title);
  assert.equal(link.searchParams.get("dates"), "20261110T230000Z/20261111T000000Z");
});
test("calendar files escape injected properties and fold Unicode on UTF-8 boundaries", () => {
  const tricky = { ...event, title: "Title\r\nATTENDEE:secret", description: "text,semi;slash\\" + "☀️".repeat(100) };
  const output = calendarFile({ event: tricky, issued_at: event.starts_at });
  assert.equal(output.includes("\r\nATTENDEE:"), false);
  assert.match(output, /SUMMARY:Title\\nATTENDEE:secret/);
  assert.ok(output.split("\r\n").every((line) => Buffer.byteLength(line) <= 75));
  assert.equal(output.includes("�"), false);
  assert.match(output, /DESCRIPTION:text\\,semi\\;slash\\\\/);
  const noEnd = calendarFile({ event: { ...event, ends_at: null }, issued_at: event.starts_at });
  assert.equal(noEnd.includes("DTEND:"), false);
});
test("ticket errors never expose unexpected database errors", () => {
  assert.equal(ticketError("PT409", "This event is full"), "This event is full.");
  assert.equal(ticketError("XX001", "SECRET server detail").includes("SECRET"), false);
  assert.equal(ticketError("PT409", "SECRET server detail").includes("SECRET"), false);
});
test("login returns to event/ticket paths without allowing external redirects", () => {
  for (const value of ["https://evil.test", "//evil.test", "/\\evil.test", "/\nevil.test"]) assert.equal(safeNextPath(value), "/dashboard");
  assert.equal(safeNextPath("/events/123?from=calendar"), "/events/123?from=calendar");
  assert.equal(safeNextPath("/tickets/123"), "/tickets/123");
});
