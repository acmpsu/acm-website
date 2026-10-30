import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { hashToken } from "../src/lib/mcp/tokens";
import { createEventBackend } from "../src/lib/mcp/backend";
import { createMcpHandler } from "../src/lib/mcp/http";

const officer = "11111111-1111-4111-8111-111111111111";
const member = "22222222-2222-4222-8222-222222222222";
const other = "33333333-3333-4333-8333-333333333333";
const token = `acm_events_${"a".repeat(64)}`;
const otherToken = `acm_events_${"b".repeat(64)}`;
const hash = hashToken(token);
const otherHash = hashToken(otherToken);
const payload = {
  request_id: "44444444-4444-4444-8444-444444444444",
  title: "Agent workshop",
  starts_at: "2026-11-10T23:00:00.000Z",
  ends_at: "2026-11-11T00:00:00.000Z",
  location: "Westgate",
  category: "workshop",
  committee_id: "acm-web",
  checkin_code: "SECRET-CODE",
};

test("actual Postgres policies and RPCs enforce officer-only, scoped, idempotent event creation", async (t) => {
  const db = new PGlite();
  try {
    // Minimal Supabase auth scaffolding. Policies, grants and RPCs below are
    // loaded from the actual application SQL, without mocking database logic.
    await db.exec(`
      create role anon; create role authenticated;
      create schema auth;
      create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb);
      create function auth.uid() returns uuid language sql stable as $$
        select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
      $$;
      grant usage on schema public, auth to anon, authenticated;
      alter default privileges in schema public grant all on tables to anon, authenticated;
    `);
    const schema = await readFile(
      new URL("../supabase/schema.sql", import.meta.url),
      "utf8",
    );
    const migration = await readFile(
      new URL(
        "../supabase/migrations/202610280001_officer_event_mcp.sql",
        import.meta.url,
      ),
      "utf8",
    );
    await db.exec(schema);
    await db.exec(migration);
    await db.exec(migration); // Deployment retries must be harmless.
    await db.exec(
      await readFile(
        new URL(
          "../supabase/migrations/202610290001_committee_roster.sql",
          import.meta.url,
        ),
        "utf8",
      ),
    );
    await db.query(
      "insert into auth.users (id, email) values ($1, 'officer@example.test'), ($2, 'member@example.test'), ($3, 'other@example.test')",
      [officer, member, other],
    );
    await db.query(
      "update public.profiles set is_officer = true where id in ($1, $2)",
      [officer, other],
    );

    async function asUser(id: string) {
      await db.exec("reset role");
      await db.query("select set_config('request.jwt.claim.sub', $1, false)", [
        id,
      ]);
      await db.exec("set role authenticated");
    }
    async function asAgent() {
      await db.exec("reset role; set role anon");
    }
    async function create(data: unknown = payload, credential = token) {
      const result = await db.query<{
        result: { event: Record<string, unknown>; created: boolean };
      }>("select public.agent_create_event($1, $2::jsonb) as result", [
        credential,
        JSON.stringify(data),
      ]);
      return result.rows[0].result;
    }

    await t.test(
      "members cannot promote themselves, issue tokens, or read token hashes",
      async () => {
        await asUser(member);
        await assert.rejects(
          db.query(
            "update public.profiles set is_officer = true where id = $1",
            [member],
          ),
          { code: "42501" },
        );
        await db.query(
          "update public.profiles set full_name = 'Updated member' where id = $1",
          [member],
        );
        await assert.rejects(
          db.query(
            "insert into public.officer_agent_tokens(profile_id, label, token_hash) values ($1, 'forbidden', $2)",
            [member, hash],
          ),
          { code: "42501" },
        );
        await assert.rejects(
          db.query("select token_hash from public.officer_agent_tokens"),
          { code: "42501" },
        );
      },
    );

    await t.test(
      "officers can issue only their own tokens and cannot grant themselves unlimited expiry",
      async () => {
        await asUser(officer);
        await assert.rejects(
          db.query(
            "insert into public.officer_agent_tokens(profile_id, label, token_hash) values ($1, 'wrong owner', $2)",
            [other, hash],
          ),
          { code: "42501" },
        );
        await assert.rejects(
          db.query(
            "insert into public.officer_agent_tokens(profile_id, label, token_hash, expires_at) values ($1, 'never expires', $2, '2099-01-01')",
            [officer, hash],
          ),
          { code: "42501" },
        );
        await db.query(
          "insert into public.officer_agent_tokens(profile_id, label, token_hash) values ($1, 'Codex', $2)",
          [officer, hash],
        );
        await asUser(other);
        await db.query(
          "insert into public.officer_agent_tokens(profile_id, label, token_hash) values ($1, 'Claude', $2)",
          [other, otherHash],
        );
        assert.equal(
          (await db.query("select id from public.officer_agent_tokens")).rows
            .length,
          1,
        );
      },
    );

    await t.test(
      "invalid tokens cannot verify, list events, or create events",
      async () => {
        await asAgent();
        for (const sql of [
          "select public.verify_agent_token('invalid')",
          "select public.agent_list_events('invalid', now(), now() + interval '1 day')",
        ])
          await assert.rejects(db.exec(sql), { code: "PT401" });
        await assert.rejects(create(payload, "invalid"), { code: "PT401" });
        await assert.rejects(create(payload, hash), { code: "PT401" });
        await assert.rejects(
          db.exec("select public.require_agent_token('invalid')"),
          { code: "42501" },
        );
      },
    );

    let eventId: unknown;
    await t.test(
      "valid token publishes an event; identical retries return the same event",
      async () => {
        const first = await create();
        eventId = first.event.id;
        assert.equal(first.created, true);
        assert.equal("checkin_code" in first.event, false);
        const retried = await create();
        assert.equal(retried.created, false);
        assert.equal(retried.event.id, eventId);
        assert.equal(
          (await db.query("select id from public.events")).rows.length,
          1,
        );
        await assert.rejects(create({ ...payload, title: "Different event" }), {
          code: "PT409",
        });
        await assert.rejects(
          create({
            ...payload,
            request_id: "55555555-5555-4555-8555-555555555555",
          }),
          { code: "PT409" },
        );
      },
    );

    await t.test(
      "database rejects invalid input even if the application validator is bypassed",
      async () => {
        for (const data of [
          null,
          {},
          { ...payload, title: " " },
          { ...payload, starts_at: "invalid" },
          { ...payload, category: "unknown" },
          { ...payload, committee_id: "admin" },
          { ...payload, committee_id: "acm-hack" },
          { ...payload, ends_at: "2020-01-01" },
        ]) {
          await assert.rejects(create(data), { code: "PT400" });
        }
      },
    );

    await t.test(
      "list returns only public fields; check-in codes and retry payloads cannot be read directly",
      async () => {
        const listed = await db.query<{ result: unknown[] }>(
          "select public.agent_list_events($1, '2026-11-10', '2026-11-12') as result",
          [token],
        );
        assert.equal(listed.rows[0].result.length, 1);
        assert.equal(
          JSON.stringify(listed.rows).includes("SECRET-CODE"),
          false,
        );
        await assert.rejects(
          db.exec("select checkin_code from public.events"),
          { code: "42501" },
        );
        await assert.rejects(
          db.exec("select * from public.agent_event_requests"),
          { code: "42501" },
        );
        await asUser(member);
        await assert.rejects(
          db.exec("select checkin_code from public.events"),
          { code: "42501" },
        );
        await assert.rejects(
          db.query(
            "insert into public.events(title, starts_at, checkin_code) values ('forbidden', now(), 'FORBIDDEN')",
          ),
          { code: "42501" },
        );
      },
    );

    await t.test(
      "an officer cannot revoke another officer's token",
      async () => {
        await asUser(other);
        const result = await db.query(
          "update public.officer_agent_tokens set revoked_at = now() where profile_id = $1 returning id",
          [officer],
        );
        assert.equal(result.rows.length, 0);
      },
    );

    await t.test(
      "MCP HTTP creation writes an event that the public calendar can read",
      async () => {
        await asAgent();
        let invalidated = false;
        const handle = createMcpHandler({
          configured: true,
          onCreated: () => {
            invalidated = true;
          },
          backend: (credential) =>
            createEventBackend(async (name, args) => {
              const query =
                name === "verify_agent_token"
                  ? {
                      text: "select public.verify_agent_token($1) as data",
                      values: [args.p_token],
                    }
                  : {
                      text: "select public.agent_create_event($1, $2::jsonb) as data",
                      values: [args.p_token, JSON.stringify(args.p_event)],
                    };
              const result = await db.query<{ data: unknown }>(
                query.text,
                query.values,
              );
              return { data: result.rows[0].data, error: null };
            }, credential),
        });
        const response = await handle(
          new Request("http://localhost:3000/api/mcp", {
            method: "POST",
            headers: {
              authorization: `Bearer ${token}`,
              "content-type": "application/json",
              accept: "application/json, text/event-stream",
            },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 1,
              method: "tools/call",
              params: {
                name: "create_event",
                arguments: {
                  request_id: "66666666-6666-4666-8666-666666666666",
                  title: "Public agent event",
                  date: "2026-11-12",
                  start_time: "18:00",
                  checkin_code: "NEW-CODE",
                },
              },
            }),
          }),
        );
        assert.equal(response.status, 200);
        const body = await response.json();
        assert.equal(body.result.isError, undefined);
        assert.equal(invalidated, true);
        const calendar = await db.query(
          "select id, title, starts_at, ends_at, location, category from public.events where title = 'Public agent event'",
        );
        assert.equal(calendar.rows.length, 1);
        assert.equal(JSON.stringify(body).includes("NEW-CODE"), false);
      },
    );

    await t.test(
      "revocation blocks all future requests, including previously successful retries",
      async () => {
        await asUser(officer);
        await db.exec(
          "update public.officer_agent_tokens set revoked_at = now()",
        );
        await asAgent();
        await assert.rejects(create(), { code: "PT401" });
      },
    );

    await t.test(
      "losing officer status invalidates a token without waiting for expiry",
      async () => {
        await db.exec("reset role");
        await db.query(
          "update public.profiles set is_officer = false where id = $1",
          [other],
        );
        await asAgent();
        await assert.rejects(create(payload, otherToken), { code: "PT401" });
      },
    );

    await t.test(
      "expired token fails even if the account remains an officer",
      async () => {
        await db.exec("reset role");
        await db.query(
          "update public.officer_agent_tokens set revoked_at = null, created_at = now() - interval '31 days', expires_at = now() - interval '1 day' where token_hash = $1",
          [hash],
        );
        await asAgent();
        await assert.rejects(create(), { code: "PT401" });
      },
    );
  } finally {
    await db.close();
  }
});
