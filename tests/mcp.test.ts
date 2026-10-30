import assert from "node:assert/strict";
import { test } from "node:test";

import { createEventBackend, type Rpc } from "../src/lib/mcp/backend";
import {
  createEventSchema,
  IntegrationError,
  normalizeEvent,
  parseEvents,
} from "../src/lib/mcp/contracts";
import { hashToken, issueToken, readBearer } from "../src/lib/mcp/tokens";
import { easternWallTimeToIso } from "../src/lib/eastern";

const input = {
  request_id: "12345678-1234-4234-8234-123456789012",
  title: "ACM workshop",
  date: "2026-11-10",
  start_time: "18:00",
  end_time: "19:00",
  checkin_code: "WORKSHOP-26",
};
const event = {
  id: "12345678-1234-4234-8234-123456789013",
  title: input.title,
  starts_at: "2026-11-10T23:00:00+00:00",
  ends_at: "2026-11-11T00:00:00+00:00",
  location: null,
  category: null,
  committee_id: null,
};

test("tokens contain 256 random bits; only a one-way hash is persisted", () => {
  const first = issueToken();
  assert.match(first, /^acm_events_[a-f0-9]{64}$/);
  assert.notEqual(first, issueToken());
  assert.equal(hashToken(first).length, 64);
  assert.equal(readBearer(`Bearer ${first}`), first);
  for (const value of [null, first, "Bearer invalid", `Bearer ${first} extra`])
    assert.equal(readBearer(value), null);
});

test("strict event validation rejects unexpected fields, blank text, invalid categories and committees", () => {
  assert.equal(createEventSchema.safeParse(input).success, true);
  for (const extra of [
    { title: " " },
    { category: "other" },
    { committee_id: "admin" },
    { profile_id: "other-user" },
    { checkin_code: " " },
    { request_id: "bad" },
  ]) {
    assert.equal(
      createEventSchema.safeParse({ ...input, ...extra }).success,
      false,
    );
  }
});

test("Eastern conversion handles daylight saving and rejects impossible dates/times", () => {
  assert.equal(
    easternWallTimeToIso("2026-11-10", "18:00"),
    "2026-11-10T23:00:00.000Z",
  );
  assert.equal(
    easternWallTimeToIso("2026-07-10", "18:00"),
    "2026-07-10T22:00:00.000Z",
  );
  for (const [date, time] of [
    ["2026-02-30", "18:00"],
    ["2026-13-01", "18:00"],
    ["2026-03-08", "02:30"],
    ["2026-11-10", "24:00"],
  ]) {
    assert.equal(easternWallTimeToIso(date, time), null);
  }
  assert.throws(() => normalizeEvent({ ...input, end_time: "17:00" }), {
    code: "INVALID_INPUT",
  });
});

test("creating an event validates and normalizes its request and strips private response fields", async () => {
  const rpc: Rpc = async (name, args) => {
    assert.equal(name, "agent_create_event");
    assert.equal(args.p_token, "private-token");
    assert.deepEqual(args.p_event, normalizeEvent(input));
    return {
      data: {
        event: { ...event, checkin_code: "SECRET", profile_id: "PRIVATE" },
        created: true,
      },
      error: null,
    };
  };
  const result = await createEventBackend(rpc, "private-token").createEvent(
    input,
  );
  assert.deepEqual(result, { event, created: true });
  assert.equal(JSON.stringify(result).includes("SECRET"), false);
});

test("invalid inputs never call the database", async () => {
  let calls = 0;
  const backend = createEventBackend(async () => {
    calls++;
    return { data: null, error: null };
  }, "hash");
  await assert.rejects(backend.createEvent({ ...input, title: "" }), {
    code: "INVALID_INPUT",
  });
  await assert.rejects(backend.createEvent({ ...input, date: "2026-02-30" }), {
    code: "INVALID_INPUT",
  });
  await assert.rejects(
    backend.listEvents({ from: "2026-01-01", through: "2027-01-01" }),
    { code: "INVALID_INPUT" },
  );
  await assert.rejects(
    backend.listEvents({ from: "2026-02-30", through: "2026-03-01" }),
    { code: "INVALID_INPUT" },
  );
  assert.equal(calls, 0);
});

test("list range is inclusive in Eastern time, with a valid empty result", async () => {
  const backend = createEventBackend(async (name, args) => {
    assert.equal(name, "agent_list_events");
    assert.equal(args.p_from, "2026-11-10T05:00:00.000Z");
    assert.equal(args.p_until, "2026-11-11T05:00:00.000Z");
    return { data: [], error: null };
  }, "hash");
  assert.deepEqual(
    await backend.listEvents({ from: "2026-11-10", through: "2026-11-10" }),
    [],
  );
});

for (const [databaseCode, expected] of [
  ["PT401", "UNAUTHORIZED"],
  ["PT409", "CONFLICT"],
  ["PT400", "INVALID_INPUT"],
  ["57014", "TIMEOUT"],
  ["XX000", "UNAVAILABLE"],
]) {
  test(`database ${databaseCode} is safely mapped to ${expected}`, async () => {
    const backend = createEventBackend(
      async () => ({ data: null, error: { code: databaseCode } }),
      "hash",
    );
    await assert.rejects(backend.createEvent(input), { code: expected });
  });
}

test("unavailable and timed-out services do not leak internal exception details", async () => {
  for (const name of ["Error", "TimeoutError", "AbortError"]) {
    const backend = createEventBackend(async () => {
      const error = new Error("SECRET database details");
      error.name = name;
      throw error;
    }, "hash");
    await assert.rejects(
      backend.authenticate(),
      (error) =>
        error instanceof IntegrationError &&
        error.code === (name === "Error" ? "UNAVAILABLE" : "TIMEOUT") &&
        !error.message.includes("SECRET"),
    );
  }
});

test("malformed responses fail closed", async () => {
  for (const data of [
    null,
    {},
    { event, created: "yes" },
    { event: { id: "bad" }, created: true },
  ]) {
    const backend = createEventBackend(
      async () => ({ data, error: null }),
      "hash",
    );
    await assert.rejects(backend.createEvent(input), {
      code: "INVALID_RESPONSE",
    });
  }
  assert.throws(() => parseEvents([{ ...event, starts_at: "garbage" }]), {
    code: "INVALID_RESPONSE",
  });
  const backend = createEventBackend(
    async () => ({ data: false, error: null }),
    "hash",
  );
  await assert.rejects(backend.authenticate(), { code: "INVALID_RESPONSE" });
});

test("retries preserve the original request ID and expose whether the event was new", async () => {
  const requests: unknown[] = [];
  const backend = createEventBackend(async (_name, args) => {
    requests.push(args.p_event);
    return { data: { event, created: requests.length === 1 }, error: null };
  }, "hash");
  assert.equal((await backend.createEvent(input)).created, true);
  assert.equal((await backend.createEvent(input)).created, false);
  assert.deepEqual(requests[0], requests[1]);
});
