"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Event {
  id: number;
  title: string;
  date: number; // Day of month
  time: string;
  location: string;
  category: "workshop" | "hackathon" | "social";
}

const events: Event[] = [
  {
    id: 1,
    title: "Web Development Workshop",
    date: 18,
    time: "6:00 PM – 8:00 PM",
    location: "Innovation Hub, Room 201",
    category: "workshop",
  },
  {
    id: 2,
    title: "AI Challenge 2026",
    date: 25,
    time: "All day",
    location: "Tech Center, Building 5",
    category: "hackathon",
  },
  {
    id: 3,
    title: "Coffee & Code Social",
    date: 20,
    time: "4:00 PM – 6:00 PM",
    location: "Campus Café",
    category: "social",
  },
];

const categoryColors = {
  workshop: { bg: "bg-blue-50", text: "text-blue-700", badge: "bg-blue-100 text-blue-800" },
  hackathon: { bg: "bg-purple-50", text: "text-purple-700", badge: "bg-purple-100 text-purple-800" },
  social: { bg: "bg-green-50", text: "text-green-700", badge: "bg-green-100 text-green-800" },
};

function EventDayView({ date, dayEvents }: { date: number; dayEvents: Event[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">
        April {date}, 2026
      </h3>
      {dayEvents.length === 0 ? (
        <p className="text-slate-600">No events scheduled for this day.</p>
      ) : (
        <div className="space-y-3">
          {dayEvents.map((event) => (
            <div
              key={event.id}
              className={`rounded-lg border border-slate-200 p-4 ${categoryColors[event.category].bg}`}
            >
              <div className="mb-2 flex items-start justify-between">
                <h4 className="font-semibold text-slate-900">{event.title}</h4>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${categoryColors[event.category].badge}`}>
                  {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                </span>
              </div>
              <div className="space-y-1 text-sm text-slate-700">
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
  const [selectedDate, setSelectedDate] = useState<number>(20);
  
  // Get all dates that have events
  const datesWithEvents = useMemo(() => new Set(events.map((e) => e.date)), []);

  // Get events for selected date
  const selectedDayEvents = useMemo(
    () => events.filter((e) => e.date === selectedDate),
    [selectedDate]
  );

  // Calendar grid for April 2026
  const firstDay = 2; // April 1, 2026 is a Tuesday
  const daysInMonth = 30;
  const days = [];

  // Add empty cells for days before the month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add all days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Calendar */}
      <div className="lg:col-span-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-6 text-xl font-bold text-slate-900">April 2026</h2>

          {/* Days of week header */}
          <div className="mb-4 grid grid-cols-7 gap-2 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2 text-sm font-semibold text-slate-600">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => {
              const hasEvent = day && datesWithEvents.has(day);
              const isSelected = day === selectedDate;

              return (
                <button
                  key={idx}
                  onClick={() => day && setSelectedDate(day)}
                  className={`relative aspect-square rounded-lg border-2 py-2 text-sm font-medium transition-all ${
                    day === null
                      ? "cursor-default bg-white"
                      : isSelected
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : hasEvent
                          ? "border-blue-200 bg-white text-slate-900 hover:border-blue-300 hover:bg-blue-50"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {day}
                  {hasEvent && (
                    <div className={`absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${isSelected ? "bg-blue-600" : "bg-blue-400"}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event details panel */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
        <EventDayView date={selectedDate} dayEvents={selectedDayEvents} />
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero section */}
      <section className="border-b border-slate-200 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 sm:text-5xl">
            Upcoming Events
          </h1>
          <p className="max-w-2xl text-lg text-slate-700">
            Join us for workshops, hackathons, and networking events. Click on any date to see what's happening that day.
          </p>
        </div>
      </section>

      {/* Calendar section */}
      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <Calendar />
        </div>
      </section>

      {/* CTA section */}
      <section className="border-t border-slate-200 bg-slate-50 px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 sm:text-3xl">
            Want to host an event?
          </h2>
          <p className="mb-6 text-slate-700">
            If you have an idea for an event, we'd love to hear it!
          </p>
          <Link
            href="/#contact"
            className="inline-flex h-11 items-center rounded-full bg-blue-900 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-950"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  );
}
