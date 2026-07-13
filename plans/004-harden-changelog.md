# Plan 004: Harden changelog parsing and rendering against bad input

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If a
> STOP condition occurs, stop and report. When done, update this plan's row in
> `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 34b5a9e..HEAD -- lib/changelog.ts components/showcase/changelog-view.tsx`
> If either file changed, compare the "Current state" excerpts against the live
> code; on a mismatch, STOP.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `34b5a9e`, 2026-07-13

## Why this matters

The `/changelog` page is rendered from GitHub Releases at build time and frozen
into the static export. The parser fails **globally** on one bad input: a single
malformed date in one release note makes the _entire_ changelog render "No
releases recorded yet," and because the error is swallowed the build succeeds and
ships the blank page unnoticed. Three smaller rendering bugs (React key
collisions, a heading parser that eats colon-ending bullets, and a "Latest" badge
that can disagree with the "Updated" date) round out the hardening. This is
build-time-only code, but its output is what every visitor sees.

## Current state

### Bug A — a malformed date blanks the whole changelog

`lib/changelog.ts:110-118` (inside `releaseToChangelog`):

```ts
const dateString =
  release.body?.match(DATE_OVERRIDE)?.[1] ?? // <!-- date: YYYY-MM-DD -->, shape-checked only
  release.published_at ??
  release.created_at;
const isoDate = dateString ? new Date(dateString).toISOString() : null; // :118 — throws on invalid date
```

`DATE_OVERRIDE` (`lib/changelog.ts:47`) is `/<!--\s*date:\s*(\d{4}-\d{2}-\d{2})\s*-->/`
— it validates _shape_, not calendar validity. A value like `2026-02-30` or
`2026-13-01` produces an `Invalid Date`, and `.toISOString()` throws `RangeError:
Invalid time value`.

`lib/changelog.ts:154-163` (`getChangelog`):

```ts
try {
  const raw = await fetchReleases();
  releases = raw
    .map(releaseToChangelog) // one throw here aborts the whole .map
    .filter((release): release is ChangelogRelease => release !== null);
} catch {
  releases = []; // → entire changelog becomes empty
}
```

So one bad date typo takes down every release, silently.

### Bug B — heading parser treats any line ending in `:` as a heading

`lib/changelog.ts:89` (in `parseSections`):

```ts
const headingMatch = line.match(/^(.+):$/); // a bullet "- Fixes the redirect bug:" matches
```

A bullet that happens to end in a colon is classified as a heading with no items,
then dropped by the `items.length > 0` filter (`:107`) — its content vanishes.

### Bug C — React key collisions on duplicate headings/bullets

`components/showcase/changelog-view.tsx:80` uses `key={section.heading}` and `:87`
uses `key={item}`. A release body with two `Highlights:` sections, or two identical
bullet strings, produces duplicate keys (warning + possible mis-reconciliation).
`parseSections` does not de-dup headings.

### Bug D — "Latest" badge (index 0) can disagree with "Updated" date

`components/showcase/changelog-view.tsx:56` pins the "Latest" badge to
`index === 0`, and the list is sorted by semver (`lib/changelog.ts:165` →
`compareSemver`, highest first). But `lastUpdated` (`lib/changelog.ts:170-179`) is
the most recent by `isoDate`, explicitly to handle a backport shipping after a
newer major. So a backported `v1.2.4` published after `v2.0.0` makes the header
read "Updated <v1.2.4 date>" while the badge sits on `v2.0.0`.

## Commands you will need

| Purpose   | Command          | Expected on success |
| --------- | ---------------- | ------------------- |
| Install   | `pnpm install`   | exit 0              |
| Typecheck | `pnpm typecheck` | exit 0              |
| Lint      | `pnpm lint`      | exit 0              |
| Build     | `pnpm build`     | exit 0              |

## Scope

**In scope**:

- `lib/changelog.ts`
- `components/showcase/changelog-view.tsx`

**Out of scope**:

- The `/changelog` route, `app/changelog/page.tsx` — presentation stays the same.
- The `DATE_OVERRIDE` marker format and the `Heading:` / `- bullet` release-note
  contract — don't change the authoring format, just make the parser robust to
  violations of it.

## Git workflow

- Branch: `advisor/004-changelog-hardening`
- Commit style: `fix: make changelog parsing resilient to malformed release notes`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Guard the date parse (Bug A)

Replace the throwing conversion at `:118` with a validated parse:

```ts
const parsed = dateString ? new Date(dateString) : null;
const isoDate =
  parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : null;
```

Also apply the same guard to the `displayDate` computation at `:125-127` (it calls
`new Date(isoDate)` again — safe once `isoDate` is validated, but confirm it
doesn't reintroduce a throw).

**Verify**: `pnpm typecheck` exits 0.

### Step 2: Isolate per-release failures (Bug A, defense in depth)

Make `releaseToChangelog` unable to take down the whole list: wrap its body in a
try/catch that returns `null` on any unexpected error (so `.filter` drops just that
release), OR wrap the per-item call in `getChangelog`'s map. Prefer the per-item
guard so one malformed release is dropped, not the entire changelog.

**Verify**: `pnpm typecheck` exits 0. Trace: a release that still somehow throws
now yields `null` and is filtered, leaving the others intact.

### Step 3: Don't treat colon-ending bullets as headings (Bug B)

At `lib/changelog.ts:89`, only match a heading when the line is not a bullet:

```ts
const headingMatch = !line.startsWith("- ") ? line.match(/^(.+):$/) : null;
```

**Verify**: `pnpm typecheck` exits 0.

### Step 4: Composite React keys (Bug C)

In `changelog-view.tsx`, change `key={section.heading}` (`:80`) to include the map
index (e.g. ``key={`${section.heading}-${i}`}``) and `key={item}` (`:87`) to
``key={`${item}-${i}`}`` (add the index parameter to the `.map` callbacks).

**Verify**: `pnpm lint` and `pnpm typecheck` exit 0.

### Step 5: Reconcile "Latest" with "Updated" (Bug D)

Pick one definition and make the UI consistent. Recommended: badge the release
whose `isoDate` equals the computed most-recent date rather than `index === 0`.
The simplest approach: expose the most-recent release's `key` from `getChangelog`
(add a `latestKey` field to the `Changelog` type, set from the same `reduce` at
`:170-179`), and in `changelog-view.tsx:56` badge `release.key === latestKey`
instead of `index === 0`. If threading a new field is undesirable, the acceptable
alternative is to rename the badge label to "Latest release" so it clearly means
"highest version," matching the semver sort. Choose one; do not leave both
notions unlabelled.

**Verify**: `pnpm typecheck` exits 0; if you added `latestKey`, confirm the type
and the producer/consumer agree.

### Step 6: Full build

**Verify**: `pnpm build` exits 0 and the `/changelog` page renders in `out/`
(`ls out/changelog` shows `index.html`).

## Test plan

No unit runner. Verification is typecheck/lint/build plus reasoning through each
guard. If a `lib/*.test.ts` runner is ever added, `parseSections` and
`releaseToChangelog` are ideal pure-function test targets: feed a body with an
invalid date, a duplicate heading, and a colon-ending bullet, and assert the output
is well-formed and non-empty. Note that as the recommended first-test-set target.

## Done criteria

- [ ] An invalid date override no longer throws (validated parse at `:118`)
- [ ] One malformed release cannot empty the whole list (per-release isolation)
- [ ] A bullet ending in `:` is not treated as a heading
- [ ] Changelog list keys are unique even with duplicate headings/bullets
- [ ] The "Latest" badge and "Updated" date use one consistent definition
- [ ] `pnpm typecheck` exits 0, `pnpm lint` exits 0, `pnpm build` exits 0
- [ ] Only the two in-scope files modified
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report if:

- `getChangelog`/`releaseToChangelog`/`parseSections` have been refactored so the
  cited lines don't match.
- Adding `latestKey` would require changing the `/changelog` page contract in a way
  that breaks other consumers of `getChangelog` — fall back to the rename option.

## Maintenance notes

- The release-note authoring contract (`Heading:` + `- bullet`, optional
  `<!-- date: -->`) is unchanged; this only hardens the parser against mistakes.
- A reviewer should confirm the empty-changelog path ("No releases recorded yet")
  still works when the fetch genuinely returns nothing — the fail-soft behavior
  must survive.
