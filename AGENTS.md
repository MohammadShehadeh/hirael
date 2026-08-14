# Hirael — a shadcn-compatible component registry

Hirael ships "the components shadcn/ui doesn't ship": ~64 React components,
80+ section blocks, and full-page templates, distributed through the
**shadcn registry schema** so consumers install them with
`npx shadcn add https://hirael.com/r/<name>.json` and the source lands in
their repo. There is no runtime package. The repo itself is the showcase
site: a fully static Next.js 16 export that previews every item and serves
the generated `/r/*.json` files.

This is the brief. Detail lives in [docs/](./docs/README.md) — read it before
any non-trivial change.

## Stack

**Next.js 16, React 19, Tailwind CSS v4** — APIs and conventions differ from
older majors and from most training data. Before framework-level code, check
the matching skill (`nextjs`, `shadcn`, `react-best-practices`) and
[docs/conventions.md](./docs/conventions.md) for the gotchas already hit
(async route `params`, `output: "export"`, `@theme inline` tokens, the
`.dark` / `.light` strategy).

The site is `output: "export"` — **no server, ISR, or route handlers at
runtime.** Anything needing data (the `/changelog` fetch, source reads) runs
once during `next build` and freezes into `out/`. Don't assume a request-time
server.

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
with no preview loader.

## Every item follows the same shape

Full checklist in [CONTRIBUTING.md](./CONTRIBUTING.md), rules in
[docs/conventions.md](./docs/conventions.md). The essentials:

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
- **Design tokens, never hard-coded colors** (see
  [docs/design.md](./docs/design.md)). Light is a faithful inverse of dark;
  both must work. `--warm` (taupe) is the brand tone; `--accent-cool` is
  reserved for live/active state — don't spend either on decoration or swap
  them.
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
`side`). Full detail and the overlay/marquee cases in
[docs/conventions.md → RTL](./docs/conventions.md#rtl). Verify with the
toggle.

## Read /docs first

Before any non-trivial change, read [docs/README.md](./docs/README.md) — the
orientation: what's built, where things live, and what NOT to undo. The four
docs are load-bearing, not a changelog; if your change makes one wrong, fix
it in the same change, and don't spawn new doc files.

- `README.md` — file map, done vs pending, deliberate decisions
- `conventions.md` — Next 16 / React 19 / Tailwind v4 / registry gotchas
- `design.md` — palette tokens, typography, radius/motion scale
- `catalog.md` — the full component/block/template catalog

Match: an item → `catalog.md`; palette/type/radius → `design.md`; a framework
gotcha → `conventions.md`; a moved route → `README.md`'s map. Keep the
human-facing [README.md](./README.md) / [CONTRIBUTING.md](./CONTRIBUTING.md)
in sync when the same fact changes.

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
