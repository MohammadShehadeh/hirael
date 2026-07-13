# Plan 001: Registry items declare the npm packages their source actually imports

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 34b5a9e..HEAD -- registry/hirael/registry-meta.ts registry/hirael/ui/accordion.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `34b5a9e`, 2026-07-13

## Why this matters

The redistributed `accordion` primitive tells consumers to install
`@radix-ui/react-accordion`, but its source imports the unified `radix-ui`
meta-package instead. A consumer running `npx shadcn add
https://hirael.com/r/accordion.json` (or any of the four FAQ blocks that pull
`accordion` transitively) installs the wrong package and, if they don't already
have `radix-ui`, gets a hard build failure: `Cannot find module 'radix-ui'`.
Six other items declare individual `@radix-ui/*` packages they never import
(redundant installs), and one description names the wrong library. The npm
`dependencies` array is exactly the set a consumer's package manager installs,
so every wrong entry ships as a broken or bloated install. This plan makes each
item's declared npm dependencies match what its source actually imports.

## Current state

`registry-meta.ts` is the single source of truth; `registry.json` is generated
from it (`pnpm registry:gen`). Each item has a `dependencies: string[]` array of
npm package names the consumer must install.

The migrated `ui/*` primitives now import the unified `radix-ui` package, not the
individual `@radix-ui/react-*` packages:

- `registry/hirael/ui/accordion.tsx:5` — `import { Accordion as AccordionPrimitive } from "radix-ui"`

But these meta entries still declare the old individual packages (line numbers at
commit `34b5a9e`):

- `registry-meta.ts:2552` — **`accordion`** primitive declares
  `dependencies: ["@radix-ui/react-accordion", "lucide-react"]` → the broken
  install. Its source imports `radix-ui`.
- `registry-meta.ts:112` — **`number-range`** declares `["@radix-ui/react-slider"]`; its source imports the `slider` ui primitive via `registryDependencies`, not the raw package.
- `registry-meta.ts:535` — **`faq-01`** declares `["@radix-ui/react-accordion", "lucide-react"]`
- `registry-meta.ts:552` — **`faq-02`** declares `["@radix-ui/react-accordion"]`
- `registry-meta.ts:575` — **`faq-03`** declares `["@radix-ui/react-accordion", "lucide-react"]`
- `registry-meta.ts:592` — **`faq-04`** declares `["@radix-ui/react-accordion"]`
- `registry-meta.ts:1355` — **`audio-player`** declares `["@radix-ui/react-slider", "lucide-react"]`
- `registry-meta.ts:1481` — **`dock`** description ends "…Built on framer-motion." but `registry/hirael/components/dock.tsx` imports `motion/react`.

**The rule** (`docs/conventions.md`): an item's `dependencies` array must list the
bare npm packages its own source files import directly. Packages reached through a
ui primitive belong to that primitive's `dependencies`, and the primitive is pulled
via `registryDependencies` (which is already correct here).

**How to know what each item imports**: read the item's `files` in
`registry-meta.ts`, then grep those files for bare-package imports:

```bash
# accordion primitive — should be radix-ui + lucide-react
grep -nE "from \"(radix-ui|@radix-ui|lucide-react|motion|framer-motion)" registry/hirael/ui/accordion.tsx
# faq blocks / number-range / audio-player — confirm they import the ui primitive, NOT the raw radix pkg
grep -rnE "from \"@radix-ui" registry/hirael/blocks/faq-0*/ registry/hirael/components/number-range.tsx registry/hirael/components/audio-player.tsx
```

## Commands you will need

| Purpose        | Command               | Expected on success                |
| -------------- | --------------------- | ---------------------------------- |
| Install        | `pnpm install`        | exit 0 (node_modules absent)       |
| Regenerate     | `pnpm registry:gen`   | writes registry.json + vercel.json |
| Registry check | `pnpm check:registry` | exit 0, no drift                   |
| Install check  | `pnpm check:install`  | exit 0                             |
| Typecheck      | `pnpm typecheck`      | exit 0                             |

## Scope

**In scope** (the only files you may modify):

- `registry/hirael/registry-meta.ts` — the 8 entries above
- `registry.json` — only via `pnpm registry:gen` (never hand-edit)
- `vercel.json` — only as a side effect of `pnpm registry:gen` (redirects regenerate); commit it if it changes

**Out of scope** (do NOT touch):

- Any `registry/hirael/ui/*` or component source — this is a metadata-only fix.
- `scripts/check-registry.mjs` — hardening the checker is Plan 002.
- Any item not in the list above.

## Git workflow

- Branch: `advisor/001-registry-dep-drift`
- Conventional Commits are enforced (`.commitlintrc.json`). Use e.g.
  `fix: correct npm dependency declarations for accordion and FAQ blocks`.
  No JIRA ticket (this repo doesn't use them).
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Fix the `accordion` primitive dependency (the broken install)

In `registry-meta.ts:2552`, change the `accordion` entry's `dependencies` from
`["@radix-ui/react-accordion", "lucide-react"]` to
`["radix-ui", "lucide-react"]`.

**Verify**: `grep -n '"radix-ui"' registry/hirael/registry-meta.ts` shows the new
entry; `grep -nA1 'name: "accordion"' registry/hirael/registry-meta.ts` confirms
you edited the primitive (its `files` is `registry/hirael/ui/accordion.tsx`), not
another item.

### Step 2: Remove the redundant individual radix packages from the consumer items

For `number-range` (:112), `faq-01` (:535), `faq-02` (:552), `faq-03` (:575),
`faq-04` (:592), and `audio-player` (:1355): first confirm each item's source
does NOT import a bare `@radix-ui/*` package (run the grep in "Current state").
It reaches Slider/Accordion through the ui primitive, which it lists in
`registryDependencies`. Remove the `@radix-ui/react-slider` /
`@radix-ui/react-accordion` string from each item's `dependencies` array, keeping
`lucide-react` where present.

- If an item's `dependencies` becomes empty, use `dependencies: []`.
- If the grep shows an item DOES directly import `@radix-ui/react-*`, that's a
  STOP condition — do not remove it; report which item.

**Verify**: `grep -nE "@radix-ui/react-(accordion|slider)" registry/hirael/registry-meta.ts`
returns **no matches** (all individual-package declarations are gone).

### Step 3: Fix the `dock` description

In `registry-meta.ts:1481`, change "Built on framer-motion." to "Built on motion."
(the source imports `motion/react`).

**Verify**: `grep -n "Built on motion" registry/hirael/registry-meta.ts` matches;
`grep -n "Built on framer-motion" registry/hirael/registry-meta.ts` returns nothing.

### Step 4: Regenerate and verify

Run `pnpm registry:gen`, then the checks.

**Verify**:

- `pnpm registry:gen` → exits 0, prints "registry.json generated".
- `pnpm check:registry` → exit 0.
- `pnpm check:install` → exit 0.
- `git status` shows `registry.json` (and possibly `vercel.json`) regenerated.

## Test plan

No unit-test runner exists. Verification is the registry pipeline itself:

- `pnpm check:registry` proves `registry.json` matches the edited meta.
- `pnpm check:install` applies shadcn's import-rewrite rules offline and asserts
  each item still resolves — the closest thing to a real `shadcn add`.
- Manually inspect the generated `accordion` item:
  `node -e "const r=require('./registry.json'); console.log(r.items.find(i=>i.name==='accordion').dependencies)"`
  → expect `[ 'lucide-react', 'radix-ui' ]` (sorted).

## Done criteria

- [ ] `registry-meta.ts` `accordion` entry declares `radix-ui`, not `@radix-ui/react-accordion`
- [ ] `grep -nE "@radix-ui/react-(accordion|slider)" registry/hirael/registry-meta.ts` returns no matches
- [ ] `grep -n "Built on framer-motion" registry/hirael/registry-meta.ts` returns no matches
- [ ] `pnpm registry:gen` regenerated `registry.json`
- [ ] `pnpm check:registry` exits 0
- [ ] `pnpm check:install` exits 0
- [ ] `pnpm typecheck` exits 0
- [ ] Only in-scope files modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report (do not improvise) if:

- Any item in Step 2 turns out to import a bare `@radix-ui/react-*` package
  directly in its source (then the declaration is correct, not redundant).
- `pnpm check:install` fails after the change — the rewrite resolution broke;
  report the exact error.
- The `accordion` primitive source at `ui/accordion.tsx:5` no longer imports
  `radix-ui` (the codebase drifted since this plan was written).

## Maintenance notes

- Plan 002 adds an automated guard (`check-registry.mjs` validating npm
  `dependencies` against real imports) that will keep this from recurring. Land
  002 after this so it starts from a green baseline.
- When you migrate any remaining primitive to `radix-ui`, its `dependencies` must
  move to `radix-ui` in the same change — a reviewer should check the meta entry
  against the actual import specifier on every primitive edit.
