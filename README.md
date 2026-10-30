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

[![CI](https://github.com/acmpsu/acm-website/actions/workflows/ci.yml/badge.svg)](https://github.com/acmpsu/acm-website/actions/workflows/ci.yml)

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

- **`ci.yml`** — the merge gate. Runs format, lint, typecheck, test and build in parallel on every pull request and on pushes to `main`. Docs-only changes skip everything but format. `ci-ok` aggregates the results and is the only check branch protection should require.
- **`codeql.yml`** — static analysis of our own source on pull requests, `main`, and weekly. Reports to the Security tab; does not block merges.
- **`security.yml`** — `npm audit` on a daily schedule and on demand. Reports only.
- **`dependabot.yml`** — weekly dependency and action updates. Minor and patch bumps are grouped into one pull request; majors come separately.

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
- Require status checks to pass, and select **`ci-ok` only**.
- Require branches to be up to date before merging.
