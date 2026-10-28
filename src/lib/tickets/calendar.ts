import type { MemberTicket, TicketEvent } from "./contracts";

function utc(value: string) { return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z"); }
function escape(value: string) { return value.replace(/\\/g, "\\\\").replace(/\r\n|\r|\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,"); }
function fold(line: string) {
  const encoder = new TextEncoder();
  const parts: string[] = [];
  let current = "", bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (bytes + size > 75) { parts.push(current); current = " "; bytes = 1; }
    current += char; bytes += size;
  }
  parts.push(current);
  return parts.join("\r\n");
}

export function calendarFile(ticket: Pick<MemberTicket, "event" | "issued_at">) {
  const { event } = ticket;
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Penn State ACM//Event tickets//EN", "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH", "BEGIN:VEVENT", `UID:${event.id}@psuacm.com`, `DTSTAMP:${utc(ticket.issued_at)}`,
    `DTSTART:${utc(event.starts_at)}`, ...(event.ends_at ? [`DTEND:${utc(event.ends_at)}`] : []),
    `SUMMARY:${escape(event.title)}`, ...(event.location ? [`LOCATION:${escape(event.location)}`] : []),
    ...(event.description ? [`DESCRIPTION:${escape(event.description)}`] : []), "END:VEVENT", "END:VCALENDAR", "",
  ].map(fold).join("\r\n");
}

export function googleCalendarUrl(event: TicketEvent) {
  const query = new URLSearchParams({ action: "TEMPLATE", text: event.title,
    dates: `${utc(event.starts_at)}/${utc(event.ends_at ?? event.starts_at)}`, ctz: "America/New_York" });
  if (event.location) query.set("location", event.location);
  if (event.description) query.set("details", event.description);
  return `https://calendar.google.com/calendar/render?${query}`;
}
