"use client";

import Image from "next/image";
import { useState } from "react";
import { eventLabels, ticketNumber } from "@/lib/tickets/format";
import { ticketStatus, type MemberTicket, type TicketEvent } from "@/lib/tickets/contracts";
import { StampSeal } from "./StampSeal";
import styles from "./tickets.module.css";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className={styles.field}><dt>{label}</dt><dd>{children}</dd></div>;
}

export function BoardingPass({ ticket = null, event = null, onStamp }: { ticket?: MemberTicket | null; event?: TicketEvent | null; onStamp?: () => void }) {
  const data = ticket?.event ?? event;
  const labels = eventLabels(data);
  const [now] = useState(() => Date.now());
  const status = ticket ? ticketStatus(ticket, now) : null;
  return <div className={styles.passWrap}>
    <article className={`${styles.pass} ${ticket ? styles.issuedPass : ""}`} aria-label="Event boarding pass">
      <div className={styles.paperArt} aria-hidden="true" />
      <div className={styles.passMain}>
        <header className={styles.airline}><strong>acm / penn state</strong><span>BOARDING PASS / {labels.term}</span></header>
        <Image src="/resources/tickets/rule.svg" alt="" width={820} height={1} className={styles.rule} />
        <div className={styles.route}>
          <dl><Field label="FROM">YOU</Field></dl>
          <Image src="/resources/tickets/airplane.svg" alt="" width={98} height={54} className={styles.airplane} />
          <dl><Field label="TO">{data?.category?.toUpperCase() ?? "—"}</Field></dl>
          <div className={styles.destination}><p>{data?.title ?? "—"}</p><span>YOUR NEXT STOP</span></div>
        </div>
        <Image src="/resources/tickets/perforation.svg" alt="" width={820} height={1} className={styles.rule} />
        <dl className={styles.eventFields}>
          <Field label="DATE">{labels.date}</Field>
          <Field label="BOARDING TIME">{labels.time}</Field>
          <Field label="GATE / LOCATION">{data?.location ?? "—"}</Field>
        </dl>
        <Image src="/resources/tickets/rule.svg" alt="" width={820} height={1} className={styles.rule} />
        <div className={styles.notes}><span>FLIGHT NOTES</span><p>{data?.description ?? "—"}</p></div>
        {ticket && <dl className={styles.memberFields}>
          <Field label="PASSENGER">{ticket.member.fullName ?? "—"}</Field>
          <Field label="ROLE">{ticket.member.role}</Field>
          <Field label="MEMBERSHIP">{ticketNumber(ticket.member.membershipNumber)}</Field>
          <Field label="COMMITTEES">{ticket.member.committees.join(", ") || "—"}</Field>
          <Field label="CLASS OF">{ticket.member.graduationYear ?? "—"}</Field>
          <Field label="RSVP STATUS">{status}</Field>
        </dl>}
      </div>
      <aside className={styles.stub} aria-label="Event ticket stub">
        <span className={styles.eyebrow}>ADMIT ONE / YOU</span>
        <span className={styles.stubMonth}>{labels.month}</span>
        <span className={styles.stubDay}>{labels.day}</span>
        <span className={styles.eyebrow}>{labels.weekday} · {labels.year}</span>
        {ticket ? <StampSeal label={ticket.status === "cancelled" ? "VOID" : "RSVP"} date={labels.date} /> : null}
        <Image src="/resources/tickets/barcode.png" alt="" width={201} height={52} className={styles.barcode} aria-hidden="true" />
        <span className={styles.eyebrow}>{ticket ? ticketNumber(ticket.ticket_number) : "—"}</span>
      </aside>
      {onStamp && <button type="button" className={styles.stampTarget} onClick={onStamp} aria-label="Stamp the invitation and choose your RSVP" />}
    </article>
    {onStamp && <Image src="/resources/tickets/stamp.svg" alt="" width={254} height={206} className={styles.rubberStamp} />}
  </div>;
}
