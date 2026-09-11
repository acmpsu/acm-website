"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Event {
  id: number;
  title: string;
  date: string; // ISO calendar day, e.g. "2026-09-11"
  time: string;
  location: string;
  category: "workshop" | "hackathon" | "social";
}

const events: Event[] = [];

const categoryColors = {
  workshop: { bg: "bg-[#f0f4f8]", text: "text-[var(--navy)]", badge: "bg-[#e0e8f2] text-[var(--navy)]" },
  hackathon: { bg: "bg-[#f0f4f8]", text: "text-[var(--navy)]", badge: "bg-[#e0e8f2] text-[var(--navy)]" },
  social: { bg: "bg-[#f0f4f8]", text: "text-[var(--navy)]", badge: "bg-[#e0e8f2] text-[var(--navy)]" },
};

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
}: {
  year: number;
  month: number;
  day: number;
  dayEvents: Event[];
}) {
  const label = new Date(year, month, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-4">
      <h3 className="text-[14px] font-semibold text-[var(--navy-dk)]">{label}</h3>
      {dayEvents.length === 0 ? (
        <p className="text-[14px] text-[var(--slate)]">No events scheduled for this day</p>
      ) : (
        <div className="space-y-3">
          {dayEvents.map((event) => (
            <div
              key={event.id}
              className={`rounded-lg border border-[var(--border)] p-4 ${categoryColors[event.category].bg}`}
            >
              <div className="mb-2 flex items-start justify-between">
                <h4 className="font-semibold text-[var(--navy-dk)]">{event.title}</h4>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${categoryColors[event.category].badge}`}>
                  {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                </span>
              </div>
              <div className="space-y-1 text-[14px] text-[var(--slate)]">
                <p>⏰ {event.time}</p>
                <p>📍 {event.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Calendar() {
  const [today] = useState(() => new Date());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(
    toIsoDate(today.getFullYear(), today.getMonth(), today.getDate())
  );

  const minIndex = monthIndex(today.getFullYear(), today.getMonth()) - 12;
  const maxIndex = monthIndex(today.getFullYear(), today.getMonth()) + 12;
  const viewIndex = monthIndex(viewYear, viewMonth);
  const canGoPrev = viewIndex > minIndex;
  const canGoNext = viewIndex < maxIndex;

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const monthLength = daysInMonth(viewYear, viewMonth);
  const selected = parseIsoDate(selectedDate);

  const datesWithEvents = useMemo(
    () => new Set(events.map((e) => e.date)),
    []
  );
  const selectedDayEvents = useMemo(
    () => events.filter((e) => e.date === selectedDate),
    [selectedDate]
  );

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
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="rounded-lg border border-[var(--border)] bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-[var(--navy-dk)]">{monthLabel}</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                disabled={!canGoPrev}
                aria-label="Previous month"
                className="rounded-lg border border-[var(--border)] p-1.5 text-[var(--navy-dk)] transition hover:bg-[#f0f4f8] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                disabled={!canGoNext}
                aria-label="Next month"
                className="rounded-lg border border-[var(--border)] p-1.5 text-[var(--navy-dk)] transition hover:bg-[#f0f4f8] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-7 gap-2 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2 text-[12px] font-semibold text-[var(--slate)]">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => {
              if (day === null) {
                return <div key={idx} className="aspect-square" />;
              }

              const iso = toIsoDate(viewYear, viewMonth, day);
              const hasEvent = datesWithEvents.has(iso);
              const isSelected = iso === selectedDate;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(iso)}
                  className={`relative aspect-square rounded-lg border py-2 text-[13px] font-medium transition-all ${
                    isSelected
                      ? "border-[var(--navy)] bg-[#f0f4f8] text-[var(--navy-dk)]"
                      : hasEvent
                        ? "border-[var(--border)] bg-white text-[var(--navy-dk)] hover:bg-[#f0f4f8]"
                        : "border-[var(--border)] bg-white text-[var(--slate)] hover:bg-[var(--bg-alt)]"
                  }`}
                >
                  {day}
                  {hasEvent && (
                    <div className={`absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${isSelected ? "bg-[var(--navy)]" : "bg-[var(--navy-lt)]"}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] p-6">
        <EventDayView year={selected.year} month={selected.month} day={selected.day} dayEvents={selectedDayEvents} />
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <main className="border-b border-[var(--border)] bg-white">
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto flex w-full max-w-[1160px] flex-col px-8 py-[72px]">
          <h1 className="mb-3 text-[clamp(28px,3vw,42px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[var(--navy-dk)]">
            Upcoming Events
          </h1>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--navy)]">
            Join Us
          </p>
          <p className="max-w-3xl text-[15px] leading-[1.75] text-[var(--slate)]">
            Join us for workshops, hackathons, and networking events. Click on any date to see what's happening that day
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto flex w-full max-w-[1160px] flex-col px-8 py-[72px]">
          <Calendar />
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--bg-alt)]">
        <div className="mx-auto flex w-full max-w-[1160px] flex-col px-8 py-[72px] text-center">
          <h2 className="mb-3 text-[clamp(24px,2vw,32px)] font-extrabold leading-[1.1] text-[var(--navy-dk)]">
            Want to host an event?
          </h2>
          <p className="mb-6 max-w-2xl mx-auto text-[15px] leading-[1.75] text-[var(--slate)]">
            If you have an idea for an event, we'd love to hear it
          </p>
          <div className="flex justify-center">
            <Link
              href="/#contact"
              className="inline-block rounded-md bg-[var(--navy)] px-[18px] py-[7px] text-[13px] font-semibold text-white transition hover:bg-[var(--navy-dk)]"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
