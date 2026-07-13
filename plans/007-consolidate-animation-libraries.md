# Plan 007: Consolidate the catalog onto a single animation runtime (motion)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If a
> STOP condition occurs, stop and report. When done, update this plan's row in
> `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 34b5a9e..HEAD -- registry/hirael/templates registry/hirael/registry-meta.ts package.json`
> If any changed, re-run the import inventory in Step 1 before editing.

## Status

- **Priority**: P2
- **Effort**: M–L
- **Risk**: MED (animation behavior can regress; needs visual verification)
- **Depends on**: none (but do this AFTER Plan 006's prune to avoid lockfile churn conflicts)
- **Category**: dependencies / performance
- **Planned at**: commit `34b5a9e`, 2026-07-13

## Why this matters

`package.json` ships two direct dependencies — `framer-motion` and `motion` — that
are the **same project**: `motion` is the renamed successor of Framer Motion, and
`motion@12` itself depends on `framer-motion@12` (identical version). The catalog
is mid-migration: components and blocks import `motion/react`, but all five
templates still import `framer-motion`. A consumer who installs one `motion`-based
component and one `framer-motion`-based template ships two near-identical animation
runtimes (~40-60KB gzip duplicated) in their app, and new contributors have no
signal which library to use. Standardizing on `motion/react` and dropping
`framer-motion` fixes both.

## Current state

Confirmed at `34b5a9e`:

- **16** registry files import `from "motion/react"` (components + newer blocks:
  `hero-06/07/08`, `cta-05/06`, `login-03`, `components/dock.tsx`,
  `text-reveal.tsx`, `spotlight-card.tsx`, …).
- **28** registry files import `from "framer-motion"` — **all under
  `registry/hirael/templates/`** (`asme/*`, `creative-studio/*`, `mindloop/*`,
  `portfolio/*`, `rivr/*`). Inventory them precisely:

  ```bash
  grep -rln 'from "framer-motion"' registry/hirael
  ```

- Five template `dependencies` arrays in `registry-meta.ts` list `framer-motion`:
  - `:1654` `["framer-motion", "lucide-react"]`
  - `:1748` `["framer-motion", "hls.js"]`
  - `:1807` `["gsap", "framer-motion", "hls.js"]` ← portfolio (keeps `gsap`)
  - `:1901` `["framer-motion", "lucide-react"]`
  - `:2015` `["framer-motion", "lucide-react"]`
- `package.json:49` `"framer-motion": "^12.40.0"`, `:54` `"motion": "^12.40.0"`.

At v12 the two expose the same API surface the templates use (`motion`,
`AnimatePresence`, `useInView`, `useReducedMotion`, `useScroll`, `useTransform`,
`MotionConfig`, `MotionProps`, `HTMLMotionProps`) — all re-exported from
`motion/react`.

**Note on portfolio (`:1807`)**: it also imports `gsap` (ScrollTrigger). This plan
does NOT touch `gsap` — that's a separate, larger effort deliberately deferred
(`plans/README.md` records it as not-worth-doing now). Only swap its
`framer-motion` → `motion` here.

## Commands you will need

| Purpose      | Command                                            | Expected on success   |
| ------------ | -------------------------------------------------- | --------------------- |
| Install      | `pnpm install`                                     | exit 0                |
| Inventory    | `grep -rln 'from "framer-motion"' registry/hirael` | list shrinks to empty |
| Regenerate   | `pnpm registry:gen`                                | writes registry.json  |
| Registry chk | `pnpm check:registry`                              | exit 0                |
| Install chk  | `pnpm check:install`                               | exit 0                |
| Typecheck    | `pnpm typecheck`                                   | exit 0                |
| Build        | `pnpm build`                                       | exit 0                |

## Scope

**In scope**:

- All `registry/hirael/templates/**` files importing `framer-motion`
- `registry/hirael/registry-meta.ts` — the five template `dependencies` arrays
- `package.json` / `pnpm-lock.yaml` — remove `framer-motion` direct dep
- `registry-meta.ts:1481` `dock` description — ONLY if Plan 001 hasn't already
  fixed "Built on framer-motion" (check; skip if done)

**Out of scope**:

- `gsap` in the portfolio template — keep it.
- Any `motion/react` file that's already correct.
- Behavioral changes to animations — this is a pure import-specifier swap; do not
  "improve" any animation while migrating.

## Git workflow

- Branch: `advisor/007-consolidate-motion`
- Commit per template kit (e.g. `refactor: migrate asme template from framer-motion to motion`), then a final `build: drop framer-motion direct dependency`.
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Inventory the imports

Run `grep -rln 'from "framer-motion"' registry/hirael` and record every file. Then
`grep -rhn 'from "framer-motion"' registry/hirael | sort -u` to see every imported
symbol set, so you can confirm each symbol exists in `motion/react`.

**Verify**: you have the full file list and the full symbol set.

### Step 2: Swap import specifiers per template

In each file, change `from "framer-motion"` to `from "motion/react"`, leaving the
imported symbols and all usage unchanged. Work one template kit at a time and
typecheck between kits.

**Verify (per kit)**: `grep -rln 'from "framer-motion"' registry/hirael/templates/<kit>`
returns nothing; `pnpm typecheck` exits 0.

### Step 3: Update the five template dependencies arrays

In `registry-meta.ts`, change `framer-motion` → `motion` in the arrays at `:1654,
:1748, :1807, :1901, :2015` (keep `gsap`, `hls.js`, `lucide-react` as-is at each).
If Plan 001 didn't already fix the `dock` description at `:1481`, do it here.

**Verify**: `grep -n '"framer-motion"' registry/hirael/registry-meta.ts` returns
nothing.

### Step 4: Regenerate registry and run the registry checks

```bash
pnpm registry:gen
pnpm check:registry
pnpm check:install
```

**Verify**: all exit 0. (If Plan 002's npm-dependency check is in place, it now
enforces that each template imports `motion` and declares it — a good sign.)

### Step 5: Remove the framer-motion direct dependency

Delete `framer-motion` from `package.json:49`. Run `pnpm install` and `pnpm build`.

**Verify**:

- `grep -rln 'from "framer-motion"' registry` returns nothing (no source still
  imports it).
- `pnpm install` → exit 0.
- `pnpm build` → exit 0 (`framer-motion` remains resolvable transitively via
  `motion`, so anything internal still works, but no direct dep or direct import
  remains).

### Step 6: Visual verification (required for this plan)

Because animation behavior can differ subtly, run the site and eyeball each
migrated template preview:

```bash
pnpm dev
```

Open each template's `/embed/templates/<name>` (asme, creative-studio, mindloop,
portfolio, rivr) and confirm entrance/scroll/hover animations still play. Portfolio
specifically: confirm both the `gsap` ScrollTrigger effects AND the migrated
`motion` animations work together.

**Verify**: each template animates as before; no console errors.

## Test plan

No automated visual-regression suite exists (documented gap). The test is the
manual template walkthrough in Step 6 plus `pnpm build`. If a visual-regression
tool is ever added, these five templates are the highest-value capture targets —
note that in the maintenance section.

## Done criteria

- [ ] `grep -rln 'from "framer-motion"' registry` returns no matches
- [ ] `grep -n '"framer-motion"' registry/hirael/registry-meta.ts` returns no matches
- [ ] `framer-motion` removed from `package.json`; `motion` retained
- [ ] `pnpm registry:gen` regenerated `registry.json`; `pnpm check:registry` and `pnpm check:install` exit 0
- [ ] `pnpm typecheck` and `pnpm build` exit 0
- [ ] All five template previews animate correctly (manual Step 6)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report if:

- A `framer-motion` symbol used by a template does not exist in `motion/react`
  (unlikely at v12, but stop rather than guess an equivalent).
- Any migrated template's animation visibly breaks in Step 6 and the cause isn't
  an obvious import typo — report which template and what regressed.
- Removing `framer-motion` from `package.json` breaks `pnpm build` — means
  something imports it directly still; find it (Step 5 grep) before removing.

## Maintenance notes

- After this, `motion/react` is the single animation runtime; any new
  animated item must import `motion/react`, and Plan 002's check will enforce the
  matching `dependencies` entry.
- The portfolio template still ships `gsap` + `motion` deliberately (ScrollTrigger
  scroll-scrubbing isn't a free `motion` port). It's the heaviest template; a
  reviewer sizing bundle impact should expect that.
- These five templates are the priority targets if visual-regression testing is
  added later.
