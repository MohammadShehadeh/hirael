<!--
  Thanks for contributing to Hirael!

  Please give your pull request a title in the Conventional Commits format,
  for example:
    feat(week-picker): add week picker component
    fix(phone-input): keep the country when the number is cleared

  Keep each pull request to one change. Remove any section that doesn't apply.
  The contributing guide explains each step: CONTRIBUTING.md
-->

## What does this pull request do?

<!-- Describe the change and why it's needed, in a few sentences. -->

Closes #

## Type of change

- [ ] New component, block or template
- [ ] New feature for an existing component, block or template
- [ ] Bug fix
- [ ] Documentation
- [ ] Tests
- [ ] Refactoring or performance improvement
- [ ] Build, CI or tooling

## Affected components

<!--
  List the components, blocks or templates you added or changed, with a link
  to their page on the website. For example:
    - tag-input: https://hirael.com/components/inputs/tag-input
  Leave this empty if you only changed the website or tooling.
-->

## Does this break existing usage?

<!--
  People who installed a component own a copy of its code, so a change like
  renaming a prop can break their project when they update. If you renamed or
  removed a prop, a part, an export or a data-slot, explain how to update, and
  add a "!" to the title, like "feat(multi-select)!: ...".
-->

- [ ] No, this doesn't break existing usage

## Screenshots

<!--
  Required for visual changes. Show light and dark mode, and right-to-left if
  the layout changed. For bug fixes, include before and after. For animations
  or interactions, a short video helps.
-->

## How did you test this?

<!--
  Describe what you checked and how. For example:
  "Pasted 'a, b, c' into the tag input and got three tags. Pressing Backspace
  in the empty input removed the last tag."
-->

## Checklist

### Every pull request

- [ ] All checks pass locally:
      `pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm registry:build && pnpm build`
- [ ] I haven't committed generated files (`registry*.json`,
      `registry-props.json`, `llms.txt` or anything in `public/r/`)
- [ ] I haven't disabled the `shadcn/no-restyle` lint rule

### Components, blocks and templates

- [ ] It's listed in `registry/hirael/registry-meta.ts` with the right
      dependencies
- [ ] The same change is made in both the Radix UI (`bases/radix/`) and Base UI
      (`bases/base/`) versions
- [ ] Every part has a `data-slot` attribute, and colors come from the theme
      (no fixed colors)
- [ ] It works in right-to-left layouts
- [ ] Components have a demo in `examples/` in both versions, with text
      translated through `useT()`
- [ ] Tests in `registry/hirael/tests/` cover both versions, where the behavior
      is worth testing
- [ ] I checked it in light mode, dark mode and right-to-left, with both
      versions
- [ ] `pnpm check:health --changed` passes
- [ ] New components, blocks and templates are listed under `added:` in a
      `content/changelog/` entry
