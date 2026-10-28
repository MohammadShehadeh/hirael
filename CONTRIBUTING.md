# Contributing to Hirael

Thanks for helping out. Bug fixes, docs and new components are all welcome.
Please follow the [Code of Conduct](./CODE_OF_CONDUCT.md) in all project spaces.

For anything bigger than a small fix,
[open an issue](https://github.com/MohammadShehadeh/hirael/issues/new/choose)
first, so we can agree on the approach before you spend time on it.

## Getting started

You need [Node.js](https://nodejs.org) 24 (pinned in `.nvmrc`) and
[pnpm](https://pnpm.io) 12 (pinned in `package.json`; `corepack enable` picks
it up).

```bash
git clone https://github.com/MohammadShehadeh/hirael.git
cd hirael
pnpm install
pnpm dev
```

The site runs at [http://localhost:3000](http://localhost:3000). `pnpm install`
also generates the registry files the site needs.

## How the project works

Hirael is a [shadcn registry](https://ui.shadcn.com/docs/registry). People
install components with the shadcn CLI, which copies the source into their
project; there is no npm package. This repository is the website that previews
everything and serves the registry files.

Every component, block and template exists in two versions, one for each
primitive library shadcn/ui supports:

- `registry/hirael/bases/radix/` is the Radix UI version, and the default.
- `registry/hirael/bases/base/` is the Base UI version.

You write the Radix UI version first and then port it. Files that don't use a
primitive directly are identical in both folders. Hooks and helpers that don't
touch a primitive live once in `registry/hirael/hooks/` and
`registry/hirael/lib/`, and can't import from `bases/`.

```text
registry/hirael/
  bases/{radix,base}/
    ui/            shadcn/ui primitives, copied unchanged
    components/    Hirael's components
    blocks/        page sections, like heroes and pricing tables
    templates/     complete pages
    examples/      the demos shown on the website
  hooks/, lib/     shared by both versions
  registry-meta.ts the list of everything Hirael publishes
  tests/           component tests
content/changelog/ one file per release
app/, components/, lib/  the website itself
```

**`registry-meta.ts` is the source of truth.** Listing an item there publishes
it, and the sidebar, pages, counts and sitemap are built from it. The registry
files (`registry*.json`, `registry-props.json`, `public/llms.txt` and
`public/r/`) are generated from it and ignored by git, so never edit or commit
them. [scripts/README.md](./scripts/README.md) explains the build scripts.

## Adding a component

Say you're adding `week-picker`:

1. Write it in `registry/hirael/bases/radix/components/week-picker.tsx`.
2. Port it to `registry/hirael/bases/base/components/week-picker.tsx`.
3. Add a demo at `examples/week-picker-demo.tsx` in both folders.
4. List it in `registry-meta.ts` with a category, a short description, its npm
   `dependencies` and its `registryDependencies` (the shadcn or Hirael items it
   imports, by name). `pnpm check:registry` tells you if these don't match your
   imports.
5. Add tests in `registry/hirael/tests/week-picker.test.tsx`.
6. List `week-picker` under `added:` in the release's changelog file.

**Blocks** are page sections in `bases/<base>/blocks/<name>/<name>.tsx`. They
need a `blockKind` and a `blockTagline` in `registry-meta.ts`, and numbered
blocks get a descriptive `subtitle` (`hero-03` is "Hero 03", "Hero with Logo
Cloud"). **Templates** are complete pages in `bases/<base>/templates/<name>/`
with `category: 'templates'`. Neither needs a separate demo file. If you're
unsure which one something is: a general control is a component, and something
built for one kind of product is a block.

## Guidelines

Installed code should feel like it was written for the project it lands in.

**API.** Build components from small parts that are exported by name, like
shadcn/ui does: `<WeekPicker>` holds the state, with `<WeekPickerTrigger>` and
`<WeekPickerContent>` beside it (not `WeekPicker.Trigger`). Give every rendered
element a `data-slot`, such as `data-slot="week-picker-trigger"`. Import
primitives from `@/registry/hirael/bases/<base>/ui/...` and Hirael components
from `.../components/...`, and never import across the two version folders.
`ui/` holds only shadcn/ui's own files, unchanged.

**Theming.** Use only shadcn/ui's tokens (`bg-primary`, `text-muted-foreground`,
`border`, `ring`, ...) plus `success`, `warning` and `info`, combined with
`cn()`. No fixed colors like `bg-blue-500`, and no website-only styles such as
`--warm` or the `container` class. Check both light and dark mode.

**Right-to-left.** Use logical classes (`ms-2`, `ps-4`, `start-0`,
`text-start`), add `rtl:rotate-180` to directional icons, and swap left and
right arrow keys in right-to-left mode. Things that sit on one physical side of
the screen, like a sheet that opens from the left, stay there.

**Restyling.** A `className` passed to a shadcn or Hirael component should only
control layout; the `shadcn/no-restyle` lint rule enforces this. If you need a
different look, use an existing variant, add a variant to Hirael's
`components/` (in both versions, never in `ui/`), wrap the component, or as a
last resort add an exception under `contracts` in `eslint.config.mjs`. Don't
disable the rule inline.

**Porting to Base UI.** The usual changes:

| Radix UI                         | Base UI                                           |
| -------------------------------- | ------------------------------------------------- |
| `asChild`                        | `render`                                          |
| `data-[state=open]`              | `data-open` (`data-checked`, `data-pressed`, ...) |
| Anchored content, like a popover | A `Positioner` wrapping a `Popup`                 |
| `onSelect` on a menu item        | `onClick`                                         |

**Text and comments.** Keep copy plain ("Pick a date", not "Effortlessly select
your desired date") and avoid em dashes. Translate demo text with
`t({ en: '...', ar: '...' })` from `useT()`. Comments ship into other people's
code, so explain why, not what. Prop JSDoc stays, because it builds the API
tables.

**Performance.** The website uses the React Compiler, so don't add `useMemo` or
`useCallback` in `app/`, `components/`, `lib/` or `examples/`. Keep them in
shipped component, block and template source, since consumers may not use the
compiler.

**Media.** Put placeholder images and videos in
`public/media/{blocks,components,templates}/<name>/` and reference them with a
root path like `/media/blocks/hero-04/earth.jpg`. Compress them, and don't link
to third-party hosts.

## Testing

Run the same checks as CI before opening a pull request:

```bash
pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

Tests use [Vitest](https://vitest.dev) and
[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).
Component tests go in `registry/hirael/tests/` and run against both versions
with `describe.each`. `.test.tsx` files run in jsdom and `.test.ts` files in
Node; website tests sit next to their file in `lib/`. Start test names with
"should", and test what a user sees and does rather than internal state.

There are no screenshot tests, so check visual changes by hand: open the page
locally, switch between Radix UI and Base UI with the **Base** option in the
Customizer, and look at light mode, dark mode and right-to-left.

To try a real install, run `pnpm dev` and, in a separate shadcn project, run
`npx shadcn@latest add http://localhost:3000/r/week-picker.json` (or
`/r/base/week-picker.json`). `pnpm check:health --changed` does a trial install
of everything your branch touches, in both versions. Both need an internet
connection.

## Changelog

Each release has one file in `content/changelog/`, written for people using
Hirael. List new items under `added:`: this dates them and shows a "New" badge
for a week.

```mdx
---
title: Week picker
version: '6.10.0'
date: 2026-09-30
description: 'A picker for choosing a whole week.'
added:
  - week-picker
---
```

## Pull requests

- Branch from `main`, with a name like `feat/week-picker` or
  `fix/multi-select-keyboard`, and keep each pull request to one change.
- Title it in the [Conventional Commits](https://www.conventionalcommits.org/)
  format, `<type>(<scope>): <description>`, using `feat`, `fix`, `docs`,
  `refactor`, `test`, `build`, `ci` or `chore`. The title becomes the commit
  message when the pull request is squashed.
- If you rename or remove a prop, part, export or `data-slot`, add a `!` to the
  title (`feat(multi-select)!: ...`) and explain how to update.
- Fill in the template, with screenshots for visual changes, and answer review
  feedback with new commits instead of force-pushing.

## Issues, questions and security

Use the [bug report](https://github.com/MohammadShehadeh/hirael/issues/new?template=bug_report.yml)
and [feature request](https://github.com/MohammadShehadeh/hirael/issues/new?template=feature_request.yml)
forms, and [Discussions](https://github.com/MohammadShehadeh/hirael/discussions)
for questions. Report security problems privately, as described in
[SECURITY.md](./SECURITY.md).

## License

By contributing, you agree that your contributions are licensed under the
[MIT License](./LICENSE).
