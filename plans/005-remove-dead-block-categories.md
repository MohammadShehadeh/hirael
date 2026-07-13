# Plan 005: Remove the dead BlockCategories grid and its illustration file

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If a
> STOP condition occurs, stop and report. When done, update this plan's row in
> `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 34b5a9e..HEAD -- components/showcase/block-categories.tsx components/showcase/block-categories-illustrations.tsx components/showcase/block-showcase.tsx`
> If any changed, re-run the importer greps in Step 1 before deleting anything.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: tech-debt
- **Planned at**: commit `34b5a9e`, 2026-07-13

## Why this matters

`components/showcase/block-categories.tsx` contains a full parallel category-grid
implementation (`BlockCategories`) plus an 18-illustration file
(`block-categories-illustrations.tsx`, ~317 lines) that **nothing renders** — the
live `/blocks` index is a different component, `BlockShowcase`. About 550 lines of
dead UI must be read, type-checked, and kept theme/RTL-correct forever with no
runtime purpose, and it actively misleads: its `CATEGORIES` array lists only 18 of
the 22 block categories, so an editor "fixing the blocks grid" edits the wrong,
stale thing. (This is why the direction audit mistakenly reported "4 hidden
categories" — the live grid is complete; only this dead array is stale.) Deleting
it removes the trap.

## Current state

`components/showcase/block-categories.tsx` exports a mix of **live data** and
**dead UI**:

- **LIVE (keep)** — used by the real `/blocks` index, the block routes, and the
  sitemap:
  - `CategoryMeta` (type, `:33`)
  - `CATEGORY_REGISTRY` (`:48`, the complete 22-entry array) — consumed by
    `components/showcase/block-showcase.tsx:5,500` (`CATEGORY_REGISTRY.map(...)`)
  - `CATEGORY_BY_SLUG` (`:204`)
- **DEAD (remove)** — the illustration imports (`:8-27`),
  `CategoryDefWithIllustration` (`:42`), `CATEGORIES` (`:208`, the stale 18-entry
  array), `countLabel` (`:301`), `tileShell` (`:312`), `Variant` (`:315`),
  `BlockCategories` (`:317`), `Tile` (`:349`).
- `components/showcase/block-categories-illustrations.tsx` — 18 `Ill*`
  components; imported **only** by `block-categories.tsx:27` (for the dead
  `CATEGORIES`).

Confirmed at `34b5a9e`: `BlockCategories` has zero importers anywhere, and the
illustrations file is imported only by `block-categories.tsx`.

## Commands you will need

| Purpose   | Command          | Expected on success |
| --------- | ---------------- | ------------------- |
| Install   | `pnpm install`   | exit 0              |
| Typecheck | `pnpm typecheck` | exit 0              |
| Lint      | `pnpm lint`      | exit 0              |
| Build     | `pnpm build`     | exit 0              |

## Scope

**In scope**:

- `components/showcase/block-categories.tsx` — trim to the three live exports
- `components/showcase/block-categories-illustrations.tsx` — delete entirely

**Out of scope**:

- `components/showcase/block-showcase.tsx` — the live grid; do not touch.
- `CATEGORY_REGISTRY` contents — do not add/remove categories here; that's a
  separate concern.

## Git workflow

- Branch: `advisor/005-remove-dead-block-categories`
- Commit style: `refactor: remove unused BlockCategories grid and illustrations`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Re-confirm the code is dead

```bash
grep -rn "BlockCategories" --include="*.tsx" --include="*.ts" app components lib registry | grep -v "block-categories.tsx:"
grep -rn "block-categories-illustrations" --include="*.tsx" --include="*.ts" app components lib registry | grep -v "block-categories-illustrations.tsx"
```

Both must return **no output** (only the definitions reference themselves). If
either returns an importer, STOP — the code is not dead.

Also confirm the live exports are still used:

```bash
grep -rn "CATEGORY_REGISTRY\|CATEGORY_BY_SLUG\|CategoryMeta" --include="*.tsx" --include="*.ts" app components lib registry | grep -v "block-categories.tsx"
```

Expect at least `block-showcase.tsx`, the block route(s), and `app/sitemap.ts`.

### Step 2: Delete the illustrations file

Remove `components/showcase/block-categories-illustrations.tsx`.

**Verify**: file no longer exists.

### Step 3: Trim block-categories.tsx to the live exports

Remove from `block-categories.tsx`: the illustration imports (`:8-27`), the
`ArrowUpRight`/`Link` imports if now unused, `CategoryDefWithIllustration`,
`CATEGORIES`, `countLabel`, `tileShell`, `Variant`, `BlockCategories`, and `Tile`.
Keep `CategoryMeta`, `CATEGORY_REGISTRY`, and `CATEGORY_BY_SLUG` exactly as they
are. Remove any now-unused imports (e.g. `Link`, `ArrowUpRight`, `next/link`,
`lucide-react`) — lint will flag leftovers.

**Verify**: `grep -n "BlockCategories\|CATEGORIES\|Illustration\|IllHero" components/showcase/block-categories.tsx` returns nothing; `grep -n "CATEGORY_REGISTRY" components/showcase/block-categories.tsx` still matches.

### Step 4: Typecheck, lint, build

**Verify**:

- `pnpm typecheck` → exit 0 (no unresolved references to the removed symbols)
- `pnpm lint` → exit 0 (no unused-import errors)
- `pnpm build` → exit 0; the `/blocks` index still builds (`ls out/blocks/index.html`)

## Test plan

No unit runner. The typecheck and build are the gate: if anything still referenced
the removed symbols, `tsc` fails. Optionally run `pnpm dev` and load `/blocks` to
confirm the live grid (all 22 categories) is unaffected — it derives from
`CATEGORY_REGISTRY`, which is untouched.

## Done criteria

- [ ] `block-categories-illustrations.tsx` deleted
- [ ] `block-categories.tsx` exports only `CategoryMeta`, `CATEGORY_REGISTRY`, `CATEGORY_BY_SLUG` (plus their internal helpers if any remain used)
- [ ] `grep -rn "BlockCategories" app components lib registry` returns no matches
- [ ] `pnpm typecheck` / `pnpm lint` / `pnpm build` all exit 0
- [ ] `/blocks` index still renders (`out/blocks/index.html` present)
- [ ] Only the two in-scope files changed
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report if:

- Step 1's greps show any live importer of `BlockCategories` or the illustrations.
- Removing the symbols breaks typecheck in a file outside the two in-scope files
  (means something did depend on them — reassess before proceeding).

## Maintenance notes

- After this lands, `CATEGORY_REGISTRY` is unambiguously the single owner of block
  category metadata for the site; `BlockShowcase` is the only grid. A future
  category tweak happens in `CATEGORY_REGISTRY` only.
- Consider whether `CategoryMeta.comingSoon` (kept, but now unused by any renderer)
  should also go — leave it for now unless a reviewer wants it gone; it's harmless
  and may be wired up by the roadmap direction work.
