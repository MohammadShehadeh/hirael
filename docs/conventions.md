# Conventions & gotchas

Framework, registry, and tooling notes hit during development. When you trip
over a new one worth a future agent's time, add it here under the right
heading rather than starting a new doc.

## Next.js 16 (App Router)

- **`output: "export"` — the whole site is static.** No server at runtime:
  no request-time route handlers, no ISR, no dynamic rendering, no
  middleware data. Anything that needs data runs **once during
  `next build`** and is frozen into `out/`. See `app/changelog` (build-time
  GitHub fetch) and the `[component]` / `[block]` pages (build-time
  `fs.readFile` of source) for the pattern.
- **Dynamic params are Promises.** Route segment props are
  `params: Promise<{ … }>` and must be `await`ed:

  ```tsx
  export default async function Page({
    params,
  }: { params: Promise<{ component: string }> }) {
    const { component } = await params
  }
  ```

  The same applies to `generateMetadata`. Don't destructure `params`
  synchronously — that's the pre-15 shape.
- **Static param sets are closed.** Dynamic routes use
  `export const dynamicParams = false` + `generateStaticParams()`, so only
  enumerated paths are built and anything else 404s. Add new items to the
  source list (`registry-meta.ts`), not to a separate route table.
- **Reading source off disk is fine — at build time.** The component/block
  pages `import * as fs from "node:fs/promises"` and read the registry TSX to
  show "Usage" source. Under `output: "export"` these reads only ever run
  during the build, so there's no request-time filesystem access. Don't move
  these reads into a client component.
- **Images are `unoptimized: true`** — the optimizer needs a server a static
  export doesn't have. Use plain `<img>`/`next/image` with known dimensions.
- Turbopack powers `next dev` and `next build` (see `package.json`).

## React 19

- **The React Compiler is NOT enabled here** (unlike some sibling repos), so
  the usual `useMemo`/`useCallback` rules apply — add them where a real
  measured need exists, but prefer plain derived values for readability.
- Server Components by default; mark interactive files `"use client"`. The
  showcase chrome (`site-header`, `topbar`, theme toggles) is client; pages
  are mostly server components that pass data down.
- `rsc: true` in `components.json`.

## Tailwind CSS v4

- **No `tailwind.config.js`.** Config is CSS-first: `@import "tailwindcss"`
  in [app/globals.css](../app/globals.css), tokens via `@theme inline`, and
  variants via `@custom-variant`. `components.json` has an empty
  `tailwind.config` on purpose.
- PostCSS is `@tailwindcss/postcss` only (see `postcss.config.mjs`).
- **Theme switching is two custom variants** — `.dark` and `.light` — both
  set on `<html>` by a prehydration script (`lib/theme.ts`,
  `themePrehydrationScript()`), so there's no flash and `dark:` utilities
  resolve the shadcn way. Keep the prehydration script inline in
  `app/layout.tsx`.
- `tw-animate-css` is imported for keyframe utilities.

## Registry items

- **Edit `registry-meta.ts`, then `pnpm registry:gen`.** `registry.json` is
  generated; `pnpm check:registry` fails the build on drift, on declared
  `registryDependencies` that don't match a component's real imports, or on a
  showcased entry missing its preview loader in `registry-demos.tsx`.
- **Register the preview loader in `registry-demos.tsx`.** Every showcased
  item renders its preview / `/embed/*` iframe through `RegistryDemo`, keyed
  by entry name; an unregistered name returns `null` and the preview comes up
  blank. `check:registry` enforces it so this can't ship silently.
- **Compound API first + `data-slot`.** Always default to a flat, shadcn-style
  compound API: the bare `Name` holds state; parts are `NameTrigger`,
  `NameContent`, … A single-prop convenience form is optional and secondary,
  never the only API. Every rendered slot carries `data-slot="<kebab>"`.
- **Import shadcn primitives from `@/registry/hirael/ui/*`** (the `ui` alias).
  The alias is rewritten to the consumer's `components.json` on install — a
  relative import would break that rewrite.
- **Tokens, not colors.** Never hard-code a color in component source.
- **Comments are stripped on publish** (`scripts/strip-comments.mjs`) because
  the source is copied into consumer repos. Put reasoning in commits/PRs/docs.
  Comments in `components/showcase/`, `app/`, `lib/` are fine — those aren't
  published.
- **Distribution-only items** (e.g. `accordion`) live in `DISTRIBUTION_ONLY`
  in `registry-meta.ts`: they ship in the registry but have no standalone
  showcase page.

## RTL

Components, blocks, and templates must work under `dir="rtl"` with no extra
config. Use
**logical** utilities (`ms/me`, `ps/pe`, `start/end`, `text-start/end`,
`border-s/e`, `rounded-s/e`) over physical ones; flip directional icons with
`rtl:rotate-180`; mirror horizontal arrow-key focus movement. Physical
positioning is fine where geometry genuinely is physical (Radix
`data-[side]` animations, the color-picker canvas, `side="left|right"` on
Sheet/Sidebar). Every preview has an RTL toggle — verify with it.

The framed `/embed/*` previews carry direction as a `?dir=rtl` query
param. It's applied to `<html dir>` by a pre-paint inline script
(`lib/embed.ts`, rendered from each embed `page.tsx`), the same trick the
theme uses — so an RTL preview comes up correct on the first frame instead
of flipping after hydration. The embed shells are plain background wrappers;
don't reintroduce direction state there.

## Changelog fetch

[lib/changelog.ts](../lib/changelog.ts) fetches GitHub Releases with
`cache: "force-cache"` so the result is baked into the static export. It
fails soft: a non-200 or thrown error yields an empty list and the page
shows "No releases recorded yet" rather than failing the build. Auth is
optional via `GITHUB_TOKEN_HIRAEL` (mapped from `RELEASES_TOKEN` in the
release build, and the Actions `GITHUB_TOKEN` in CI) to dodge the 60 req/hr
unauthenticated limit on shared runner IPs. Release bodies must use
`Heading:` lines followed by `- ` bullets — that's what the parser groups
into sections.

## Style

- Registry source style: **2-space indent, double-quoted strings, no
  trailing semicolons** (match the surrounding file). The repo does not run a
  separate formatter — don't reformat committed files; reset your editor's
  formatter on this repo instead.
- Prefer named exports; default exports are reserved for Next.js route/page
  files.
- Use the `@/` path alias, not `../../` chains.
- Compose class names with `cn(...)` from `@/lib/utils`.
- **Copy reads like a human** — concise, plain, specific; short labels and
  sentences; no filler or marketing voice. Applies to registry
  `description`s, demo / block / template copy, empty states, and showcase
  text. Prefer "Pick a date" over "Effortlessly select your desired date."
- **No em dashes in user-facing copy** — a deliberate site-wide decision.

## Gating signal

There is no unit/visual-regression suite yet. Before requesting review:

```bash
pnpm lint && pnpm typecheck && pnpm registry:build && pnpm build
```

plus the manual checks in [CONTRIBUTING.md](../CONTRIBUTING.md) (exercise the
showcase demo, validate an `npx shadcn add` into a consumer app, check both
themes, spot-check keyboard/AT for interactive items).
