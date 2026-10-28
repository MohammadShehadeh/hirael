<!--
  Thanks for contributing! Title the pull request in the Conventional Commits
  format, like "fix(phone-input): keep the country when the number is cleared",
  and keep it to one change. CONTRIBUTING.md has the details.
-->

## What does this change?

<!-- What you changed and why, in a few sentences. -->

Closes #

## How did you test it?

<!--
  What you checked and how. For visual changes, add screenshots in light and
  dark mode, and in right-to-left if the layout changed.
-->

## Checklist

- [ ] `pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build` passes
- [ ] Components, blocks and templates are changed the same way in both `bases/radix/` and `bases/base/`
- [ ] I checked it in light mode, dark mode and right-to-left
- [ ] It doesn't break existing usage, or the title has a `!` and the description explains how to update
- [ ] New components, blocks and templates are listed under `added:` in a `content/changelog/` entry
