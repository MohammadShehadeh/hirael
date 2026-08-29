# Hirael — a shadcn-compatible component registry

Hirael ships "the components shadcn/ui doesn't ship": 70+ React components,
95+ section blocks, and full-page templates, distributed through the **shadcn
registry schema** — consumers run `npx shadcn add
https://hirael.com/r/<name>.json` and the source lands in their repo. There's
no runtime package. The repo is the showcase site: a static Next.js 16 export
that previews every item and serves the generated `/r/*.json` files.
[CONTRIBUTING.md](./CONTRIBUTING.md) has the full workflow and item checklist.

## Stack — not the versions you know

**Next.js 16, React 19, Tailwind v4.** Check the `nextjs` / `shadcn` /
`react-best-practices` skills before framework code. Traps hit here:

- **`output: "export"` — no server at runtime.** Data (the `/changelog`
  fetch, source reads) is fetched once at `next build` and frozen into `out/`.
  Images are `unoptimized`; route `params` are Promises (`await` them);
  `dynamicParams = false`, so add items to `registry-meta.ts`, not a route
  table.
- **The React Compiler is on.** Don't hand-write `useMemo`/`useCallback` in
  showcase code (`app/`, `components/`, `lib/`, the registry's `examples/`) — but **keep
  explicit memoization in shipped registry source** (`ui/*`, `components/*`),
  which consumers may run without the compiler. TanStack Table (v9) components
  need `"use no memo"`.
- **Tailwind is CSS-first** — no config file; tokens via `@theme inline` in
  `app/globals.css`; `.dark` / `.light` set on `<html>` by a prehydration
  script in `app/layout.tsx`.

## registry-meta.ts is the single source of truth

[registry-meta.ts](./registry/hirael/registry-meta.ts) declares every item;
the sidebar, counts, pages, and sitemap derive from it (its presence is the
only "published" flag). To change the catalog: edit it, register the preview
loader in [registry-demos.tsx](./registry/hirael/registry-demos.tsx), commit.
`registry.json`, `registry.base.json`, `registry-props.json`, `llms.txt` and
`/r/**/*.json` are generated on install and build (`pnpm registry:gen` /
`registry:props` / `registry:build`) and are git-ignored, never committed or
hand-edited; `pnpm check:registry` fails on a missing file or loader in either
base. List `registryDependencies` by bare name; generation rewrites
hirael-to-hirael deps to `/r/<name>.json` (Radix) or `/r/base/<name>.json`
(Base UI) URLs. `registry:md` writes each item's page as Markdown beside its
payload (`/r/<name>.md`, `/r/base/<name>.md`): install command, usage, demos,
full source and API in one document, with in-repo imports rewritten to the
paths the CLI installs to. It is what "Copy page" copies and what an agent
handed the URL reads, so the two can never drift.

## Two bases: Radix UI and Base UI

Like shadcn/ui's `registry/bases`, every item exists in two parallel trees:
`registry/hirael/bases/radix/` (the default, `/r/<name>.json`) and
`registry/hirael/bases/base/` (Base UI, `/r/base/<name>.json`). Each tree
holds `ui/`, `components/`, `blocks/`, `templates/` and `examples/`;
`registry-meta.ts` file paths are base-relative (`ui/button.tsx`) and resolve
through `registryFilePath(base, path)`. Author in `radix/` first, then apply
the same change to `base/`: identical files where the item touches no
primitive, otherwise `asChild` → `render`, Radix `data-[state=…]` selectors →
Base UI attributes (`data-open`, `data-popup-open`, `data-panel-open`,
`data-pressed`, `data-checked`, `data-active`), anchored content as
Positioner + Popup, menu item `onSelect` → `onClick`. Never edit only one tree
unless the change is deliberately base-specific. The Customizer's Base picker
switches previews, source tabs, framed embeds (`/embed/base/...`) and install
commands between the two.

## Every item follows the same shape

- **Compound API first** — a flat set of composable parts like shadcn
  primitives, no namespacing. The bare `Name` holds state; `NameTrigger`,
  `NameContent`, … are the parts. A single-prop form is optional, never the
  only API.
- **`data-slot="<kebab>"` on every rendered slot.**
- **`ui/` is shadcn primitives only; hirael's own go in `components/`.** Import
  via `@/registry/hirael/bases/<base>/ui/*` and
  `@/registry/hirael/bases/<base>/components/*` within the same base (rewritten
  on install); never import across bases or across items by relative path.
- **Design tokens, never hard-coded colors** (defined in `app/globals.css`);
  compose classes with `cn()`. Light is a faithful inverse of dark, both must
  work. `--warm` (taupe) is the brand tone; `--accent-cool` is reserved for
  live/active state — don't swap or waste them.
- **A demo at `bases/<base>/examples/<name>-demo.tsx`** (in both bases) with user-facing strings through
  `useT()` — `t({ en, ar })` — so the RTL toggle shows Arabic.
- **RTL works with no config** — logical properties (`ms/me`, `ps/pe`,
  `start/end`), `rtl:rotate-180` on directional icons, mirror horizontal
  arrow-key focus. Physical geometry stays physical (Radix `data-[side]`,
  Sheet/Sidebar `side`). Verify with the toggle.
- **Copy reads like a human** — plain and specific, no hype ("Pick a date",
  not "Effortlessly select your desired date").

## Don't undo these

- **Dark is the default canvas** (`:root`); `.light` is the inverse.
- **No em dashes in site copy; social link is GitHub, not X** — both deliberate.
- **Components are generic controls; single-domain compositions are blocks**
  (the `cloud` / `saas` / `widgets` block kinds).
- **Auth embeds (`/embed/blocks/auth/*`) carry a "doesn't submit" notice** —
  Google Safe Browsing flagged them as phishing. Keep registry components real
  (native `type="password"`), fix appearance at the showcase layer, and don't
  robots-disallow `/embed/`.
- **Single static-export app** — not a monorepo, ships no npm package.

## Gating

Before review, all four pass (plus a manual pass in both themes and RTL):

```bash
pnpm lint && pnpm typecheck && pnpm registry:build && pnpm build
```

## Releases

`/changelog` renders MDX entries from `content/changelog/*.mdx` — one file per
release, compiled at build (`next-mdx-remote`) and frozen into the export.
Frontmatter is `title`, `date` (YYYY-MM-DD), and optional `version` /
`description`; the MDX body is visitor-facing (new components, blocks, fixes —
no build/deploy internals). The site deploys to Cloudflare Pages; add the
changelog entry in the same change and cut a Release to ship it.

**A release that adds items lists their names under `added:`** — the one place
the catalog records what shipped when. `lib/changelog.ts` reads it into
`getReleaseDates()`, which drives the "New" badge (7 days, `lib/freshness.ts`),
the landing page's recently-added rail, and each detail page's `Shipped` line
and `datePublished`. An item no release claims simply has no date and wears no
badge, so an omitted list degrades quietly rather than dating things wrongly.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
