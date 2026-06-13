# Hirael — a shadcn-compatible component registry

Hirael ships "the components shadcn/ui doesn't ship": ~45 React components,
~40 section blocks, and full-page templates, distributed through the
**shadcn registry schema** so consumers install them with
`npx shadcn add https://hirael.com/r/<name>.json` and the source lands in
their repo. There is no runtime package. The
showcase site in this repo is a fully static Next.js 16 export that
previews every item and serves the generated `/r/*.json` registry files.

This file is the load-bearing brief. The deeper detail lives in
[docs/](./docs/README.md) — read that before any non-trivial change.

## This is NOT the Next.js / React / Tailwind you know

This repo runs **Next.js 16, React 19, and Tailwind CSS v4** — APIs,
defaults, and file conventions differ from older majors and from most
training data. Before writing framework-level code, check the matching
skill (`nextjs`, `shadcn`, `react-best-practices`) and
[docs/conventions.md](./docs/conventions.md), which records the gotchas
already hit here (async route `params` are Promises, `output: "export"`
constraints, Tailwind v4 `@theme inline` tokens, the `.dark` / `.light`
class strategy). Heed deprecation notices rather than reaching for the old
shape.

The whole site is `output: "export"` (see [next.config.ts](./next.config.ts)) —
**there is no server, no ISR, no route handlers at runtime.** Anything that
needs data (the `/changelog` GitHub fetch, the component source reads) runs
once during `next build` and is frozen into `out/`. Do not add code that
assumes a request-time server.

## registry-meta.ts is the single source of truth — never hand-edit registry.json

[registry/hirael/registry-meta.ts](./registry/hirael/registry-meta.ts)
declares every item: name, title, description, category, `sourceFiles`,
`installTargets`, `registryDependencies`, `dependencies`, and (for blocks)
`blockKind` / `blockTagline`. From it:

- `pnpm registry:gen` regenerates **registry.json** — it is GENERATED, do
  not edit it by hand.
- `pnpm registry:props` extracts the prop tables shown on component pages.
- `pnpm check:registry` (run in CI and by `pnpm build`) fails if
  `registry.json` has drifted from `registry-meta.ts`, or if a declared
  `registryDependencies` list doesn't match the component's actual imports.

So the workflow for any catalog change is: edit `registry-meta.ts`, then
`pnpm registry:gen`, then commit both. The sidebar, landing counts,
component/block/template index pages, and sitemap all derive from this file
— there is no separate "is it published" flag, the entry's presence is the
source of truth.

## Every registry item follows the same shape

When you add or touch a component, block, or template, keep it consistent
with the rest of the catalog (the full checklist is in
[CONTRIBUTING.md](./CONTRIBUTING.md), the conventions in
[docs/conventions.md](./docs/conventions.md)):

- **Compound API first — always.** Build every component the way shadcn
  ships primitives: a flat set of composable parts, no namespacing, no
  convenience wrappers. The bare `Name` is the root primitive and holds the
  state; `NameTrigger`, `NameContent`, … are the parts. A single-prop
  "convenience" form is optional and strictly secondary — never the only
  API, and never a reason to skip the compound parts.
- **`data-slot` on every rendered slot** (`data-slot="<kebab>"`) so
  downstream styling and slot-targeting works in a consumer app.
- **Import shadcn primitives from `@/registry/hirael/ui/*`** — the alias is
  rewritten on install based on the consumer's `components.json`. Never
  import primitives by relative path.
- **Design tokens, never hard-coded colors.** Use `--background /
  --foreground / --border / --primary / --accent` and friends (see
  [docs/design.md](./docs/design.md)). Light is a faithful inverse of dark;
  both must work. The single non-neutral is `--accent-cool`, reserved for
  live/active state — don't spend it on decoration.
- **Compose class names with `cn(...)`** from [lib/utils.ts](./lib/utils.ts).
- **A `*.demo.tsx`** under `registry/hirael/<name>/` showing a basic compose
  and a customized compose.

## Copy reads like a human

Every word a visitor or consumer reads — registry `description`s, demo
content, block and template copy, empty states, prop docs, and showcase site
text — should sound like a person wrote it: concise, plain, specific. Short
labels, short sentences. No filler, no hype, no marketing voice (prefer "Pick
a date" over "Effortlessly select your desired date"; "No results" over "It
looks like there's nothing here yet"). When in doubt, cut words. Match the
register of the existing catalog descriptions and the landing copy.

## RTL is not optional

Components and blocks must work under `dir="rtl"` with no extra config, and
every preview on the site has an RTL toggle. Use **CSS logical properties**
instead of physical ones — `ms-*`/`me-*` over `ml-*`/`mr-*`, `ps-*`/`pe-*`
over `pl-*`/`pr-*`, `start-*`/`end-*` over `left-*`/`right-*`,
`text-start`/`text-end`, `border-s`/`border-e`, `rounded-s-*`/`rounded-e-*`.
Flip directional icons with `rtl:rotate-180` and mirror horizontal
arrow-key handlers that move focus through a visual grid. Physical
positioning is fine where the geometry genuinely is physical (Radix
`data-[side=…]` animations, canvas surfaces like the color picker,
`side="left|right"` on Sheet/Sidebar). Verify with the toggle before you
call it done.

## Comments are stripped from shipped registry source

[scripts/strip-comments.mjs](./scripts/strip-comments.mjs) removes comments
from `registry/hirael/**` source before it is published into the `/r/*.json`
files, because that source is copied verbatim into a consumer's repo. Keep
reasoning in commit messages, PR descriptions, or [docs/](./docs/) — not in
shipped component source. (Comments in the showcase site under
`components/showcase/`, `app/`, `lib/` are fine; those are never published.)

## Read /docs first

Before any non-trivial change, read [docs/README.md](./docs/README.md) — the
canonical orientation: what's built, what isn't, where things live, and what
NOT to undo. The four files in [docs/](./docs/) are:

- `README.md` — entry point, file map, done vs pending, deliberate decisions
- `conventions.md` — Next 16 / React 19 / Tailwind v4 / registry gotchas
- `design.md` — palette tokens, typography, radius/motion scale
- `catalog.md` — the full component, block, and template catalog and categories

These are for the next agent (and for you next session). If your change
makes a doc statement wrong, fix the doc in the same change — they are
load-bearing, not a changelog. Don't add a new `docs/` file per task; extend
the existing four.

Specifically: adding/renaming a component, block, or template → update `catalog.md`;
changing palette tokens, typography, or the radius/motion scale →
`design.md`; hitting a new framework/lint/hydration gotcha → `conventions.md`;
moving or removing a route/section → `README.md`'s file map. The top-level
[README.md](./README.md) and [CONTRIBUTING.md](./CONTRIBUTING.md) are the
human-facing equivalents — keep them in sync when the same fact changes.

## Public changelog is release-tag driven

A `/changelog` page ([app/changelog/page.tsx](./app/changelog/page.tsx))
renders one visitor-facing note per version from GitHub Releases, read at
build time via [lib/changelog.ts](./lib/changelog.ts) (which fetches
`api.github.com/repos/MohammadShehadeh/hirael.com/releases` and parses each
release's `name` as the title and `body` as `Highlights:` / `Fixes:`
sections). It does **not** render individual commits, PR links, or
unreleased branch work. The fetch is frozen into the static export, which is
fresh enough because production only deploys when a Release is published and
this fetch runs during that very build.

Production deployments are release-driven. Vercel auto-deploy on push to
`main` is disabled in [vercel.json](./vercel.json)
(`git.deploymentEnabled.main = false`); pushing a tag alone does nothing.
Production ships only when a **GitHub Release is published**, which fires the
[release-deploy workflow](./.github/workflows/release-deploy.yml) and runs
`vercel deploy --prebuilt --prod`. PR preview deploys are unaffected. The
workflow needs `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`
secrets, plus `RELEASES_TOKEN` (a public-repo-read PAT) so the changelog
fetch during the production build isn't rate-limited.

When you ship anything user-visible, make the next release note describe it
before the tag is pushed:

- Keep release titles short and visitor-facing, e.g. `Static export & RTL`.
- Put detail in the annotated tag/release body under `Highlights:` and
  `Fixes:` headings, each followed by `- ` bullets — that's exactly what the
  changelog parser groups.
- Backdate the annotated tag to the real release date if you're recording
  history.

To cut a release:

```bash
git fetch origin --tags
git switch main && git pull origin main
git tag -a v0.7.0 -m "Release title

Highlights:
- Adds ...
- Improves ...

Fixes:
- Fixes ..."
git push origin main
git push origin v0.7.0
```

Then publish a GitHub Release from the tag (its body should mirror the
annotated tag message so the in-app `/changelog` and the GitHub Releases UI
stay in sync) — that is what triggers the production deploy. If a tag was
created locally but not pushed, delete and recreate it to fix the
date/message; if it was already pushed, prefer a new patch tag over
rewriting public history.
