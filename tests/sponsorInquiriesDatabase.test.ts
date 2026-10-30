import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { PGlite } from "@electric-sql/pglite";

const member = "11111111-1111-4111-8111-111111111111";
const officer = "33333333-3333-4333-8333-333333333333";

test("sponsor inquiries are insert-only for visitors and readable only by officers", async (t) => {
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
    const migration = await readFile(
      new URL(
        "../supabase/migrations/202610290002_sponsor_inquiries.sql",
        import.meta.url,
      ),
      "utf8",
    );
    await db.exec(migration);
    await db.exec(migration); // Deployment retries must be harmless.
    await db.query(
      "insert into auth.users(id,email) values($1,'member@example.test'),($2,'officer@example.test')",
      [member, officer],
    );
    await db.query("update public.profiles set is_officer = (id = $1)", [
      officer,
    ]);

    async function as(role: "anon" | "authenticated", id = "") {
      await db.exec("reset role");
      await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
        id,
      ]);
      await db.exec(`set role ${role}`);
    }
    const submit = (email: string, message: string) =>
      db.query(
        "insert into public.sponsor_inquiries(email, message) values($1, $2)",
        [email, message],
      );

    await t.test(
      "anonymous visitors can submit but not read inquiries back",
      async () => {
        await as("anon");
        await submit(
          "recruiting@company.example",
          "We'd like to sponsor the spring hackathon.",
        );
        await assert.rejects(
          db.query("select * from public.sponsor_inquiries"),
          { code: "42501" },
        );
      },
    );

    await t.test(
      "visitors cannot set ids or timestamps, or submit malformed inquiries",
      async () => {
        await as("anon");
        await assert.rejects(
          db.query(
            "insert into public.sponsor_inquiries(email, message, created_at) values('a@b.co', 'hi', now() - interval '1 year')",
          ),
          { code: "42501" },
        );
        for (const [email, message] of [
          ["not-an-email", "hi"],
          ["a@b.co", "   "],
          ["a@b.co", "x".repeat(5001)],
        ]) {
          await assert.rejects(submit(email, message), { code: "23514" });
        }
      },
    );

    await t.test(
      "members see nothing; officers see every inquiry",
      async () => {
        await as("authenticated", member);
        assert.equal(
          (await db.query("select * from public.sponsor_inquiries")).rows
            .length,
          0,
        );
        await as("authenticated", officer);
        const rows = (
          await db.query<{ email: string }>(
            "select email from public.sponsor_inquiries",
          )
        ).rows;
        assert.deepEqual(
          rows.map((row) => row.email),
          ["recruiting@company.example"],
        );
      },
    );

    await t.test("nobody can edit or delete an inquiry", async () => {
      await as("authenticated", officer);
      await assert.rejects(
        db.query("update public.sponsor_inquiries set message = 'changed'"),
        { code: "42501" },
      );
      await assert.rejects(db.query("delete from public.sponsor_inquiries"), {
        code: "42501",
      });
    });
  } finally {
    await db.close();
  }
});
