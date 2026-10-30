"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, Ticket } from "lucide-react";
import {
  COLLECTION_TABS,
  filterTickets,
  ticketBucket,
  type CollectionTab,
} from "@/lib/tickets/collection";
import type { TicketState, TicketSummary } from "@/lib/tickets/contracts";
import { EventTicket } from "./EventTicket";
import styles from "./myEvents.module.css";

export function MyEventsCollection({
  tickets,
  preview,
  now,
  state,
}: {
  tickets: TicketSummary[];
  preview: boolean;
  now: number;
  state: TicketState;
}) {
  const [tab, setTab] = useState<CollectionTab>("all");
  const [search, setSearch] = useState("");
  const filtered = filterTickets(tickets, tab, search, now);
  const upcoming = tickets.filter(
    (t) => ticketBucket(t, now) === "upcoming",
  ).length;
  const past = tickets.filter((t) => ticketBucket(t, now) === "past").length;
  const groups = [
    {
      bucket: "upcoming",
      title: "Your next stops",
      note: "A seat saved. Something to look forward to.",
    },
    {
      bucket: "past",
      title: "The memory collection",
      note: "Good times deserve a place to stay.",
    },
    {
      bucket: "cancelled",
      title: "Changed plans",
      note: "There’s always another next stop.",
    },
  ] as const;
  return (
    <div className={styles.content}>
      <div className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>
            YOUR ACM JOURNEY / ONE TICKET AT A TIME
          </p>
          <h1>
            My <em>events.</em>
          </h1>
          <p className={styles.subtitle}>
            The plans you’re making. The memories you’re keeping.
            <br />
            All your ACM tickets, in one little collection.
          </p>
        </div>
        <Link href="/events" className={styles.explore}>
          Explore events <ArrowUpRight size={20} />
        </Link>
      </div>
      {preview && (
        <p className={styles.previewNotice}>
          <span>PREVIEW COLLECTION</span> Sample tickets to try out the
          experience. Your own RSVPs will appear here once accounts are
          connected.
        </p>
      )}
      <div className={styles.summary}>
        <span>
          <strong>{String(upcoming).padStart(2, "0")}</strong> upcoming plans
        </span>
        <span>
          <strong>{String(past).padStart(2, "0")}</strong> past events
        </span>
        <span className={styles.summaryNote}>
          <Ticket size={20} /> A little proof you were part of it.
        </span>
      </div>
      <div className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label="Filter events">
          {COLLECTION_TABS.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={tab === value}
              onClick={() => setTab(value)}
            >
              {value === "all"
                ? "All events"
                : value.charAt(0).toUpperCase() + value.slice(1)}
              <span>
                {value === "all"
                  ? tickets.length
                  : tickets.filter((t) => ticketBucket(t, now) === value)
                      .length}
              </span>
            </button>
          ))}
        </div>
        <label className={styles.search}>
          <Search size={18} />
          <span className="sr-only">Search your events</span>
          <input
            type="search"
            placeholder="Find a memory…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>
      <p className="sr-only" role="status">
        {filtered.length} {filtered.length === 1 ? "event" : "events"} shown
      </p>
      {groups.map(({ bucket, title, note }) => {
        const items = filtered.filter((t) => ticketBucket(t, now) === bucket);
        if (!items.length) return null;
        return (
          <section
            key={bucket}
            className={styles.group}
            aria-labelledby={`heading-${bucket}`}
          >
            <div className={styles.sectionHeading}>
              <h2 id={`heading-${bucket}`}>
                {title}
                <span> / {String(items.length).padStart(2, "0")}</span>
              </h2>
              <p>{note}</p>
            </div>
            <div className={styles.grid}>
              {items.map((ticket, index) => (
                <EventTicket
                  key={ticket.id}
                  ticket={ticket}
                  preview={preview}
                  now={now}
                  featured={bucket === "upcoming" && index === 0}
                />
              ))}
            </div>
          </section>
        );
      })}
      {!filtered.length && (
        <div className={styles.empty}>
          <Ticket size={36} aria-hidden="true" />
          <h2>
            {state === "unauthenticated"
              ? "Your collection is waiting."
              : state === "unavailable"
                ? "Let’s try that again."
                : tickets.length
                  ? "No matching tickets."
                  : "Every story starts somewhere."}
          </h2>
          <p>
            {state === "unauthenticated"
              ? "Sign in to see the events you’ve RSVPed for."
              : state === "unavailable"
                ? "We couldn’t load your events. Refresh the page to try again."
                : state === "member-not-found"
                  ? "Complete your membership profile to start collecting tickets."
                  : tickets.length
                    ? "Try another search or explore a different filter."
                    : "RSVP for your first event, and your ticket will find a home here."}
          </p>
          {state === "unauthenticated" ? (
            <Link className={styles.explore} href="/login?next=%2Fmy-events">
              Sign in <ArrowUpRight size={18} />
            </Link>
          ) : tickets.length ? (
            <button
              className={styles.explore}
              onClick={() => {
                setSearch("");
                setTab("all");
              }}
            >
              Reset filters
            </button>
          ) : (
            <Link className={styles.explore} href="/events">
              Explore events <ArrowUpRight size={18} />
            </Link>
          )}
        </div>
      )}
      <div className={styles.closing}>
        <span>ACM / PENN STATE</span>
        <p>
          Show up curious.
          <br />
          <em>Leave with a story.</em>
        </p>
        <span>YOUR NEXT CHAPTER IS WAITING ↗</span>
      </div>
    </div>
  );
}
