# Contributing to Hirael

Thank you for your interest in contributing to Hirael. Whether you are fixing a
bug, improving the docs, or adding a new component, your help is welcome.

This guide explains how the project is organized, how to run it locally, and
what we look for in a pull request. Please read it before you start, and follow
our [Code of Conduct](./CODE_OF_CONDUCT.md) in all project spaces.

## Table of contents

- [Ways to contribute](#ways-to-contribute)
- [Getting started](#getting-started)
- [How the project is organized](#how-the-project-is-organized)
- [Adding a component](#adding-a-component)
- [Adding a block or template](#adding-a-block-or-template)
- [Guidelines](#guidelines)
- [Testing your changes](#testing-your-changes)
- [Changelog](#changelog)
- [Commit messages](#commit-messages)
- [Opening a pull request](#opening-a-pull-request)
- [Reporting bugs and requesting features](#reporting-bugs-and-requesting-features)
- [Security](#security)
- [License](#license)

## Ways to contribute

- **Report a bug** you found in a component, block, template, or the website.
- **Suggest a component** that shadcn/ui doesn't ship yet.
- **Fix a bug** or improve an existing component.
- **Add a new component, block or template.**
- **Improve the documentation**, including this guide.

For anything larger than a small fix, please
[open an issue](https://github.com/MohammadShehadeh/hirael/issues/new/choose)
first so we can agree on the approach before you spend time on it.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) 24. The version is pinned in `.nvmrc`, so you
  can run `nvm use`.
- [pnpm](https://pnpm.io) 12. The version is pinned in `package.json`, and
  running `corepack enable` will pick it up. Please don't switch to another
  package manager in a pull request.

### Running the site locally

```bash
git clone https://github.com/MohammadShehadeh/hirael.git
cd hirael
pnpm install
pnpm dev
```

The site runs at [http://localhost:3000](http://localhost:3000). `pnpm install`
also generates the registry files the site needs, so there is no separate
setup step.

## How the project is organized

Hirael is a [shadcn registry](https://ui.shadcn.com/docs/registry). People
install components with the shadcn CLI, which copies the source code into their
project. There is no npm package. This repository is the website that previews
everything and serves the registry files.

### One component, two versions

shadcn/ui supports two primitive libraries: Radix UI and Base UI. Every
component, block and template in Hirael exists in both, in two parallel folders:

- `registry/hirael/bases/radix/` is the Radix UI version, and the default.
- `registry/hirael/bases/base/` is the Base UI version.

Most files are identical in both folders. They only differ where a Radix or
Base UI primitive is used directly. You write the Radix version first, then
port it. [Porting to Base UI](#porting-to-base-ui) lists the usual changes.

### Folder structure

```text
registry/hirael/
  bases/radix/  and  bases/base/
    ui/              shadcn/ui primitives, copied unchanged from shadcn
    components/      Hirael's components
    blocks/          page sections (heroes, pricing tables, dashboards, ...)
    templates/       complete pages
    examples/        the demos shown on the website
  registry-meta.ts   the list of everything Hirael publishes
  tests/             component tests
content/changelog/   one file per release
public/media/        placeholder images and videos used by blocks and templates
app/, components/, lib/   the website itself (not installed by users)
scripts/             the build pipeline for the registry
```

### `registry-meta.ts` is the source of truth

Adding a component to `registry/hirael/registry-meta.ts` is what publishes it.
The website's sidebar, pages, counts and sitemap are all built from this file.

The registry files (`registry.json`, `registry.base.json`,
`registry/hirael/registry-props.json`, `public/llms.txt` and everything in
`public/r/`) are generated from it when you run `pnpm install` or `pnpm build`.
They are ignored by git, so never edit or commit them.
[scripts/README.md](./scripts/README.md) explains what each build script does.

## Adding a component

Let's say you are adding a component called `week-picker`.

1. **Write the component** in
   `registry/hirael/bases/radix/components/week-picker.tsx`. If it needs
   several files, use a `components/week-picker/` folder instead. Follow the
   [API guidelines](#component-api) below.
2. **Port it to Base UI** at
   `registry/hirael/bases/base/components/week-picker.tsx`.
3. **Add a demo** at `examples/week-picker-demo.tsx` in both folders. This is
   what the website shows. To show several focused examples instead of one,
   create files like `week-picker-range.tsx` and list them under
   `EXAMPLE_OVERRIDES` in `registry-meta.ts`. The first one is used as the
   preview image across the site.
4. **Register it** in `registry-meta.ts` with a category, a short description,
   its npm `dependencies`, and its `registryDependencies` (the shadcn or Hirael
   components it imports, by name, like `button` or `calendar`).
   `pnpm check:registry` will tell you if these don't match your imports.
5. **Add tests** in `registry/hirael/tests/week-picker.test.tsx` for any
   behavior worth protecting. See [Testing your changes](#testing-your-changes).
6. **Add a changelog entry.** List `week-picker` under `added:` in the
   release's file in `content/changelog/`. See [Changelog](#changelog).
7. **Check it by hand** in light mode, dark mode and right-to-left, with both
   the Radix UI and Base UI versions.

## Adding a block or template

**Blocks** are ready-made page sections, like a hero, a pricing table or a
dashboard. They live in `bases/<base>/blocks/<name>/<name>.tsx` and need a
`blockKind` (the section type, such as `hero`) and a short `blockTagline` in
`registry-meta.ts`.

A good rule for deciding between the two: a general control that works
anywhere, like a date picker, is a component. Something built for one kind of
product, like a cloud console panel, is a block.

**Templates** are complete pages made of several sections. They live in
`bases/<base>/templates/<name>/` and use `category: 'templates'` in
`registry-meta.ts`.

Blocks and templates are previewed full-width on the website, so they don't
need a separate demo file. Everything else in the component steps above still
applies.

## Guidelines

Hirael's goal is that installed code feels like it was written for the
project it lands in. These guidelines exist to make that true.

### Component API

Build components the way shadcn/ui builds its own: a set of small parts that
you compose together, exported by name.

```tsx
<WeekPicker value={week} onValueChange={setWeek}>
  <WeekPickerTrigger />
  <WeekPickerContent />
</WeekPicker>
```

- The root part (`WeekPicker`) holds the state. The other parts are exported
  alongside it, not nested under it (`WeekPickerTrigger`, not
  `WeekPicker.Trigger`).
- Every rendered element has a `data-slot` attribute, such as
  `data-slot="week-picker-trigger"`, so people can target it in their styles.
- A simpler single-component shortcut is fine as an extra, but it can't be the
  only way to use the component.
- `ui/` only contains shadcn/ui's own primitives, copied unchanged. Hirael's
  own code always goes in `components/`.
- Import shadcn primitives from `@/registry/hirael/bases/<base>/ui/...` and
  other Hirael components from `@/registry/hirael/bases/<base>/components/...`.
  The shadcn CLI rewrites these paths to match the user's project. Never import
  across the two version folders.

### Styling and theming

People install Hirael into projects that already have their own shadcn/ui theme.
A component should pick up that theme without any changes.

- Use only shadcn/ui's color tokens, like `bg-primary`, `text-muted-foreground`,
  `border` and `ring`, plus the `success`, `warning` and `info` tokens that
  Hirael ships. Never use a fixed color like `bg-blue-500`.
- Combine class names with the `cn()` helper.
- Don't use styles that only exist on this website, such as the `--warm` and
  `--accent-cool` tokens or the `container` class. `pnpm check:registry` checks
  for these.
- Make sure the component looks right in both light and dark mode.

### Right-to-left languages

Components should work in right-to-left languages like Arabic without extra
setup.

- Use logical classes: `ms-2` instead of `ml-2`, `ps-4` instead of `pl-4`,
  `start-0` instead of `left-0`, `text-start` instead of `text-left`.
- Add `rtl:rotate-180` to icons that point in a direction, like arrows and
  chevrons.
- When arrow keys move focus left and right, swap them in right-to-left mode.
- Things that are physically on one side of the screen, such as a sheet that
  opens from the left, should stay that way.

### Restyling shadcn components

The `shadcn/no-restyle` lint rule stops you from changing how a shadcn or
Hirael component looks by passing it a `className`. Class names passed this way
should only control layout, like margins or width. If you need a different
look, try these in order:

1. Use a variant the component already has.
2. Add a new variant, but only to Hirael's own components in `components/`,
   never to shadcn's files in `ui/`. Add it to both versions.
3. Wrap the component in an element and style the wrapper.
4. As a last resort, add an exception under `contracts` in `eslint.config.mjs`.

Please don't disable the rule with an `eslint-disable` comment.

### Porting to Base UI

These are the changes you'll make most often when porting from Radix UI:

| Radix UI                         | Base UI                                               |
| -------------------------------- | ----------------------------------------------------- |
| `asChild`                        | `render`                                              |
| `data-[state=open]`              | `data-open` (and `data-checked`, `data-pressed`, ...) |
| Anchored content, like a popover | A `Positioner` wrapping a `Popup`                     |
| `onSelect` on a menu item        | `onClick`                                             |

If a file doesn't touch a primitive directly, it should be identical in both
folders.

### Images and videos

Placeholder media lives in `public/media/{blocks,components,templates}/<name>/`
and is referenced with a root path, like `/media/blocks/hero-04/earth.jpg`. The
build turns these into full `https://hirael.com/media/...` links so they still
work after someone installs the block. Compress files before committing, and
don't link to third-party image or video hosts.

### Writing text

- Keep demo text and descriptions plain and short. "Pick a date" is better
  than "Effortlessly select your desired date".
- Avoid em dashes in website text.
- Demo text is translated so the right-to-left preview shows Arabic. Wrap each
  string in `t({ en: '...', ar: '...' })` using the `useT()` hook.

### Code comments

Your comments end up in other people's codebases, so make each one worth
reading. Explain why something is done when it isn't obvious, such as a browser
bug or a timing issue. Don't describe what the code already says.

The JSDoc comments on props are an exception: they generate the API tables on
the website, so every prop should have a clear one.

### Performance

The website uses the React Compiler, so don't add `useMemo` or `useCallback`
to website code (`app/`, `components/`, `lib/` and `examples/`). Do keep them
in the component, block and template source, because the projects that install
them may not use the compiler.

### Formatting and linting

The repository uses Prettier and ESLint, and a pre-commit hook runs both on the
files you commit. Formatting is automatic, so there's no need to configure your
editor beyond using Prettier. The `ui/` folders are excluded so they stay
identical to shadcn/ui.

## Testing your changes

### Automated checks

Run the full set of checks before opening a pull request. CI runs the same ones.

```bash
pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm registry:build && pnpm build
```

### Writing tests

Tests use [Vitest](https://vitest.dev) and
[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

- Component tests go in `registry/hirael/tests/<name>.test.tsx`. Each test file
  imports the component from both folders and runs the same tests against each
  with `describe.each`, so the Radix UI and Base UI versions stay in step.
- Tests for plain logic use the `.test.ts` extension and run in Node. For
  website code, place them next to the file they test in `lib/`.
- Start every test name with "should", like
  `it('should add a tag when Enter is pressed')`.
- Test what a user can see and do (roles, labels, clicks and key presses)
  rather than internal state.

Use `pnpm test` to run the tests once, or `pnpm test:watch` while you work.

### Checking by hand

There are no screenshot tests, so please check visual changes yourself. Open
the component's page on your local site, switch between Radix UI and Base UI
with the **Base** option in the Customizer, and check it in light mode, dark
mode and right-to-left. For interactive components, try them with the keyboard
too.

### Installing into a real project

To confirm your component installs correctly, build the registry, start the
site, and install from it into a separate project that already uses shadcn/ui:

```bash
# in this repository
pnpm registry:build
pnpm dev

# in your test project
npx shadcn@latest add http://localhost:3000/r/week-picker.json        # Radix UI
npx shadcn@latest add http://localhost:3000/r/base/week-picker.json   # Base UI
```

This needs an internet connection, because shadcn primitives are downloaded
from ui.shadcn.com. Other Hirael components your component depends on are
downloaded from hirael.com, so you'll get the published version of those, not
your local changes.

Before opening a pull request, also run:

```bash
pnpm check:health --changed
```

This runs the same checks as shadcn's registry directory and does a trial
install of everything your branch changed, in both versions. It needs an
internet connection, so it isn't part of CI.

## Changelog

Each release has one file in `content/changelog/`, which appears on the
website's changelog page. When you add something new, list its name under
`added:`. This dates the new component and shows a "New" badge next to it for
a week. Write the text for people using Hirael, not about build details.

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

## Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/). Pull
request titles follow the same format, since they become the commit message
when the pull request is merged.

```text
<type>(<scope>): <short description>
```

The scope is optional, and is usually the name of the component or area you
changed. Write the description in the imperative ("add", not "added") and keep
the whole line under 72 characters.

| Type       | Use it when you...                                   |
| ---------- | ---------------------------------------------------- |
| `feat`     | add a component, block or template, or a new feature |
| `fix`      | fix a bug                                            |
| `docs`     | change documentation or code comments                |
| `style`    | change formatting only                               |
| `refactor` | change code without changing its behavior            |
| `perf`     | improve performance                                  |
| `test`     | add or update tests                                  |
| `build`    | change the build setup or dependencies               |
| `ci`       | change the GitHub Actions workflows                  |
| `chore`    | do other maintenance                                 |
| `revert`   | revert an earlier commit                             |

Examples:

```text
feat(week-picker): add week picker component
fix(phone-input): keep the country when the number is cleared
docs: explain the Base UI port in CONTRIBUTING
```

If your change breaks existing usage, such as renaming a prop, add a `!` after
the type and explain how to update in the commit body:

```text
feat(multi-select)!: rename onChange to onValueChange

BREAKING CHANGE: rename the onChange prop to onValueChange.
```

## Opening a pull request

1. Create a branch from `main` named after your change, like
   `feat/week-picker` or `fix/multi-select-keyboard`.
2. Keep the pull request focused on one change. Separate pull requests are
   easier to review than one large one.
3. Run the [automated checks](#automated-checks) and
   `pnpm check:health --changed`.
4. Fill in the pull request template. For visual changes, include screenshots
   in light and dark mode.
5. Respond to review feedback with new commits instead of force-pushing, so
   reviewers can see what changed.

Pull requests are squashed into a single commit when merged.

## Reporting bugs and requesting features

Please use the issue forms on GitHub:

- **[Bug report](https://github.com/MohammadShehadeh/hirael/issues/new?template=bug_report.yml)**:
  tell us which component, block or template is affected, whether you use Radix
  UI or Base UI, how to reproduce the problem, what you expected, and which
  browser you use. A small reproduction helps a lot.
- **[Feature request](https://github.com/MohammadShehadeh/hirael/issues/new?template=feature_request.yml)**:
  describe the problem you're trying to solve before suggesting a solution.

For questions, please use
[GitHub Discussions](https://github.com/MohammadShehadeh/hirael/discussions)
instead of opening an issue.

## Security

Please don't report security vulnerabilities in public issues. Follow the steps
in [SECURITY.md](./SECURITY.md) instead.

## License

By contributing to Hirael, you agree that your contributions will be licensed
under the [MIT License](./LICENSE).
