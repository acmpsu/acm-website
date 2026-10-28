import {
  createEventSchema, listEventsSchema, normalizeEvent, parseEvents, IntegrationError,
  type EventRecord,
} from "./contracts";
import { easternWallTimeToIso } from "../eastern";

export type Rpc = (name: string, args: Record<string, unknown>) => Promise<{
  data: unknown; error: { code?: string } | null;
}>;
export type CreateEventResponse = { event: EventRecord; created: boolean };

export function createEventBackend(rpc: Rpc, token: string) {
  async function call(name: string, args: Record<string, unknown> = {}) {
    try {
      const { data, error } = await rpc(name, { p_token: token, ...args });
      if (error) {
        if (error.code === "PT401") throw new IntegrationError("UNAUTHORIZED", "This agent token is invalid, expired, revoked, or no longer belongs to an officer.");
        if (error.code === "PT400") throw new IntegrationError("INVALID_INPUT", "Check the event fields and date range.");
        if (error.code === "PT409") throw new IntegrationError("CONFLICT", "The request ID or check-in code is already in use. Retry an unchanged event with its original request ID.");
        if (error.code === "57014") throw new IntegrationError("TIMEOUT", "The calendar request timed out. Retry with the same request ID.");
        // Deliberately exclude payloads, tokens, identities and database messages.
        console.warn("Calendar MCP database failure", { operation: name });
        throw new IntegrationError("UNAVAILABLE", "The calendar is unavailable. Try again later with the same request ID.");
      }
      return data;
    } catch (error) {
      if (error instanceof IntegrationError) throw error;
      if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
        throw new IntegrationError("TIMEOUT", "The calendar request timed out. Retry with the same request ID.");
      }
      console.warn("Calendar MCP connection failure", { operation: name });
      throw new IntegrationError("UNAVAILABLE", "The calendar is unavailable. Try again later with the same request ID.");
    }
  }

  return {
    async authenticate() {
      if (await call("verify_agent_token") !== true) {
        throw new IntegrationError("INVALID_RESPONSE", "Unable to verify agent access. Try again later.");
      }
    },
    async listEvents(input: unknown): Promise<EventRecord[]> {
      const parsed = listEventsSchema.safeParse(input);
      if (!parsed.success) throw new IntegrationError("INVALID_INPUT", "Provide from and through dates as YYYY-MM-DD.");
      const { from, through } = parsed.data;
      const start = easternWallTimeToIso(from, "00:00");
      const end = easternWallTimeToIso(through, "00:00");
      const calendarDaysApart = (Date.parse(`${through}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400000;
      if (!start || !end || calendarDaysApart < 0 || calendarDaysApart >= 92) {
        throw new IntegrationError("INVALID_INPUT", "Choose a valid date range of at most 92 days.");
      }
      const nextDate = new Date(Date.parse(`${through}T00:00:00Z`) + 86400000).toISOString().slice(0, 10);
      const until = easternWallTimeToIso(nextDate, "00:00");
      return parseEvents(await call("agent_list_events", { p_from: start, p_until: until }));
    },
    async createEvent(input: unknown): Promise<CreateEventResponse> {
      const parsed = createEventSchema.safeParse(input);
      if (!parsed.success) throw new IntegrationError("INVALID_INPUT", "Check the title, dates, category, committee, check-in code and request UUID.");
      const data = await call("agent_create_event", { p_event: normalizeEvent(parsed.data) });
      if (!data || typeof data !== "object" || !("created" in data) || typeof data.created !== "boolean" || !("event" in data)) {
        throw new IntegrationError("INVALID_RESPONSE", "The calendar returned an unexpected response. Retry with the same request ID.");
      }
      return { event: parseEvents([data.event])[0], created: data.created };
    },
  };
}

export type EventBackend = ReturnType<typeof createEventBackend>;
