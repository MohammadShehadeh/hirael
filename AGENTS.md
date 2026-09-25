# Hirael

A shadcn registry of "the components shadcn/ui doesn't ship": components,
section blocks and full-page templates. Consumers run
`npx shadcn add https://hirael.com/r/<name>.json` and own the source; there is
no npm package. This repo is the showcase site, a static Next.js export that
previews every item and serves the generated `/r/*`. Full workflow and item
checklist: [CONTRIBUTING.md](./CONTRIBUTING.md).

## Stack traps

Next.js 16, React 19, Tailwind v4, pnpm 12, Vitest 5. Check the `nextjs` /
`shadcn` skills before framework code.

- **`output: "export"`, no runtime server.** Data is read at `next build` and
  frozen into `out/`. Images are `unoptimized`, route `params` are Promises,
  `dynamicParams = false`: routes come from `registry-meta.ts`.
- **React Compiler is on.** No hand-written `useMemo`/`useCallback` in showcase
  code (`app/`, `components/`, `lib/`, `examples/`). **Keep** them in shipped
  source (`ui/`, `components/` under `bases/`), since consumers may not run the
  compiler. TanStack Table components need `"use no memo"`.
- **Tailwind is CSS-first.** No config file; tokens live in `@theme inline` in
  `app/globals.css`.

## Registry

- **[registry-meta.ts](./registry/hirael/registry-meta.ts) is the single
  source of truth.** Listing an item there publishes it; sidebar, pages, counts
  and sitemap derive from it. Previews are picked up from the file layout
  (`<kind>/<name>/<name>.tsx`, `examples/<name>-demo.tsx`).
- **Generated files are never committed or hand-edited:** `registry*.json`,
  `registry-props.json`, `llms.txt`, `public/r/**` (JSON and per-item `.md`).
  `pnpm install` and `pnpm build` regenerate them.
- **`registryDependencies` by bare name.** Generation turns Hirael-to-Hirael
  deps into `/r/<name>.json` or `/r/base/<name>.json` URLs.

## Two bases

Every item exists in `registry/hirael/bases/radix/` (default, `/r/<name>.json`)
and `registry/hirael/bases/base/` (Base UI, `/r/base/<name>.json`). Meta paths
are base-relative. Author in `radix/`, then port to `base/`: identical where no
primitive is touched, otherwise `asChild` → `render`, `data-[state=…]` →
`data-open` / `data-checked` / `data-pressed` / …, anchored content →
Positioner + Popup, menu `onSelect` → `onClick`. Never change one tree only
unless the difference is deliberate.

## Item shape

- **Compound API.** Flat parts, no namespacing; the bare `Name` holds state.
  A single-prop form is optional, never the only API.
- **`data-slot="<kebab>"`** on every rendered part.
- **`ui/` is shadcn primitives only**, mirrored verbatim; Hirael's own go in
  `components/`. Import via `@/registry/hirael/bases/<base>/{ui,components}/*`
  within one base; never across bases or items by relative path.
- **Adopt the consumer's design system.** Someone with their own customized
  shadcn primitives and theme must get a matching item with zero class
  cleanup. So shipped source uses only shadcn's tokens (`primary`, `muted`,
  `accent`, `border`, `ring`, `chart-*`, …) plus `success` / `warning` /
  `info` (shipped as `cssVars`), composed with `cn()`; never raw colors,
  site-only tokens (`--warm`, `--accent-cool`) or site-only utilities
  (`container`). `pnpm check:registry` enforces it. Tokens follow shadcn
  (`:root` light, `.dark` dark; dark is the default mode); both must work.
- **RTL with no config.** Logical properties, `rtl:rotate-180` on directional
  icons, mirrored arrow keys. Physical geometry (`data-[side]`, Sheet `side`)
  stays physical.
- **A demo in both bases** at `examples/<name>-demo.tsx`, strings through
  `useT()` (`t({ en, ar })`).
- **Plain copy.** "Pick a date", not "Effortlessly select your desired date".
  No em dashes in site copy.

## Lint and tests

`shadcn/no-restyle` is an error: `className` on a Hirael or shadcn component
carries layout only. Fix in this order: an existing variant; a new variant, but
only on Hirael's `components/` (never `ui/`, which consumers install from
shadcn), in both bases; a wrapper element; a `contracts` entry in
`eslint.config.mjs`. Never disable it inline. Source under `bases/*/ui/**` and
`bases/*/components/**` is exempt.

Vitest: `*.test.ts` runs in Node, `*.test.tsx` in jsdom. Site logic tests sit
beside their file in `lib/`; registry tests live in `registry/hirael/tests/`
(never under `bases/`) and cover both bases with `describe.each`. Titles start
with "should".

Comments explain why (a quirk, a race, a constraint), never what the code
says. Shipped source reaches consumers verbatim. Prop JSDoc stays: it feeds the
API tables.

## Don't undo

- Social link is GitHub, not X.
- Generic controls are components; single-domain compositions are blocks
  (`cloud`, `saas`, `widgets`).
- Auth embeds carry a "doesn't submit" notice (Safe Browsing flagged them).
  Keep native `type="password"` in registry code and don't robots-disallow
  `/embed/`.
- One static-export app: no monorepo, no npm package.

## Gate

```bash
pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm registry:build && pnpm build
```

Plus a manual pass in light, dark and RTL, with both bases.

## Releases

One MDX file per release in `content/changelog/` (`title`, `date`, optional
`version` / `description`), written for visitors. **List new item names under
`added:`**: it dates each item and drives the 7-day "New" badge, the
recently-added rail and `datePublished`. Ship the entry with the change; the
site deploys to Cloudflare Pages on Release.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
