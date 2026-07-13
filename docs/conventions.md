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
- **Cross-hirael deps are emitted as URLs.** `registry-meta.ts` lists
  `registryDependencies` by bare name (so `check:registry` can match them to
  imports). At generation time `build-registry.mjs` rewrites any dep that is a
  hirael item into an absolute `https://hirael.com/r/<name>.json` URL — bare
  names resolve against the default `ui.shadcn.com` registry, which only has the
  shadcn primitives, so a hirael-only dep (`calendar-utils`, `confirm`, …) must
  be a URL to install. `REGISTRY_BASE_URL` overrides the base if the registry is
  served somewhere other than `https://hirael.com`.
- **`pnpm check:install` verifies install resolution offline.** A real
  `shadcn add` can't run in CI — the CLI always reaches `ui.shadcn.com` for base
  colors and primitives, which stalls the runner — so instead this rebuilds
  `/r/*.json` and applies shadcn's own import-rewrite rules to every item,
  asserting that each installs to the right place (`ui/` → `components/ui`,
  extended → `components/`), every `@/registry/hirael/*` import maps to a
  consumer alias (nothing left pointing back at the registry), and every
  cross-hirael dep is a `/r/<name>.json` URL rather than a bare name. Network-free
  and deterministic; runs in CI after the build.
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

## Component code shape & UI/UX rules (parity with shadcn/ui)

Hirael's primitives and components are kept in lockstep with shadcn/ui's actual
source shape and design rules — not just its repo layout (see
[README.md → Upstream alignment](./README.md#upstream-alignment-with-shadcnui)).
A structural review against `apps/v4/registry/new-york-v4` confirmed the parity
below; keep new work inside it.

**Primitive shape (the `ui/*` files).** They are the shadcn **v4** shape, copied
faithfully (e.g. `ui/button.tsx` matches upstream byte-for-byte modulo hirael's
semicolons/trailing commas):

- Plain **function components, not `forwardRef`** — `function Button({ … }:
React.ComponentProps<"button"> & VariantProps<…>)`. (React 19 forwards refs as
  a normal prop; the whole `ui/` tree is `forwardRef`-free — keep it that way.)
- **`data-slot="<kebab>"` on every rendered element**, plus `data-variant` /
  `data-size` where a `cva` drives variants. Variant maps are authored with
  `cva` and the `*Variants` fn is exported alongside the component.
- `asChild` via `radix-ui`'s `Slot`; classes always composed through `cn()`.

**Hirael component shape (the `components/*` additions).** Flat compound API with
the bare `Name` holding state — implemented with a `React.createContext` +
`useName()` guard hook, parts (`NameTrigger`, `NameContent`, …) as top-level
named exports, each carrying its own `data-slot`. This is hirael's own pattern;
the rule is compound-first, never a single mega-prop component.

**UI/UX usage rules** (mirrors `skills/shadcn/rules/*` — apply these in demos,
blocks, and templates, the places that _compose_ components):

- **Semantic tokens only** — `bg-primary`, `text-muted-foreground`,
  `text-destructive`. No raw Tailwind color scales for state, and **no manual
  `dark:` color overrides** (tokens already flip). Literal colors are allowed
  only where the color _is_ the data (rating star, heatmap scale, a status dot).
- **`gap-*`, not `space-x-*` / `space-y-*`** — use `flex`/`grid` + `gap`.
- **`size-*` when width == height**; **`truncate`** over the three-class longhand.
- **Don't add `z-index` to overlay components** (Dialog, Sheet, Drawer, Popover,
  Tooltip, DropdownMenu, HoverCard) — they own their stacking.
- **Compose, don't reinvent** — `Alert` for callouts, `Empty` for empty states,
  `Badge` over styled spans, `Separator` over border divs, `Skeleton` over
  `animate-pulse` divs, `sonner` `toast()` for toasts.
- **Accessibility composition** — Dialog/Sheet/Drawer need a `*Title` (use
  `sr-only` if hidden); `Avatar` needs `AvatarFallback`; group items inside their
  `*Group`; `TabsTrigger` inside `TabsList`. `Button` has no `isLoading` — compose
  a `Spinner` + `disabled`.

**Current conformance** (from a registry-wide scan, for the next agent): no
`forwardRef` in `ui/`, no equal `w-N h-N` (uses `size-*`), no manual `dark:`
color overrides. Known minor divergences worth cleaning up opportunistically:
`space-y-*`/`space-x-*` survives in ~14 files (prefer `gap`), and three files use
a literal color for genuinely color-as-data cases (`rating`, `calendar-heatmap`
demo, a portfolio status dot). Don't mass-rewrite; fix in passing.

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

## Embed pages & Safe Browsing

- **Bare auth embeds read as phishing to Google.** `/embed/blocks/auth/*`
  serves full-viewport login forms — brand mark, password field, OAuth
  buttons, no site chrome. Google Safe Browsing flagged exactly that as
  "Possible phishing detected on user login" (Chrome then warns users who
  type saved passwords anywhere on the site). The fix is a demo notice, not
  neutering the components: `BlockEmbedShell` takes `demoNotice` (passed for
  `blockKind === "login"`) and renders a "this form doesn't submit" banner.
- **The notice is standalone-only via `html[data-framed]`.** The pre-paint
  script in `lib/embed.ts` stamps `data-framed` on `<html>` when the page is
  iframed, and the banner carries `[[data-framed]_&]:hidden`. So the static
  HTML (what the Safe Browsing crawler sees) and direct visits show the
  notice, while the showcase's framed previews never flash it. Any future
  auth-looking embed (e.g. a login template) must get the same notice.
- **Don't robots-disallow `/embed/`.** The embed routes rely on
  `robots: { index: false }` metadata; a robots.txt disallow would keep
  Google from fetching the pages at all, so the noindex would go unseen and
  a Safe Browsing security review couldn't verify a fix. Crawlable +
  noindexed is the correct pair.
- **Registry components stay real.** `PasswordInputField` keeps native
  `type="password"` and `autoComplete="current-password"` — consumers install
  it for actual login forms. Don't ship demo-mode workarounds (masked text
  inputs, `autocomplete="off"`) into registry source to appease the
  classifier; fix it at the showcase layer.

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

- Registry source style: **2-space indent, double-quoted strings,
  semicolons** (Prettier defaults; match the surrounding file). Prettier runs
  via lint-staged on commit (`.husky/pre-commit`), auto-formatting staged
  files.
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

## Commits & repo tooling

- **Conventional Commits are enforced.** `.commitlintrc.json` extends
  `@commitlint/config-conventional`, and `.github/workflows/commitlint.yml`
  validates every PR's commit messages. Use `type(scope): summary`
  (`feat`, `fix`, `docs`, `refactor`, `build`, `ci`, `chore`, …) — see
  [CONTRIBUTING.md](../CONTRIBUTING.md) for the type table. Run a message past
  it locally with `echo "feat: x" | pnpm exec commitlint`; for pre-push
  feedback you can add an optional `.husky/commit-msg` running
  `pnpm exec commitlint --edit "$1"`.
- **Node is pinned** in `.nvmrc` (`22`, matching CI's `setup-node`); `nvm use`
  picks it up. Editor defaults live in `.editorconfig` (2-space, LF, final
  newline).
- This convention set mirrors the upstream **shadcn/ui** repo; see
  [README.md → Upstream alignment with shadcn/ui](./README.md#upstream-alignment-with-shadcnui)
  for what hirael adopted from it and what it deliberately does not.
