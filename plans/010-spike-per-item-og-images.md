# Plan 010 (spike): Per-item OpenGraph images for catalog pages

> **Executor instructions**: This is a DESIGN/SPIKE plan, not a build-everything
> plan. Produce a working proof for ONE segment plus a written recommendation;
> do not roll it out to all ~145 pages until the approach is approved. Follow the
> steps, run the verifications, and report findings + open questions. Update this
> plan's row in `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat 34b5a9e..HEAD -- app/opengraph-image.tsx "app/(showcase)"`

## Status

- **Priority**: P3 (direction / spike)
- **Effort**: M (coarse — direction estimate)
- **Risk**: LOW (additive route files)
- **Depends on**: none (composes well after Plan 009's `detailMetadata`)
- **Category**: direction
- **Planned at**: commit `34b5a9e`, 2026-07-13

## Why this matters

All ~145 catalog pages (73 components + 61 blocks + 9 templates) share one
site-wide social card (`app/opengraph-image.tsx`). Every shared link — Slack, a
blog, a PR — unfurls the generic homepage image instead of "Hero 03." A registry's
reach depends on shareability, and shadcn/ui (hirael's stated parity target) renders
per-item previews. A distinct card per item is the cheapest reach multiplier the
site can add, and it compounds automatically on every future item. This spike
proves the `ImageResponse` + `output: "export"` path works and recommends the card
design.

## Current state

`app/opengraph-image.tsx` is the only OG image, a static `ImageResponse` (Next
`next/og`) marked `export const dynamic = "force-static"` (`:6`), `size` 1200×630
(`:8`), rendering the wordmark + tagline + a computed
`${components} components · ${blocks} blocks` line (`:110`). It reads
`COMPONENTS`/`REGISTRY` from `registry-meta.ts`.

The three detail routes each hard-code `images: ["/opengraph-image"]` /
`{ url: "/opengraph-image", width: 1200, height: 630 }` in their
`generateMetadata` (e.g.
`app/(showcase)/components/[category]/[component]/page.tsx:61-68,74`).

Under `output: "export"`, a route-segment `opengraph-image.tsx` with
`generateStaticParams` + `force-static` is emitted as a static PNG at build — the
same mechanism the single image already uses, so it is export-safe. The open
question is font loading and per-item styling, not feasibility.

## Commands you will need

| Purpose | Command                                                               | Expected on success               |
| ------- | --------------------------------------------------------------------- | --------------------------------- |
| Install | `pnpm install`                                                        | exit 0                            |
| Build   | `pnpm build`                                                          | exit 0; PNGs emitted under `out/` |
| Inspect | `ls out/(showcase)/components/*/*/opengraph-image*` (path may differ) | per-item image files exist        |

## Scope

**In scope (spike)**:

- ONE new `opengraph-image.tsx` under a single detail segment (recommend the
  component segment: `app/(showcase)/components/[category]/[component]/`)
- That route's `generateMetadata` to point at its own image
- A written recommendation in this plan's "Findings" section (append it)

**Out of scope (until approved)**:

- Rolling out to blocks and templates segments
- Real live-preview screenshots (build-time capture) — evaluate but don't build
- Changing the existing site-wide `app/opengraph-image.tsx`

## Git workflow

- Branch: `advisor/010-spike-og-images`
- Commit style: `feat: per-item OpenGraph image (spike, components segment)`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Add a per-segment opengraph-image for components

Create `app/(showcase)/components/[category]/[component]/opengraph-image.tsx`
mirroring `app/opengraph-image.tsx`'s structure (`force-static`, `size`,
`contentType`), but:

- `export function generateStaticParams()` returning the same `{ category,
component }` pairs the page uses (import `COMPONENTS` from `registry-meta.ts`).
- The default export receives `{ params }` (a Promise under Next 16 — `await` it),
  looks up `REGISTRY_BY_NAME[component]`, and renders a templated card: the item
  title (large), its category label, and the description, styled with the existing
  palette constants (`#0D1117` canvas, `#E7E4DE` ink) from the site-wide image.

### Step 2: Point the route metadata at its own image

In the component route `generateMetadata`, replace the hard-coded
`/opengraph-image` references with the relative per-item image URL Next generates
for the segment (Next resolves `opengraph-image` relative to the route). Confirm
the emitted `<meta property="og:image">` points at the per-item PNG.

### Step 3: Build and verify emission

**Verify**:

- `pnpm build` exits 0.
- Per-item PNGs are emitted for each component under `out/` (find them:
  `find out -name 'opengraph-image*'`).
- The component detail page's `<head>` references its own image (grep an
  `out/.../index.html` for `og:image`).

### Step 4: Evaluate font loading and write the recommendation

`ImageResponse` needs fonts embedded for non-system typefaces. Confirm the spike
renders acceptably with the default/system font, or document what font-loading
step a branded card needs (fetch a woff at build, pass to `ImageResponse` `fonts`).
Then append a **Findings** section to this plan answering:

- Templated card vs. build-time live screenshot — which, and why?
- Font strategy under `output: "export"`.
- Rollout cost to blocks + templates (mostly mechanical once the component segment
  works — note the two extra `generateStaticParams` sources).
- Any per-item OG image build-time cost (145 `ImageResponse` renders).

## Test plan

No automated test. The spike's proof is: per-item PNGs exist in `out/`, and one
detail page's HTML references its own card. Manually open a generated PNG to
eyeball the card. If image-snapshot testing is ever added, per-item OG is a natural
target.

## Done criteria

- [ ] One per-segment `opengraph-image.tsx` builds and emits per-item PNGs
- [ ] The component detail page references its own OG image in `out/`
- [ ] `pnpm build` exits 0
- [ ] A **Findings** section is appended recommending card design, font strategy, and rollout plan
- [ ] `plans/README.md` status row updated
- [ ] No rollout to blocks/templates yet (spike scope only)

## STOP conditions

Stop and report if:

- `ImageResponse` fails under `output: "export"` at build (report the error — it
  would change the whole approach; a build-time capture step may be needed).
- Per-item image emission balloons build time unacceptably (report the delta).

## Maintenance notes

- If approved, rollout adds one `opengraph-image.tsx` per remaining segment (blocks,
  templates) and updates their metadata — trivial once Plan 009's `detailMetadata`
  centralizes the OG wiring.
- Keep the card driven by `registry-meta.ts` so new items get a card for free.
