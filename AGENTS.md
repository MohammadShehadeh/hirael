# Hirael — a shadcn-compatible component registry

Hirael ships "the components shadcn/ui doesn't ship": ~64 React components,
80+ section blocks, and full-page templates, distributed through the
**shadcn registry schema** so consumers install them with
`npx shadcn add https://hirael.com/r/<name>.json` and the source lands in
their repo. There is no runtime package. The repo itself is the showcase
site: a fully static Next.js 16 export that previews every item and serves
the generated `/r/*.json` files.

This is the brief; [CONTRIBUTING.md](./CONTRIBUTING.md) has the full
contributor workflow and item checklist. Read both before any non-trivial
change.

## Stack

**Next.js 16, React 19, Tailwind CSS v4** — APIs and conventions differ from
older majors and from most training data. Before framework-level code, check
the matching skill (`nextjs`, `shadcn`, `react-best-practices`). Gotchas
already hit here:

- **`output: "export"` — no server, ISR, or route handlers at runtime.**
  Anything needing data (the `/changelog` fetch, source reads) runs once
  during `next build` and freezes into `out/`. Images are `unoptimized`.
- **Dynamic route `params` are Promises** — `await` them (also in
  `generateMetadata`). Routes use `dynamicParams = false` +
  `generateStaticParams()`, so only enumerated paths build; add items to
  `registry-meta.ts`, not a route table.
- **The React Compiler is on** (`reactCompiler: true`), so it auto-memoizes
  showcase code (`app/`, `components/`, `lib/`, `examples/`) — don't
  hand-write `useMemo`/`useCallback` there. **But shipped registry source
  (`ui/*`, `components/*`) keeps its explicit memoization** — it's copied into
  consumer repos that may not run the compiler. TanStack Table is v9 and its
  table-reading components need `"use no memo"`.
- **Tailwind v4 is CSS-first** — no `tailwind.config.js`; tokens via `@theme
  inline` in `app/globals.css`. Theme is two custom variants, `.dark` /
  `.light`, set on `<html>` by a prehydration script — keep it inline in
  `app/layout.tsx`.

## registry-meta.ts is the single source of truth

[registry/hirael/registry-meta.ts](./registry/hirael/registry-meta.ts)
declares every item (name, category, `files`, `registryDependencies`,
`dependencies`, and for blocks `blockKind` / `blockTagline`). The sidebar,
counts, index pages, and sitemap all derive from it — an entry's presence is
what "published" means; there's no separate flag.

Workflow for any catalog change: edit `registry-meta.ts`, register the
preview loader in [registry-demos.tsx](./registry/hirael/registry-demos.tsx),
run `pnpm registry:gen`, commit. **Never hand-edit `registry.json`** — it's
generated. `pnpm check:registry` (CI and `pnpm build`) fails on drift, on
`registryDependencies` that don't match real imports, or on a showcased entry
with no preview loader; `pnpm check:install` verifies each item installs
offline. List `registryDependencies` by bare name — generation rewrites any
hirael-to-hirael dep into an absolute `/r/<name>.json` URL (bare names resolve
against `ui.shadcn.com`, which only has the primitives).

## Every item follows the same shape

Full checklist in [CONTRIBUTING.md](./CONTRIBUTING.md). The essentials:

- **Compound API first.** Build like shadcn primitives — a flat set of
  composable parts, no namespacing. The bare `Name` holds state;
  `NameTrigger`, `NameContent`, … are the parts. A single-prop convenience
  form is optional and secondary, never the only API.
- **`data-slot="<kebab>"` on every rendered slot.**
- **`ui/` is shadcn primitives only; hirael's own go in `components/`.**
  Import primitives from `@/registry/hirael/ui/*`, other hirael components
  from `@/registry/hirael/components/*` (both aliases rewrite on install).
  Never import across items by relative path — only a multi-file kit's own
  parts may.
- **Design tokens, never hard-coded colors.** Tokens are defined in
  `app/globals.css`; light is a faithful inverse of dark and both must work.
  `--warm` (taupe) is the brand tone; `--accent-cool` is reserved for
  live/active state — don't spend either on decoration or swap them. Reuse the
  custom utilities in `globals.css` (`.text-display`, `.glass-panel`,
  `.ambient-halo`, `.state-dot`, …) rather than re-rolling them.
- **Compose classes with `cn(...)`** from [lib/utils.ts](./lib/utils.ts).
- **A demo at `examples/<name>-demo.tsx`** (basic + customized compose) with
  every user-facing string through `useT()` — `t({ en, ar })` — so the RTL
  toggle renders Arabic, not mirrored English.

**Copy reads like a human:** concise, plain, specific. Short labels and
sentences, no hype ("Pick a date", not "Effortlessly select your desired
date"). Applies to descriptions, demo/block/template copy, empty states, and
site text.

**RTL is not optional.** Every item works under `dir="rtl"` with no config.
Use logical properties (`ms/me`, `ps/pe`, `start/end`, `text-start/end`,
`border-s/e`, `rounded-s/e`), flip directional icons with `rtl:rotate-180`,
and mirror horizontal arrow-key focus movement. Physical geometry stays
physical (Radix `data-[side]`, the color-picker canvas, Sheet/Sidebar
`side`). Two things that don't flip themselves: CSS-transform animations
(the marquee flips its `translateX` sign via a `--marquee-x-dir` CSS var),
and portaled overlays (each `*Content` reads `Direction.useDirection()` and
sets `dir` only when it resolves to `rtl`, since Radix portals to `<body>`
outside any `dir` wrapper). Verify with the preview toggle.

## Where things live

```
app/                      Next.js App Router (output: "export")
  page.tsx                landing
  (showcase)/             sidebar + topbar shell; component/block/template pages
  embed/                  isolated framed previews for blocks/templates
  globals.css             design tokens + custom utilities
components/showcase/       site chrome — NOT part of the registry
registry/hirael/
  ui/<primitive>.tsx      shadcn primitives only
  components/<name>.tsx    hirael's added components (multi-file kits as a folder)
  examples/<name>-demo.tsx per-component demo
  blocks/<block>/          marketing / app blocks
  templates/<template>/    full-page templates
  registry-meta.ts         single source of truth
  registry-demos.tsx       preview-loader registry
lib/, hooks/               site.ts, theme.ts, embed.ts, changelog.ts, demo-locale.tsx …
scripts/                   build-registry, build-redirects, extract-props, check-*
registry.json              GENERATED — never hand-edit
vercel.json                GENERATED redirects + main auto-deploy disabled
```

Browsable items sit under a category segment
(`/components/<category>/<name>`, `/blocks/<category>/<name>`); build links
with `entryHref(entry)` from `registry-meta.ts`, never by hand. Old flat URLs
301 to the nested paths via `vercel.json` redirects, generated by
`scripts/build-redirects.mjs` (also from `pnpm registry:gen`).

## Deliberate decisions — don't undo these

- **Dark is the default canvas** (`:root`); `.light` is the inverse. Never
  assume light-first.
- **No em dashes in site copy** — removed site-wide on purpose; use commas or
  parentheses.
- **Social link is GitHub, not Twitter/X** — the X link was removed
  deliberately.
- **An item's presence in `registry-meta.ts` is the only "published" flag** —
  don't add a `published`/`playable` field.
- **Components are generic controls; domain-specific compositions are blocks.**
  A reusable control (table, rating, metric card) is a component; a
  single-domain widget (infra console, billing panel, pod table) is a **block**
  under a kind that names the domain — the `cloud`, `saas`, and `widgets` block
  kinds hold these.
- **Auth embeds carry a demo notice.** `/embed/blocks/auth/*` serves
  full-viewport login forms that Google Safe Browsing flagged as phishing;
  `BlockEmbedShell` renders a "this form doesn't submit" banner (standalone
  only, via `html[data-framed]`). Keep the registry components real (native
  `type="password"`, real `autocomplete`) and don't robots-disallow `/embed/` —
  fix appearance at the showcase layer, not in shipped source.

## Gating signal

No unit/visual-regression suite yet. Before requesting review, all four must
pass, plus a manual pass (exercise the demo, both themes, the RTL toggle):

```bash
pnpm lint && pnpm typecheck && pnpm registry:build && pnpm build
```

Hirael is deliberately a single static-export app — not a monorepo, and it
ships no npm package. Don't restructure it toward shadcn/ui's
monorepo/changesets/CLI shape.

## Changelog & releases

`/changelog` renders one visitor-facing note per version from GitHub Releases,
fetched at build time by [lib/changelog.ts](./lib/changelog.ts) and frozen
into the static export — not individual commits or branch work. Production
deploys only when a **GitHub Release is published**; Vercel auto-deploy on
`main` is off (`git.deploymentEnabled.main = false` in
[vercel.json](./vercel.json)), so pushing a tag alone does nothing.

Release notes are for visitors: new components, blocks, features, fixes —
leave out build/deploy/tooling internals. Keep titles short (e.g. `RTL across
the catalog`); put detail in the tag/release body under `Highlights:` and
`Fixes:` headings with `- ` bullets, which is what the parser groups. To cut
one:

```bash
git fetch origin --tags
git switch main && git pull origin main
git tag -a v0.7.0 -m "Release title

Highlights:
- Adds ...

Fixes:
- Fixes ..."
git push origin main v0.7.0
```

Then publish a GitHub Release from the tag with a body mirroring the tag
message. If a tag was pushed already, prefer a new patch tag over rewriting
history.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
