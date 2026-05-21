# msh ui

**shadcn's missing pieces.** A peer registry — not a replacement — for the
30-ish components every real product needs but shadcn doesn't ship.
Multi-select, number range, year picker, tag input, phone input,
file dropzone, the lot.

```bash
npx shadcn@latest add https://forgecn.dev/r/multi-select.json
```

## Positioning

- **Peer of shadcn.** You must have shadcn installed first. msh ui
  components import from `@/components/ui/*` (Button, Input, Popover,
  Command, …) just like shadcn's own composed blocks do.
- **Distributed via the shadcn registry schema.** No runtime dependency
  on an msh ui package — source is copied straight into your repo.
- **Modern shadcn polish.** 1px soft borders, 0.65rem radius scale
  (sm/md/lg/xl derived from `--radius`), zinc neutrals, dark as primary
  canvas, no chromatic accent — primary draws the eye. Geist Sans for
  body, Geist Mono reserved for code and identifiers.

## Composition (shadcn-style)

Every compound component ships as flat top-level exports — no
namespacing, no convenience wrappers. Compose the way shadcn ships
their primitives:

```tsx
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectTrigger,
} from "@/components/ui/multi-select"

<MultiSelect value={value} onValueChange={setValue} options={options}>
  <MultiSelectTrigger placeholder="Pick…" />
  <MultiSelectContent searchPlaceholder="Filter…" />
</MultiSelect>
```

The bare component name is the root primitive (it holds the state).
Each part renders with a `data-slot="…"` attribute so downstream
styling and slot-targeting works out of the box.

## Phase 1 — Form inputs

| Component        | Status   | Registry deps                          |
| ---------------- | -------- | -------------------------------------- |
| MultiSelect      | stable   | `button`, `popover`, `command`, `badge`|
| NumberRange      | stable   | `slider`, `input`, `label`             |
| YearPicker       | stable   | `button`, `popover`                    |
| TagInput         | stable   | `badge`                                |
| Combobox         | stable   | `button`, `popover`, `command`         |
| PasswordInput    | stable   | `input`                                |
| CurrencyInput    | stable   | `input`                                |
| PhoneInput       | stable   | `input`, `popover`, `command`          |
| FileDropzone     | stable   | `button`                               |
| StatCard         | stable   | —                                      |
| MonthPicker      | planned  | `button`, `popover`                    |
| TimePicker       | planned  | `button`, `popover`, `input`           |
| ColorPicker      | planned  | `button`, `popover`, `input`           |

Phase 2 (Data display) — DataTable, TreeView, Timeline, Stepper,
KanbanBoard, Calendar, RatingInput, AvatarStack, EmptyState, CopyButton,
JsonViewer, DiffViewer, Breadcrumb, CommandPalette — not in this cut.

## Repository layout

```
msh-ui/
  app/
    page.tsx                   # landing
    (showcase)/
      components/page.tsx      # full component index
      [component]/page.tsx     # per-component page: preview · code · install
      layout.tsx               # sidebar + main column
    layout.tsx
    globals.css                # design tokens (zinc, 0.65rem radius)
  components/
    showcase/                  # shell-only chrome, not part of the registry
  registry/
    sabk/
      ui/                      # shadcn primitives msh ui imports from
      multi-select/
        multi-select.tsx         # component, flat compound exports
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
3. A consumer runs `npx shadcn add https://forgecn.dev/r/<name>.json`. The
   shadcn CLI fetches each registryDependency from the upstream shadcn
   registry, installs the listed npm dependencies, and copies the source
   file — rewriting alias-prefixed imports to match the consumer's
   `components.json`.

Local install can be validated with `npx shadcn add http://localhost:3000/r/<name>.json`
from a separate consumer project (requires reachable `ui.shadcn.com`
to resolve registry dependencies).

## Contribution checklist

For each new component:

- [ ] Source file at `registry/sabk/<name>/<name>.tsx` exporting the
      compound parts as flat top-level named exports (`Name`, `NameTrigger`,
      `NameContent`, …). No namespacing, no convenience wrappers. The
      bare `Name` is the root primitive and holds state.
- [ ] Every rendered slot carries `data-slot="<kebab>"` so downstream
      styling and slot-targeting just works.
- [ ] `Name.demo.tsx` showing a basic compose + a customized compose.
- [ ] `index.ts` re-export.
- [ ] Entry in `registry.json` with `type: "registry:ui"`, `dependencies`,
      `registryDependencies`, `files[].target = "components/ui/<name>.tsx"`.
- [ ] Entry in `registry/sabk/registry-meta.ts` with category, demo,
      and source file list.
- [ ] All imports for shadcn primitives go through `@/registry/sabk/ui/*`
      (alias is rewritten on install).
- [ ] Tokens reuse `--background / --foreground / --border / --primary / --accent`
      and friends — never hard-code colors.
- [ ] `pnpm registry:build && pnpm typecheck && pnpm build` clean.

## Design tokens

Dark is the primary canvas. Light is a faithful inverse. The palette is
pure zinc (achromatic OKLch) with no warm accent — `--primary` carries
emphasis. Borders are 1px and soft (10% white in dark, oklch(0.922) in
light). Radii follow shadcn's standard scale derived from
`--radius: 0.65rem` (sm = radius − 4px, md = radius − 2px, lg = radius,
xl = radius + 4px). Geist Sans is the default body face; Geist Mono is
reserved for code, install commands, and identifiers. Motion stays
short (120–180ms, ease-out).

## License

MIT — © Mohammad Shehadeh
