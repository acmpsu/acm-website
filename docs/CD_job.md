# CD job

Nothing is deployed by CI today. No hosting target has been chosen yet. This is the
shortlist and the decisions that have to be made first.

## The one rule

A deploy must never start before the checks have passed. With one workflow per check
there is no single job to hang `needs:` off, so there are two ways to get the ordering:

**Trigger on `push: branches: [main]`.** Branch protection already blocked the merge
until every required check passed, so anything reaching `main` is green by
construction. Simplest, and the recommended default. It assumes branch protection is
actually enabled — without it, this guarantees nothing.

**Trigger on `workflow_run`.** A deploy workflow can wait for the check workflows to
complete and read their conclusions. More machinery, and `workflow_run` fires against
the default branch's copy of the workflow, which makes it awkward to iterate on. Worth
it only if preview deploys per pull request are wanted, where there is no merge to
gate on.

## Option A — Vercel via CLI

```yaml
# sketch, not wired up
on:
  push:
    branches: [main]
env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
steps:
  - run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
  - run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
```

Three secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

Add `--prod` on `main`; without it the deploy is a preview URL. Mapping that to
events: a preview per pull request, production only on a push to `main`.

**Why the CLI and not the Vercel Git integration.** The Git integration builds on
every push on its own schedule. It does not know our workflows exist and will not wait
for them, so a pull request can have a live preview while `lint` is still red, and a
merge can reach production before the checks finish. The CLI route gives up the
zero-config convenience and buys the ordering guarantee. If the Git integration is
used instead, it should be limited to previews.

## Option B — Docker image to GHCR

Needs `output: "standalone"` in `next.config.ts`, which Next currently does not set.
Produces a portable image for any container host. More moving parts than Option A and
only worth it if the host is not Vercel.

## Supabase migrations

A separate concern from shipping the frontend, and sequenced before it.

`supabase db push` applies `supabase/migrations/*.sql`, authenticated with
`SUPABASE_ACCESS_TOKEN` plus the project ref. Migrations are not trivially
reversible: a bad one needs a hand-written forward fix, not a rollback. Treat this as
its own job with its own approval, not a step bolted onto the deploy.

The test suite already exercises these migrations against PGlite, so schema
regressions are caught by the `test` workflow before any of this runs.

## Before shipping

- `.nvmrc` pins Node 24 and CI honours it. The deploy host's runtime must match, or
  the artifact is built on a different Node than it runs on.
- `npm audit` reports 13 known vulnerabilities (1 critical, 8 high, 3 moderate, 1
  low). Acceptable for a repo that only runs CI; worth clearing before anything
  serves public traffic.
- Production needs real `NEXT_PUBLIC_SUPABASE_*` values. CI builds without them
  because `src/lib/supabase/env.ts` defaults them to `""` and the app degrades
  through `isSupabaseConfigured`. A deployed site with those blanks is broken, not
  degraded.
