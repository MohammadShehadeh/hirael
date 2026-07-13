# Hirael

The components shadcn/ui doesn't ship: multi-select, number range, year
picker, tag input, phone input, file dropzone, and a few dozen more,
plus full section blocks. Hirael is a shadcn-compatible registry, so it
works alongside shadcn rather than replacing it. The CLI copies the
source into your repo and there's no package to depend on.

[![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![shadcn registry](https://img.shields.io/badge/shadcn-registry-000)](https://ui.shadcn.com/docs/registry)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#license)

```bash
npx shadcn@latest add https://hirael.com/r/multi-select.json
```

## The name

**Hirael** is a coined word, not a translation.

- **Hira-** comes from _hiraeth_ (Welsh): a deep longing for a place or
  time you can't return to.
- **-el** is a soft, old-feeling name ending, slightly celestial — as in
  Gabriel or Noel.

Together it reads as a quiet longing for something familiar but out of
reach — softened by acceptance rather than despair. The intended register
is melancholic but calm: memory and distance, a little reflective, minimal,
more "soft sadness with clarity" than heavy or dark.

It's deliberately a container word — it has no fixed dictionary meaning, so
the meaning is the one the product earns over time.

## Why Hirael

- **Peer of shadcn.** You must have shadcn installed first. Hirael
  components import from `@/components/ui/*` (Button, Input, Popover,
  Command, …) just like shadcn's own composed blocks do.
- **Distributed via the shadcn registry schema.** No runtime dependency
  on a Hirael package — source is copied straight into your repo.
- **Considered design tokens.** 1px soft borders, 0.65rem radius scale
  (sm/md/lg/xl derived from `--radius`), a cool blue-slate canvas in OKLch
  with dark as the primary mode and warm cream ink, plus two non-neutrals —
  a warm taupe brand tone (`--warm`) and a single cool blue (`--accent-cool`)
  reserved for live/active state. Inter for body, Geist Mono for code and
  identifiers, Cormorant Garamond for the display wordmark.

## Features

- **Form inputs** — MultiSelect, NumberRange, TagInput, Combobox,
  PasswordInput, CurrencyInput, PhoneInput, Rating.
- **Pickers** — YearPicker, MonthPicker, TimePicker, ColorPicker.
- **Files** — FileDropzone with previews and validation.
- **Data display** — StatCard, Timeline, AvatarStack, TreeView,
  AnimatedNumber.
- **Display & feedback** — Spinner, CopyButton, Marquee, Kbd, Callout,
  ScrollProgress, AnnouncementBar.
- **Navigation** — Stepper (horizontal & vertical orientation).
- **Marketing blocks** — Hero, Feature, Pricing, Testimonial, CTA, FAQ,
  Login, Header, Footer, Not-Found, Logo Cloud, Contact, Blog,
  Dashboard, Integrations, Image Gallery, App Shell.
- **Templates** — full-page, multi-section layouts (e.g. Creative
  Studio) that compose blocks and components into a finished page.
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

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
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

| Component       | Category   | Status | Registry deps                                |
| --------------- | ---------- | ------ | -------------------------------------------- |
| MultiSelect     | inputs     | stable | `button`, `popover`, `command`, `badge`      |
| NumberRange     | inputs     | stable | `slider`, `input`, `label`                   |
| TagInput        | inputs     | stable | `badge`                                      |
| Combobox        | inputs     | stable | `button`, `popover`, `command`               |
| PasswordInput   | inputs     | stable | `input`, `input-group`                       |
| CurrencyInput   | inputs     | stable | `input`, `input-group`                       |
| PhoneInput      | inputs     | stable | `input`, `input-group`, `popover`, `command` |
| Rating          | inputs     | stable | —                                            |
| YearPicker      | pickers    | stable | `button`, `popover`                          |
| MonthPicker     | pickers    | stable | `button`, `popover`                          |
| TimePicker      | pickers    | stable | `popover`, `tabs`                            |
| ColorPicker     | pickers    | stable | `popover`, `input`, `tabs`                   |
| FileDropzone    | files      | stable | `button`                                     |
| StatCard        | data       | stable | —                                            |
| Timeline        | data       | stable | —                                            |
| AvatarStack     | data       | stable | —                                            |
| TreeView        | data       | stable | —                                            |
| AnimatedNumber  | data       | stable | —                                            |
| Spinner         | display    | stable | —                                            |
| CopyButton      | display    | stable | —                                            |
| Marquee         | display    | stable | —                                            |
| Kbd             | display    | stable | —                                            |
| Callout         | display    | stable | —                                            |
| ScrollProgress  | display    | stable | —                                            |
| AnnouncementBar | display    | stable | —                                            |
| Stepper         | navigation | stable | —                                            |

Marketing blocks (Hero, Feature, Pricing, Testimonial, CTA, FAQ, Login,
Header, Footer, Not-Found, Logo Cloud, Contact, Blog, Dashboard,
Integrations, Image Gallery, App Shell) live under
`registry/hirael/blocks/` and are listed in `registry.json`. Browse them
at [hirael.com/blocks](https://hirael.com/blocks).

## Project structure

```
hirael/
├── app/                          # Next.js App Router
│   ├── (showcase)/               # sidebar + main column
│   │   ├── components/page.tsx   # component index
│   │   ├── components/[category]/[component]/ # per-component page
│   │   ├── blocks/[category]/[block]/         # per-block preview
│   │   ├── templates/[template]/ # per-template preview
│   │   └── theme/playground.tsx  # theme playground
│   ├── embed/blocks/[category]/[block]/ # framed block previews
│   ├── layout.tsx
│   ├── globals.css               # design tokens (Hirael palette, 0.65rem radius)
│   └── page.tsx                  # landing
├── components/showcase/          # site chrome (not part of the registry)
├── registry/
│   └── hirael/                   # canonical source for every registry item
│       ├── ui/                   # shadcn primitives only (install dependencies)
│       ├── components/           # every component hirael adds (extended); data-table is a folder
│       ├── examples/             # <component>-demo.tsx showcase demos
│       ├── blocks/<block>/       # marketing blocks
│       ├── templates/<template>/ # full-page templates
│       └── registry-meta.ts      # showcase metadata for sidebar / pages
├── hooks/                        # shared client hooks
├── lib/                          # site config, theme, package-manager helpers
├── scripts/strip-comments.mjs    # strip comments from registry source
├── public/r/                     # generated by `pnpm registry:build` (gitignored)
├── registry.json                 # canonical declaration of every item
└── components.json               # shadcn config; `ui` alias → registry/hirael/ui
```

## Prerequisites

- [Node.js](https://nodejs.org) **20+** (CI runs Node 22; `.nvmrc` pins it — `nvm use`)
- [pnpm](https://pnpm.io) **10+** (lockfile is `pnpm-lock.yaml`)

## Installation

```bash
git clone https://github.com/MohammadShehadeh/hirael.com.git
cd hirael.com
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

| Script                | What it does                                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`            | Next.js dev server with Turbopack on port 3000                                                                  |
| `pnpm build`          | `registry:gen` → `registry:props` → `check:registry` → `registry:build` → `next build` (static export → `out/`) |
| `pnpm start`          | Serve the static export in `out/` locally                                                                       |
| `pnpm lint`           | ESLint (`eslint .`, flat config)                                                                                |
| `pnpm typecheck`      | `tsc --noEmit`                                                                                                  |
| `pnpm registry:build` | `shadcn build` — generates `/public/r/<name>.json`                                                              |

## Configuration

Environment variables are optional and read at build time (this is a
static export — there is no runtime server).

| Variable               | Used in                                 | Default                             | Notes                                                                                             |
| ---------------------- | --------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_BASE_URL` | `components/showcase/install-block.tsx` | `window.location.origin` at runtime | Override the public origin used when generating `npx shadcn add <origin>/r/<name>.json` snippets. |
| `REGISTRY_BASE_URL`    | `scripts/build-registry.mjs`            | `https://hirael.com`                | Build-time override for the registry base URL baked into generated `registryDependencies` links.  |
| `GITHUB_TOKEN_HIRAEL`  | `lib/changelog.ts`                      | none (anonymous)                    | Authenticates the build-time GitHub Releases fetch to avoid the 60 req/hr unauthenticated limit.  |

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
} from "@/components/ui/multi-select";

<MultiSelect value={value} onValueChange={setValue} options={options}>
  <MultiSelectTrigger placeholder="Pick…" />
  <MultiSelectContent searchPlaceholder="Filter…" />
</MultiSelect>;
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

Dark is the primary canvas (`:root`); light is a warm-cream inverse
behind a `.light` class, with the standard shadcn `.dark` class
mirrored onto `<html>` in dark mode so `dark:` variants resolve the
same way they do in a consumer app. The palette is a cool blue-slate
canvas in OKLch under warm cream ink, with two non-neutrals — a warm
taupe brand tone (`--warm`) and a single cool blue (`--accent-cool`)
reserved for live/active state. `--primary` carries emphasis (cream
on dark, slate on light). Borders are 1px and soft. Radii follow shadcn's standard scale derived from
`--radius: 0.65rem` (sm = radius − 4px, md = radius − 2px, lg =
radius, xl = radius + 4px). Inter is the default body face; Geist
Mono is reserved for code, install commands, and identifiers;
Cormorant Garamond is loaded for serif accents (e.g. testimonial
quote marks). Motion stays short (120–180ms, ease-out).

## Deployment

The showcase site is a Next.js 16 App Router app built as a fully
static export (`output: "export"`). `pnpm build` first regenerates
`registry.json` from `registry/hirael/registry-meta.ts`
(`registry:gen`), verifies it (`check:registry`), and runs
`registry:build` so the generated `/public/r/*.json` files travel with
the build, then runs `next build`, which pre-renders every route to
plain HTML/CSS/JS in `out/`. `pnpm start` serves that directory
locally.

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
Participation is governed by our
**[Code of Conduct](./CODE_OF_CONDUCT.md)**.

## License

MIT — © Mohammad Shehadeh. See **[LICENSE](./LICENSE)** for the full text.
