# Event invitations, RSVPs and boarding passes

This implements issue #38 as a playful signup experience based on the Figma GBM
mockups (`503:1720` invitation, `503:2508` RSVP). The calendar’s event links open
an invitation. Stamping it flips to the RSVP choice; it does **not** register the
member. Choosing “Yes, I’ll be there” creates the member’s private boarding pass.
The barcode is original decorative artwork. There are no QR codes, scanners,
attendance writes, or admission checks in this feature.

## Set up Supabase

Run `supabase/schema.sql`, followed by the migrations in filename order:

1. `202610280001_officer_event_mcp.sql` (the calendar/MCP work in PR #41).
2. `202610280002_event_tickets.sql` (this feature).

Use the existing project-local `.env.local` configuration:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

The legacy anon-key variable is also supported. No service-role key is needed.
Restart/rebuild after setting environment variables. Without a configured
database, `/my-events` displays an explicitly labeled static preview collection,
with upcoming, past and cancelled sample tickets. Samples live in
`src/lib/tickets/preview.ts`; they are never written to a database or mixed into
accounts. `/my-events/preview/[previewId]` opens a sample boarding pass without
RSVP or cancellation controls. Preview routes redirect to My events once
Supabase is configured. Individual real invitation/ticket routes retain blank
states when their data is unavailable.

Officers create events from the dashboard, including optional flight notes,
capacity, an Eastern-time RSVP deadline, and an “Allow RSVPs” setting. Existing
and MCP-created events default to enabled RSVPs, unlimited capacity, and a
deadline equal to the event’s start. These defaults are stored in the database.

## Member flow

- `/events`: choose a date, then an event’s invitation/RSVP link.
- `/events/[eventId]`: view the public event invitation and stamp it by tapping
  the ticket or using the keyboard. Sign-in returns to the same event. Confirm
  the RSVP to receive a ticket, or choose “Maybe next time” without any write.
- `/my-events`: search and filter upcoming, past and cancelled tickets owned by
  the signed-in member. RSVP and cancellation actions automatically refresh this
  collection. The dashboard and account menu link here; `/tickets` redirects here.
  Signed-out, empty and failed account loads never display samples.
- `/tickets/[ticketId]`: view your private boarding pass, including its RSVP
  status and member fields. Confirmed tickets can be added to Google Calendar or
  downloaded as `.ics` for Apple Calendar/Outlook. Cancellation asks for a second
  confirmation and is allowed before the event starts. A cancelled ticket can be
  reactivated while registration remains open and capacity is available.
- `/tickets/[ticketId]/calendar.ics`: authenticated, owner-only download. A
  cancelled ticket returns 410; another member’s ticket returns 404. The file
  contains only public event data, with UTC times, escaped text and UTF-8 line
  folding following [RFC 5545](https://www.rfc-editor.org/rfc/rfc5545).

Past events remain visible as keepsakes with a “Past event” label. Adding an
event to an external calendar is separate from RSVPing; cancellation in this
website does not edit an external calendar entry.

## Data contract

| Source | Ticket fields |
| --- | --- |
| `events` | Title, description/flight notes, start/end, location, category, committee ID, RSVP enabled flag, capacity, deadline. Eastern dates/times, month/day/year and semester label derive from the event date. |
| `profiles` | Full name, officer/member role, generated membership number, graduation year. |
| `committee_members` | The member’s joined committees, displayed using existing committee labels. |
| `event_registrations` | Opaque ticket UUID, generated ticket number, profile/event foreign keys, confirmed/cancelled status, issue/cancellation dates. |

TypeScript contracts and response validation live in `src/lib/tickets/`. Missing
optional values display as an em dash. UI components accept the same typed model for static previews and live records.
Live ticket content comes from account-owned database records. Preview fixtures
are isolated from server queries and clearly labeled; no real person is impersonated.

## Authorization and consistency

The server validates Supabase sessions with `auth.getUser()` and derives the
member identity from that session. Ticket queries also filter explicitly by that
identity. RLS allows only the ticket owner to read a registration, including when
the requester is an officer. There is no public listing of event attendees.

Authenticated clients have no direct insert/update/delete grants on registrations.
`rsvp_for_event(event_id)` and `cancel_event_rsvp(ticket_id)` enforce ownership
inside Postgres with a restricted search path. They do not accept a member ID.
The generated membership number is not a self-editable profile field.

A unique member/event constraint and event-row locking make RSVP retries
idempotent and capacity checks atomic. Repeated confirmations return the same
ticket. Cancellation and re-RSVP retain its UUID and ticket number. Existing
confirmed RSVPs can still be retrieved by retry after registration closes. The
same event-first locking order is used for cancellation to avoid lock inversion.

Database operations have eight-second network timeouts. An interrupted response
can follow a committed RSVP, so members can check My events and safely retry.
Errors expose only allowlisted messages. Private pages are dynamic and prevent
indexing/referrer forwarding; calendar downloads use `private, no-store`.

## UI and validation

The desktop pass uses the original Figma paper silhouette, airplane, rubber
stamp, ring graphics and decorative barcode. The blurred meadow and blue veil
follow the supplied mockup. The existing shared site header/footer are retained.
On mobile the ticket stacks and uses native circular cutouts instead of
stretching the desktop silhouette. Stamp transitions respect reduced motion;
the full ticket is a keyboard-operable stamp button. Pending form buttons disable
to prevent repeated submissions. Initial, loading, empty, signed-out,
member-not-found, invalid ticket, success, cancelled and service-error states are
implemented.

Run `npm test`, `npm run lint`, and `npm run build`. Tests cover real Postgres RLS
and lifecycle rules, idempotency, capacity, deadlines, cancellation/re-RSVP,
private ticket access, malformed responses, safe redirects, and calendar output.
An isolated project-local browser harness additionally exercised the actual
pages/server actions against an in-memory database and test auth endpoint at
320–2560px. Those fixtures and browser/tool binaries are outside production code
and excluded from Git. No live Supabase project is required for these checks;
production login and writes require the configuration above.
