# Plan 012: Emit the shadcn `docs` field for heavy items

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If a
> STOP condition occurs, stop and report. When done, update this plan's row in
> `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 34b5a9e..HEAD -- scripts/build-registry.mjs registry/hirael/registry-meta.ts`

## Status

- **Priority**: P3 (direction)
- **Effort**: S–M
- **Risk**: LOW (additive, CLI-understood JSON field)
- **Depends on**: none
- **Category**: direction
- **Planned at**: commit `34b5a9e`, 2026-07-13

## Why this matters

The shadcn registry-item schema supports a `docs` field — a short note the CLI
prints after installing an item. Several hirael items need consumer setup after
the source lands: `rich-text-editor` pulls six `@tiptap/*` packages, the
`data-table` kit pulls TanStack Table and ships `"use no memo"` pragmas consumers
must understand, and chart items pull `recharts`. Today a consumer runs `shadcn add
rich-text-editor`, gets source importing packages they must wire up, and no
in-CLI guidance — they go read the site. A one-line `docs` per heavy item surfaces
the setup note at exactly the install moment. The build never emits `docs` today,
so this is a purely additive win.

## Current state

`scripts/build-registry.mjs:99-111` (`toRegistryItem`) emits
`name/type/title/description/categories/dependencies/registryDependencies`, plus
`cssVars` conditionally, plus `files` — but **not** `docs`:

```js
return {
  name: entry.name,
  type,
  title: entry.title,
  description: entry.description,
  categories,
  dependencies: [...(entry.dependencies ?? [])].sort(),
  registryDependencies: [...].sort().map((dep) => resolveDep(dep, hiraelNames)),
  ...(entry.cssVars ? { cssVars: entry.cssVars } : {}),   // docs would go alongside
  files,
};
```

The meta entry type in `registry-meta.ts` (near the top, ~`:1-92`) declares the
allowed fields; `docs` is not among them, so add it as an optional `docs?: string`.

Heavy items that warrant a `docs` note (verify each item's real post-install needs
before writing the note — don't invent setup that isn't required):

- `rich-text-editor` — imports `@tiptap/*` (`registry-meta.ts` ~`:1243`).
- The `data-table` kit — TanStack Table + the `"use no memo"` pragma.
- Chart items — `recharts`.

## Commands you will need

| Purpose        | Command               | Expected on success  |
| -------------- | --------------------- | -------------------- |
| Install        | `pnpm install`        | exit 0               |
| Regenerate     | `pnpm registry:gen`   | writes registry.json |
| Registry check | `pnpm check:registry` | exit 0               |
| Install check  | `pnpm check:install`  | exit 0               |
| Build          | `pnpm build`          | exit 0               |

## Scope

**In scope**:

- `scripts/build-registry.mjs` — emit `docs` conditionally in `toRegistryItem`
- `registry/hirael/registry-meta.ts` — add `docs?: string` to the entry type and
  populate it for the confirmed heavy items

**Out of scope**:

- Rewriting descriptions — `docs` is a separate, install-time note.
- Adding `docs` to items that need no setup (keep it to the genuinely heavy ones).
- Any component source.

## Git workflow

- Branch: `advisor/012-registry-docs-field`
- Commit style: `feat: emit registry docs field for heavy items`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Add `docs` to the meta type and emit it

In `registry-meta.ts`, add `docs?: string` to the registry-entry type. In
`build-registry.mjs:109` area, add `...(entry.docs ? { docs: entry.docs } : {})`
alongside the `cssVars` spread.

**Verify**: `pnpm registry:gen` exits 0. `node -e "const r=require('./registry.json'); console.log(r.items.filter(i=>i.docs).map(i=>i.name))"`
prints the (currently empty) list without error.

### Step 2: Confirm each heavy item's real setup need, then write the note

For `rich-text-editor`, the `data-table` items, and chart items: read the source to
confirm what a consumer must actually do post-install (peer packages to install,
the `"use no memo"` pragma for data-table, a `ChartContainer` config for charts).
Write a concise, plain `docs` string for each — one or two sentences, no marketing
voice (match the repo's copy rules). Skip any item whose install is truly
self-contained.

**Verify**: `node -e "const r=require('./registry.json'); console.log(r.items.filter(i=>i.docs).map(i=>i.name))"`
lists exactly the intended items.

### Step 3: Regenerate and check

**Verify**:

- `pnpm registry:gen` exits 0.
- `pnpm check:registry` exits 0.
- `pnpm check:install` exits 0 (the `docs` field must not break install
  resolution).
- `pnpm build` exits 0.
- Inspect `public/r/rich-text-editor.json` (after `pnpm registry:build`) and
  confirm the `docs` string is present.

## Test plan

No unit runner. Verification is the pipeline: `check:registry` (drift),
`check:install` (resolution unaffected), and inspecting the emitted `/r/*.json`.
The `docs` field is CLI-understood, so its presence in the JSON is the deliverable.

## Done criteria

- [ ] `registry-meta.ts` entry type has `docs?: string`
- [ ] `build-registry.mjs` emits `docs` when present (conditional spread)
- [ ] `docs` populated for the confirmed heavy items (Tiptap editor, data-table, charts) with concise, human copy — and no others
- [ ] `pnpm registry:gen` / `check:registry` / `check:install` / `build` all exit 0
- [ ] The emitted `/r/<item>.json` for a heavy item contains its `docs` string
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report if:

- `check:install` fails once `docs` is emitted — the field placement or shape is
  wrong; report the error.
- An item you planned to annotate turns out to need no post-install setup — skip it
  and note that (don't write filler docs).

## Maintenance notes

- Keep `docs` reserved for items with real post-install setup; over-using it dilutes
  the signal.
- When a new heavy, multi-dependency item is added, giving it a `docs` note becomes
  part of the add-an-item checklist.
