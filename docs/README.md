# Hirael — agent context

Read this first. It's the orientation a fresh agent needs to make
non-trivial changes without re-reading every file. The other three docs go
deeper on specific topics; nothing here duplicates `CLAUDE.md` / `AGENTS.md`
at the repo root.

## What this is

**Hirael is a shadcn-compatible component registry** — "the components
shadcn/ui doesn't ship." It distributes ~64 React components, 80+ section
blocks, and full-page templates through the shadcn registry schema, so a
consumer runs
`npx shadcn add https://hirael.com/r/<name>.json` and the **source is copied
into their repo**. There is no Hirael npm package and no runtime dependency;
Hirael is a _peer_ of shadcn (its components import shadcn primitives from
`@/components/ui/*`), not a replacement.

The thing in this repo is the **showcase site**: a fully static Next.js 16
App Router export that previews every item, renders prop tables and install
snippets, ships a theme playground, and serves the generated `/r/*.json`
registry files. Because it's `output: "export"`, there is no server at
runtime — every page is HTML/CSS/JS in `out/`.

Live at [hirael.com](https://hirael.com). Author: Mohammad Shehadeh
([mohammadshehadeh.com](https://mohammadshehadeh.com)).

## The registry pipeline (the heart of the repo)

```
registry/hirael/registry-meta.ts   ← single source of truth (you edit this)
        │  pnpm registry:gen
        ▼
registry.json                      ← GENERATED catalog (never hand-edit)
        │  pnpm registry:build (shadcn build)
        ▼
public/r/<name>.json               ← gitignored build output the CLI installs
```

`pnpm check:registry` (in CI and in `pnpm build`) fails if `registry.json`
drifts from `registry-meta.ts`, or if a component's declared
`registryDependencies` don't match its actual imports. `pnpm registry:props`
extracts the prop tables shown on component pages. See
[catalog.md](./catalog.md) for the full item list and
[conventions.md](./conventions.md) for the per-item rules.

## File map

```
app/                              # Next.js App Router (output: "export")
  page.tsx                        # landing — Hero, live demos, why-Hirael grid, category grid, closing CTA
  changelog/page.tsx              # /changelog — rendered from GitHub Releases
  (showcase)/                     # sidebar + topbar shell
    components/page.tsx           # component index (links to category pages)
    components/[category]/        # per-category component listing
    components/[category]/[component]/ # per-component page (demo, usage, props, install)
    blocks/page.tsx               # block index (category tiles)
    blocks/[category]/            # per-category block listing
    blocks/[category]/[block]/    # per-block preview
    templates/page.tsx            # template index
    templates/[template]/         # per-template preview
    theme/playground.tsx          # theme playground
  embed/blocks/[category]/[block]/ # isolated framed block previews
  embed/templates/[template]/     # isolated framed template previews
  global-error.tsx, not-found.tsx # error + 404 surfaces
  globals.css                     # design tokens (slate canvas, cream ink, 0.65rem radius)
  layout.tsx, manifest.ts, sitemap.ts, robots.ts, opengraph-image.tsx, icon.tsx …
components/showcase/              # site chrome — NOT part of the registry
  site-header.tsx, topbar.tsx, sidebar.tsx, site-footer.tsx
  component-page.tsx              # shared detail-page layout (content + "On this page" rail)
  toc.tsx                         # scroll-spy table of contents for the detail pages
  pager.tsx                       # prev/next walk across the whole catalog
  changelog-view.tsx              # /changelog presentation
  code-block.tsx, command-menu.tsx, theme-*.tsx, logo.tsx, install-block.tsx …
registry/hirael/                  # canonical source for every registry item
  ui/<primitive>.tsx              # shadcn primitives only (button, table, popover, …)
  components/<name>.tsx           # hirael's added components (multi-file kits as components/<name>/, e.g. data-table/)
  examples/<component>-demo.tsx   # showcase demo per component
  blocks/<block>/                 # marketing / app blocks
  templates/<template>/           # full-page templates (multi-file)
  registry-meta.ts                # SINGLE SOURCE OF TRUTH
  registry-demos.tsx              # demo registry used by the landing/live previews
hooks/                            # shared client hooks
lib/                              # site.ts, theme.ts, embed.ts, changelog.ts, highlight.ts, utils.ts, demo-locale.tsx (RTL→Arabic demos) …
scripts/                          # build-registry, build-redirects, extract-props, check-registry, check-install
registry.json                    # GENERATED — do not hand-edit
components.json                   # shadcn config; ui alias → registry/hirael/ui
vercel.json                       # GENERATED redirects (old flat URLs → category-nested) + main auto-deploy disabled
```

## What's done

- **Registry pipeline** — `registry-meta.ts` as the single source of truth,
  generation + drift check + prop extraction wired into `pnpm build`.
- **Catalog** — 66 registry UI items (64 components + 2 distribution-only
  primitives), 83 blocks, and 9 full-page templates (Creative Studio,
  Agency Landing, Portfolio, USD Halo, Mindloop, Rivr, NexaCore, Velorah,
  Asme). Full list in [catalog.md](./catalog.md).
- **Showcase** — landing with live demos, component/block/template indexes,
  per-category listing pages, and per-item detail pages laid out like the
  shadcn/ui docs: a breadcrumb + title header, then anchored sections (preview
  or examples, installation, API/props, source, dependencies) in a content
  column beside a sticky scroll-spy "On this page" rail (`toc.tsx`, hidden
  below `xl`). Headings are deep-linkable, the live previews sit on a faint
  dot-grid canvas, and a prev/next pager (`pager.tsx`) walks the whole
  collection across category boundaries. Plus a theme playground, command
  menu, and light/dark toggle. Every browsable item sits under its category
  segment
  (`/components/<category>/<name>`, `/blocks/<category>/<name>`); build
  `entryHref(entry)` rather than hand-writing paths, and old flat URLs 301 to
  the nested ones via generated `vercel.json` redirects.
- **RTL** — every component and block works under `dir="rtl"`; previews have
  an RTL toggle.
- **Fully static export** — `output: "export"`, image optimization off,
  source files read off disk at build time only.
- **SEO** — full metadata, favicons/app icons, manifest, sitemap, robots,
  OG image, JSON-LD.
- **Resilience** — `global-error.tsx` and `not-found.tsx`.
- **Release-driven deploy** — `/changelog` rendered from GitHub Releases;
  Vercel prod deploy gated on a published Release (see AGENTS.md →
  "Public changelog is release-tag driven").

## What's pending

- An automated test runner — there is **no unit/visual-regression suite
  today**; the gating signal is `pnpm lint && pnpm typecheck && pnpm build`
  plus the manual checks in `CONTRIBUTING.md`. shadcn/ui runs vitest; see
  "Upstream alignment" below for the recommended minimal test set.
- Hosting-specific build/env/domain docs once the deploy pipeline is final.

## Deliberate decisions — do not "fix" these

- **Dark is the default canvas.** `:root` is dark; `.light` is the inverse.
  Both must work for every item. Don't assume light-first.
- **`--accent-cool` (the cool blue) is reserved for live/active state.**
  Don't spend it on generic accents or decoration. The warm taupe `--warm`
  is the brand tone for sheen and glows — pair them (warm-near, cool-far),
  don't swap one for the other.
- **registry.json is generated.** Don't hand-edit it; edit
  `registry-meta.ts` and run `pnpm registry:gen`.
- **No em dashes in site copy.** They were deliberately removed across the
  site; use commas, parentheses, or "—"-free phrasing.
- **Social link is GitHub, not Twitter/X.** The Twitter/X link and icon were
  removed on purpose; don't reintroduce them.
- **`output: "export"` everywhere.** No server-only runtime features (route
  handlers at request time, ISR, dynamic rendering). Data is fetched at
  build only.
- **Don't add a `playable`/`published` flag.** An item's presence in
  `registry-meta.ts` is the source of truth for whether it exists.
- **Components are generic controls; domain compositions are blocks.** The
  `components/` tier is for controls reusable across unrelated domains (a
  table, a rating, a metric card, a code editor — composing shadcn primitives
  is fine; being domain-specific is not). A widget that only makes sense for
  one domain — an infra console, a statuspage, a pod table, a billing panel —
  is a **block** under a kind that names that domain, and its block file
  exports both its `data-slot` parts and a ready composition. Three block
  kinds hold the migrated domain widgets: **`cloud`** (`server-card`,
  `vm-table`, `k8s-pod-table`, `resource-status`, `cluster-map`,
  `network-topology`, `storage-browser`, `log-viewer`, `terminal`,
  `deployment-history`), **`saas`** (`billing-card`, `subscription-plans`,
  `api-keys`, `usage-dashboard`, `audit-log`) and **`widgets`** (`kpi-grid`,
  `quick-actions`, `notifications`, `activity-feed`, `inspector-panel`,
  `tenant-switcher`). Genuinely generic composed items stayed components on
  purpose — `data-table` (a table is generic), `metric-card`, `yaml-editor`.
  The old `widgets` and `saas` component _categories_ are gone; those names
  are now block kinds.

## Upstream alignment with shadcn/ui

Hirael's sibling reference is the **shadcn/ui monorepo** (mirrored at
`MohammadShehadeh/ui`). Hirael is, in effect, a standalone, flattened
equivalent of just that repo's `apps/v4` showcase-and-registry app. It
deliberately is **not** a monorepo and ships **no published package**, so most
of shadcn/ui's repo-level machinery does not apply. This section records what
that repo looks like, how hirael compares, and which conventions were adopted
vs deliberately skipped — so the next agent doesn't restructure hirael toward a
shape it chose not to take.

### How shadcn/ui is structured

```
ui/                         # Turborepo + pnpm workspaces + changesets
├── apps/
│   └── v4/                 # the ui.shadcn.com docs + registry site (Next 16)
│       ├── app/ content/   #   app routes + fumadocs MDX docs
│       ├── registry/       #   registry.json + new-york-v4/{ui,example} source,
│       │                   #   built by scripts/build-registry.mts
│       └── scripts/        #   build-registry / capture / validate-registries
├── packages/
│   ├── shadcn/             # the published `shadcn` CLI (npm, versioned by changesets)
│   └── tests/              # shared test fixtures
├── templates/              # framework starters (next/vite/astro/react-router/start)
├── skills/shadcn/          # agent skill (SKILL.md + rules/, cli.md, registry.md, evals/)
├── .changeset/             # changesets versioning for the CLI
├── .github/                # workflows (code-check, test, release, validate-registries),
│                           #   ISSUE_TEMPLATE, dependabot, FUNDING, version scripts
├── turbo.json, vitest.config.ts, vitest.workspace.ts
├── .commitlintrc.json, .editorconfig, .nvmrc, .npmrc, .kodiak.toml
└── prettier.config.cjs (import sorting) · README/CONTRIBUTING/SECURITY/LICENSE
```

The registry idea is the same in both repos — declare items, build them into
JSON the shadcn CLI installs — but the plumbing differs. shadcn/ui's current
model (see `apps/v4/registry/README.md` there) authors two **bases**
(`bases/base/` for Base UI, `bases/radix/` for Radix) and a set of style-token
CSS files (`nova`, `sera`, `vega`, …); `build-registry.mts` crosses them into
generated combinations (`base-nova`, `radix-sera`, …) and even generates
`ui-rtl/` RTL variants for the nova styles. `new-york-v4/` is its **legacy**
directly-authored registry. hirael builds from `registry-meta.ts` (its single
source of truth) into a single `registry/hirael/` tree via
`scripts/build-registry.mjs`. Don't port the bases×styles matrix — hirael ships
one base and one style, and its RTL support lives in the components themselves
(logical properties) rather than generated variants. The directly-authored
analogue is `new-york-v4/{ui,blocks,charts,examples,hooks,internal,lib}` →
hirael's `registry/hirael/{ui,components,blocks,templates,examples}`.

Component **code** is kept in parity too, not just the repo layout: hirael's
`ui/*` primitives are the shadcn **v4** function-component shape (`data-slot`,
`cva`, no `forwardRef`) and demos/blocks follow shadcn's design rules. See
[conventions.md → Component code shape & UI/UX rules](./conventions.md#component-code-shape--uiux-rules-parity-with-shadcnui).

### shadcn/ui vs hirael

| Area                 | shadcn/ui (`ui`)                                                             | hirael                                                                          |
| -------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Topology             | Turborepo monorepo (`apps/*`, `packages/*`)                                  | single Next.js app                                                              |
| Build orchestration  | `turbo run` across workspaces                                                | plain `pnpm` scripts                                                            |
| Published artifact   | `shadcn` CLI on npm                                                          | none — registry JSON only                                                       |
| Registry source      | `bases/{base,radix}` × style tokens (generated combos; `new-york-v4` legacy) | `registry-meta.ts` → generated `registry.json`                                  |
| Tests                | vitest workspace                                                             | none (build pipeline is the gate)                                               |
| Lint / format        | eslint + prettier w/ import sorting                                          | eslint + prettier (no import-order plugin)                                      |
| Commits              | Conventional Commits + `.commitlintrc.json`                                  | Conventional Commits + `.commitlintrc.json` (enforced in CI)                    |
| Release / versioning | changesets → npm publish                                                     | GitHub Release → Vercel prod deploy                                             |
| CI                   | code-check, test, validate-registries, release                               | `ci.yml` (lint/typecheck/build/check:registry/check:install) + `commitlint.yml` |
| Agent tooling        | `skills/shadcn`                                                              | `.claude/` skills (`hero`, etc.) + `AGENTS.md`                                  |
| Meta files           | LICENSE, SECURITY, ISSUE_TEMPLATE                                            | mirrored (see below)                                                            |

### Adopted into hirael

Repo-hygiene conventions hirael mirrors from shadcn/ui, none of which touch
the static-export / release-driven architecture:

- **Conventional-commit enforcement** — `.commitlintrc.json`
  (`@commitlint/config-conventional`) plus a `commitlint.yml` CI job that
  validates PR commit messages. Hirael already _documented_ the convention;
  this enforces it the way shadcn/ui's config does.
- `.editorconfig` and `.nvmrc` (Node `22`, matching CI).
- `LICENSE` (MIT), `SECURITY.md`, `CODE_OF_CONDUCT.md` (Contributor Covenant).
- `.github/ISSUE_TEMPLATE/` (bug + feature + config) and a `PULL_REQUEST_TEMPLATE.md`.

### Deliberately NOT adopted

These belong to shadcn/ui's published-package monorepo and would fight
hirael's [deliberate decisions](#deliberate-decisions--do-not-fix-these):

- **Monorepo conversion** (`apps/` + `packages/` + `turbo.json`) — hirael is one
  static-export app with no package to publish; a workspace split adds cost with
  no consumer.
- **Changesets release flow** — hirael's changelog is GitHub-Release-driven (see
  "Public changelog is release-tag driven" in `AGENTS.md`). Don't replace it.
- **`packages/shadcn` CLI and `templates/` starters** — hirael distributes only
  `/r/*.json`; there is no CLI and no `create`-style framework templates.
- **`new-york-v4` style-directory registry layout** — hirael's single
  `registry/hirael/{ui,components,blocks,templates,examples}` is the one-style
  equivalent.
- **`.npmrc` workspace linking and `.kodiak.toml` auto-merge** — workspace- and
  automerge-specific; not needed for a single repo.

### Recommended, not yet applied

- **vitest smoke tests** — hirael still has no test runner. A minimal set worth
  adding: a `registry.json`-vs-`registry-meta.ts` drift check (already covered
  by `check:registry`, could be a test) and an import-rewrite assertion
  (mirrors `check:install`). shadcn/ui's `apps/v4/registry/*.test.ts` are the
  reference shape.
- **prettier plugins** — hirael already runs prettier (default config, enforced
  on staged files by lint-staged); the delta vs ui is the plugins:
  `@ianvs/prettier-plugin-sort-imports` (import order) and
  `prettier-plugin-tailwindcss` with `tailwindFunctions: ["cn", "cva"]`
  (canonical class order — the more valuable of the two for a registry whose
  source is copied into consumer repos). Adopting them reformats many files, so
  do it as a dedicated one-commit change if at all.
- **Optional local `commit-msg` hook** — contributors who want pre-push feedback
  can add `.husky/commit-msg` containing `pnpm exec commitlint --edit "$1"`. CI
  already enforces it; the hook is convenience only.

## Keep these docs current

If your change makes a statement here wrong, fix it in the same change.
Adding/renaming an item → [catalog.md](./catalog.md); palette/typography/radius
→ [design.md](./design.md); a new framework/registry gotcha →
[conventions.md](./conventions.md); a moved/removed route → this file's map.
Extend these four files; don't spawn a new doc per task.
