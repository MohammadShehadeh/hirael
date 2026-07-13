# Plan 006: Prune unused dependencies and clear the postcss advisory

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If a
> STOP condition occurs, stop and report. When done, update this plan's row in
> `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 34b5a9e..HEAD -- package.json pnpm-lock.yaml`
> If either changed, re-verify the import greps in Step 1 against the live tree.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW → MED (the radix packages need a clean build to confirm)
- **Depends on**: none (do NOT bundle with Plan 007; the `framer-motion` removal belongs there)
- **Category**: dependencies
- **Planned at**: commit `34b5a9e`, 2026-07-13

## Why this matters

The showcase `package.json` carries direct dependencies nothing imports:
`date-fns` and `@hookform/resolvers` (zero usages anywhere), plus a cluster of
individual `@radix-ui/react-*` packages superseded by the unified `radix-ui`
meta-package. Dead manifest entries slow installs, bloat the lockfile, and mislead
contributors ("there's a date bug — reach for `date-fns`," which isn't used).
Separately, `next@16.2.9` pulls `postcss@8.4.31`, the version behind the one
`pnpm audit` MODERATE advisory; bumping to `16.2.10` clears it cheaply and keeps
`pnpm audit` a usable signal. (The advisory is build-only and low-severity for a
static export — this is hygiene, not an emergency.)

## Current state

`package.json` (line numbers at `34b5a9e`):

- `:24` — `"@hookform/resolvers": "^5.4.0"` — **0 imports** in `app/ components/
lib/ hooks/ registry/` and 0 in any `registry-meta.ts` `dependencies` array.
- `:47` — `"date-fns": "^4.4.0"` — **0 imports** anywhere, 0 in registry-meta
  deps. (`react-day-picker@10` does not require a `date-fns` peer.)
- `:25-35` — individual `@radix-ui/react-*` packages. The `ui/*` primitives now
  import the unified `radix-ui` package. Per the dependency audit, only
  `@radix-ui/react-slot` (3 importers) and `@radix-ui/react-dialog` (1 importer:
  lightbox) are still used; the others
  (`accordion, checkbox, label, popover, select, separator, slider, tabs,
tooltip`) have **0** source importers after the `radix-ui` migration.
- `:55` — `"next": "16.2.9"` and `:84` `"eslint-config-next": "16.2.9"` (kept in
  lockstep). `16.2.10` is available and lifts the transitive `postcss` past
  `8.5.10`.

`node_modules` is not installed, so **every removal must be confirmed by a clean
`pnpm install && pnpm build`** — a shadcn primitive could theoretically pull an
individual radix package transitively as a required direct dep.

## Commands you will need

| Purpose      | Command                                                                                 | Expected on success                 |
| ------------ | --------------------------------------------------------------------------------------- | ----------------------------------- |
| Install      | `pnpm install`                                                                          | exit 0, lockfile updates            |
| Audit        | `pnpm audit --prod`                                                                     | 0 vulnerabilities (after next bump) |
| Build        | `pnpm build`                                                                            | exit 0                              |
| Typecheck    | `pnpm typecheck`                                                                        | exit 0                              |
| Verify usage | `grep -rn "<pkg>" app components lib hooks registry --include="*.ts" --include="*.tsx"` | 0 real import matches               |

## Scope

**In scope**:

- `package.json` — remove unused deps, bump `next` + `eslint-config-next`
- `pnpm-lock.yaml` — updated by `pnpm install` (commit the result)

**Out of scope**:

- `framer-motion` removal — that's Plan 007 (it requires migrating template
  imports first). Do NOT remove `framer-motion` or `motion` here.
- `@radix-ui/react-slot` and `@radix-ui/react-dialog` — still imported; keep them.
- Any source file — this is manifest-only.

## Git workflow

- Branch: `advisor/006-prune-deps`
- Commit style: `build: remove unused dependencies and bump next to 16.2.10`
  (or split into two commits: the prune and the bump).
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Confirm each candidate is truly unused

For each of `@hookform/resolvers`, `date-fns`, and the 9 candidate radix packages,
run:

```bash
grep -rn "from \"<pkg>\"\|require(\"<pkg>\")" app components lib hooks registry --include="*.ts" --include="*.tsx"
grep -n "\"<pkg>\"" registry/hirael/registry-meta.ts
```

Both must be empty for a package to be removable. For the scoped radix packages,
also grep for the subpath form (`@radix-ui/react-accordion`). Record the results.
If any candidate has a real import, drop it from the removal list and note it.

### Step 2: Remove the confirmed-unused packages from package.json

Delete `@hookform/resolvers` (`:24`), `date-fns` (`:47`), and each confirmed-unused
`@radix-ui/react-*` line. Keep `@radix-ui/react-slot` and `@radix-ui/react-dialog`.

### Step 3: Bump next and eslint-config-next

Change `next` and `eslint-config-next` both to `16.2.10` (keep them equal).

### Step 4: Reinstall and verify the build

```bash
pnpm install
pnpm build
pnpm audit --prod
```

**Verify**:

- `pnpm install` → exit 0.
- `pnpm build` → exit 0 (the whole registry pipeline + `next build`). This is the
  real proof the removed radix packages weren't needed — if the build fails with a
  missing `@radix-ui/react-*`, that package was required; restore it (STOP).
- `pnpm audit --prod` → 0 vulnerabilities (the postcss MODERATE is cleared). If it
  still reports postcss, note the resolved version and report — the bump may not
  have moved the transitive dep.
- `pnpm typecheck` → exit 0.

## Test plan

No unit runner. The clean `pnpm install && pnpm build` is the definitive test for
the dependency removals — a static export that builds with a dep removed proves it
was unused. `pnpm audit --prod` is the test for the postcss bump.

## Done criteria

- [ ] `@hookform/resolvers` and `date-fns` removed from `package.json`
- [ ] Confirmed-unused `@radix-ui/react-*` packages removed; `@radix-ui/react-slot` and `@radix-ui/react-dialog` retained
- [ ] `next` and `eslint-config-next` both at `16.2.10`
- [ ] `framer-motion` and `motion` both still present (untouched — Plan 007 owns them)
- [ ] `pnpm install` succeeds; `pnpm-lock.yaml` updated and committed
- [ ] `pnpm build` exits 0
- [ ] `pnpm audit --prod` reports 0 vulnerabilities
- [ ] `pnpm typecheck` exits 0
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report if:

- `pnpm build` fails after removing a radix package with a `Cannot find module
'@radix-ui/react-*'` error — restore that package (it's transitively required)
  and report which one.
- `pnpm audit --prod` still flags postcss after the `next` bump — report the
  resolved postcss version; a `pnpm.overrides` pin may be needed instead
  (`"postcss": ">=8.5.10"`), but do not add it without confirming the build.
- Any candidate turns out to be imported (Step 1) — leave it and note it.

## Maintenance notes

- Once Plan 002's npm-dependency check is in place, the registry side of dep drift
  is guarded, but `package.json`'s own direct deps are not — a periodic
  `grep`-for-usage or a `depcheck` run is the manual backstop for the showcase
  manifest.
- Keep `next` and `eslint-config-next` version-matched on every future bump.
