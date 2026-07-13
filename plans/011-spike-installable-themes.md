# Plan 011 (spike): Ship installable theme presets via the cssVars field

> **Executor instructions**: This is a DESIGN/SPIKE plan. Produce ONE working
> installable theme end-to-end and a written recommendation; do not build a full
> theme catalog until approved. Run the verifications and report findings + open
> questions. Update this plan's row in `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat 34b5a9e..HEAD -- scripts/build-registry.mjs registry/hirael/registry-meta.ts components/showcase/theme-sheet.tsx`

## Status

- **Priority**: P3 (direction / spike)
- **Effort**: M (coarse)
- **Risk**: LOW (additive registry items)
- **Depends on**: none
- **Category**: direction
- **Planned at**: commit `34b5a9e`, 2026-07-13

## Why this matters

The theme playground's whole pitch is "watch the entire Hirael registry re-skin,"
but its only export is a **Copy CSS** button that hands the user a raw
`:root {…} .dark {…}` block to paste by hand
(`components/showcase/theme-sheet.tsx`, the copy-CSS action the direction audit
located at ~`:280-294`). Meanwhile the `cssVars` registry field is already
plumbed through the build (`scripts/build-registry.mjs:109` emits it) yet only one
catalog item uses it. shadcn distributes themes as installable registry items, so
hirael could ship curated presets as `/r/<theme>.json` and let a consumer run
`npx shadcn add https://hirael.com/r/theme-<name>.json` to reskin their whole app
in one command — turning a demo toy into a distributable product and delivering on
the copy the playground already implies. This spike proves one theme installs
end-to-end.

## Current state

`scripts/build-registry.mjs:99-111` (`toRegistryItem`) already forwards `cssVars`:

```js
return {
  name: entry.name,
  type,
  title: entry.title,
  description: entry.description,
  categories,
  dependencies: [...(entry.dependencies ?? [])].sort(),
  registryDependencies: [...].sort().map((dep) => resolveDep(dep, hiraelNames)),
  ...(entry.cssVars ? { cssVars: entry.cssVars } : {}),   // :109 — already wired
  files,
};
```

- The `cssVars` type on a meta entry is declared in `registry-meta.ts` (the
  direction audit located the schema at ~`:81-90` and the single current user at
  ~`:243`). Confirm both by reading them.
- `type` is derived from `entry.type` (`:76`); a theme entry would set
  `type: "registry:theme"` (a shadcn registry item type). Verify `shadcn build`
  (`pnpm registry:build`) accepts `registry:theme` items and that `check:install`
  handles an item with no `files` (a theme is `cssVars`-only) — this is the key
  unknown.
- The playground's export path is `components/showcase/theme-sheet.tsx` (Copy CSS).

## Commands you will need

| Purpose        | Command               | Expected on success                   |
| -------------- | --------------------- | ------------------------------------- |
| Install        | `pnpm install`        | exit 0                                |
| Regenerate     | `pnpm registry:gen`   | writes registry.json                  |
| Registry build | `pnpm registry:build` | emits `public/r/theme-<name>.json`    |
| Registry check | `pnpm check:registry` | exit 0                                |
| Install check  | `pnpm check:install`  | exit 0 (or reveals a gap — record it) |
| Build          | `pnpm build`          | exit 0                                |

## Scope

**In spike scope**:

- ONE new theme entry in `registry-meta.ts` (`type: "registry:theme"`, a `cssVars`
  block, no or minimal `files`)
- Whatever minimal `build-registry.mjs` / check-script adjustment is needed for a
  files-less theme item to pass (only if required — record what)
- A written recommendation (append **Findings** to this plan)

**Out of scope (until approved)**:

- A full set of presets
- Rewiring the playground's Copy-CSS button to emit an install command (evaluate,
  don't build)
- Any change to the design tokens themselves

## Git workflow

- Branch: `advisor/011-spike-installable-themes`
- Commit style: `feat: installable theme preset (spike)`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Confirm the cssVars plumbing and shadcn theme-item support

Read `registry-meta.ts` cssVars type (~`:81-90`) and the existing user (~`:243`)
to learn the exact `cssVars` shape (`{ theme?, light?, dark? }` etc.). Check how
`registry:ui`/`registry:block` are the only types currently authored and whether
`shadcn build` / `check:install` assume every item has `files`.

**Verify**: you can state the `cssVars` shape and whether a files-less
`registry:theme` item is supported by the current pipeline.

### Step 2: Author one theme preset entry

Add a single theme entry to `registry-meta.ts` — e.g. `theme-<name>` with
`type: "registry:theme"`, a title/description, and a `cssVars` block holding a
curated light+dark token set (reuse the site's own tuned values). Give it a
preview loader only if the showcase should list it (a theme may be
distribution-only — decide and record).

**Verify**: `pnpm registry:gen` exits 0 and `registry.json` contains the theme
item with its `cssVars`.

### Step 3: Build the registry and test install resolution

Run `pnpm registry:build` and `pnpm check:install`.

**Verify**:

- `public/r/theme-<name>.json` is emitted with the `cssVars`.
- `pnpm check:install` either passes or reveals exactly what a theme item needs
  (e.g. a files-less item may need special handling). Record the outcome — a gap
  here is a finding, not a failure of the spike.
- `pnpm check:registry` exits 0 (or tells you what a theme item must declare).

### Step 4: Write the recommendation

Append a **Findings** section answering:

- Does `registry:theme` install cleanly via the existing pipeline? What (if
  anything) needed adjusting?
- Presets vs. a "copy the tuned result as an install command" export from the
  playground — which is the better product shape?
- How many presets to ship, and whether they are distribution-only or showcased.
- The rollout cost and any `check:install`/`check:registry` changes required.

## Test plan

No automated test. The spike's proof: `public/r/theme-<name>.json` exists with the
right `cssVars`, and `check:install` either passes or precisely documents the gap.
If feasible in the executor's environment, do a real `npx shadcn add
<local>/r/theme-<name>.json` into a scratch app using `REGISTRY_BASE_URL` to point
at a local server (the same override the install smoke-test uses) — but this is
optional; `check:install` is the offline gate.

## Done criteria

- [ ] One `registry:theme` entry authored with a `cssVars` token set
- [ ] `public/r/theme-<name>.json` is emitted by `pnpm registry:build`
- [ ] `pnpm check:registry` outcome recorded (pass, or the exact requirement for theme items)
- [ ] `pnpm check:install` outcome recorded (pass, or the precise gap)
- [ ] **Findings** section appended with the product recommendation
- [ ] `plans/README.md` status row updated
- [ ] No full preset catalog built yet (spike scope only)

## STOP conditions

Stop and report if:

- `shadcn build` rejects a `registry:theme` item or a files-less item — record the
  exact error; that defines the real work and is the spike's key result.
- Supporting themes would require non-trivial changes to `check:install` /
  `check:registry` — stop and report the scope rather than building it in the spike.

## Maintenance notes

- Keep theme presets driven by `cssVars` in `registry-meta.ts` so they flow through
  the same single-source-of-truth pipeline as every other item.
- If approved, the playground's Copy-CSS button becomes a "Copy install command"
  affordance — a small follow-up once the theme-item shape is settled.
