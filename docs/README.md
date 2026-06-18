# Hirael — agent context

Read this first. It's the orientation a fresh agent needs to make
non-trivial changes without re-reading every file. The other three docs go
deeper on specific topics; nothing here duplicates `CLAUDE.md` / `AGENTS.md`
at the repo root.

## What this is

**Hirael is a shadcn-compatible component registry** — "the components
shadcn/ui doesn't ship." It distributes ~70 React components, ~40 section
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
        │  pnpm registry:build (shadcn build)  +  scripts/strip-comments.mjs
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
  ui/<component>.tsx              # component source (flat compound exports)
  ui/<primitive>.tsx              # shadcn primitives the registry imports from
  examples/<component>-demo.tsx   # showcase demo per component
  blocks/<block>/                 # marketing / app blocks
  templates/<template>/           # full-page templates (multi-file)
  registry-meta.ts                # SINGLE SOURCE OF TRUTH
  registry-demos.tsx              # demo registry used by the landing/live previews
hooks/                            # shared client hooks
lib/                              # site.ts, theme.ts, embed.ts, changelog.ts, highlight.ts, utils.ts …
scripts/                          # build-registry, extract-props, check-registry, strip-comments
registry.json                    # GENERATED — do not hand-edit
components.json                   # shadcn config; ui alias → registry/hirael/ui
vercel.json                       # GENERATED redirects (old flat URLs → category-nested) + main auto-deploy disabled
```

## What's done

- **Registry pipeline** — `registry-meta.ts` as the single source of truth,
  generation + drift check + prop extraction + comment stripping wired into
  `pnpm build`.
- **Catalog** — 70 registry UI items (69 components + the distribution-only
  `accordion`), 40 blocks, and 10 full-page templates (Creative Studio,
  Agency Landing, Portfolio, USD Halo, Mindloop, Rivr, NexaCore, Velorah,
  Asme, Infrazen). Full list in [catalog.md](./catalog.md).
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

These are referenced as `TODO` in `README.md` / `CONTRIBUTING.md` and not
yet committed:

- `LICENSE` file (MIT is declared but the full text file is missing).
- `SECURITY.md`, `CODE_OF_CONDUCT.md`, and `.github/ISSUE_TEMPLATE/`.
- An automated test runner — there is **no unit/visual-regression suite
  today**; the gating signal is `pnpm lint && pnpm typecheck && pnpm build`
  plus the manual checks in `CONTRIBUTING.md`.
- Hosting-specific build/env/domain docs once the deploy pipeline is final.
- Some prose in the top-level `README.md` still references old project
  names (`forgecn`) in the directory tree and clone URL — correct these
  when you next touch that file.

## Deliberate decisions — do not "fix" these

- **Dark is the default canvas.** `:root` is dark; `.light` is the inverse.
  Both must work for every item. Don't assume light-first.
- **`--accent-cool` (the cool blue) is reserved for live/active state.**
  Don't spend it on generic accents or decoration. The warm taupe `--warm`
  is the brand tone for sheen and glows — pair them (warm-near, cool-far),
  don't swap one for the other.
- **registry.json is generated.** Don't hand-edit it; edit
  `registry-meta.ts` and run `pnpm registry:gen`.
- **Comments are stripped from `registry/hirael/**` on publish.\*\* Keep
  reasoning in commits/PRs/docs, not in shipped component source.
- **No em dashes in site copy.** They were deliberately removed across the
  site; use commas, parentheses, or "—"-free phrasing.
- **Social link is GitHub, not Twitter/X.** The Twitter/X link and icon were
  removed on purpose; don't reintroduce them.
- **`output: "export"` everywhere.** No server-only runtime features (route
  handlers at request time, ISR, dynamic rendering). Data is fetched at
  build only.
- **Don't add a `playable`/`published` flag.** An item's presence in
  `registry-meta.ts` is the source of truth for whether it exists.

## Keep these docs current

If your change makes a statement here wrong, fix it in the same change.
Adding/renaming an item → [catalog.md](./catalog.md); palette/typography/radius
→ [design.md](./design.md); a new framework/registry gotcha →
[conventions.md](./conventions.md); a moved/removed route → this file's map.
Extend these four files; don't spawn a new doc per task.
