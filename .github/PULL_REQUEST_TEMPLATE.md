<!--
  Thanks for contributing to Hirael! Please give your PR a title in
  Conventional Commit format, e.g. `feat(multi-select): add async loader prop`.
  Keep the PR focused — one component, one fix, or one refactor.
-->

## Summary

<!-- What does this change and why? Link any related issue (e.g. Closes #123). -->

## Type of change

- [ ] New component / block / template (`feat`)
- [ ] Bug fix (`fix`)
- [ ] Docs (`docs`)
- [ ] Refactor / internal (`refactor` / `chore`)
- [ ] Build / CI / tooling (`build` / `ci`)

## Checklist

- [ ] `pnpm lint && pnpm typecheck && pnpm registry:build && pnpm build` pass locally
- [ ] Edited `registry/hirael/registry-meta.ts` and ran `pnpm registry:gen` (never hand-edited `registry.json`)
- [ ] Registered a preview loader in `registry-demos.tsx` for any new showcased item
- [ ] Tokens reuse design variables (no hard-coded colors); verified in **both** light and dark
- [ ] Works under `dir="rtl"` (checked the preview RTL toggle) using CSS logical properties
- [ ] Copy is concise and human; comments in shipped `registry/hirael/**` source are purposeful (it's copied into consumer repos)

## Test plan

<!-- How did you verify this? Add screenshots or short clips for any UI work. -->
