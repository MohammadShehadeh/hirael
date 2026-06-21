# Conventions & gotchas

Framework, registry, and tooling notes hit during development. When you trip
over a new one worth a future agent's time, add it here under the right
heading rather than starting a new doc.

## Next.js 16 (App Router)

- **`output: "export"` — the whole site is static.** No server at runtime:
  no request-time route handlers, no ISR, no dynamic rendering, no
  middleware data. Anything that needs data runs **once during
  `next build`** and is frozen into `out/`. See `app/changelog` (build-time
  GitHub fetch) and the `[component]` / `[block]` pages (build-time
  `fs.readFile` of source) for the pattern.
- **Dynamic params are Promises.** Route segment props are
  `params: Promise<{ … }>` and must be `await`ed:

  ```tsx
  export default async function Page({
    params,
  }: {
    params: Promise<{ component: string }>;
  }) {
    const { component } = await params;
  }
  ```

  The same applies to `generateMetadata`. Don't destructure `params`
  synchronously — that's the pre-15 shape.

- **Static param sets are closed.** Dynamic routes use
  `export const dynamicParams = false` + `generateStaticParams()`, so only
  enumerated paths are built and anything else 404s. Add new items to the
  source list (`registry-meta.ts`), not to a separate route table.
- **Reading source off disk is fine — at build time.** The component/block
  pages `import * as fs from "node:fs/promises"` and read the registry TSX to
  show "Usage" source. Under `output: "export"` these reads only ever run
  during the build, so there's no request-time filesystem access. Don't move
  these reads into a client component.
- **Images are `unoptimized: true`** — the optimizer needs a server a static
  export doesn't have. Use plain `<img>`/`next/image` with known dimensions.
- Turbopack powers `next dev` and `next build` (see `package.json`).

## React 19

- **The React Compiler is enabled** (`reactCompiler: true` in
  [next.config.ts](../next.config.ts), via `babel-plugin-react-compiler`), so
  the showcase build auto-memoizes components and hooks. Don't hand-write
  `useMemo`/`useCallback` in showcase/demo code (`app/`, `components/`, `lib/`,
  `registry/hirael/examples/`) — prefer plain derived values. **The exception
  is shipped registry source (`registry/hirael/ui/*` and
  `registry/hirael/components/*`):** it's copied as raw source into consumer
  repos that may not run the compiler, so keep its explicit memoization. The
  compiler only optimizes how this site is built; it never touches what ships.
- **TanStack Table needs `"use no memo"`.** `useReactTable` returns functions
  the compiler can't memoize without serving stale rows, so every file that
  creates or reads a table instance starts with the `"use no memo"` directive —
  the whole `registry/hirael/components/data-table/*` folder **and the
  `data-table-demo` example** that demos it. This is the one place demo code
  keeps explicit `useMemo` and the pragma instead of leaning on the compiler.
- Server Components by default; mark interactive files `"use client"`. The
  showcase chrome (`site-header`, `topbar`, theme toggles) is client; pages
  are mostly server components that pass data down.
- `rsc: true` in `components.json`.

## Tailwind CSS v4

- **No `tailwind.config.js`.** Config is CSS-first: `@import "tailwindcss"`
  in [app/globals.css](../app/globals.css), tokens via `@theme inline`, and
  variants via `@custom-variant`. `components.json` has an empty
  `tailwind.config` on purpose.
- PostCSS is `@tailwindcss/postcss` only (see `postcss.config.mjs`).
- **Theme switching is two custom variants** — `.dark` and `.light` — both
  set on `<html>` by a prehydration script (`lib/theme.ts`,
  `themePrehydrationScript()`), so there's no flash and `dark:` utilities
  resolve the shadcn way. Keep the prehydration script inline in
  `app/layout.tsx`.
- `tw-animate-css` is imported for keyframe utilities.

## Registry items

- **Edit `registry-meta.ts`, then `pnpm registry:gen`.** `registry.json` is
  generated; `pnpm check:registry` fails the build on drift, on declared
  `registryDependencies` that don't match a component's real imports, or on a
  showcased entry missing its preview loader in `registry-demos.tsx`.
- **Register the preview loader in `registry-demos.tsx`.** Every showcased
  item renders its preview / `/embed/*` iframe through `RegistryDemo`, keyed
  by entry name; an unregistered name returns `null` and the preview comes up
  blank. `check:registry` enforces it so this can't ship silently.
- **Compound API first + `data-slot`.** Always default to a flat, shadcn-style
  compound API: the bare `Name` holds state; parts are `NameTrigger`,
  `NameContent`, … A single-prop convenience form is optional and secondary,
  never the only API. Every rendered slot carries `data-slot="<kebab>"`.
- **`ui/` is shadcn primitives; everything hirael adds lives in `components/`.**
  `registry/hirael/ui/*` holds only shadcn-style primitives (button, table,
  popover, …) — the things shadcn itself ships, kept as install dependencies.
  Every component hirael _adds_ (the whole showcased catalog: multi-select,
  combobox, date-picker, data-table, …) lives in `registry/hirael/components/`:
  single-file ones as `components/<name>.tsx`, multi-file kits as a folder
  `components/<name>/*`. `components.json`'s `components` alias is
  `@/registry/hirael/components` so the two aliases (`ui`, `components`) map
  cleanly to the consumer's on install.
- **Imports + the two aliases.** Import primitives from
  `@/registry/hirael/ui/*` and extended components from
  `@/registry/hirael/components/*`; never by relative path across items (shadcn
  rewrites both aliases to the consumer's `components.json` on install — it
  keys off the `/ui/` and `/components/` path segments, see the `ga` transform
  in the shadcn CLI). Inside one multi-file kit, parts import each other by
  **relative path** (like templates). `check:registry` collects both `ui/*` and
  `components/*` imports and matches them to `registryDependencies`.
- **Tokens, not colors.** Never hard-code a color in component source.
- **Comments are stripped on publish** (`scripts/strip-comments.mjs`) because
  the source is copied into consumer repos. Put reasoning in commits/PRs/docs.
  Comments in `components/showcase/`, `app/`, `lib/` are fine — those aren't
  published.
- **The component page renders any multi-file item as a file tree**
  (`component-page.tsx`, `treeView`) — used by the data table and every block /
  template.
- **Distribution-only items** (`accordion`, `calendar-utils`) live in
  `DISTRIBUTION_ONLY` in `registry-meta.ts`: they ship in the registry but have
  no standalone showcase page.
- **One `useDataTable`, server or client.** The hook always keeps page, sort
  and per-column filters in the URL (nuqs). Pass `pageCount` and it runs
  manual (the server queries; `data` is the current page); omit it and the
  table sorts, filters and pages the full `data` array in memory from the same
  URL state. Filter values are encoded per `meta.variant` — arrays for
  `select` / `multiSelect` / `range` / `dateRange`, scalars for `text` /
  `number` / `date` — so a multi-word text filter survives a round-trip.
- **URL-state demos wrap themselves in a nuqs adapter.** The `data-table-demo`
  example uses `useDataTable`, so it wraps its content in `NuqsAdapter`
  (`nuqs/adapters/next/app`). That's safe under `output: "export"` because
  previews render client-side through `React.lazy` + `Suspense`
  (`registry-demos.tsx`), so `useSearchParams` is never called during the
  static prerender.

## Routing & URLs

- **Every browsable item sits under its category segment.** Components live at
  `/components/<category>/<name>`, blocks at `/blocks/<category>/<name>`.
  Templates stay flat (`/templates/<name>`) — there's a single template
  category, so the collection _is_ the group. Each tier also has a category
  listing page (`/components/<category>`, `/blocks/<category>`).
- **Never hand-write item paths — call the helpers in `registry-meta.ts`.**
  `entryHref(entry)` gives the detail path, `entryEmbedHref(entry)` the framed
  `/embed/*` path, `entryCategorySlug(entry)` the segment. They keep the slug
  logic in one place, and live in data-only `registry-meta.ts` so the sidebar
  and command palette can import them without dragging block-illustration code
  into a client bundle.
- **Component vs block slugs differ.** A component's category key _is_ its slug
  (`inputs`, `pickers`, …). Block slugs come from `BLOCK_KIND_SLUGS`, which
  reads better in a path than the raw kind (`feature` → `features`, `login` →
  `auth`, `faq` → `faqs`). `BLOCK_KIND_BY_SLUG` is the reverse.
- **Nested dynamic routes are doubly closed.** `generateStaticParams` returns
  `{ category, … }` pairs and the page 404s unless `entryCategorySlug(entry)`
  matches the requested segment, so only the canonical category/name pair
  resolves (`/components/pickers/multi-select` 404s; `/components/inputs/multi-select`
  serves). Keep `dynamicParams = false`.
- **Breadcrumbs** render through `components/showcase/breadcrumbs.tsx`; detail
  pages pass a `breadcrumb` trail to `ComponentPage`. Slash separators are
  RTL-neutral, so there's nothing directional to flip.
- **Old flat URLs are kept alive.** `vercel.json` redirects (`/components/<name>`,
  `/blocks/<name>`, and the legacy bare `/<name>`) 301 to the nested paths.
  That file's `redirects` array is GENERATED by `scripts/build-redirects.mjs`,
  run from `pnpm registry:gen` — don't hand-edit it. Vercel reads `vercel.json`
  from the repo (not the build output), so it must be regenerated and committed
  at authoring time, never during the deploy build.

## RTL

Components, blocks, and templates must work under `dir="rtl"` with no extra
config. Use
**logical** utilities (`ms/me`, `ps/pe`, `start/end`, `text-start/end`,
`border-s/e`, `rounded-s/e`) over physical ones; flip directional icons with
`rtl:rotate-180`; mirror horizontal arrow-key focus movement. Physical
positioning is fine where geometry genuinely is physical (Radix
`data-[side]` animations, the color-picker canvas, `side="left|right"` on
Sheet/Sidebar). Every preview has an RTL toggle — verify with it.

**CSS-transform animations don't flip themselves.** `translateX` is physical,
so a keyframe that scrolls a `dir`-aware flex flow has to flip its sign under
RTL or the loop tears (content exits with nothing trailing it). The marquee
(`ui/marquee.tsx`) drives its horizontal travel through a `--marquee-x-dir`
sign (`-1` ltr, `1` rtl, set by a `[dir="rtl"] [data-slot="marquee-track"]`
rule) so the track moves toward the inline-start either way; `translateY` for
the vertical mode stays put since the block axis doesn't flip.

The framed `/embed/*` previews carry direction as a `?dir=rtl` query
param. It's applied to `<html dir>` by a pre-paint inline script
(`lib/embed.ts`, rendered from each embed `page.tsx`), the same trick the
theme uses — so an RTL preview comes up correct on the first frame instead
of flipping after hydration. The embed shells are plain background wrappers;
don't reintroduce direction state there.

**Portaled overlays carry direction explicitly.** Radix/Base UI portal
popover, dropdown, select, dialog, sheet, tooltip and hover-card content to
`<body>` — outside any `dir` wrapper — and Radix's Popper does not stamp
`dir` on the floating node, so portaled content otherwise only picks up RTL
from `<html dir>`. Each overlay's `*Content` reads `Direction.useDirection()`
and sets `dir` **only when it resolves to `rtl`** (never forcing `ltr`, so a
consumer's `html[dir]` is never overridden); wrapping a subtree in the
`direction` primitive's `DirectionProvider` (Radix) or Base UI's then drives
them. `ExampleBlock` wraps each preview in both providers, which is why
multi-select / combobox / picker dropdowns render RTL on the showcase even
though `dir` is only on a wrapper `<div>`, not `<html>`. Radix menu/select
primitives already consume the provider themselves. Keep physical geometry
that is genuinely physical (Sheet/Sidebar `side`, drawer `vaul-direction`,
`data-[side]` animations, centering transforms) — convert only content
layout (text, padding, adornment positions) to logical utilities.

**Component previews render Arabic in RTL.** On component detail pages the
RTL toggle isn't only a direction flip — `ExampleBlock` (in
`component-page.tsx`) wraps the demo in a `DemoLocaleProvider`
(`lib/demo-locale.tsx`) set to `ar` when RTL is on, `en` otherwise, and
remounts the demo via a `key` so locale-derived initial state (entered
text, selections) re-seeds in the active language. So an RTL component
preview shows real Arabic text, not mirrored English. Every component demo
in `registry/hirael/examples/*` therefore sources its user-facing strings
through `useT()`: `t({ en: "Pick a date", ar: "اختر تاريخًا" })`, which works
for strings, arrays of options, and JSX nodes alike. A new demo must do the
same — wrap visible copy in `t({ en, ar })`, keeping brand names, codes,
URLs, and Western digits unchanged. (Blocks/templates preview through the
`/embed/*` iframe and stay English for now; the provider is wired only into
the component `ExampleBlock`.)

## Changelog fetch

[lib/changelog.ts](../lib/changelog.ts) fetches GitHub Releases with
`cache: "force-cache"` so the result is baked into the static export. It
fails soft: a non-200 or thrown error yields an empty list and the page
shows "No releases recorded yet" rather than failing the build. Auth is
optional via `GITHUB_TOKEN_HIRAEL` (mapped from `RELEASES_TOKEN` in the
release build, and the Actions `GITHUB_TOKEN` in CI) to dodge the 60 req/hr
unauthenticated limit on shared runner IPs. Release bodies must use
`Heading:` lines followed by `- ` bullets — that's what the parser groups
into sections.

## Style

- Registry source style: **2-space indent, double-quoted strings, no
  trailing semicolons** (match the surrounding file). The repo does not run a
  separate formatter — don't reformat committed files; reset your editor's
  formatter on this repo instead.
- Prefer named exports; default exports are reserved for Next.js route/page
  files.
- Use the `@/` path alias, not `../../` chains.
- Compose class names with `cn(...)` from `@/lib/utils`.
- **Copy reads like a human** — concise, plain, specific; short labels and
  sentences; no filler or marketing voice. Applies to registry
  `description`s, demo / block / template copy, empty states, and showcase
  text. Prefer "Pick a date" over "Effortlessly select your desired date."
- **No em dashes in user-facing copy** — a deliberate site-wide decision.

## Detail-page layout (`component-page.tsx`)

The shared per-item page (components, blocks, templates) renders a content
column beside a sticky "On this page" rail (`toc.tsx`), shadcn-docs style. Two
things to keep in sync when you touch it:

- **One descriptor list, two consumers.** `ComponentPage` builds a single
  `sections` array (`{ id, label, content }`) and feeds it to both the rendered
  `<Section>`s and the `Toc`. Add or reorder a section there, not in two places,
  or the rail drifts from the page.
- **Sticky offsets must agree.** The topbar is `sticky h-14`, so every section
  carries `scroll-mt-24` and the rail sticks at `top-24`; the scroll-spy
  `rootMargin` clears the same band. Change one, change all three. The rail is
  client-only (an `IntersectionObserver`), which is fine under `output:
"export"` — it ships static and wires up on hydration.
- **Headings deep-link; the pager walks the collection.** Each `<Section>`
  heading is an `<a href="#id">` with a hover-revealed hash, and the page ends
  with a prev/next `Pager`. Siblings come from `entrySiblings(entry)` in
  `registry-meta.ts`, which walks a flat per-collection order
  (`COMPONENTS_ORDERED` chains every category end-to-end, `BLOCKS_ORDERED`
  every kind), so Next crosses category boundaries. The pager chevrons flip
  with `rtl:rotate-180`.
- **Previews sit on a dot-grid canvas.** Component examples and the block
  viewer back their preview surface with `bg-dot-grid` (token-only, so it
  works in both themes); the toolbar keeps the `bg-card` tint so chrome reads
  apart from the canvas.

## Gating signal

There is no unit/visual-regression suite yet. Before requesting review:

```bash
pnpm lint && pnpm typecheck && pnpm registry:build && pnpm build
```

plus the manual checks in [CONTRIBUTING.md](../CONTRIBUTING.md) (exercise the
showcase demo, validate an `npx shadcn add` into a consumer app, check both
themes, spot-check keyboard/AT for interactive items).
