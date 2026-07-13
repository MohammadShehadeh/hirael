# Plan 002: check-registry validates npm dependencies, ordering completeness, and orphan loaders

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If a
> STOP condition occurs, stop and report — do not improvise. When done, update
> this plan's row in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 34b5a9e..HEAD -- scripts/check-registry.mjs scripts/strip-comments.mjs registry/hirael/registry-meta.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code; on a mismatch, STOP.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/001 (must land first, or the new npm-dependency check fails on pre-existing drift)
- **Category**: tech-debt / tooling
- **Planned at**: commit `34b5a9e`, 2026-07-13

## Why this matters

`registry-meta.ts` is the single source of truth, but three of its
hand-maintained invariants have **no automated guard**, so drift ships silently
to consumers:

1. The npm `dependencies` array is never checked against what a file actually
   imports — this is the exact gap that let Plan 001's broken `accordion`
   install exist.
2. The block-kind ordering arrays (`BLOCK_KIND_ORDER`, `COMPONENT_CATEGORY_ORDER`)
   are plain arrays; add a new `BlockKind` and forget one and its blocks silently
   vanish from the detail-page pager and the sitemap — no build error.
3. `registry-demos.tsx`'s loader map is checked forward (item → loader) but not
   backward, so a loader for a deleted item lingers uncaught.

Separately, `scripts/strip-comments.mjs` has a latent foot-gun: its JSX comment
sweep can misread a regex literal's trailing `//` as a comment and delete real
code from shipped source. Not currently triggered, but cheap to neutralize while
we're in the tooling.

Closing these makes the build the reliable gate it's meant to be.

## Current state

**`scripts/check-registry.mjs`** — the drift guard. It already validates
`registryDependencies` against `@/registry/hirael/{ui,components}/*` imports via
`collectUiImports` (lines 34-62) and this loop (lines 132-152):

```js
const declared = new Set(entry.registryDependencies ?? []);
for (const dep of imported) {
  if (!declared.has(dep))
    fail(`"${entry.name}" imports "${dep}" but doesn't declare it`);
}
for (const dep of declared) {
  if (!imported.has(dep))
    fail(`"${entry.name}" declares "${dep}" but never imports it`);
}
```

It does **not** collect bare-package imports (`radix-ui`, `motion`,
`lucide-react`, …) and never inspects `entry.dependencies`. The loader check is
forward-only (lines 108-130): it fails when a showcased item has no loader, but
never when a loader key has no matching item. `demoLoaderNames` is a `Set` of the
loader keys, already available in scope.

**`registry-meta.ts` ordering arrays** (line numbers at `34b5a9e`):

- `BLOCK_KIND_ORDER: BlockKind[]` at ~`:2695`
- `COMPONENT_CATEGORY_ORDER` at ~`:2725`
- The `BlockKind` union is declared at ~`:14-36`; `BLOCK_KIND_LABELS` /
  `BLOCK_KIND_SLUGS` are `Record<BlockKind, …>` (so TS already forces those to be
  exhaustive — the plain arrays are the unguarded ones).

**`scripts/strip-comments.mjs`** — `collapseBlankLines` (lines 84-110) already
computes `protectedSpans` for string/template/**regex** literals and an
`inProtected(offset)` helper. But `sweepExpression` (lines 48-68), which
re-tokenizes JSX expressions with a raw scanner, has no such guard, so a `//`
inside a regex literal can be classified as a comment.

## Commands you will need

| Purpose        | Command               | Expected on success       |
| -------------- | --------------------- | ------------------------- |
| Install        | `pnpm install`        | exit 0                    |
| Registry check | `pnpm check:registry` | exit 0 (after 001 landed) |
| Regenerate     | `pnpm registry:gen`   | writes registry.json      |
| Build          | `pnpm build`          | exit 0                    |

## Scope

**In scope**:

- `scripts/check-registry.mjs` — add the three validations
- `scripts/strip-comments.mjs` — guard `sweepExpression`
- `registry/hirael/registry-meta.ts` — ONLY if the new ordering check surfaces a
  genuinely missing entry (otherwise do not touch)

**Out of scope**:

- `scripts/build-registry.mjs` — generation logic is unchanged.
- Fixing dependency data — that's Plan 001; this plan assumes 001 landed so the
  new check starts green.

## Git workflow

- Branch: `advisor/002-harden-check-registry`
- Commit style: `build: validate npm deps, ordering, and orphan loaders in check-registry`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Add npm-dependency validation to check-registry.mjs

Add a collector alongside `collectUiImports` that captures **bare package**
import specifiers (not `@/…` aliases, not relative paths), normalizing subpaths
to the installable package name:

- `motion/react` → `motion`
- `radix-ui` → `radix-ui` (stays)
- `@radix-ui/react-dialog` → `@radix-ui/react-dialog` (scoped: keep first two segments)
- `date-fns/format` → `date-fns`
- bare `react`, `react-dom`, `react/jsx-runtime` → ignore (allowlist; every consumer has React)

Normalization rule: for a specifier `s` that is not `@/…` and not `./`/`../`:

- if it starts with `@`, the package is the first two `/`-separated segments;
- otherwise it's the first segment.

Then, per item, diff the collected bare imports (minus the React allowlist)
against `entry.dependencies` and `fail(...)` on either direction, mirroring the
existing `registryDependencies` loop. Use a small `ALLOWED = new Set(["react",
"react-dom"])`.

**Verify**: `pnpm check:registry` exits 0 (001 already fixed the real drift). To
prove the check works, temporarily add a bogus `"nonexistent-pkg"` to any item's
`dependencies`, run `pnpm check:registry`, confirm it fails naming that item, then
revert.

### Step 2: Add a reverse (orphan) loader check

After the forward loader checks (line ~130), iterate `demoLoaderNames` and
`fail(...)` for any loader key that does not correspond to a showcased registry
entry (build the set of expected loader keys from the meta: block/template names

- example slugs, the same sources the forward check uses).

**Verify**: `pnpm check:registry` exits 0. Temporarily add a fake key to
`BLOCK_LOADERS` in `registry-demos.tsx`, confirm the check fails naming it, revert.

### Step 3: Add ordering-array completeness checks

Assert that `BLOCK_KIND_ORDER` contains every member of the `BlockKind` union
exactly once, and that `COMPONENT_CATEGORY_ORDER` contains every component
category exactly once. The runtime meta is loaded via `loadRegistryMeta()`
(already imported); derive the full `BlockKind` set from `BLOCK_KIND_LABELS` keys
(TS-guaranteed exhaustive) and diff against `BLOCK_KIND_ORDER`. `fail(...)` on any
missing or duplicated kind.

**Verify**: `pnpm check:registry` exits 0 today. Temporarily delete one entry
from `BLOCK_KIND_ORDER` in a scratch edit, confirm the check fails naming the
missing kind, revert.

### Step 4: Guard sweepExpression in strip-comments.mjs against regex literals

Reuse the `collapseBlankLines` approach: compute `protectedSpans` for
string/template/regex literals from the same source file, and in
`sweepExpression`, reject any candidate comment range whose start position falls
inside a protected span (so a regex's `//` is never treated as a comment). Factor
the protected-span computation into a shared helper used by both functions.

**Verify**: add a temporary fixture file
`registry/hirael/components/_striptest.tsx` containing a JSX expression with a
regex ending in `//`, e.g. `<span>{String(/^https?:\/\//.test(x))}</span>`, run
`node scripts/strip-comments.mjs registry/hirael/components`, confirm the regex is
intact in the output, then delete the fixture. (Do NOT commit the fixture.)

### Step 5: Full build

**Verify**: `pnpm build` exits 0 (runs registry:gen → registry:props →
check-registry → registry:build → next build).

## Test plan

No unit runner. Each step's verification is a deliberate
break-it-confirm-it-catches-it-revert cycle against the real checker. The
strip-comments fixture is the one genuinely new behavioral test — keep it as a
throwaway, or, if a `scripts/*.test.mjs` runner is ever added (see the DX
assessment), promote it to a permanent fixture asserting the regex survives.

## Done criteria

- [ ] `check-registry.mjs` fails when an item's `dependencies` mismatch its bare imports (proven by the temporary-bogus-dep test)
- [ ] `check-registry.mjs` fails on an orphan loader key (proven)
- [ ] `check-registry.mjs` fails on a missing `BLOCK_KIND_ORDER` entry (proven)
- [ ] `strip-comments.mjs` leaves a regex literal ending in `//` intact (proven with the throwaway fixture)
- [ ] `pnpm check:registry` exits 0 on the real tree
- [ ] `pnpm build` exits 0
- [ ] No throwaway fixture or scratch edit left committed (`git status` clean except the two scripts)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report if:

- `pnpm check:registry` fails on the **real** tree after Step 1 with a dependency
  the source genuinely imports — means Plan 001 didn't land or missed a case;
  report the item and stop (don't paper over it by adding the dep to an allowlist).
- The `BlockKind` union or the ordering arrays have moved/renamed so the excerpts
  don't match.
- Normalizing a real import to a package name is ambiguous for some specifier you
  encounter (e.g. a deep subpath package) — report it rather than guessing.

## Maintenance notes

- The React allowlist in Step 1 is the one place to add legitimately-implicit
  packages; keep it minimal and comment why each entry is there.
- If a future primitive imports a new bare package, the check will now force its
  `dependencies` to list it — that's the intended behavior, not a false positive.
