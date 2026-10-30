<div align="center">

<img src="public/logos/acm.png" alt="ACM Logo" width="180" />

# ACM at Penn State

Student community for computing, collaboration, and growth

<p>
	<a href="https://www.psuacm.com/">Website</a> •
	<a href="https://www.instagram.com/pennstateacm/">Instagram</a> •
	<a href="https://www.linkedin.com/company/acmpsu">LinkedIn</a>
</p>

<p>
	<a href="https://discover.psu.edu/organization/association-for-computing-machinery">Org Page</a> •
	<a href="https://discord.gg/zkqYjGxVsh">Discord</a> •
	<a href="https://groupme.com/join_group/113864937/hfRpqc64">GroupMe</a>
</p>

</div>

## CI

[![Format](https://github.com/acmpsu/acm-website/actions/workflows/format.yml/badge.svg)](https://github.com/acmpsu/acm-website/actions/workflows/format.yml)
[![Lint](https://github.com/acmpsu/acm-website/actions/workflows/lint.yml/badge.svg)](https://github.com/acmpsu/acm-website/actions/workflows/lint.yml)
[![Typecheck](https://github.com/acmpsu/acm-website/actions/workflows/typecheck.yml/badge.svg)](https://github.com/acmpsu/acm-website/actions/workflows/typecheck.yml)
[![Test](https://github.com/acmpsu/acm-website/actions/workflows/test.yml/badge.svg)](https://github.com/acmpsu/acm-website/actions/workflows/test.yml)
[![Build](https://github.com/acmpsu/acm-website/actions/workflows/build.yml/badge.svg)](https://github.com/acmpsu/acm-website/actions/workflows/build.yml)

Run the same five checks CI runs:

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

Node version comes from `.nvmrc`. `npm test` needs no database or secrets — PGlite runs Postgres in-process.

### Workflows

One check per workflow. Each runs on every pull request, on pushes to `main`, and on demand.

- **`format.yml`** — `prettier --check .`. Checks only, never rewrites. No docs-only skip, because Prettier covers Markdown.
- **`lint.yml`** — `eslint --max-warnings=0`.
- **`typecheck.yml`** — `tsc --noEmit`.
- **`test.yml`** — `node --test` over `tests/*.test.ts`.
- **`build.yml`** — `next build`, caching `.next/cache`.
- **`actionlint.yml`** — lints the workflow files and fails if any third-party action is not pinned to a full commit SHA. Only does work when `.github/**` changes.
- **`codeql.yml`** — static analysis of our own source on pull requests, `main`, and weekly. Reports to the Security tab; does not block merges.
- **`security.yml`** — `npm audit` on a daily schedule and on demand. Reports only, never on pull requests.
- **`dependabot.yml`** — weekly dependency and action updates. Minor and patch bumps are grouped into one pull request; majors come separately.

Two composite actions keep the workflows from repeating themselves: `.github/actions/setup` installs Node and dependencies, and `.github/actions/changes` is the single place the docs-only rule is defined.

A docs-only pull request still reports every check as green — each job runs, detects that nothing but documentation changed, skips its steps and says so in the log. A required check that never reports would leave the pull request pending forever, which is why the jobs are never skipped wholesale.

To run one by hand: **Actions → pick the workflow → Run workflow**, or `gh workflow run lint.yml`. A manual run always executes the check, bypassing the docs-only rule. The button only appears once the workflow exists on `main`.

A fuller walkthrough with diagrams lives in [`docs/ci-map.md`](docs/ci-map.md).

### Landing order

Prettier is configured but the repository has not been reformatted yet, so the `format` job fails until it is. Land it in this order:

1. Merge the CI configuration.
2. Run `npm run format` and commit the result on its own, touching nothing else.
3. Add that commit's SHA to `.git-blame-ignore-revs`, then run `git config blame.ignoreRevsFile .git-blame-ignore-revs` locally once.
4. Turn on branch protection.

### Branch protection

GitHub UI settings under **Settings → Branches → `main`**, not files in the repository. Someone has to click them:

- Require a pull request before merging.
- Require status checks to pass, and select all five: **`format`**, **`lint`**, **`typecheck`**, **`test`**, **`build`**. Leave `actionlint`, `codeql` and `audit` unrequired — they report without gating.
- Require branches to be up to date before merging.

Checks only become selectable after they have reported once, so merge this first and let one run finish. Requires admin on the repository. Adding a sixth check later means returning to this screen, which is the cost of one workflow per check instead of a single aggregating gate.
