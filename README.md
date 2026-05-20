# Sabk

**shadcn's missing pieces.** A peer registry — not a replacement — for the
30-ish components every real product needs but shadcn doesn't ship.
Multi-select, number range, year picker, tag input, phone input,
file dropzone, the lot.

```bash
npx shadcn@latest add https://sabk.dev/r/multi-select.json
```

## Positioning

- **Peer of shadcn.** You must have shadcn installed first. Sabk components
  import from `@/components/ui/*` (Button, Input, Popover, Command, …)
  just like shadcn's own composed blocks do.
- **Distributed via the shadcn registry schema.** No runtime dependency
  on a Sabk package — source is copied straight into your repo.
- **Forge aesthetic.** Mechanical precision: 2px borders, ≤4px radii,
  monospace for labels and counts, motion 120–180ms ease-out, dark as
  primary canvas, one warm-metallic accent. Reject gradients,
  glassmorphism, generic polish.

## Dual-API contract

Every component ships in two shapes from the same file:

```tsx
// Compound (canonical) — for control.
<MultiSelect.Root value={value} onValueChange={setValue} options={options}>
  <MultiSelect.Trigger placeholder="Pick…" />
  <MultiSelect.Content searchPlaceholder="Filter…" />
</MultiSelect.Root>

// Single-prop (convenience) — for speed.
<MultiSelect options={options} value={value} onChange={setValue} />
```

The single-prop form is a thin wrapper over the compound form. Document
compound as canonical; reach for single-prop when ninety percent of
usage fits.

## Phase 1 — Form inputs

| Component        | Status   | Registry dep                           |
| ---------------- | -------- | -------------------------------------- |
| MultiSelect      | shipped  | `button`, `popover`, `command`, `badge`|
| NumberRange      | shipped  | `slider`, `input`, `label`             |
| YearPicker       | shipped  | `button`, `popover`                    |
| MonthPicker      | planned  | `button`, `popover`                    |
| TimePicker       | planned  | `button`, `popover`, `input`           |
| TagInput         | planned  | `badge`, `input`                       |
| Combobox (async) | planned  | `button`, `popover`, `command`         |
| PasswordInput    | planned  | `input`, `button`                      |
| PhoneInput       | planned  | `input`, `popover`, `command`          |
| CurrencyInput    | planned  | `input`                                |
| FileDropzone     | planned  | `button`, `badge`                      |
| ColorPicker      | planned  | `button`, `popover`, `input`           |

Phase 2 (Data display) — DataTable, TreeView, Timeline, Stepper,
KanbanBoard, Calendar, RatingInput, AvatarStack, StatCard, EmptyState,
CopyButton, JsonViewer, DiffViewer, Breadcrumb, CommandPalette — not in
this cut.

## Repository layout

```
sabk/
  app/
    (showcase)/
      [component]/page.tsx     # per-component page: preview · code · install
      layout.tsx               # sidebar + main column
      page.tsx                 # landing
    layout.tsx
    globals.css                # design tokens (forge palette)
  components/
    showcase/                  # shell-only chrome, not part of the registry
  registry/
    sabk/
      ui/                      # shadcn primitives Sabk imports from
      multi-select/
        multi-select.tsx       # component (both APIs in one file)
        multi-select.demo.tsx
        index.ts
      number-range/
      year-picker/
      registry-meta.ts         # showcase metadata for sidebar / pages
  public/r/                    # generated; gitignored
  registry.json                # canonical declaration of every item
  components.json              # shadcn config; `ui` alias → registry/sabk/ui
```

## Scripts

```bash
pnpm dev               # showcase site, http://localhost:3000
pnpm registry:build    # emit /public/r/<name>.json from registry.json
pnpm build             # registry:build && next build
pnpm typecheck
```

## How install works

1. `registry.json` declares each item: name, dependencies (npm packages),
   registryDependencies (shadcn primitives), and source file paths.
2. `pnpm registry:build` (the `shadcn build` CLI) reads `registry.json`,
   inlines source file contents into `/public/r/<name>.json`, and writes
   `target: components/ui/<name>.tsx` so the consumer's shadcn CLI knows
   where to drop the file.
3. A consumer runs `npx shadcn add https://sabk.dev/r/<name>.json`. The
   shadcn CLI fetches each registryDependency from the upstream shadcn
   registry, installs the listed npm dependencies, and copies the source
   file — rewriting alias-prefixed imports to match the consumer's
   `components.json`.

Local install can be validated with `npx shadcn add http://localhost:3000/r/<name>.json`
from a separate consumer project (requires reachable `ui.shadcn.com`
to resolve registry dependencies).

## Contribution checklist

For each new component:

- [ ] Source file at `registry/sabk/<name>/<name>.tsx` exporting both
      the compound namespace (`Name.Root`, `Name.Trigger`, …) and the
      single-prop wrapper from the same file.
- [ ] `Name.demo.tsx` showing both API shapes side by side.
- [ ] `index.ts` re-export.
- [ ] Entry in `registry.json` with `type: "registry:ui"`, `dependencies`,
      `registryDependencies`, `files[].target = "components/ui/<name>.tsx"`.
- [ ] Entry in `registry/sabk/registry-meta.ts` with category, demo,
      and source file list.
- [ ] All imports for shadcn primitives go through `@/registry/sabk/ui/*`
      (alias is rewritten on install).
- [ ] Tokens reuse `--background / --foreground / --border / --forge`
      and friends — never hard-code colors.
- [ ] `pnpm registry:build && pnpm typecheck && pnpm build` clean.

## Design tokens

Dark is the primary canvas. Light is a faithful inverse. The forge
accent (`--forge`, warm copper/brass) is the single color allowed to
shout — selection state, slider fill, focus underline, ◆ marks.
Borders are 2px. Radii cap at 4px on most surfaces, 6px on overlays.
Monospace (`--font-mono`) is reserved for labels, counts, codes, and
status. Motion is 120–180ms with `--ease-forge`. No springs.
