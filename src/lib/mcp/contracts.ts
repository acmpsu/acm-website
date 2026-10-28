import { z } from "zod";

import { COMMITTEES } from "../constants";
import { easternWallTimeToIso } from "../eastern";
import { EVENT_CATEGORIES } from "../events";

export const createEventSchema = z.object({
  request_id: z.string().uuid().describe("A new UUID per event. Reuse it when retrying the same event; never reuse for a different event."),
  title: z.string().trim().min(1).max(160),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Calendar date in America/New_York, YYYY-MM-DD."),
  start_time: z.string().regex(/^\d{2}:\d{2}$/).describe("24-hour Eastern time, HH:MM."),
  end_time: z.string().regex(/^\d{2}:\d{2}$/).optional().describe("Same-day end in Eastern time, after start."),
  location: z.string().trim().min(1).max(240).optional(),
  category: z.enum(EVENT_CATEGORIES).optional(),
  committee_id: z.string().refine((id) => COMMITTEES.some((c) => c.id === id), "Choose a listed committee ID").optional(),
  checkin_code: z.string().trim().min(4).max(64).regex(/^[a-zA-Z0-9-]+$/).describe("Officer-only code, shared at the event. Letters, numbers and hyphens."),
}).strict();

export const listEventsSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  through: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
}).strict();

export type CreateEventRequest = z.infer<typeof createEventSchema>;
export type ListEventsRequest = z.infer<typeof listEventsSchema>;
export type EventRecord = {
  id: string; title: string; starts_at: string; ends_at: string | null;
  location: string | null; category: string | null; committee_id: string | null;
};
export type IntegrationErrorCode = "UNAUTHORIZED" | "INVALID_INPUT" | "CONFLICT" | "TIMEOUT" | "UNAVAILABLE" | "INVALID_RESPONSE";
export class IntegrationError extends Error {
  constructor(public readonly code: IntegrationErrorCode, message: string) { super(message); }
}

export function normalizeEvent(input: CreateEventRequest) {
  const startsAt = easternWallTimeToIso(input.date, input.start_time);
  const endsAt = input.end_time ? easternWallTimeToIso(input.date, input.end_time) : null;
  if (!startsAt || (input.end_time && !endsAt) || (endsAt && endsAt <= startsAt)) {
    throw new IntegrationError("INVALID_INPUT", "Use valid Eastern dates and times, with the end after the start. Daylight-saving gaps are not valid times.");
  }
  return {
    request_id: input.request_id, title: input.title, starts_at: startsAt, ends_at: endsAt,
    location: input.location ?? null, category: input.category ?? null,
    committee_id: input.committee_id ?? null, checkin_code: input.checkin_code,
  };
}

const eventRecordSchema = z.object({
  id: z.string().uuid(), title: z.string(), starts_at: z.string().datetime({ offset: true }),
  ends_at: z.string().datetime({ offset: true }).nullable(), location: z.string().nullable(),
  category: z.enum(EVENT_CATEGORIES).nullable(), committee_id: z.string().nullable(),
});

export function parseEvents(value: unknown): EventRecord[] {
  const parsed = z.array(eventRecordSchema).safeParse(value);
  if (!parsed.success) throw new IntegrationError("INVALID_RESPONSE", "The calendar returned an unexpected response. Try again later.");
  // Zod strips any extra fields, including check-in codes.
  return parsed.data;
}
