"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
}: {
  year: number;
  month: number;
  day: number;
  dayEvents: CalendarEvent[];
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
          {dayEvents.map((event) => {
            const styles = event.category ? categoryStyles[event.category] : null;
            return (
              <div
                key={event.id}
                className={`rounded-lg border border-[var(--border)] p-4 ${styles?.bg ?? "bg-[#f0f4f8]"}`}
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h4 className="font-semibold text-[var(--navy-dk)]">{event.title}</h4>
                  {styles && (
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles.badge}`}>
                      {styles.label}
                    </span>
                  )}
                </div>
                <div className="space-y-1 text-[14px] text-[var(--slate)]">
                  <p>⏰ {event.time}</p>
                  <p>📍 {event.location}</p>
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

  const categoriesByDate = useMemo(() => {
    const map = new Map<string, EventCategory[]>();
    for (const event of events) {
      const list = map.get(event.date) ?? [];
      if (event.category && !list.includes(event.category)) list.push(event.category);
      map.set(event.date, list);
    }
    return map;
  }, [events]);

  const selectedDayEvents = useMemo(
    () => events.filter((e) => e.date === selectedDate),
    [events, selectedDate]
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

          <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2">
            {EVENT_CATEGORIES.map((category) => (
              <div key={category} className="flex items-center gap-1.5 text-[12px] text-[var(--slate)]">
                <span className={`h-1.5 w-1.5 rounded-full ${categoryStyles[category].dot}`} />
                {categoryStyles[category].label}
              </div>
            ))}
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
              const dayCategories = categoriesByDate.get(iso) ?? [];
              const hasEvent = categoriesByDate.has(iso);
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
                    <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5">
                      {(dayCategories.length > 0 ? dayCategories : [null]).map((category, i) => (
                        <span
                          key={category ?? i}
                          className={`h-1.5 w-1.5 rounded-full ${
                            category ? categoryStyles[category].dot : "bg-[var(--navy-lt)]"
                          }`}
                        />
                      ))}
                    </div>
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
