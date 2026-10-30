# CI Map

GitHub Actions · `ubuntu-latest` · Node 24 via `.nvmrc` · required check: `ci-ok`
Free on this repo (public = unlimited minutes, CodeQL, Dependabot).

---

## System

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
    T1 -->|"ungated"| FMT
    T2 -->|"ungated"| FMT
    T1 --> QL
    T2 --> QL
    T4 --> QL
    T5 --> AUD
    T6 --> AUD
    T3 -.->|"opens upgrade PR, which re-enters here"| T1

    CH -->|"only if code changed"| LNT
    CH -->|"only if code changed"| TYP
    CH -->|"only if code changed"| TST
    CH -->|"only if code changed"| BLD
    CH --> OKJ

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

Only `ci.yml` blocks merges. CodeQL reports to the Security tab, `npm audit` to its run log.

---

## Coverage

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
    B13["Route signature break<br/>.next/types exists only after a build<br/>so typecheck stays green"] --> BLD
    B11["Dependency with a CVE"] --> AUD
    B12["Unsafe pattern in our<br/>own source"] --> QL

    classDef chk fill:#80c8fe,stroke:#002052,stroke-width:2px,color:#00243f
    classDef bug fill:#ffffff,stroke:#1c4866,stroke-width:1px,color:#1c4866
    class FMT,LNT,TYP,TST,BLD,AUD,QL chk
    class B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11,B12,B13 bug
```

The two "will NOT catch this" labels are why `typecheck` and `build` both exist.

---

## Job anatomy

```mermaid
flowchart LR
    S["Job starts<br/>ubuntu-latest<br/>timeout-minutes set"] --> C["actions/checkout<br/>pinned to SHA"]
    C --> SU[".github/actions/setup<br/>composite action, no checkout<br/>used by every check job<br/>and by npm audit"]
    SU --> N["actions/setup-node<br/>node-version-file .nvmrc<br/>cache npm"]
    N --> I["npm ci<br/>from package-lock.json"]
    I --> PP["postinstall fires<br/>patch-package applies<br/>react-three-fiber 9.6.0 patch"]
    PP --> W["The actual check runs"]
    W --> R["Result reported to ci-ok"]

    BC["build job only:<br/>actions/cache on .next/cache ONLY<br/>key next-OS-lockfile-hash(src)<br/>caching .next/types would restore<br/>stale route validators"] -.-> W

    classDef step fill:#e8f4fa,stroke:#1c4866,stroke-width:1px,color:#00243f
    classDef hi fill:#80c8fe,stroke:#002052,stroke-width:2px,color:#00243f
    classDef note fill:#fff8e1,stroke:#b8860b,stroke-width:1px,color:#3d2c00
    class S,C,N,I,PP,R step
    class SU,W hi
    class BC note
```

`npm ci` always reinstalls `node_modules`. The npm cache only skips the download.

---

## The ci-ok gate

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

Branch protection requires named checks. Require `build` directly and a docs-only PR
that skips it waits forever. `ci-ok` is the only check marked required, so adding a
sixth check later means editing its `needs` list, not GitHub settings.

---

## Path filter

```mermaid
flowchart LR
    F["Files changed"] --> D{"Do ALL of them match<br/>docs/** or **/*.md or LICENSE?"}
    D -->|"yes"| SKIP["code = false<br/>run format only<br/>no Next.js compile"]
    D -->|"no"| RUN["code = true<br/>run all five checks"]
    SKIP --> OK["ci-ok green either way"]
    RUN --> OK
    M["dorny/paths-filter<br/>predicate-quantifier every<br/>patterns ** · !docs/** · !**/*.md · !LICENSE<br/>a file counts as code only if it matches ALL four"] -.-> D

    classDef dec fill:#e8f2fa,stroke:#1f6a9b,stroke-width:2px,color:#00243f
    classDef path fill:#80c8fe,stroke:#002052,stroke-width:2px,color:#00243f
    classDef gate fill:#00243f,stroke:#00243f,stroke-width:3px,color:#ffffff
    classDef note fill:#fff8e1,stroke:#b8860b,stroke-width:1px,color:#3d2c00
    class D dec
    class SKIP,RUN path
    class OK gate
    class F path
    class M note
```

`format` stays ungated because Prettier covers Markdown.

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
    PR --> CI["Runs the full ci.yml gate"]
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

    classDef rule fill:#80c8fe,stroke:#002052,stroke-width:2px,color:#00243f
    classDef why fill:#e8f4fa,stroke:#1c4866,stroke-width:1px,color:#00243f
    class H1,H2,H3,H4 rule
    class W1,W2,W3,W4 why
```

Dependabot's `github-actions` ecosystem keeps those SHA pins current.

---

## When it goes red

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

## Commands

```bash
npm run format:check   # the format job
npm run lint           # the lint job
npm run typecheck      # the typecheck job
npm test               # the test job
npm run build          # the build job
```

`--max-warnings=0` lives in `package.json`, not in CI, so local and CI strictness can't
drift. Tests need no secrets: PGlite runs Postgres in-process and loads
`supabase/schema.sql` plus the migrations to exercise real RLS policies.

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
    S --> R2["Require status checks to pass<br/>ci-ok — this one ONLY"]
    S --> R3["Require branches to be up to date"]

    classDef hdr fill:#00243f,stroke:#00243f,stroke-width:3px,color:#ffffff
    classDef rule fill:#80c8fe,stroke:#002052,stroke-width:2px,color:#00243f
    class S hdr
    class R1,R2,R3 rule
```

Repo settings, not files. Someone has to click these.

---

## Deployment

Not set up. See [`CD_job.md`](./CD_job.md).
