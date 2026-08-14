# Contributing to Hirael

Thanks for taking the time to contribute — Hirael is small, opinionated,
and benefits from every well-scoped PR. This guide covers the dev
workflow, the conventions we follow, and the checklist for shipping a
new component or block.

By participating you agree to abide by the project's
[Code of Conduct](./CODE_OF_CONDUCT.md).

## Table of contents

- [Setting up the dev environment](#setting-up-the-dev-environment)
- [Project layout](#project-layout)
- [Branch and commit conventions](#branch-and-commit-conventions)
- [Coding standards](#coding-standards)
- [Component contribution checklist](#component-contribution-checklist)
- [Testing requirements](#testing-requirements)
- [Pull request process](#pull-request-process)
- [Issue workflow](#issue-workflow)
- [Reporting security issues](#reporting-security-issues)

## Setting up the dev environment

### Prerequisites

- [Node.js](https://nodejs.org) **20+** (CI runs Node 22; `.nvmrc` pins
  the version — run `nvm use`)
- [pnpm](https://pnpm.io) **10+** (the repo ships `pnpm-lock.yaml`; do
  not switch package managers in a PR)

### First-time setup

```bash
git clone https://github.com/MohammadShehadeh/hirael.com.git
cd hirael.com
pnpm install
pnpm dev          # showcase site at http://localhost:3000
```

### Validating an install end-to-end

To confirm a registry item installs cleanly into a consumer project:

```bash
pnpm registry:build                # emits /public/r/<name>.json
pnpm dev                            # serve /r/<name>.json locally

# in a separate consumer app that already has shadcn installed
npx shadcn@latest add http://localhost:3000/r/<name>.json
```

Resolving `registryDependencies` reaches out to `ui.shadcn.com`, so the
machine running the consumer install must have network access to that
host.

## Project layout

```
registry/hirael/
  ui/<primitive>.tsx         # shadcn primitives only
  components/<name>.tsx      # hirael's added components (multi-file kits as components/<name>/)
  examples/<component>-demo.tsx  # showcase demo per component
  blocks/<block>/            # marketing blocks
  templates/<template>/      # full-page templates
  registry-meta.ts           # single source of truth for every item
registry.json                # GENERATED from registry-meta.ts — do not
                             # edit by hand, run `pnpm registry:gen`
```

See the top-level **[README.md](./README.md)** for a full directory
tour.

## Branch and commit conventions

### Branches

Work on a topic branch off `main`:

```
<type>/<short-kebab-description>
```

Examples:

- `feat/month-picker`
- `fix/multi-select-keyboard-nav`
- `docs/contributing-guide`
- `refactor/registry-meta-types`

Avoid long-lived branches — rebase on `main` frequently and keep PRs
focused.

### Commit messages — Conventional Commits

We follow [Conventional Commits](https://www.conventionalcommits.org/)
so the history is scannable and ready for tooling. This is **enforced** —
`.commitlintrc.json` (`@commitlint/config-conventional`) runs against every
PR's commits via the `commitlint` CI workflow, and your PR title should use
the same format. Check a message locally with
`echo "feat: …" | pnpm exec commitlint`; for pre-push feedback you can add an
optional `.husky/commit-msg` hook running `pnpm exec commitlint --edit "$1"`.
The format is:

```
<type>(<optional scope>): <imperative summary>

<optional body>

<optional footer(s)>
```

| Type       | When to use                                         |
| ---------- | --------------------------------------------------- |
| `feat`     | New component, block, prop, public surface area     |
| `fix`      | Bug fix in a component, block, or the showcase site |
| `docs`     | README, CONTRIBUTING, comments, JSDoc               |
| `style`    | Formatting only — no behavior change                |
| `refactor` | Internal rework with no externally visible change   |
| `perf`     | Performance improvement                             |
| `test`     | Adding or correcting tests                          |
| `build`    | Build pipeline, Tailwind config, `tsconfig`, deps   |
| `ci`       | GitHub Actions and other CI                         |
| `chore`    | Maintenance with no production impact               |
| `revert`   | Revert a prior commit                               |

Scope is optional but encouraged — use the component or area name:

```
feat(multi-select): add async loader prop
fix(phone-input): correct E.164 normalization for short numbers
docs(readme): document NEXT_PUBLIC_BASE_URL
```

Breaking changes — add `!` after the type and a `BREAKING CHANGE:`
footer:

```
feat(multi-select)!: rename `onChange` to `onValueChange`

BREAKING CHANGE: `MultiSelect` now exposes `onValueChange` to match the
shadcn convention. Consumers using `onChange` must rename the prop.
```

Keep the subject line ≤ 72 characters and in the imperative mood
("add", not "added"/"adds").

## Coding standards

### TypeScript

- `tsconfig.json` runs in **strict** mode — no implicit `any`, no
  ignored errors. Fix the type, don't widen it.
- Prefer named exports. Default exports are reserved for Next.js route
  files and page-level components.
- Use the `@/` path alias instead of relative `../../` chains.

### Linting and formatting

```bash
pnpm lint        # ESLint via next/core-web-vitals + next/typescript
pnpm typecheck   # tsc --noEmit
```

Formatting is Prettier with its default config (`.prettierrc` is `{}`):
2-space indent, double-quoted strings, semicolons. It runs automatically on
staged files via the husky pre-commit hook (`lint-staged`), so you rarely need
to think about it — just don't fight it with a different editor formatter.
Generated files (`registry.json`, `vercel.json`, `registry-props.json`) are
excluded via `.prettierignore` because `check:registry` verifies them
byte-for-byte against the generators' output.

### Component conventions

- **Compound API first.** Always build the way shadcn ships primitives:
  a flat set of composable parts, no namespacing, no convenience
  wrappers. The bare component name is the root primitive and holds the
  state. A single-prop convenience form is optional and secondary —
  never the only API, and never a reason to skip the compound parts.
- **`data-slot`.** Every rendered slot carries `data-slot="<kebab>"`
  so downstream styling and slot-targeting just works.
- **Copy reads like a human.** Descriptions, demo content, and any
  user-facing text are concise, plain, and specific — short labels and
  sentences, no filler or marketing voice. Prefer "Pick a date" over
  "Effortlessly select your desired date."
- **Imports** go through aliases rewritten on install from the consumer's
  `components.json`: shadcn primitives from `@/registry/hirael/ui/*`, other
  hirael components from `@/registry/hirael/components/*`. `ui/` holds only
  shadcn primitives; everything hirael adds lives in `components/`.
- **Tokens.** Use `--background / --foreground / --border / --primary /
--accent` and the rest of the design tokens — never hard-code a
  color. Light is a faithful inverse of dark; both must work.
- **`cn` helper.** Compose class names with `cn(...)` from
  `@/lib/utils`. Don't ad-hoc-concatenate `className` strings.
- **RTL.** Use logical utilities instead of physical ones — `ms-*`/`me-*`
  over `ml-*`/`mr-*`, `ps-*`/`pe-*` over `pl-*`/`pr-*`, `start-*`/`end-*`
  over `left-*`/`right-*`, `text-start`/`text-end`, `border-s`/`border-e`,
  `rounded-s-*`/`rounded-e-*`. Flip directional icons with
  `rtl:rotate-180` (e.g. prev/next chevrons) and mirror horizontal
  arrow-key handlers when they move focus through a visual grid.
  Physical positioning is fine where the geometry genuinely is
  physical: Radix `data-[side=…]` animations, canvas-like surfaces
  (color picker), and `side="left|right"` props on Sheet/Sidebar.
  Verify with the RTL toggle on the component's preview.
- **Comments.** Registry source is copied verbatim into consumer repos,
  so keep any comments purposeful and consumer-facing — put internal
  reasoning in commit messages, PR descriptions, or design docs.

## Component contribution checklist

For each new component:

- [ ] Source file at `registry/hirael/components/<name>.tsx` (or a
      `components/<name>/` folder for a multi-file kit) exporting the
      compound parts as flat top-level named exports (`Name`,
      `NameTrigger`, `NameContent`, …). No namespacing, no convenience
      wrappers. The bare `Name` is the root primitive and holds state.
      (`registry/hirael/ui/` is reserved for shadcn primitives.)
- [ ] Every rendered slot carries `data-slot="<kebab>"`.
- [ ] `registry/hirael/examples/<name>-demo.tsx` showing a basic compose
      **and** a customized compose. To showcase several focused examples
      instead, add `<name>-<variant>.tsx` files, list them (ordered, with
      titles) under `EXAMPLE_OVERRIDES` in `registry-meta.ts`, and register
      each slug in `EXAMPLE_LOADERS` in `registry-demos.tsx` — the component
      page stacks them as titled preview/code blocks (the first is the
      representative preview used in grids and embeds).
- [ ] Entry in `registry/hirael/registry-meta.ts` with category,
      description, `dependencies`, `registryDependencies` and source
      file list, then `pnpm registry:gen` to regenerate `registry.json`
      (never edit it by hand — `pnpm check:registry` fails if it
      drifts or if declared `registryDependencies` don't match the
      component's actual imports).
- [ ] Imports go through `@/registry/hirael/ui/*` (shadcn primitives) and
      `@/registry/hirael/components/*` (other hirael components) — both
      aliases are rewritten on install.
- [ ] Tokens reuse `--background / --foreground / --border /
--primary / --accent` and friends — never hard-code colors.
- [ ] `pnpm lint && pnpm typecheck && pnpm registry:build && pnpm build`
      clean.

Marketing blocks follow the same shape but live under
`registry/hirael/blocks/<block>/` and have a `blockKind` plus
`blockTagline` in `registry-meta.ts`.

Templates are full-page, multi-section layouts. They live under
`registry/hirael/templates/<template>/`, use `category: "templates"` in
`registry-meta.ts`, and ship as a multi-file `registry:block` in
`registry.json`. Like blocks, they are previewed full-bleed and do not
need a demo under `registry/hirael/examples/`.

## Testing requirements

Hirael does not ship a unit-test suite today — the gating signal is
the build pipeline:

```bash
pnpm lint
pnpm typecheck
pnpm registry:build
pnpm build
```

All four must pass before requesting review. For component PRs you are
also expected to:

1. Visit the showcase page at
   `http://localhost:3000/components/<category>/<name>` and exercise the demo.
2. Confirm `npx shadcn@latest add http://localhost:3000/r/<name>.json`
   succeeds in a separate consumer app (see
   [Validating an install end-to-end](#validating-an-install-end-to-end)).
3. Verify the component renders correctly in **both** light and dark
   themes — toggle from the showcase header.
4. Spot-check keyboard navigation and screen-reader output for any
   interactive component.

> **Note** — automated unit and visual-regression tests are not yet set
> up. A future PR is expected to introduce a test runner (vitest, mirroring
> shadcn/ui — see
> [docs/README.md → Upstream alignment](./docs/README.md#upstream-alignment-with-shadcnui));
> until then, the build pipeline plus the manual checks above are the
> contract.

## Pull request process

1. **Open an issue first** for non-trivial work so we can agree on the
   shape before code lands (see
   [Issue workflow](#issue-workflow)). Small fixes and doc edits can
   skip this.
2. **Branch off `main`** using the
   [branch convention](#branches) above.
3. **Keep the PR focused.** One component, one fix, one refactor — not
   all three at once.
4. **Complete the
   [component contribution checklist](#component-contribution-checklist)**
   when adding a component.
5. **Run the full build pipeline locally** — `pnpm lint && pnpm
typecheck && pnpm registry:build && pnpm build`.
6. **Open the PR** with:
   - a clear title in Conventional Commit format,
   - a short summary of the change and the motivation,
   - screenshots or short clips for any UI work,
   - a manual test plan describing what you exercised.
7. **Address review feedback** with follow-up commits — do not
   force-push during review unless asked. Squash on merge keeps the
   history clean.
8. Maintainers will merge once CI is green and the checklist is met.

## Issue workflow

Use the issue forms under `.github/ISSUE_TEMPLATE/` — **Bug report** and
**Feature request** — which prompt for the fields below.

- **Bug reports** should include: the component or block, the
  reproduction steps, the expected vs actual behavior, your Node
  version, browser, and a minimal repro repo or CodeSandbox where
  possible.
- **Feature requests** should explain the user problem first, then
  propose the API. Reference existing shadcn or Radix conventions
  where relevant.
- **Component proposals** should reference the shadcn convention you
  expect to follow, list the `registryDependencies` you anticipate,
  and sketch the compound surface area.
- **Triage labels** are applied by maintainers — please do not assign
  labels yourself.

## Reporting security issues

Please do **not** open a public GitHub issue for security
vulnerabilities. Follow the private disclosure process documented in
**[SECURITY.md](./SECURITY.md)**.

---

Thanks again for contributing — every well-scoped PR makes Hirael
sharper.
