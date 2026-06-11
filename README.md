# Hirael

**Tools for builders who think in systems.** A component registry for the
pieces every real product needs — multi-select, number range, year
picker, tag input, phone input, file dropzone, the lot. A peer of shadcn,
not a replacement. Minimal. Thoughtful. Built to last.

[![Next.js](https://img.shields.io/badge/Next.js-15-000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![shadcn registry](https://img.shields.io/badge/shadcn-registry-000)](https://ui.shadcn.com/docs/registry)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#license)

```bash
npx shadcn@latest add https://hirael.com/r/multi-select.json
```

## Why Hirael

- **Peer of shadcn.** You must have shadcn installed first. Hirael
  components import from `@/components/ui/*` (Button, Input, Popover,
  Command, …) just like shadcn's own composed blocks do.
- **Distributed via the shadcn registry schema.** No runtime dependency
  on a Hirael package — source is copied straight into your repo.
- **Considered design tokens.** 1px soft borders, 0.65rem radius scale
  (sm/md/lg/xl derived from `--radius`), warm-neutral Hirael palette
  (`0D1117`, `1A1F29`, `2E3440`, `ADA69A`, `E7E4DE`), dark as the primary
  canvas. Inter for body, Cormorant Garamond for display, Geist Mono for
  code and identifiers.

## Features

- **Form inputs** — MultiSelect, NumberRange, TagInput, Combobox,
  PasswordInput, CurrencyInput, PhoneInput, Rating.
- **Pickers** — YearPicker, MonthPicker, TimePicker, ColorPicker.
- **Files** — FileDropzone with previews and validation.
- **Data display** — StatCard, Timeline, AvatarStack, TreeView,
  AnimatedNumber.
- **Display & feedback** — Spinner, CopyButton, Marquee, Kbd, Callout,
  ScrollProgress, AnnouncementBar, EmptyState.
- **Navigation** — Stepper (horizontal & vertical orientation).
- **Marketing blocks** — Hero, Feature, Pricing, Testimonial, CTA, FAQ,
  Login, Header, Footer, Not-Found, Logo Cloud, Contact, Blog,
  Dashboard, Integrations, Image Gallery, App Shell.
- **Flat compound APIs** — same composition style shadcn ships, with a
  `data-slot="…"` attribute on every rendered slot for downstream
  styling.
- **RTL support** — components and blocks use CSS logical properties
  (`ms-*`, `pe-*`, `start-*`, `text-start`, …), mirror directional
  icons and arrow-key navigation, and work under `dir="rtl"` with no
  extra configuration. Every preview on the site has an RTL toggle.
- **Design-token driven** — tokens reuse `--background / --foreground /
  --border / --primary / --accent` and friends, never hard-coded colors.

## Tech stack

- [Next.js 15](https://nextjs.org) (App Router, Turbopack)
- [React 19](https://react.dev)
- [TypeScript 5](https://www.typescriptlang.org) — strict mode
- [Tailwind CSS 4](https://tailwindcss.com) via `@tailwindcss/postcss`
- [shadcn CLI](https://ui.shadcn.com) — registry build + install
- [Radix UI](https://www.radix-ui.com) primitives
- [cmdk](https://cmdk.paco.me) for command palettes
- [Shiki](https://shiki.style) for syntax highlighting
- [Lucide](https://lucide.dev) icons
- [Inter](https://rsms.me/inter) (body) / [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) (display) / [Geist Mono](https://vercel.com/font) (code) via `next/font`
- [Zod](https://zod.dev) for schemas
- pnpm (workspace lockfile committed)

## Components

| Component       | Category   | Status | Registry deps                            |
| --------------- | ---------- | ------ | ---------------------------------------- |
| MultiSelect     | inputs     | stable | `button`, `popover`, `command`, `badge`  |
| NumberRange     | inputs     | stable | `slider`, `input`, `label`               |
| TagInput        | inputs     | stable | `badge`                                  |
| Combobox        | inputs     | stable | `button`, `popover`, `command`           |
| PasswordInput   | inputs     | stable | `input`, `input-group`                   |
| CurrencyInput   | inputs     | stable | `input`, `input-group`                   |
| PhoneInput      | inputs     | stable | `input`, `input-group`, `popover`, `command` |
| Rating          | inputs     | stable | —                                        |
| YearPicker      | pickers    | stable | `button`, `popover`                      |
| MonthPicker     | pickers    | stable | `button`, `popover`                      |
| TimePicker      | pickers    | stable | `popover`, `tabs`                        |
| ColorPicker     | pickers    | stable | `popover`, `input`, `tabs`               |
| FileDropzone    | files      | stable | `button`                                 |
| StatCard        | data       | stable | —                                        |
| Timeline        | data       | stable | —                                        |
| AvatarStack     | data       | stable | —                                        |
| TreeView        | data       | stable | —                                        |
| AnimatedNumber  | data       | stable | —                                        |
| Spinner         | display    | stable | —                                        |
| CopyButton      | display    | stable | —                                        |
| Marquee         | display    | stable | —                                        |
| Kbd             | display    | stable | —                                        |
| Callout         | display    | stable | —                                        |
| ScrollProgress  | display    | stable | —                                        |
| AnnouncementBar | display    | stable | —                                        |
| EmptyState      | display    | stable | —                                        |
| Stepper         | navigation | stable | —                                        |

Marketing blocks (Hero, Feature, Pricing, Testimonial, CTA, FAQ, Login,
Header, Footer, Not-Found, Logo Cloud, Contact, Blog, Dashboard,
Integrations, Image Gallery, App Shell) live under
`registry/hirael/blocks/` and are listed in `registry.json`. Browse them
at [hirael.com/blocks](https://hirael.com/blocks).

## Project structure

```
forgecn/
├── app/                          # Next.js App Router
│   ├── (showcase)/               # sidebar + main column
│   │   ├── components/page.tsx   # component index
│   │   ├── blocks/[block]/       # per-block preview
│   │   └── theme/playground.tsx  # theme playground
│   ├── embed/blocks/             # framed block previews
│   ├── layout.tsx
│   ├── globals.css               # design tokens (Hirael palette, 0.65rem radius)
│   └── page.tsx                  # landing
├── components/showcase/          # site chrome (not part of the registry)
├── registry/
│   └── hirael/                   # canonical source for every registry item
│       ├── ui/                   # shadcn primitives the registry imports from
│       ├── <component>/          # *.tsx, *.demo.tsx, index.ts
│       ├── blocks/<block>/       # marketing blocks
│       └── registry-meta.ts      # showcase metadata for sidebar / pages
├── hooks/                        # shared client hooks
├── lib/                          # site config, theme, package-manager helpers
├── scripts/strip-comments.mjs    # strip comments from registry source
├── public/r/                     # generated by `pnpm registry:build` (gitignored)
├── registry.json                 # canonical declaration of every item
└── components.json               # shadcn config; `ui` alias → registry/hirael/ui
```

## Prerequisites

- [Node.js](https://nodejs.org) **20+**
- [pnpm](https://pnpm.io) **8+** (lockfile is `pnpm-lock.yaml`)

## Installation

```bash
git clone https://github.com/MohammadShehadeh/forgecn.git
cd forgecn
pnpm install
```

## Local development

```bash
pnpm dev              # start the showcase site at http://localhost:3000
pnpm registry:build   # emit /public/r/<name>.json from registry.json
```

To validate a registry item end-to-end against a real consumer
project:

```bash
# in a separate consumer app (must have shadcn installed)
npx shadcn@latest add http://localhost:3000/r/<name>.json
```

Resolving `registryDependencies` reaches out to `ui.shadcn.com`, so the
machine must have network access to that host.

### Consuming from a published deployment

```bash
npx shadcn@latest add https://hirael.com/r/multi-select.json
```

The shadcn CLI fetches each `registryDependency` from the upstream
shadcn registry, installs the listed npm dependencies, and copies the
source file into your project — rewriting alias-prefixed imports to
match your `components.json`.

## Available scripts

| Script                 | What it does                                              |
| ---------------------- | --------------------------------------------------------- |
| `pnpm dev`             | Next.js dev server with Turbopack on port 3000            |
| `pnpm build`           | `registry:build` then `next build` (static export → `out/`) |
| `pnpm start`           | Serve the static export in `out/` locally                 |
| `pnpm lint`            | ESLint via `next lint` (`next/core-web-vitals` + TS)      |
| `pnpm typecheck`       | `tsc --noEmit`                                            |
| `pnpm registry:build`  | `shadcn build` — generates `/public/r/<name>.json`        |

## Configuration

Environment variables are optional and read at runtime in the
showcase site.

| Variable               | Used in                            | Default                                | Notes                                                                                              |
| ---------------------- | ---------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_BASE_URL` | `components/showcase/install-block.tsx` | `window.location.origin` at runtime    | Override the public origin used when generating `npx shadcn add <origin>/r/<name>.json` snippets.  |

`registry.json` (`homepage`) and `lib/site.ts` (`SITE.registry.origin`)
hold the canonical published origin — update both if the project moves
to a new domain.

## Usage examples

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

### How install works

1. `registry.json` declares each item: name, dependencies (npm packages),
   `registryDependencies` (shadcn primitives), and source file paths.
2. `pnpm registry:build` (the `shadcn build` CLI) reads `registry.json`,
   inlines source file contents into `/public/r/<name>.json`, and writes
   `target: components/ui/<name>.tsx` so the consumer's shadcn CLI knows
   where to drop the file.
3. A consumer runs `npx shadcn add https://hirael.com/r/<name>.json`.
   The shadcn CLI fetches each `registryDependency` from the upstream
   shadcn registry, installs the listed npm dependencies, and copies the
   source file — rewriting alias-prefixed imports to match the consumer's
   `components.json`.

## Design tokens

Dark is the primary canvas. Light is a warm-neutral inverse on
`#E7E4DE`. The palette anchors on five Hirael hex values converted to
OKLch — `#0D1117` (background), `#1A1F29` (card / popover), `#2E3440`
(raised surface, muted, border), `#ADA69A` (warm taupe accent, used for
muted-foreground and ring), `#E7E4DE` (warm off-white foreground).
`--primary` carries emphasis. Borders are 1px and soft. Radii follow
shadcn's standard scale derived from `--radius: 0.65rem` (sm = radius −
4px, md = radius − 2px, lg = radius, xl = radius + 4px). Inter is the
default body face; Cormorant Garamond is reserved for display
headlines; Geist Mono is reserved for code, install commands, and
identifiers. Motion stays short (120–180ms, ease-out).

## Deployment

The showcase site is a Next.js 15 App Router app built as a fully
static export (`output: "export"`). `pnpm build` runs `registry:build`
first so the generated `/public/r/*.json` files travel with the build,
then runs `next build`, which pre-renders every route to plain
HTML/CSS/JS in `out/`. `pnpm start` serves that directory locally.

The canonical deployment runs at [hirael.com](https://hirael.com).
`.vercel` is gitignored, so Vercel-style deployment is supported out of
the box; because the output is fully static, any static host or CDN
can serve it — no Node server required.

> **TODO** — document hosting-specific build, env, and domain
> configuration once the production deployment pipeline is finalized.

## Contributing

Contributions are welcome — please read
**[CONTRIBUTING.md](./CONTRIBUTING.md)** before opening a PR. It covers
the development workflow, commit conventions, the component
contribution checklist, and the PR review process.

## Security

If you discover a security issue, please follow the disclosure process
in **[SECURITY.md](./SECURITY.md)** rather than opening a public issue.

> **TODO** — `SECURITY.md` is not yet committed; add it before the
> first public release.

## License

MIT — © Mohammad Shehadeh

> **TODO** — add a top-level `LICENSE` file containing the full MIT
> license text.
