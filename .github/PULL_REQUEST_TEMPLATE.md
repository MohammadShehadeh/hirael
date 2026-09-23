<!--
  Thanks for contributing to Hirael!

  Title: Conventional Commit, imperative, 72 characters max.
    feat(multi-select): add async loader prop
    fix(phone-input): correct E.164 normalization for short numbers
  One component, one fix or one refactor per PR. Delete sections that don't apply.
-->

## Summary

<!-- What changes and why, in a few lines. -->

Closes #

## Type of change

- [ ] New component, block or template (`feat`)
- [ ] New prop, variant or part on an existing item (`feat`)
- [ ] Bug fix (`fix`)
- [ ] Tests (`test`)
- [ ] Docs (`docs`)
- [ ] Refactor, performance or maintenance (`refactor` / `perf` / `chore`)
- [ ] Build, CI or tooling (`build` / `ci`)

## Items touched

<!--
  Registry items this PR adds or changes, with their preview links, e.g.
  - `tag-input`: https://hirael.com/components/inputs/tag-input
  Leave empty for site-only or tooling changes.
-->

## Breaking change for installed copies

<!--
  Consumers own the source, so an API change reaches them through
  `shadcn add --diff`. If you renamed or removed a prop, part, export or
  data-slot, say what and how to migrate, and mark the title with `!`.
-->

- [ ] No breaking change

## Checklist

**Every PR**

- [ ] `pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm registry:build && pnpm build` pass locally
- [ ] No generated files committed (`registry*.json`, `registry-props.json`, `llms.txt`, `public/r/`)
- [ ] No `eslint-disable` for `shadcn/no-restyle`: used a variant, a wrapper element or a `contracts` entry instead

**Registry items** (components, blocks, templates)

- [ ] Declared in `registry/hirael/registry-meta.ts` with accurate `dependencies` and `registryDependencies`
- [ ] Same change in both bases (`bases/radix/` and `bases/base/`), with Base UI APIs in the `base` tree
- [ ] Compound API with `data-slot` on every rendered part; theme tokens only, no hard-coded colors
- [ ] RTL via logical properties (`ms-*`, `start-*`), `rtl:rotate-180` on directional icons
- [ ] Demo at `bases/<base>/examples/<name>-demo.tsx` in both bases, strings through `useT()` (components only)
- [ ] Tests in `registry/hirael/tests/<name>.test.tsx` covering both bases, for behavior worth locking in
- [ ] Previewed with both bases (Customizer's Base picker), in light, dark and RTL
- [ ] `pnpm check:install` passes, or installed into a separate shadcn app
- [ ] New items listed under `added:` in a `content/changelog/*.mdx` entry

## Screenshots

<!--
  Required for UI changes. Light and dark; RTL too if layout changed.
  Before / after for fixes. A short clip for interactions and motion.
-->

## Test plan

<!--
  What you exercised and how: steps, keyboard paths, edge cases, browsers.
  e.g. "Pasted 'a, b, c' into tag-input: three tags. Backspace on empty draft removes the last."
-->
