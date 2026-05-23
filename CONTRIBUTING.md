# Contributing to MSH UI

Thanks for taking the time to contribute — MSH UI is small, opinionated,
and benefits from every well-scoped PR. This guide covers the dev
workflow, the conventions we follow, and the checklist for shipping a
new component or block.

By participating you agree to abide by the project's Code of Conduct.

> **TODO** — link to `CODE_OF_CONDUCT.md` once committed.

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

- [Node.js](https://nodejs.org) **20+**
- [pnpm](https://pnpm.io) **8+** (the repo ships `pnpm-lock.yaml`; do
  not switch package managers in a PR)

### First-time setup

```bash
git clone https://github.com/MohammadShehadeh/msh-ui.git
cd msh-ui
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
registry/msh-ui/
  <component>/
    <component>.tsx          # source (flat compound exports)
    <component>.demo.tsx     # showcase demo
    index.ts                 # re-export
  ui/                        # shadcn primitives the registry imports from
  blocks/<block>/            # marketing blocks
  registry-meta.ts           # showcase metadata for sidebar / pages
registry.json                # canonical declaration of every item
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
so the history is scannable and ready for tooling. The format is:

```
<type>(<optional scope>): <imperative summary>

<optional body>

<optional footer(s)>
```

| Type       | When to use                                                   |
| ---------- | ------------------------------------------------------------- |
| `feat`     | New component, block, prop, public surface area               |
| `fix`      | Bug fix in a component, block, or the showcase site           |
| `docs`     | README, CONTRIBUTING, comments, JSDoc                         |
| `style`    | Formatting only — no behavior change                          |
| `refactor` | Internal rework with no externally visible change             |
| `perf`     | Performance improvement                                       |
| `test`     | Adding or correcting tests                                    |
| `build`    | Build pipeline, Tailwind config, `tsconfig`, deps             |
| `ci`       | GitHub Actions and other CI                                   |
| `chore`    | Maintenance with no production impact                         |
| `revert`   | Revert a prior commit                                         |

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

The repo does not enforce a separate formatter. Match the surrounding
code (2-space indent, double-quoted strings, no semicolons at the end
of statements is the prevailing style in `registry/msh-ui/`). If your
editor disagrees, reset its formatter on this repo rather than
reformatting committed files.

### Component conventions

- **Flat compound exports.** Compose like shadcn — no namespacing,
  no convenience wrappers. The bare component name is the root
  primitive and holds the state.
- **`data-slot`.** Every rendered slot carries `data-slot="<kebab>"`
  so downstream styling and slot-targeting just works.
- **Imports for shadcn primitives** go through `@/registry/msh-ui/ui/*`.
  The alias is rewritten on install based on the consumer's
  `components.json`.
- **Tokens.** Use `--background / --foreground / --border / --primary /
  --accent` and the rest of the design tokens — never hard-code a
  color. Light is a faithful inverse of dark; both must work.
- **`cn` helper.** Compose class names with `cn(...)` from
  `@/lib/utils`. Don't ad-hoc-concatenate `className` strings.
- **Comments.** Comments in registry source are stripped by
  `scripts/strip-comments.mjs` before publishing. Keep helpful
  reasoning in commit messages, PR descriptions, or design docs —
  not in shipped source.

## Component contribution checklist

For each new component:

- [ ] Source file at `registry/msh-ui/<name>/<name>.tsx` exporting the
      compound parts as flat top-level named exports (`Name`,
      `NameTrigger`, `NameContent`, …). No namespacing, no convenience
      wrappers. The bare `Name` is the root primitive and holds state.
- [ ] Every rendered slot carries `data-slot="<kebab>"`.
- [ ] `<name>.demo.tsx` showing a basic compose **and** a customized
      compose.
- [ ] `index.ts` re-export.
- [ ] Entry in `registry.json` with `type: "registry:ui"`,
      `dependencies`, `registryDependencies`,
      `files[].target = "components/ui/<name>.tsx"`.
- [ ] Entry in `registry/msh-ui/registry-meta.ts` with category, demo,
      and source file list.
- [ ] All imports for shadcn primitives go through
      `@/registry/msh-ui/ui/*` (alias is rewritten on install).
- [ ] Tokens reuse `--background / --foreground / --border /
      --primary / --accent` and friends — never hard-code colors.
- [ ] `pnpm lint && pnpm typecheck && pnpm registry:build && pnpm build`
      clean.

Marketing blocks follow the same shape but live under
`registry/msh-ui/blocks/<block>/` and have a `blockKind` plus
`blockTagline` in `registry-meta.ts`.

## Testing requirements

MSH UI does not ship a unit-test suite today — the gating signal is
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
   `http://localhost:3000/components/<name>` and exercise the demo.
2. Confirm `npx shadcn@latest add http://localhost:3000/r/<name>.json`
   succeeds in a separate consumer app (see
   [Validating an install end-to-end](#validating-an-install-end-to-end)).
3. Verify the component renders correctly in **both** light and dark
   themes — toggle from the showcase header.
4. Spot-check keyboard navigation and screen-reader output for any
   interactive component.

> **TODO** — automated unit and visual-regression tests are not yet
> set up. A future PR is expected to introduce a test runner; until
> then, the build pipeline plus the manual checks above are the
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

> **TODO** — issue templates under `.github/ISSUE_TEMPLATE/` are not
> yet committed. Until they land, please follow the conventions
> below.

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

> **TODO** — `SECURITY.md` is not yet committed. Until it lands,
> contact the maintainer privately via the email listed on
> [mohammadshehadeh.com](https://mohammadshehadeh.com).

---

Thanks again for contributing — every well-scoped PR makes MSH UI
sharper.
