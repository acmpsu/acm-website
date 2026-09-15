import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { EVENT_CATEGORIES, type CalendarEvent, type EventCategory } from "@/lib/events";

const EASTERN = "America/New_York";

type EventRow = {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  category: string | null;
};

function easternDate(iso: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: EASTERN,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

function easternTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: EASTERN,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatTime(startsAt: string, endsAt: string | null) {
  const start = easternTime(startsAt);
  if (!endsAt) return start;
  return `${start} – ${easternTime(endsAt)}`;
}

function parseCategory(value: string | null): EventCategory | null {
  if (value && EVENT_CATEGORIES.includes(value as EventCategory)) return value as EventCategory;
  return null;
}

function toCalendarEvent(row: EventRow): CalendarEvent {
  return {
    id: row.id,
    title: row.title,
    date: easternDate(row.starts_at),
    time: formatTime(row.starts_at, row.ends_at),
    location: row.location?.trim() || "TBA",
    category: parseCategory(row.category),
  };
}

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, title, starts_at, ends_at, location, category")
    .order("starts_at", { ascending: true })
    .returns<EventRow[]>();

  if (error || !data) {
    console.error("Failed to load calendar events", error?.message);
    return [];
  }
  return data.map(toCalendarEvent);
}
