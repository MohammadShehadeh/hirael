# Plan 008: Correct load-bearing docs that contradict the code

> **Executor instructions**: Follow this plan step by step. Verify each change
> with the greps given. If a STOP condition occurs, stop and report. When done,
> update this plan's row in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 34b5a9e..HEAD -- docs/README.md docs/conventions.md README.md CONTRIBUTING.md`
> If any changed, re-read the cited lines before editing.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW (docs only)
- **Depends on**: none
- **Category**: docs
- **Planned at**: commit `34b5a9e`, 2026-07-13

## Why this matters

`AGENTS.md` tells every agent to read `docs/README.md` and `docs/conventions.md`
"first" before non-trivial changes. Several statements in those files (and their
human-facing equivalents) are now the **opposite** of what the code does, so an
agent or contributor who follows them does the wrong thing and generates churn:

- The file maps put new components in `ui/` (the shadcn-primitives-only dir) and
  omit `components/`, where 73 of 75 UI items actually live — steering the most
  common catalog operation into the wrong directory (which breaks `check:registry`
  import-matching and shadcn's install-path rewriting).
- `conventions.md` states registry source uses "no trailing semicolons" and that
  the repo "does not run a separate formatter" — both false: the source ships
  semicolons and lint-staged auto-runs Prettier on commit. Following the doc
  produces surprise diffs.
- The README says lint runs via `next lint` (removed in Next 16) and that env vars
  are "read at runtime" (there is no runtime — it's a static export), omitting the
  two build-time vars.

Stale docs are worse than missing ones. These are all small text fixes.

## Current state

### A — file maps put components in `ui/`, omit `components/`

`docs/README.md:76-77`:

```
  ui/<component>.tsx              # component source (flat compound exports)
  ui/<primitive>.tsx              # shadcn primitives the registry imports from
```

(no `components/<name>.tsx` line in the `registry/hirael/` map)

`CONTRIBUTING.md:60-63`:

```
registry/hirael/
  ui/<component>.tsx         # source (flat compound exports), alongside
                             # the shadcn primitives the registry imports
```

Both contradict the actual split, correctly documented in
`docs/conventions.md:111-119` and `docs/README.md:147-148`: **`ui/` = shadcn
primitives only; `components/` = everything hirael adds**. `CONTRIBUTING.md:214`
itself later says the right thing (`registry/hirael/components/<name>.tsx`).

### B — conventions.md style rule is inverted

`docs/conventions.md:335-338`:

> Registry source style: **2-space indent, double-quoted strings, no trailing
> semicolons** … The repo does **not run a separate formatter** — don't reformat
> committed files; reset your editor's formatter on this repo instead.

Reality: `registry/hirael/ui/button.tsx:1` is `import * as React from "react";`
(semicolons), and `package.json:20` lint-staged runs `prettier --write` on `**/*`
via `.husky/pre-commit` (Prettier default `semi: true`). `CONTRIBUTING.md:165-171`
correctly describes Prettier default + auto-run.

### C — README scripts + config are stale

`README.md:208` — `pnpm build` described as "`registry:build` then `next build`"
(actual chain in `package.json:7`: `registry:gen && registry:props &&
check-registry && registry:build && next build`).
`README.md:210` — `pnpm lint` described as "ESLint via `next lint`" (actual
`package.json:9`: `eslint .`; `next lint` was removed in Next 16).
`README.md:216-217` — "Environment variables are optional and **read at runtime**"
and the table (`:219-221`) lists only `NEXT_PUBLIC_BASE_URL`, omitting the two
build-time vars: `REGISTRY_BASE_URL` (`scripts/build-registry.mjs:24`) and
`GITHUB_TOKEN_HIRAEL` (`lib/changelog.ts:59-60`).

## Commands you will need

| Purpose     | Command                           | Expected on success |
| ----------- | --------------------------------- | ------------------- |
| Verify grep | `grep -n ...`                     | as specified below  |
| Lint (docs) | n/a — prose only; no build needed | —                   |

(No code changes, so typecheck/build are not required, but running `pnpm lint`
after is harmless and confirms nothing else was touched.)

## Scope

**In scope**:

- `docs/README.md` — the file map (§File map)
- `docs/conventions.md` — the Style section (:333-346)
- `README.md` — the scripts table + Configuration section
- `CONTRIBUTING.md` — the Project layout block (:59-69)

**Out of scope**:

- Any code. This is documentation-only.
- `AGENTS.md` / `docs/design.md` / `docs/catalog.md` — the catalog counts there
  were verified accurate; do not touch.

## Git workflow

- Branch: `advisor/008-docs-accuracy`
- Commit style: `docs: correct file maps, registry style rule, and README scripts/env`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Fix the file maps (A)

In `docs/README.md` §File map and `CONTRIBUTING.md` §Project layout, relabel `ui/`
as "shadcn primitives only" and add the hirael component source line, e.g.:

```
registry/hirael/
  ui/<primitive>.tsx         # shadcn primitives only (button, table, popover, …)
  components/<name>.tsx       # hirael's added components (multi-file kits as components/<name>/, e.g. data-table/)
  examples/<name>-demo.tsx    # showcase demo per component
  ...
```

**Verify**: `grep -n "components/<name>" docs/README.md CONTRIBUTING.md` matches;
`grep -n "component source (flat compound exports)" docs/README.md` returns
nothing.

### Step 2: Fix the conventions.md style rule (B)

Replace the inverted bullet at `docs/conventions.md:335-338` with the truth:
2-space indent, double-quoted strings, **semicolons** (Prettier default),
auto-applied to staged files by lint-staged on commit. Remove the "does not run a
separate formatter / reset your editor" advice.

**Verify**: `grep -n "no trailing semicolons\|does not run a separate formatter" docs/conventions.md`
returns nothing.

### Step 3: Fix the README scripts + config (C)

- `:208` — describe `pnpm build` as the full chain (`registry:gen → registry:props
→ check-registry → registry:build → next build`).
- `:210` — describe `pnpm lint` as "ESLint (`eslint .`, flat config)"; remove
  `next lint`.
- `:216` — change "read at runtime" to "read at build time" (only
  `NEXT_PUBLIC_BASE_URL` is a client value used at runtime).
- Add two rows to the env table (`:219-221`): `REGISTRY_BASE_URL`
  (`scripts/build-registry.mjs`, default `https://hirael.com`, build-time registry
  base override) and `GITHUB_TOKEN_HIRAEL` (`lib/changelog.ts`, default none/anon,
  authenticates the build-time GitHub Releases fetch).

**Verify**: `grep -n "next lint\|read at runtime" README.md` returns nothing;
`grep -n "REGISTRY_BASE_URL\|GITHUB_TOKEN_HIRAEL" README.md` matches.

### Step 4: Sanity check

**Verify**: `pnpm lint` exits 0 (nothing but docs changed; `git status` shows only
the four markdown files).

## Test plan

Docs-only; no runtime surface. Verification is the grep assertions above and a
final read-through confirming the corrected text matches
`docs/conventions.md:111-119` (the authoritative ui/-vs-components/ rule) and
`package.json` (the real scripts).

## Done criteria

- [ ] `docs/README.md` + `CONTRIBUTING.md` file maps show `components/<name>.tsx` and label `ui/` as primitives-only
- [ ] `docs/conventions.md` style rule says semicolons + Prettier auto-format (no "no semicolons"/"no formatter")
- [ ] `README.md` `pnpm build` and `pnpm lint` rows are accurate; no `next lint`
- [ ] `README.md` config section says "build time" and lists `REGISTRY_BASE_URL` + `GITHUB_TOKEN_HIRAEL`
- [ ] `pnpm lint` exits 0; only the four docs files changed
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report if:

- Any cited doc line has already been corrected (codebase drifted) — verify the
  current text matches reality and skip that sub-step.
- The ui/-vs-components/ split described in `conventions.md:111-119` has itself
  changed — then that section, not this plan, is the new source of truth.

## Maintenance notes

- Per `AGENTS.md`, these docs are load-bearing: whenever a change makes a doc
  statement wrong, fix it in the same change. This plan is a one-time
  reconciliation; the ongoing discipline is on every catalog/tooling PR.
- The single source for the ui/-vs-components/ rule is
  `docs/conventions.md:111-119` — the file maps should point at it rather than
  re-describing the split.
