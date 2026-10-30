import assert from "node:assert/strict";
import { test } from "node:test";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

import { createMcpHandler } from "../src/lib/mcp/http";
import { IntegrationError } from "../src/lib/mcp/contracts";
import type { EventBackend } from "../src/lib/mcp/backend";

const token = `acm_events_${"a".repeat(64)}`;
const url = "http://localhost:3000/api/mcp";
function backend(overrides: Partial<EventBackend> = {}): EventBackend {
  return {
    authenticate: async () => {},
    listEvents: async () => [],
    createEvent: async () => {
      throw new Error("Unexpected write");
    },
    ...overrides,
  };
}
function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

test("unauthenticated requests and foreign origins never reach the backend", async () => {
  let calls = 0;
  const handle = createMcpHandler({
    configured: true,
    backend: () => {
      calls++;
      return backend();
    },
  });
  const unauthenticated = await handle(request({}, { authorization: "" }));
  assert.equal(unauthenticated.status, 401);
  assert.match(unauthenticated.headers.get("www-authenticate")!, /Bearer/);
  assert.equal(
    (await handle(request({}, { origin: "https://untrusted.example" }))).status,
    403,
  );
  assert.equal(calls, 0);
});

test("unconfigured service, invalid tokens, and database outages return safe failures", async () => {
  const unconfigured = createMcpHandler({
    configured: false,
    backend: () => backend(),
  });
  assert.equal((await unconfigured(request({}))).status, 503);
  for (const [code, status] of [
    ["UNAUTHORIZED", 401],
    ["UNAVAILABLE", 503],
  ] as const) {
    const handle = createMcpHandler({
      configured: true,
      backend: () =>
        backend({
          authenticate: async () => {
            throw new IntegrationError(code, "Please try again.");
          },
        }),
    });
    const response = await handle(request({}));
    assert.equal(response.status, status);
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
});

test("an actual MCP SDK client can initialize, discover tools, list, and create", async () => {
  let authenticated = 0;
  let created = 0;
  let revalidated = 0;
  const handle = createMcpHandler({
    configured: true,
    backend: (credential) => {
      assert.equal(credential, token);
      return backend({
        authenticate: async () => {
          authenticated++;
        },
        createEvent: async () => {
          created++;
          return {
            event: {
              id: "12345678-1234-4234-8234-123456789012",
              title: "Workshop",
              starts_at: "2026-11-10T23:00:00Z",
              ends_at: null,
              location: null,
              category: null,
              committee_id: null,
            },
            created: true,
          };
        },
      });
    },
    onCreated: () => {
      revalidated++;
    },
  });
  const client = new Client({ name: "integration-test", version: "1.0.0" });
  const transport = new StreamableHTTPClientTransport(new URL(url), {
    requestInit: { headers: { authorization: `Bearer ${token}` } },
    fetch: async (input, init) =>
      handle(new Request(input as string | URL, init)),
  });
  try {
    await client.connect(transport);
    assert.deepEqual(
      (await client.listTools()).tools.map((tool) => tool.name).sort(),
      ["create_event", "list_event_options", "list_events"],
    );
    const listed = await client.callTool({
      name: "list_events",
      arguments: { from: "2026-11-10", through: "2026-11-10" },
    });
    assert.equal(listed.isError, undefined);
    assert.match(JSON.stringify(listed.content), /events/);
    const result = await client.callTool({
      name: "create_event",
      arguments: {
        request_id: "12345678-1234-4234-8234-123456789012",
        title: "Workshop",
        date: "2026-11-10",
        start_time: "18:00",
        checkin_code: "WORKSHOP",
      },
    });
    assert.equal(result.isError, undefined);
    assert.equal(created, 1);
    assert.equal(revalidated, 1);
    assert.ok(authenticated >= 4);
  } finally {
    await client.close();
  }
});

test("tool failures are MCP errors, not crashes or internal exception leaks", async () => {
  const handle = createMcpHandler({
    configured: true,
    backend: () =>
      backend({
        listEvents: async () => {
          throw new Error("SECRET internal error");
        },
      }),
  });
  const response = await handle(
    request({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: "list_events",
        arguments: { from: "2026-11-10", through: "2026-11-10" },
      },
    }),
  );
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.result.isError, true);
  assert.equal(JSON.stringify(data).includes("SECRET"), false);
});

test("malformed JSON and oversized requests are rejected by the transport", async () => {
  const handle = createMcpHandler({
    configured: true,
    backend: () => backend(),
  });
  const malformed = new Request(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
    },
    body: "{",
  });
  assert.equal((await handle(malformed)).status, 400);
  assert.equal(
    (await handle(request({ padding: "a".repeat(33000) }))).status,
    413,
  );
});
