# Plan 009: Extract the duplicated loadSource + detail-page metadata helpers

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If a
> STOP condition occurs, stop and report. When done, update this plan's row in
> `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 34b5a9e..HEAD -- "app/(showcase)/components/[category]/[component]/page.tsx" "app/(showcase)/blocks/[category]/[block]/page.tsx" "app/(showcase)/templates/[template]/page.tsx"`
> If any changed, re-diff the three files against each other before extracting.

## Status

- **Priority**: P3
- **Effort**: S–M
- **Risk**: LOW
- **Depends on**: none (touches only showcase route code)
- **Category**: tech-debt
- **Planned at**: commit `34b5a9e`, 2026-07-13

## Why this matters

Three detail-route files carry a byte-for-byte identical `loadSource` helper and a
near-identical `generateMetadata` body (~210 lines total across the three). Any
change to source-reading or to the OpenGraph/Twitter tags must be made three times,
and it has already copy-drifted once. This is showcase site code, where DRY applies
normally (unlike the intentionally self-contained registry items). Extracting the
shared logic also makes the per-item OG-image work (Plan 010) a single-point
change instead of three.

## Current state

The three route files are:

- `app/(showcase)/components/[category]/[component]/page.tsx`
- `app/(showcase)/blocks/[category]/[block]/page.tsx`
- `app/(showcase)/templates/[template]/page.tsx`

Each contains `loadSource`, identical modulo nothing. From the components route
(`app/(showcase)/components/[category]/[component]/page.tsx:79-104`):

```tsx
async function loadSource(
  files: string[] | undefined,
): Promise<Record<string, SourceFile>> {
  const out: Record<string, SourceFile> = {};
  if (!files) return out;
  await Promise.all(
    files.map(async (f) => {
      const abs = path.join(process.cwd(), f);
      let code: string;
      try {
        code = await fs.readFile(abs, "utf8");
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[loadSource] could not read ${abs}: ${msg}`);
        code = `// (unable to read source: ${msg})`;
      }
      const lang = langFromPath(f);
      const html = await highlightCode(code, lang);
      out[f] = { code, html, lang };
    }),
  );
  return out;
}
```

And each `generateMetadata` (same file, `:32-77`) is near-identical: same
`openGraph` article block, `twitter` summary_large_image card, and
`/opengraph-image` 1200×630 wiring, differing only in the title suffix (component:
none, block: " block", template: " template") and the not-found guard. The
components route has drifted slightly (an extra explanatory comment the others
lack).

`SourceFile` is a type exported from `@/components/showcase/component-page`.
`highlightCode` / `langFromPath` come from `@/lib/highlight`. `SITE` from
`@/lib/site`. These are the existing conventions to reuse.

## Commands you will need

| Purpose   | Command                     | Expected on success                 |
| --------- | --------------------------- | ----------------------------------- |
| Install   | `pnpm install`              | exit 0                              |
| Typecheck | `pnpm typecheck`            | exit 0                              |
| Build     | `pnpm build`                | exit 0                              |
| Diff out  | compare `out/` before/after | identical HTML for the detail pages |

## Scope

**In scope**:

- `lib/highlight.ts` (or a new `lib/registry-source.ts`) — home for `loadSource`
- `lib/site.ts` — home for a `detailMetadata(...)` helper (it already owns `SITE`)
- The three detail route `page.tsx` files — call the helpers

**Out of scope**:

- The rendered output — the `out/` HTML for these pages must be byte-identical
  after the refactor (this is a pure DRY extraction, no behavior change).
- `component-page.tsx` and the `SourceFile` type — reuse, don't move.
- The registry `[category]` listing pages (`category-page.tsx` etc.) — that's a
  separate duplication (TD-09), not in scope here.

## Git workflow

- Branch: `advisor/009-dedupe-detail-routes`
- Commit style: `refactor: extract shared loadSource and detail metadata helpers`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Extract loadSource

Move the `loadSource` function into `lib/highlight.ts` (it already owns
`highlightCode`/`langFromPath`) or a new `lib/registry-source.ts`. Export it, keep
the signature and the exact error message (`[loadSource] could not read …`).
Import the `SourceFile` type from `@/components/showcase/component-page` (or move
the type to `lib` if a cleaner home is warranted — but keep the existing name).

**Verify**: `pnpm typecheck` exits 0; `grep -rn "async function loadSource" app`
returns nothing (all three inline copies removed).

### Step 2: Extract detail metadata

Add a helper to `lib/site.ts`, e.g. `detailMetadata(entry, { titleSuffix,
canonical })`, that returns the shared `Metadata` object (title, description,
`alternates.canonical`, `openGraph` article block, `twitter` card, the
`/opengraph-image` reference). Have each route call it with its suffix. Keep each
route's own not-found guard inline (it differs per route).

**Verify**: `pnpm typecheck` exits 0; the three `generateMetadata` functions are
now thin wrappers around `detailMetadata`.

### Step 3: Rebuild and diff the output

Build before and after and confirm the detail pages are unchanged:

```bash
git stash            # or build the pre-change tree first
pnpm build && cp -r out /tmp/out-before
git stash pop
pnpm build && diff -r /tmp/out-before/components /out/components  # etc.
```

Practical alternative if stashing is awkward: build once after the change and spot-
check that a component, a block, and a template detail page render with the correct
`<meta property="og:*">` tags and the same source/usage sections as before.

**Verify**: `pnpm build` exits 0; the detail pages' HTML (esp. `<head>` OG/Twitter
tags and the source blocks) is unchanged.

## Test plan

No unit runner. The test is the output diff: a pure refactor must produce identical
`out/` for the detail routes. If a `lib/*.test.ts` runner is added later,
`loadSource` (mock `fs`) and `detailMetadata` (assert the OG shape) are clean
targets.

## Done criteria

- [ ] `loadSource` exists in exactly one place (`lib/`) and all three routes import it
- [ ] A `detailMetadata` helper in `lib/site.ts` backs all three `generateMetadata`
- [ ] `grep -rn "async function loadSource" app` returns no matches
- [ ] `pnpm typecheck` and `pnpm build` exit 0
- [ ] Detail-page output is unchanged (diff or spot-check of OG tags + source sections)
- [ ] Only the in-scope files modified
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report if:

- The three `loadSource` copies are NOT actually identical (a real behavioral
  difference exists) — report the difference; don't collapse them lossily.
- The output diff shows any change to the detail pages beyond whitespace — the
  refactor altered behavior; investigate before proceeding.

## Maintenance notes

- Plan 010 (per-item OG images) should build on `detailMetadata` — after this
  lands, pointing each route at its own OG image is a one-argument change, not
  three edits.
- The `[category]` listing-page duplication (TD-09) is a separate, lower-value
  extraction left for later.
