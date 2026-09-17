<!--
  Thanks for contributing to Hirael! Title the PR in Conventional Commit format,
  e.g. `feat(multi-select): add async loader prop`. Keep it focused: one
  component, one fix, or one refactor.
-->

## Summary

<!-- What changes and why. Link the issue (e.g. Closes #123). -->

## Type of change

- [ ] New component, block or template (`feat`)
- [ ] Bug fix (`fix`)
- [ ] Docs (`docs`)
- [ ] Refactor or internal (`refactor` / `chore`)
- [ ] Build, CI or tooling (`build` / `ci`)

## Checklist

- [ ] `pnpm lint && pnpm typecheck && pnpm registry:build && pnpm build` pass locally
- [ ] Declared in `registry/hirael/registry-meta.ts` (generated `registry*.json` and `public/r/` not committed)
- [ ] Same change in both bases: `bases/radix/` and `bases/base/`
- [ ] Demo at `bases/<base>/examples/<name>-demo.tsx` with strings through `useT()` (components only)
- [ ] Checked in light, dark and RTL on the preview
- [ ] New items listed under `added:` in a `content/changelog/*.mdx` entry

## Screenshots

<!-- Required for UI work. Light and dark, plus RTL if layout changed. -->

## Test plan

<!-- What you exercised, and how. -->
