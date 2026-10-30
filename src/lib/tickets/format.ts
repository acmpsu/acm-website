import { EASTERN } from "../eastern";
import type { TicketEvent } from "./contracts";

export function eventLabels(event: TicketEvent | null) {
  if (!event)
    return {
      date: "—",
      time: "—",
      month: "—",
      day: "—",
      year: "—",
      term: "—",
      weekday: "—",
    };
  const format = (
    options: Intl.DateTimeFormatOptions,
    value = event.starts_at,
  ) =>
    new Intl.DateTimeFormat("en-US", { timeZone: EASTERN, ...options }).format(
      new Date(value),
    );
  const month = Number(format({ month: "numeric" }));
  return {
    date: format({ weekday: "short", month: "short", day: "numeric" }),
    time:
      format({ hour: "numeric", minute: "2-digit" }) +
      (event.ends_at
        ? `–${format({ hour: "numeric", minute: "2-digit" }, event.ends_at)}`
        : "") +
      " ET",
    month: format({ month: "long" }),
    day: format({ day: "numeric" }),
    year: format({ year: "numeric" }),
    term: `${month <= 5 ? "Spring" : month <= 7 ? "Summer" : "Fall"} ${format({ year: "numeric" })}`,
    weekday: format({ weekday: "long" }),
  };
}
export function ticketNumber(value: number) {
  return `ACM-${String(value).padStart(6, "0")}`;
}
