import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { PGlite } from "@electric-sql/pglite";

const member = "11111111-1111-4111-8111-111111111111";
const other = "22222222-2222-4222-8222-222222222222";
const officer = "33333333-3333-4333-8333-333333333333";
const missing = "44444444-4444-4444-8444-444444444444";

test("event RSVPs and private tickets use the real Postgres lifecycle and policies", async (t) => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth;
      create table auth.users(id uuid primary key, email text, raw_user_meta_data jsonb);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid; $$;
      grant usage on schema public, auth to anon, authenticated;
      alter default privileges in schema public grant all on tables to anon, authenticated;`);
    await db.exec(
      await readFile(
        new URL("../supabase/schema.sql", import.meta.url),
        "utf8",
      ),
    );
    await db.query(
      "insert into auth.users(id,email) values($1,'member@example.test'),($2,'other@example.test'),($3,'officer@example.test')",
      [member, other, officer],
    );
    const migration = await readFile(
      new URL(
        "../supabase/migrations/202610280002_event_tickets.sql",
        import.meta.url,
      ),
      "utf8",
    );
    await db.exec(migration);
    await db.exec(migration);
    await db.query(
      "update public.profiles set full_name='Ticket Owner', is_officer=(id=$1)",
      [officer],
    );

    async function asUser(id: string | null) {
      await db.exec("reset role");
      await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
        id ?? "",
      ]);
      await db.exec("set role authenticated");
    }
    async function event(settings = "", extraParams: unknown[] = []) {
      await db.exec("reset role");
      const result = await db.query<{ id: string }>(
        `insert into public.events(title,starts_at,ends_at,checkin_code ${settings ? "," + settings.split("=")[0] : ""})
        values('Database event',now()+interval '2 days',now()+interval '2 days 1 hour',gen_random_uuid()::text ${settings ? ",$1" : ""}) returning id`,
        extraParams,
      );
      return result.rows[0].id;
    }
    async function rsvp(id: string) {
      return (
        await db.query<{ id: string }>(
          "select public.rsvp_for_event($1) as id",
          [id],
        )
      ).rows[0].id;
    }
    const openEvent = await event();
    let ticketId = "";

    await t.test(
      "migration backfills stable membership identifiers and can run twice",
      async () => {
        const rows = await db.query<{ membership_number: number }>(
          "select membership_number from public.profiles",
        );
        assert.equal(rows.rows.length, 3);
        assert.equal(
          new Set(rows.rows.map((r) => r.membership_number)).size,
          3,
        );
        assert.ok(rows.rows.every((r) => r.membership_number > 0));
      },
    );
    await t.test(
      "anonymous callers cannot read or mutate registrations",
      async () => {
        await db.exec("set role anon");
        await assert.rejects(
          db.exec("select * from public.event_registrations"),
          { code: "42501" },
        );
        await assert.rejects(rsvp(openEvent), { code: "42501" });
        await asUser(null);
        await assert.rejects(rsvp(openEvent), { code: "PT401" });
      },
    );
    await t.test(
      "RSVP uses the authenticated member and returns one ticket on repeated requests",
      async () => {
        await asUser(member);
        const ids = await Promise.all(
          Array.from({ length: 5 }, () => rsvp(openEvent)),
        );
        assert.equal(new Set(ids).size, 1);
        ticketId = ids[0];
        const { rows } = await db.query<{
          profile_id: string;
          status: string;
          ticket_number: number;
        }>(
          "select profile_id,status,ticket_number from public.event_registrations",
        );
        assert.equal(rows.length, 1);
        assert.equal(rows[0].profile_id, member);
        assert.equal(rows[0].status, "confirmed");
        assert.ok(rows[0].ticket_number > 0);
      },
    );
    await t.test(
      "members cannot directly insert, alter, delete tickets, or forge the owner",
      async () => {
        await assert.rejects(
          db.query(
            "insert into public.event_registrations(profile_id,event_id) values($1,$2)",
            [other, openEvent],
          ),
          { code: "42501" },
        );
        await assert.rejects(
          db.query(
            "update public.event_registrations set profile_id=$1 where id=$2",
            [other, ticketId],
          ),
          { code: "42501" },
        );
        await assert.rejects(
          db.query("delete from public.event_registrations where id=$1", [
            ticketId,
          ]),
          { code: "42501" },
        );
        await assert.rejects(
          db.query(
            "update public.profiles set membership_number=default where id=$1",
            [member],
          ),
          { code: "42501" },
        );
      },
    );
    await t.test(
      "other members and officers cannot read or cancel the owner's private ticket",
      async () => {
        for (const id of [other, officer]) {
          await asUser(id);
          const result = await db.query(
            "select * from public.event_registrations where id=$1",
            [ticketId],
          );
          assert.equal(result.rows.length, 0);
          await assert.rejects(
            db.query("select public.cancel_event_rsvp($1)", [ticketId]),
            { code: "PT404" },
          );
        }
      },
    );
    await t.test(
      "cancellation is idempotent and re-RSVP restores the same ticket identity",
      async () => {
        await asUser(member);
        await db.query("select public.cancel_event_rsvp($1)", [ticketId]);
        await db.query("select public.cancel_event_rsvp($1)", [ticketId]);
        assert.equal(
          (
            await db.query<{ status: string }>(
              "select status from public.event_registrations where id=$1",
              [ticketId],
            )
          ).rows[0].status,
          "cancelled",
        );
        assert.equal(await rsvp(openEvent), ticketId);
        assert.equal(
          (
            await db.query<{ status: string }>(
              "select status from public.event_registrations where id=$1",
              [ticketId],
            )
          ).rows[0].status,
          "confirmed",
        );
      },
    );
    await t.test(
      "capacity is enforced, retries do not consume seats, and cancellation frees a seat",
      async () => {
        const limited = await event("capacity=", [1]);
        await asUser(member);
        const first = await rsvp(limited);
        assert.equal(await rsvp(limited), first);
        await asUser(other);
        await assert.rejects(rsvp(limited), {
          code: "PT409",
          message: "This event is full",
        });
        await asUser(member);
        await db.query("select public.cancel_event_rsvp($1)", [first]);
        await asUser(other);
        await rsvp(limited);
        await asUser(member);
        await assert.rejects(rsvp(limited), { code: "PT409" });
      },
    );
    await t.test(
      "disabled, deadline-closed and started events reject new RSVPs",
      async () => {
        const disabled = await event("rsvp_enabled=", [false]);
        const deadline = await event("rsvp_closes_at=", [
          new Date(Date.now() - 60000).toISOString(),
        ]);
        const started = await event();
        await db.query(
          "update public.events set starts_at=now()-interval '1 hour' where id=$1",
          [started],
        );
        await asUser(other);
        for (const id of [disabled, deadline, started])
          await assert.rejects(rsvp(id), {
            code: "PT409",
            message: "Registration is closed",
          });
      },
    );
    await t.test(
      "a confirmed RSVP can be retried after closure but cannot be cancelled after the event starts",
      async () => {
        await db.exec("reset role");
        await db.query(
          "update public.events set starts_at=now()-interval '1 hour' where id=$1",
          [openEvent],
        );
        await asUser(member);
        assert.equal(await rsvp(openEvent), ticketId);
        await assert.rejects(
          db.query("select public.cancel_event_rsvp($1)", [ticketId]),
          { code: "PT409" },
        );
      },
    );
    await t.test(
      "missing profiles and nonexistent events fail without inserting registrations",
      async () => {
        await asUser(missing);
        await assert.rejects(rsvp(openEvent), {
          code: "PT404",
          message: "Membership profile not found",
        });
        await asUser(other);
        await assert.rejects(rsvp(missing), {
          code: "PT404",
          message: "Event not found",
        });
      },
    );
    await t.test(
      "public event metadata is readable but check-in codes and registrations remain private",
      async () => {
        await db.exec("reset role; set role anon");
        assert.ok(
          (
            await db.query(
              "select description,capacity,rsvp_enabled,rsvp_closes_at from public.events",
            )
          ).rows.length > 0,
        );
        await assert.rejects(
          db.exec("select checkin_code from public.events"),
          { code: "42501" },
        );
        await assert.rejects(
          db.exec("select * from public.event_registrations"),
          { code: "42501" },
        );
      },
    );
  } finally {
    await db.close();
  }
});
