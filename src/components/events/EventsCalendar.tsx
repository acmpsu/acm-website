"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import {
  EVENT_CATEGORIES,
  categoryStyles,
  type CalendarEvent,
  type EventCategory,
} from "@/lib/events";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toIsoDate(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function parseIsoDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month: month - 1, day };
}

function monthIndex(year: number, month: number) {
  return year * 12 + month;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function EventDayView({
  year,
  month,
  day,
  dayEvents,
  nextEvent,
  onJump,
}: {
  year: number;
  month: number;
  day: number;
  dayEvents: CalendarEvent[];
  /** The first event after this day, suggested when the day is empty. */
  nextEvent: CalendarEvent | null;
  onJump: (iso: string) => void;
}) {
  const label = new Date(year, month, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-4">
      <p className="font-ds-mono text-[12px] uppercase tracking-[0.18em] text-[var(--slate)]">Your next stop</p>
      <h3 className="text-xl font-semibold text-[var(--navy-dk)]">{label}</h3>
      {dayEvents.length === 0 ? (
        <div className="space-y-12">
          <p className="text-base text-[var(--slate)]">No events scheduled for this day.</p>
          <p className="text-base leading-relaxed text-[var(--slate-lt)]">
            A little room for your next idea.
            {nextEvent ? (
              <>
                <br />
                Try{" "}
                <button
                  type="button"
                  onClick={() => onJump(nextEvent.date)}
                  className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[var(--navy)]"
                >
                  {new Date(`${nextEvent.date}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                </button>{" "}
                for {nextEvent.title}.
              </>
            ) : null}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {dayEvents.map((event) => {
            const styles = event.category ? categoryStyles[event.category] : null;
            return (
              <div
                key={event.id}
                className={`rounded-lg border border-[var(--border)] p-4 ${styles?.bg ?? "bg-[#f0f4f8]"}`}
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h4 className="font-semibold text-[var(--navy-dk)]"><Link href={`/events/${event.id}`} className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[var(--navy)]">{event.title}</Link></h4>
                  {styles && (
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles.badge}`}>
                      {styles.label}
                    </span>
                  )}
                </div>
                <div className="space-y-1 text-[14px] text-[var(--slate)]">
                  <p>⏰ {event.time}</p>
                  <p>📍 {event.location}</p>
                  <Link href={`/events/${event.id}`} className="inline-flex min-h-11 items-center font-semibold text-[var(--navy)] underline">View invitation &amp; RSVP →</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function EventsCalendar({ events }: { events: CalendarEvent[] }) {
  const [today] = useState(() => new Date());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const todayIso = toIsoDate(today.getFullYear(), today.getMonth(), today.getDate());
  const [selectedDate, setSelectedDate] = useState(todayIso);
  const [filter, setFilter] = useState<EventCategory | "all">("all");
  const visible = useMemo(
    () => (filter === "all" ? events : events.filter((event) => event.category === filter)),
    [events, filter]
  );

  const minIndex = monthIndex(today.getFullYear(), today.getMonth()) - 12;
  const maxIndex = monthIndex(today.getFullYear(), today.getMonth()) + 12;
  const viewIndex = monthIndex(viewYear, viewMonth);
  const canGoPrev = viewIndex > minIndex;
  const canGoNext = viewIndex < maxIndex;

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const monthLength = daysInMonth(viewYear, viewMonth);
  const selected = parseIsoDate(selectedDate);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of visible) map.set(event.date, [...(map.get(event.date) ?? []), event]);
    return map;
  }, [visible]);

  const selectedDayEvents = eventsByDate.get(selectedDate) ?? [];
  const nextEvent = useMemo(
    () => [...visible].filter((e) => e.date > selectedDate).sort((a, b) => a.date.localeCompare(b.date))[0] ?? null,
    [visible, selectedDate]
  );

  function jumpTo(iso: string) {
    const { year, month } = parseIsoDate(iso);
    setViewYear(year);
    setViewMonth(month);
    setSelectedDate(iso);
  }

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= monthLength; i++) {
    days.push(i);
  }

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  function shiftMonth(delta: number) {
    const next = new Date(viewYear, viewMonth + delta, 1);
    const nextIndex = monthIndex(next.getFullYear(), next.getMonth());
    if (nextIndex < minIndex || nextIndex > maxIndex) return;

    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  return (
    <div className="grid gap-6 font-body lg:grid-cols-3 lg:gap-[var(--events-calendar-gap)]">
      <div className="lg:col-span-2">
        <div className="rounded-xl border border-[var(--border)] bg-white p-4 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--navy-dk)] sm:text-2xl">{monthLabel}</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                disabled={!canGoPrev}
                aria-label="Previous month"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--navy-dk)] transition hover:bg-[var(--bg-alt)] focus-visible:outline-2 focus-visible:outline-[var(--navy)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => jumpTo(todayIso)}
                className="flex h-11 items-center justify-center rounded-xl border border-[var(--border)] px-4 text-sm font-medium text-[var(--navy-dk)] transition hover:bg-[var(--bg-alt)] focus-visible:outline-2 focus-visible:outline-[var(--navy)]"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                disabled={!canGoNext}
                aria-label="Next month"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--navy-dk)] transition hover:bg-[var(--bg-alt)] focus-visible:outline-2 focus-visible:outline-[var(--navy)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-1.5" role="group" aria-label="Filter events by type">
            {(["all", ...EVENT_CATEGORIES] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
                className={`flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm transition focus-visible:outline-2 focus-visible:outline-[var(--navy)] ${
                  filter === value ? "bg-[#eef2f7] font-medium text-[var(--navy-dk)]" : "text-[var(--slate)] hover:bg-[var(--bg-alt)]"
                }`}
              >
                {value !== "all" && <span className={`h-1.5 w-1.5 rounded-full ${categoryStyles[value].dot}`} />}
                {value === "all" ? "All" : categoryStyles[value].label}
              </button>
            ))}
          </div>

          <div className="mb-6 grid grid-cols-7 text-center sm:gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2 text-sm font-semibold text-[var(--slate)]">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 sm:gap-2">
            {days.map((day, idx) => {
              if (day === null) {
                return <div key={idx} />;
              }

              const iso = toIsoDate(viewYear, viewMonth, day);
              const dayEvents = eventsByDate.get(iso) ?? [];
              const hasEvent = dayEvents.length > 0;
              const isSelected = iso === selectedDate;
              const isToday = iso === todayIso;

              return (
                <button
                  key={idx}
                  type="button"
                  aria-pressed={isSelected}
                  aria-current={isToday ? "date" : undefined}
                  aria-label={`${new Date(viewYear, viewMonth, day).toLocaleDateString("en-US", { dateStyle: "full" })}${hasEvent ? `, ${dayEvents.length} event${dayEvents.length > 1 ? "s" : ""}` : ""}`}
                  onClick={() => setSelectedDate(iso)}
                  className={`relative flex min-h-11 flex-col items-stretch rounded-lg border p-1.5 text-left transition focus-visible:outline-2 focus-visible:outline-[var(--navy)] sm:min-h-[92px] sm:p-2 ${
                    isSelected
                      ? "border-[var(--navy)] bg-[#eef2f7]"
                      : "border-[var(--border)] bg-white hover:bg-[var(--bg-alt)]"
                  }`}
                >
                  <span
                    className={`ml-auto grid h-7 min-w-7 place-items-center rounded-full px-1 text-sm ${
                      isToday ? "bg-[var(--navy-dk)] font-semibold text-white" : hasEvent ? "font-medium text-[var(--navy-dk)]" : "text-[var(--slate)]"
                    }`}
                  >
                    {day}
                  </span>
                  {hasEvent && (
                    <span className="mt-auto flex flex-col gap-0.5 overflow-hidden" aria-hidden="true">
                      {dayEvents.slice(0, 2).map((event) => (
                        <span key={event.id} className="flex items-center gap-1 text-[10px] leading-tight text-[var(--navy-dk)]">
                          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${event.category ? categoryStyles[event.category].dot : "bg-[var(--navy-lt)]"}`} />
                          <span className="hidden truncate sm:inline">{event.title}</span>
                        </span>
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-alt)] p-6 sm:p-8">
        <EventDayView
          year={selected.year}
          month={selected.month}
          day={selected.day}
          dayEvents={selectedDayEvents}
          nextEvent={nextEvent}
          onJump={jumpTo}
        />
      </div>
    </div>
  );
}
