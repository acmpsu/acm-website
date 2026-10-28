import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";

import { COMMITTEES } from "../constants";
import { EVENT_CATEGORIES } from "../events";
import { createEventSchema, listEventsSchema, IntegrationError } from "./contracts";
import type { EventBackend } from "./backend";
import { readBearer } from "./tokens";

function failure(status: number, message: string) {
  return Response.json({ error: message }, {
    status, headers: { "Cache-Control": "no-store", ...(status === 401 ? { "WWW-Authenticate": 'Bearer realm="acm-events"' } : {}) },
  });
}

async function toolResult(operation: () => Promise<unknown>) {
  try {
    const result = await operation();
    return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
  } catch (error) {
    const known = error instanceof IntegrationError;
    if (!known) console.warn("Calendar MCP tool failure");
    return {
      isError: true,
      content: [{ type: "text" as const, text: JSON.stringify({
        code: known ? error.code : "UNAVAILABLE",
        message: known ? error.message : "Unable to complete the calendar request. Retry with the same request ID.",
      }) }],
    };
  }
}

export function createMcpHandler(options: {
  configured: boolean;
  backend: (token: string) => EventBackend;
  onCreated?: () => void;
}) {
  return async function handle(request: Request): Promise<Response> {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) return failure(403, "This origin is not allowed.");
    const token = readBearer(request.headers.get("authorization"));
    if (!token) return failure(401, "Provide an officer agent token from your dashboard.");
    if (!options.configured) return failure(503, "Calendar integration is not configured yet.");

    let server: McpServer | undefined;
    try {
      const backend = options.backend(token);
      await backend.authenticate();
      // Per-request instances: no shared identity or session state between agents.
      server = new McpServer({ name: "penn-state-acm-events", version: "1.0.0" });
      server.registerTool("list_event_options", {
        description: "List the available calendar categories, committee IDs and timezone before creating an event.",
        annotations: { readOnlyHint: true, openWorldHint: false },
      }, () => toolResult(async () => ({
        timezone: "America/New_York", categories: EVENT_CATEGORIES,
        committees: COMMITTEES.map(({ id, shortName }) => ({ id, name: shortName })),
      })));
      server.registerTool("list_events", {
        description: "Read up to 100 events in an inclusive Eastern date range of at most 92 days. Use narrower ranges if 100 are returned. Check-in codes are excluded.",
        inputSchema: listEventsSchema,
        annotations: { readOnlyHint: true, openWorldHint: false },
      }, (input) => toolResult(async () => ({ events: await backend.listEvents(input), limit: 100 })));
      server.registerTool("create_event", {
        description: "Publish an ACM calendar event. Confirm the event details with the officer before calling. Dates and times are Eastern; end time is same-day. Generate a request UUID and reuse it unchanged on retries to avoid duplicates. Does not edit or delete events.",
        inputSchema: createEventSchema,
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      }, (input) => toolResult(async () => {
        const result = await backend.createEvent(input);
        // Revalidate even on a retry: the original write may have succeeded but
        // its response/cache invalidation may have been interrupted.
        options.onCreated?.();
        return result;
      }));
      const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: undefined, enableJsonResponse: true, maxRequestBodySize: 32768,
      });
      await server.connect(transport);
      const response = await transport.handleRequest(request);
      response.headers.set("Cache-Control", "no-store");
      return response;
    } catch (error) {
      if (error instanceof IntegrationError) return failure(error.code === "UNAUTHORIZED" ? 401 : 503, error.message);
      console.warn("Calendar MCP request failure");
      return failure(503, "The calendar integration is temporarily unavailable.");
    } finally {
      await server?.close();
    }
  };
}
