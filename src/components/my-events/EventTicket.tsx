import Image from "next/image";
import Link from "next/link";
import type { TicketSummary } from "@/lib/tickets/contracts";
import { ticketNumber } from "@/lib/tickets/format";
import { ticketBucket } from "@/lib/tickets/collection";
import styles from "./myEvents.module.css";

export function EventTicket({
  ticket,
  preview,
  now,
  featured = false,
}: {
  ticket: TicketSummary;
  preview: boolean;
  now: number;
  featured?: boolean;
}) {
  const date = new Date(ticket.event.starts_at);
  const format = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      ...options,
    }).format(date);
  const bucket = ticketBucket(ticket, now);
  return (
    <Link
      href={
        preview ? `/my-events/preview/${ticket.id}` : `/tickets/${ticket.id}`
      }
      className={`${styles.ticket} ${featured ? styles.featuredTicket : ""} ${bucket === "cancelled" ? styles.cancelled : ""}`}
    >
      <div className={styles.ticketBody}>
        <div className={styles.ticketTop}>
          <span>ACM / PENN STATE</span>
          <span>{ticket.event.category?.toUpperCase() ?? "EVENT"}</span>
        </div>
        <div className={styles.flight}>
          <span>YOU</span>
          <Image
            src="/resources/tickets/airplane.svg"
            width={98}
            height={54}
            alt=""
          />
          <span>ACM</span>
        </div>
        <h3>{ticket.event.title}</h3>
        <div className={styles.details}>
          <span>
            {format({ weekday: "short", month: "short", day: "numeric" })} ·{" "}
            {format({ hour: "numeric", minute: "2-digit" })} ET
          </span>
          <span>{ticket.event.location ?? "Location to come"}</span>
        </div>
        <div className={styles.ticketBottom}>
          <span>{ticketNumber(ticket.ticket_number)}</span>
          <span>View ticket ↗</span>
        </div>
      </div>
      <div className={styles.stub}>
        <span>{format({ month: "short" }).toUpperCase()}</span>
        <strong>{format({ day: "2-digit" })}</strong>
        <span>{format({ year: "numeric" })}</span>
        <span className={styles.stamp}>
          {bucket === "upcoming"
            ? "RSVP’D"
            : bucket === "past"
              ? "PAST EVENT"
              : "CANCELLED"}
        </span>
        <span className={styles.admit}>ADMIT ONE</span>
      </div>
    </Link>
  );
}
