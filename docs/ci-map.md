# CI Map

A visual map of continuous integration in this repo. Every diagram renders natively on
GitHub and in the Kiro IDE preview.

**Platform:** GitHub Actions · **Runner:** `ubuntu-latest` · **Node:** pinned in `.nvmrc`
**Required check to merge:** `ci-ok` · **Cost:** free (public repo = unlimited minutes, free CodeQL, free Dependabot)

---

## 1. The whole system

```mermaid
flowchart TB
    T1["Pull request<br/>opened · updated · reopened"]
    T2["Push to main<br/>a merge landed"]
    T3["Dependabot<br/>weekly"]
    T4["Cron<br/>weekly"]
    T5["Cron<br/>daily"]
    T6["Manual<br/>workflow dispatch"]

    subgraph CIWF["ci.yml — THE MERGE GATE"]
        direction TB
        CH{"changes<br/>paths-filter<br/>was code touched?"}
        FMT["format<br/>prettier --check"]
        LNT["lint<br/>eslint, zero warnings"]
        TYP["typecheck<br/>tsc --noEmit"]
        TST["test<br/>node --test + PGlite"]
        BLD["build<br/>next build"]
        OKJ["ci-ok<br/>aggregating gate"]
    end

    subgraph QLWF["codeql.yml — scans OUR code"]
        QL["CodeQL<br/>javascript-typescript<br/>build-mode none"]
    end

    subgraph SECWF["security.yml — scans OUR DEPENDENCIES"]
        AUD["npm audit<br/>audit-level high"]
    end

    T1 --> CH
    T2 --> CH
    T1 --> QL
    T2 --> QL
    T4 --> QL
    T5 --> AUD
    T6 --> AUD
    T3 -.->|"opens upgrade PR, which re-enters here"| T1

    CH -->|"always"| FMT
    CH -->|"only if code changed"| LNT
    CH -->|"only if code changed"| TYP
    CH -->|"only if code changed"| TST
    CH -->|"only if code changed"| BLD

    FMT --> OKJ
    LNT --> OKJ
    TYP --> OKJ
    TST --> OKJ
    BLD --> OKJ

    OKJ -->|"green"| MERGE["Merge button unlocks"]
    OKJ -->|"red"| BLOCK["Merge blocked"]
    QL --> TAB["Security tab<br/>code scanning alerts"]
    AUD --> LOG["Run log + notification<br/>never blocks a PR"]

    classDef trig fill:#1077b1,stroke:#00243f,stroke-width:2px,color:#ffffff
    classDef dec fill:#e8f2fa,stroke:#1f6a9b,stroke-width:2px,color:#00243f
    classDef chk fill:#80c8fe,stroke:#002052,stroke-width:2px,color:#00243f
    classDef gate fill:#00243f,stroke:#00243f,stroke-width:3px,color:#ffffff
    classDef good fill:#d4f5e0,stroke:#0b6b3a,stroke-width:2px,color:#063d21
    classDef bad fill:#ffd9df,stroke:#9f1239,stroke-width:2px,color:#4c0519
    classDef info fill:#e8f4fa,stroke:#1c4866,stroke-width:1px,color:#1c4866

    class T1,T2,T3,T4,T5,T6 trig
    class CH dec
    class FMT,LNT,TYP,TST,BLD,QL,AUD chk
    class OKJ gate
    class MERGE good
    class BLOCK bad
    class TAB,LOG info
```

Only `ci.yml` can block a merge. The security workflows report into the Security tab
instead, so a slow scan or a fresh advisory in some transitive package never holds up
unrelated work.

---

## 2. Which check catches which bug

Read right to left: every arrow is a real failure mode and the job that catches it.

```mermaid
flowchart RL
    FMT["format"]
    LNT["lint"]
    TYP["typecheck"]
    TST["test"]
    BLD["build"]
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
    B11["Dependency with a CVE"] --> AUD
    B12["Unsafe pattern in our<br/>own source"] --> QL

    classDef chk fill:#80c8fe,stroke:#002052,stroke-width:2px,color:#00243f
    classDef bug fill:#ffffff,stroke:#1c4866,stroke-width:1px,color:#1c4866
    class FMT,LNT,TYP,TST,BLD,AUD,QL chk
    class B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11,B12 bug
```

The two "will NOT catch this" labels are why both `typecheck` and `build` exist.
`next.config.ts` sets no `ignoreBuildErrors`, so the build does compile — but it still
won't fail on a type error inside `tests/`, and `tsc` can't detect a prerender crash.

---

## 3. Inside any single job

```mermaid
flowchart LR
    S["Job starts<br/>ubuntu-latest<br/>timeout-minutes set"] --> C["actions/checkout<br/>pinned to SHA"]
    C --> SU[".github/actions/setup<br/>composite action<br/>written once, used by all 5 jobs"]
    SU --> N["actions/setup-node<br/>node-version-file .nvmrc<br/>cache npm"]
    N --> I["npm ci<br/>from package-lock.json"]
    I --> PP["postinstall fires<br/>patch-package applies<br/>react-three-fiber 9.6.0 patch"]
    PP --> W["The actual check runs"]
    W --> R["Result reported to ci-ok"]

    BC["build job only:<br/>actions/cache on .next/cache<br/>keyed on lockfile + hash of src"] -.-> W

    classDef step fill:#e8f4fa,stroke:#1c4866,stroke-width:1px,color:#00243f
    classDef hi fill:#80c8fe,stroke:#002052,stroke-width:2px,color:#00243f
    classDef note fill:#fff8e1,stroke:#b8860b,stroke-width:1px,color:#3d2c00
    class S,C,N,I,PP,R step
    class SU,W hi
    class BC note
```

`npm ci` always reinstalls `node_modules` from scratch; the npm cache only skips the
network fetch. That keeps installs reproducible and guarantees `patch-package` runs.

---

## 4. The `ci-ok` gate

This is the one clever piece, so it gets its own diagram.

```mermaid
flowchart TB
    START["ci-ok runs<br/>if: always()"] --> Q1{"Any needed job<br/>reported failure?"}
    Q1 -->|"yes"| RED["exit 1 — RED<br/>merge stays blocked"]
    Q1 -->|"no"| Q2{"Any needed job<br/>was cancelled?"}
    Q2 -->|"yes"| RED
    Q2 -->|"no"| GREEN["exit 0 — GREEN<br/>skipped jobs are acceptable"]

    classDef dec fill:#e8f2fa,stroke:#1f6a9b,stroke-width:2px,color:#00243f
    classDef good fill:#d4f5e0,stroke:#0b6b3a,stroke-width:2px,color:#063d21
    classDef bad fill:#ffd9df,stroke:#9f1239,stroke-width:2px,color:#4c0519
    classDef gate fill:#00243f,stroke:#00243f,stroke-width:3px,color:#ffffff
    class START gate
    class Q1,Q2 dec
    class GREEN good
    class RED bad
```

Branch protection requires *named* checks. Require `build` directly and a docs-only PR
that skips `build` waits forever for a check that will never report. One aggregating
job that always runs solves it — and `ci-ok` is then the only check to mark required,
so adding a sixth check later means editing its `needs` list, not GitHub settings.

```mermaid
flowchart LR
    S1["Normal code PR<br/>all 5 pass"] --> G1["GREEN"]
    S2["Docs-only PR<br/>format passes, 4 skipped"] --> G1
    S3["Broken test"] --> G2["RED"]
    S4["Force-push mid-run<br/>jobs cancelled"] --> G2

    classDef sc fill:#ffffff,stroke:#1c4866,stroke-width:1px,color:#1c4866
    classDef good fill:#d4f5e0,stroke:#0b6b3a,stroke-width:2px,color:#063d21
    classDef bad fill:#ffd9df,stroke:#9f1239,stroke-width:2px,color:#4c0519
    class S1,S2,S3,S4 sc
    class G1 good
    class G2 bad
```

---

## 5. Path filtering

```mermaid
flowchart LR
    F["Files changed"] --> D{"Do ALL of them match<br/>docs/** or **/*.md or LICENSE?"}
    D -->|"yes"| SKIP["code = false<br/>run format only<br/>no Next.js compile"]
    D -->|"no"| RUN["code = true<br/>run all five checks"]
    SKIP --> OK["ci-ok green either way"]
    RUN --> OK

    classDef dec fill:#e8f2fa,stroke:#1f6a9b,stroke-width:2px,color:#00243f
    classDef path fill:#80c8fe,stroke:#002052,stroke-width:2px,color:#00243f
    classDef gate fill:#00243f,stroke:#00243f,stroke-width:3px,color:#ffffff
    class D dec
    class SKIP,RUN path
    class OK gate
    class F path
```

Editing a README shouldn't spend minutes compiling Next.js. `format` stays ungated
because Prettier covers Markdown, so a docs PR still gets a real check rather than a
vacuous green tick.

---

## 6. Security cadence, and why three tools

```mermaid
flowchart TB
    subgraph WHAT["What each one looks at"]
        direction LR
        O["Code WE wrote"] --> QL["CodeQL<br/>PRs + main + weekly<br/>REPORTS"]
        D1["Code we DEPEND on"] --> AUD["npm audit<br/>daily<br/>REPORTS"]
        D1 --> DB["Dependabot<br/>weekly<br/>ACTS"]
    end

    QL --> TAB["Security tab"]
    AUD --> TAB
    DB --> PR["Opens an upgrade PR"]
    PR --> CI["Runs the full ci.yml gate"]
    CI --> REV["You review and merge"]

    classDef src fill:#ffffff,stroke:#1c4866,stroke-width:1px,color:#1c4866
    classDef tool fill:#80c8fe,stroke:#002052,stroke-width:2px,color:#00243f
    classDef act fill:#d4f5e0,stroke:#0b6b3a,stroke-width:2px,color:#063d21
    classDef info fill:#e8f4fa,stroke:#1c4866,stroke-width:1px,color:#1c4866
    class O,D1 src
    class QL,AUD tool
    class DB act
    class TAB info
    class PR,CI,REV act
```

CodeQL is the only one that analyses our own source. `npm audit` only reports.
Dependabot is the only one that *acts* — and its PRs face the same five checks as human
work.

**Why `npm audit` is a cron, not a PR gate:** an advisory on a transitive package with
no fix available would block every unrelated PR in the repo until upstream ships a
patch. On a schedule it informs without holding the team hostage.

**Why there's no nightly re-run of lint/test/build:** `npm ci` installs from a committed
lockfile, so an unchanged `main` yields a byte-identical dependency tree and identical
results. The only inputs that change on their own are the CVE database and CodeQL's
query set — exactly what the two scheduled scans cover.

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

## 7. Hygiene applied to every workflow

```mermaid
flowchart LR
    H1["permissions: contents read<br/>CodeQL job alone gets<br/>security-events write"] --> W1["A compromised action<br/>cannot write to the repo"]
    H2["concurrency group per ref<br/>cancel-in-progress on PRs only"] --> W2["Double-push kills the stale run<br/>main pushes never cancelled"]
    H3["timeout-minutes on every job"] --> W3["A hung job dies in minutes<br/>not an hour"]
    H4["Actions pinned to full SHA<br/>version in a trailing comment"] --> W4["A tag can be moved to new code<br/>a SHA cannot"]

    classDef rule fill:#80c8fe,stroke:#002052,stroke-width:2px,color:#00243f
    classDef why fill:#e8f4fa,stroke:#1c4866,stroke-width:1px,color:#00243f
    class H1,H2,H3,H4 rule
    class W1,W2,W3,W4 why
```

Dependabot's `github-actions` ecosystem is what keeps those SHA pins from going stale.

---

## 8. When it goes red

```mermaid
flowchart LR
    R["ci-ok is RED"] --> W{"Which job?"}
    W -->|"format"| F1["npm run format<br/>then commit"]
    W -->|"lint"| F2["npm run lint<br/>warnings count, gate is zero"]
    W -->|"typecheck"| F3["npm run typecheck<br/>fix types, never reach for any"]
    W -->|"test"| F4["npm test<br/>fix logic or the asserted policy"]
    W -->|"build only"| F5["npm run build<br/>usually a server/client<br/>boundary bug"]
    W -->|"cancelled"| F6["Someone pushed again<br/>wait for the newer run"]
    W -->|"green locally, red in CI"| F7["Import casing<br/>Linux is case-sensitive"]

    classDef bad fill:#ffd9df,stroke:#9f1239,stroke-width:2px,color:#4c0519
    classDef dec fill:#e8f2fa,stroke:#1f6a9b,stroke-width:2px,color:#00243f
    classDef fix fill:#d4f5e0,stroke:#0b6b3a,stroke-width:2px,color:#063d21
    class R bad
    class W dec
    class F1,F2,F3,F4,F5,F6,F7 fix
```

---

## 9. Local commands, mirrored exactly by CI

```bash
npm run format:check   # the format job
npm run lint           # the lint job
npm run typecheck      # the typecheck job
npm test               # the test job
npm run build          # the build job
```

`lint` carries `--max-warnings=0` in `package.json` itself rather than CI passing a
stricter flag, so local strictness and CI strictness cannot drift. All five green on
your machine means CI agrees.

Tests need no secrets: PGlite runs Postgres in-process and loads `supabase/schema.sql`
plus the migrations to exercise real RLS policies. No server, no containers, no
credentials.

---

## 10. One-time local setup

```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

Prettier adoption required one repo-wide reformat commit, which would otherwise make
`git blame` attribute every line to it. `.git-blame-ignore-revs` records that SHA.
GitHub honors the file automatically; locally it takes the config above.

---

## 11. Why Ubuntu only, no OS or Node matrix

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

Production runs on Linux regardless of host, so Linux is the only platform that tests
anything a user hits. Adding Mac or Windows runners would be worse than redundant: they
are precisely the environments that hide the main portability bug. Consistency across
developer machines comes from `.nvmrc` plus the committed lockfile, not from runners.

---

## 12. Branch protection — set these in the GitHub UI

```mermaid
flowchart TB
    S["Settings → Branches → main"] --> R1["Require a pull request before merging"]
    S --> R2["Require status checks to pass<br/>ci-ok — this one ONLY"]
    S --> R3["Require branches to be up to date"]

    classDef hdr fill:#00243f,stroke:#00243f,stroke-width:3px,color:#ffffff
    classDef rule fill:#80c8fe,stroke:#002052,stroke-width:2px,color:#00243f
    class S hdr
    class R1,R2,R3 rule
```

These are repo settings, not files — they have to be clicked.

---

## 13. Not set up yet

Continuous **deployment** is deliberately out of scope. See
[`CD_job.md`](./CD_job.md) for what wiring it up involves, including the rule that any
deploy job must depend on `ci-ok`.
