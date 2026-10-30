# CI Map

GitHub Actions · `ubuntu-latest` · Node 24 via `.nvmrc`
Required checks: `format` · `lint` · `typecheck` · `test` · `build`
Free on this repo (public = unlimited minutes, CodeQL, Dependabot).

---

## System

```mermaid
flowchart TB
    subgraph GATE["Required checks — one workflow each"]
        direction LR
        FMT["format.yml<br/>prettier --check"]
        LNT["lint.yml<br/>eslint, zero warnings"]
        TYP["typecheck.yml<br/>tsc --noEmit"]
        TST["test.yml<br/>node --test + PGlite"]
        BLD["build.yml<br/>next build"]
    end

    subgraph REPORT["Report only — never gate a merge"]
        direction LR
        ALN["actionlint.yml<br/>lints CI, asserts SHA pins"]
        QL["codeql.yml<br/>javascript-typescript<br/>build-mode none"]
        AUD["security.yml<br/>npm audit, audit-level high"]
    end

    T1["Pull request<br/>opened · updated · reopened"] --> GATE
    T2["Push to main<br/>a merge landed"] --> GATE
    T6["Manual<br/>workflow dispatch"] --> GATE
    T1 --> ALN
    T2 --> ALN
    T1 --> QL
    T2 --> QL
    T4["Cron<br/>weekly"] --> QL
    T5["Cron<br/>daily"] --> AUD
    T6 --> REPORT
    T3["Dependabot<br/>weekly"] -.->|"opens upgrade PR, which re-enters here"| T1

    GATE --> BP["Branch protection<br/>all five must pass"]
    BP -->|"all green"| MERGE["Merge button unlocks"]
    BP -->|"any red"| BLOCK["Merge blocked"]
    QL --> TAB["Security tab<br/>code scanning alerts"]
    AUD --> LOG["Run log + notification<br/>never blocks a PR"]
    ALN --> LOG

    classDef trig fill:#1077b1,stroke:#00243f,stroke-width:2px,color:#ffffff
    classDef chk fill:#80c8fe,stroke:#002052,stroke-width:2px,color:#00243f
    classDef gate fill:#00243f,stroke:#00243f,stroke-width:3px,color:#ffffff
    classDef good fill:#d4f5e0,stroke:#0b6b3a,stroke-width:2px,color:#063d21
    classDef bad fill:#ffd9df,stroke:#9f1239,stroke-width:2px,color:#4c0519
    classDef info fill:#e8f4fa,stroke:#1c4866,stroke-width:1px,color:#1c4866

    class T1,T2,T3,T4,T5,T6 trig
    class FMT,LNT,TYP,TST,BLD,ALN,QL,AUD chk
    class BP gate
    class MERGE good
    class BLOCK bad
    class TAB,LOG info
```

One check per workflow, so each reports its own status. CodeQL reports to the Security
tab, `npm audit` to its run log.

---

## Coverage

```mermaid
flowchart RL
    FMT["format"]
    LNT["lint"]
    TYP["typecheck"]
    TST["test"]
    BLD["build"]
    ALN["actionlint"]
    AUD["security.yml"]
    QL["codeql.yml"]

    B1["Inconsistent formatting<br/>noisy diffs"] --> FMT
    B2["Bad React hook usage"] --> LNT
    B3["Accessibility smell"] --> LNT
    B4["Type error in src"] --> TYP
    B5["Type error inside tests<br/>build will NOT catch this"] --> TYP
    B6["Broken ticket, sponsor<br/>or MCP logic"] --> TST
    B7["Broken RLS policy<br/>in schema.sql"] --> TST
    B8["Missing 'use client'"] --> BLD
    B9["Prerender crash<br/>tsc will NOT catch this"] --> BLD
    B10["Import casing wrong<br/>works on Mac, dies on Linux"] --> BLD
    B13["Route signature break<br/>.next/types exists only after a build<br/>so typecheck stays green"] --> BLD
    B14["Action pinned to a mutable tag"] --> ALN
    B15["Malformed workflow YAML"] --> ALN
    B11["Dependency with a CVE"] --> AUD
    B12["Unsafe pattern in our<br/>own source"] --> QL

    classDef chk fill:#80c8fe,stroke:#002052,stroke-width:2px,color:#00243f
    classDef bug fill:#ffffff,stroke:#1c4866,stroke-width:1px,color:#1c4866
    class FMT,LNT,TYP,TST,BLD,ALN,AUD,QL chk
    class B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11,B12,B13,B14,B15 bug
```

The two "will NOT catch this" labels are why `typecheck` and `build` both exist.

---

## Job anatomy

Every check workflow is one job with the same shape.

```mermaid
flowchart TB
    S["Job starts<br/>ubuntu-latest<br/>timeout-minutes set"] --> C["actions/checkout<br/>pinned to SHA"]
    C --> CHG[".github/actions/changes<br/>composite · skipped on manual dispatch<br/>outputs code and ci"]
    CHG --> Q{"code == true<br/>OR manual dispatch?"}
    Q -->|"no"| SKIP["Steps skipped<br/>job still reports GREEN"]
    Q -->|"yes"| SU[".github/actions/setup<br/>setup-node from .nvmrc · cache npm<br/>npm ci · postinstall runs patch-package"]
    SU --> W["The actual check runs"]
    W --> SUM["Summary step<br/>ALWAYS runs<br/>says ran or why it skipped"]
    SKIP --> SUM

    BC["build.yml only:<br/>actions/cache on .next/cache ONLY<br/>key next-OS-lockfile-hash(src)<br/>caching .next/types would restore<br/>stale route validators"] -.-> W

    classDef step fill:#e8f4fa,stroke:#1c4866,stroke-width:1px,color:#00243f
    classDef hi fill:#80c8fe,stroke:#002052,stroke-width:2px,color:#00243f
    classDef dec fill:#e8f2fa,stroke:#1f6a9b,stroke-width:2px,color:#00243f
    classDef good fill:#d4f5e0,stroke:#0b6b3a,stroke-width:2px,color:#063d21
    classDef note fill:#fff8e1,stroke:#b8860b,stroke-width:1px,color:#3d2c00
    class S,C,SUM step
    class CHG,SU,W hi
    class Q dec
    class SKIP good
    class BC note
```

`npm ci` always reinstalls `node_modules`. The npm cache only skips the download.
`format.yml` has no change detection: Prettier covers Markdown, so it always runs.

---

## Required checks

```mermaid
flowchart LR
    S1["Normal code PR<br/>all five run"] --> G1["GREEN"]
    S2["Docs-only PR<br/>format runs, four skip their steps<br/>but all five still report"] --> G1
    S3["Broken test"] --> G2["RED"]
    S4["Force-push mid-run<br/>stale run cancelled"] --> G2

    classDef sc fill:#ffffff,stroke:#1c4866,stroke-width:1px,color:#1c4866
    classDef good fill:#d4f5e0,stroke:#0b6b3a,stroke-width:2px,color:#063d21
    classDef bad fill:#ffd9df,stroke:#9f1239,stroke-width:2px,color:#4c0519
    class S1,S2,S3,S4 sc
    class G1 good
    class G2 bad
```

A required check that never reports leaves a PR pending forever. That is why no
workflow uses a top-level `paths:` filter and no job is skipped wholesale: the job
always runs and skips its steps instead.

---

## Path filter

```mermaid
flowchart LR
    F["Files changed"] --> D{"Do ALL of them match<br/>docs/** or **/*.md or LICENSE?"}
    D -->|"yes"| SKIP["code = false<br/>lint · typecheck · test · build<br/>skip their steps, report green"]
    D -->|"no"| RUN["code = true<br/>every check does its work"]
    M[".github/actions/changes<br/>dorny/paths-filter · predicate-quantifier every<br/>patterns ** · !docs/** · !**/*.md · !LICENSE<br/>a file counts as code only if it matches ALL four"] -.-> D
    MD["Manual dispatch<br/>bypasses this entirely"] -.-> RUN

    classDef dec fill:#e8f2fa,stroke:#1f6a9b,stroke-width:2px,color:#00243f
    classDef path fill:#80c8fe,stroke:#002052,stroke-width:2px,color:#00243f
    classDef note fill:#fff8e1,stroke:#b8860b,stroke-width:1px,color:#3d2c00
    class D dec
    class SKIP,RUN,F path
    class M,MD note
```

One composite action defines the rule, so the patterns live in a single file.
`actionlint` uses the same action's `ci` output, scoped to `.github/**`.

---

## Security

```mermaid
flowchart TB
    subgraph WHAT["What each one looks at"]
        direction LR
        O["Code WE wrote"] --> QL["CodeQL<br/>PRs + main + weekly<br/>REPORTS"]
        D1["Code we DEPEND on"] --> AUD["npm audit<br/>daily<br/>REPORTS"]
        D1 --> DB["Dependabot<br/>weekly<br/>ACTS"]
    end

    QL --> TAB["Security tab<br/>code scanning alerts"]
    AUD --> LOG["Run log only<br/>no Security tab entry"]
    DB --> PR["Opens an upgrade PR"]
    PR --> CI["Runs all five required checks"]
    CI --> REV["You review and merge"]

    classDef src fill:#ffffff,stroke:#1c4866,stroke-width:1px,color:#1c4866
    classDef tool fill:#80c8fe,stroke:#002052,stroke-width:2px,color:#00243f
    classDef act fill:#d4f5e0,stroke:#0b6b3a,stroke-width:2px,color:#063d21
    classDef info fill:#e8f4fa,stroke:#1c4866,stroke-width:1px,color:#1c4866
    class O,D1 src
    class QL,AUD tool
    class DB act
    class TAB,LOG info
    class PR,CI,REV act
```

CodeQL is the only one that reads our source. Dependabot is the only one that acts.

`npm audit` runs on a cron, not as a PR gate: an advisory on a transitive package with
no fix available would block every unrelated PR until upstream patches it.

There is no nightly re-run of lint/test/build. `npm ci` installs from a committed
lockfile, so an unchanged `main` produces identical results. Only the CVE database and
CodeQL's queries change on their own, and the two scheduled scans cover those.

```mermaid
flowchart LR
    W["Weekly"] --> DB["Dependabot"]
    DB --> G1["Minor + patch<br/>grouped into ONE PR"]
    DB --> G2["Each major<br/>its own PR"]
    DB --x IG["@react-three/fiber<br/>IGNORED on purpose"]
    IG -.->|"why"| RSN["patches/@react-three+fiber+9.6.0.patch<br/>is filename-pinned to 9.6.0<br/>any bump breaks npm ci<br/>until the patch is regenerated"]

    classDef tool fill:#80c8fe,stroke:#002052,stroke-width:2px,color:#00243f
    classDef act fill:#d4f5e0,stroke:#0b6b3a,stroke-width:2px,color:#063d21
    classDef bad fill:#ffd9df,stroke:#9f1239,stroke-width:2px,color:#4c0519
    classDef note fill:#fff8e1,stroke:#b8860b,stroke-width:1px,color:#3d2c00
    class W,DB tool
    class G1,G2 act
    class IG bad
    class RSN note
```

---

## Workflow hygiene

```mermaid
flowchart LR
    H1["permissions: contents read<br/>CodeQL job alone gets<br/>security-events write"] --> W1["A compromised action<br/>cannot write to the repo"]
    H2["concurrency group per ref<br/>cancel-in-progress on PRs only"] --> W2["Double-push kills the stale run<br/>main pushes never cancelled"]
    H3["timeout-minutes on every job"] --> W3["A hung job dies in minutes<br/>not an hour"]
    H4["Actions pinned to full SHA<br/>version in a trailing comment"] --> W4["A tag can be moved to new code<br/>a SHA cannot"]
    H5["actionlint asserts the pins"] --> W5["Pinning cannot quietly rot<br/>into looking maintained"]

    classDef rule fill:#80c8fe,stroke:#002052,stroke-width:2px,color:#00243f
    classDef why fill:#e8f4fa,stroke:#1c4866,stroke-width:1px,color:#00243f
    class H1,H2,H3,H4,H5 rule
    class W1,W2,W3,W4,W5 why
```

Dependabot's `github-actions` ecosystem keeps those SHA pins current, with
`directories` covering both `/` and `/.github/actions/*`.

---

## When it goes red

```mermaid
flowchart LR
    R["A check is RED"] --> W{"Which one?"}
    W -->|"format"| F1["npm run format<br/>then commit"]
    W -->|"lint"| F2["npm run lint<br/>warnings count, gate is zero"]
    W -->|"typecheck"| F3["npm run typecheck<br/>fix types, never reach for any"]
    W -->|"test"| F4["npm test<br/>fix logic or the asserted policy"]
    W -->|"build only"| F5["npm run build<br/>usually a server/client<br/>boundary bug or a route signature"]
    W -->|"actionlint"| F6["Pin the action to a 40-char SHA<br/>or fix the workflow YAML"]
    W -->|"cancelled"| F7["Someone pushed again<br/>wait for the newer run"]
    W -->|"green locally, red in CI"| F8["Import casing<br/>Linux is case-sensitive"]

    classDef bad fill:#ffd9df,stroke:#9f1239,stroke-width:2px,color:#4c0519
    classDef dec fill:#e8f2fa,stroke:#1f6a9b,stroke-width:2px,color:#00243f
    classDef fix fill:#d4f5e0,stroke:#0b6b3a,stroke-width:2px,color:#063d21
    class R bad
    class W dec
    class F1,F2,F3,F4,F5,F6,F7,F8 fix
```

---

## Commands

```bash
npm run format:check   # the format workflow
npm run lint           # the lint workflow
npm run typecheck      # the typecheck workflow
npm test               # the test workflow
npm run build          # the build workflow
```

`--max-warnings=0` lives in `package.json`, not in CI, so local and CI strictness can't
drift. Tests need no secrets: PGlite runs Postgres in-process and loads
`supabase/schema.sql` plus the migrations to exercise real RLS policies.

Run one on GitHub without a new commit: **Actions → workflow → Run workflow**, or
`gh workflow run lint.yml`. The button appears only once the workflow is on `main`.

---

## One-time local config

```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

`format` stays red until one repo-wide `npm run format` commit lands. `.git-blame-ignore-revs`
holds comments only until then — add that commit's SHA to it so `git blame` skips it.

---

## Ubuntu only

```mermaid
flowchart LR
    BUG["Import casing bug<br/>./button vs ./Button"] --> L["Ubuntu runner<br/>case-SENSITIVE<br/>CATCHES IT"]
    BUG --> M["macOS runner<br/>case-insensitive<br/>HIDES IT"]
    BUG --> W["Windows runner<br/>case-insensitive<br/>HIDES IT"]

    classDef bug fill:#ffd9df,stroke:#9f1239,stroke-width:2px,color:#4c0519
    classDef good fill:#d4f5e0,stroke:#0b6b3a,stroke-width:2px,color:#063d21
    classDef useless fill:#eeeeee,stroke:#999999,stroke-width:1px,color:#555555
    class BUG bug
    class L good
    class M,W useless
```

Production is Linux, so Linux is what CI tests. `.nvmrc` plus the lockfile keeps
developer machines consistent, which is what a Node matrix would otherwise be for.

---

## Branch protection

```mermaid
flowchart TB
    S["Settings → Branches → main"] --> R1["Require a pull request before merging"]
    S --> R2["Require status checks to pass<br/>format · lint · typecheck · test · build"]
    S --> R3["Require branches to be up to date"]
    R2 -.->|"leave unrequired"| U["actionlint · codeql · audit<br/>they report, they do not gate"]

    classDef hdr fill:#00243f,stroke:#00243f,stroke-width:3px,color:#ffffff
    classDef rule fill:#80c8fe,stroke:#002052,stroke-width:2px,color:#00243f
    classDef note fill:#fff8e1,stroke:#b8860b,stroke-width:1px,color:#3d2c00
    class S hdr
    class R1,R2,R3 rule
    class U note
```

Repo settings, not files, and they need admin. A check is only selectable after it has
reported once. Adding a sixth check later means returning here, which is the cost of
one workflow per check.

---

## Deployment

Not set up. See [`CD_job.md`](./CD_job.md).
