# Plan 003: Fix four correctness bugs in shipped registry components

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If a
> STOP condition occurs, stop and report. When done, update this plan's row in
> `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 34b5a9e..HEAD -- registry/hirael/components/qr-code.tsx registry/hirael/components/lazy-select.tsx registry/hirael/components/rich-text-editor.tsx registry/hirael/components/mention-input.tsx`
> If any in-scope file changed, compare the "Current state" excerpts against the
> live code; on a mismatch, STOP.

## Status

- **Priority**: P1
- **Effort**: S–M
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `34b5a9e`, 2026-07-13

## Why this matters

These four components are copied verbatim into consumer apps, where they run with
real user input. Two of the bugs (qr-code, lazy-select) are HIGH-confidence
defects that degrade or crash a consumer's app; two (rich-text-editor,
mention-input) are latent hazards that fire under specific but realistic
conditions. All four fixes are small and local.

## Current state

Comments are stripped from `registry/hirael/**` on publish, so keep any reasoning
out of the source — put it in the commit message.

### Bug A — `qr-code` throws during render on over-long values

`registry/hirael/components/qr-code.tsx:548-557`:

```tsx
const { d, dim } = React.useMemo(() => {
  const matrix = encodeQR(value, level); // :549 — throws for over-long value
  let path = "";
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix.length; x++) {
      if (matrix[y][x]) path += `M${x + margin} ${y + margin}h1v1h-1z`;
    }
  }
  return { d: path, dim: matrix.length + margin * 2 };
}, [value, level, margin]);
```

`encodeQR` → `pickVersion` (`qr-code.tsx:236-249`) throws
`Error("QRCode: value too long…")` when the input exceeds version-40 capacity for
the chosen error-correction `level`. There is no try/catch or error boundary, so
a too-long `value` (easy to hit at `level="H"`, or with runtime/user input)
crashes the entire React subtree during render.

### Bug B — `lazy-select` leaves `loadingMoreRef` stuck true

`registry/hirael/components/lazy-select.tsx:484-511`:

```tsx
const loadMore = React.useCallback(async () => {
  if (
    !enabled ||
    loadingRef.current ||
    loadingMoreRef.current ||
    !hasMoreRef.current
  )
    return;
  const id = reqId.current;
  const nextPage = pageRef.current + 1;
  loadingMoreRef.current = true;
  setLoadingMore(true);
  try {
    const res = await loader({ query, page: nextPage });
    if (id !== reqId.current) return; // :499 early return on stale response
    setOptions((prev) => [...prev, ...res.items.map(map)]);
    pageRef.current = nextPage;
    setHasMoreBoth(res.hasMore);
  } catch (e) {
    if (id === reqId.current) setError(e);
  } finally {
    if (id === reqId.current) {
      // :506 guard skips reset when stale
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }
}, [enabled, query, loader, map, setHasMoreBoth]);
```

If a new search bumps `reqId.current` (the search effect at `:465` runs
`++reqId.current`) while a page fetch is in flight, then on resume `id !==
reqId.current`: the `finally` guard is false, so `loadingMoreRef.current` is never
reset to `false`. The guard at `:485-490` then rejects **every** subsequent
`loadMore` for the lifetime of the hook — infinite-scroll pagination silently and
permanently stops.

### Bug C — `rich-text-editor` hide-timer not cleared on unmount

`registry/hirael/components/rich-text-editor.tsx:484,489,495-500,522-530`:

```tsx
const hideTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null); // :484
const rafRef = React.useRef(0);

React.useEffect(() => () => cancelAnimationFrame(rafRef.current), []); // :489 — only cancels rAF

const clearHide = React.useCallback(() => {
  // :495
  if (hideTimer.current) {
    clearTimeout(hideTimer.current);
    hideTimer.current = null;
  }
}, []);
// ...
const scheduleHide = React.useCallback(() => {
  // :522
  clearHide();
  hideTimer.current = setTimeout(() => {
    if (editingRef.current) return;
    const el = linkAtSelection(); // calls editor.view.domAtPos(...) — 200ms later
    if (el) show(el);
    else setTarget(null);
  }, 200);
}, [clearHide, linkAtSelection, show]);
```

The unmount cleanup at `:489` cancels the rAF but not `hideTimer`. When the editor
unmounts, `useEditor` destroys the ProseMirror view, but a pending 200ms hide
timer can still fire and call `editor.view.*` on the destroyed view (setState after
unmount / possible throw in a consumer app).

### Bug D — `mention-input` restarts its debounce on every render with an inline `onSearch`

`registry/hirael/components/mention-input.tsx:243-266`:

```tsx
React.useEffect(() => {
  if (!onSearch || activeQuery === undefined || activeTrigger === undefined) return;
  let cancelled = false;
  setLoading(true);                                     // :248
  const t = setTimeout(() => { onSearch(activeQuery, activeTrigger).then(...).catch(...); }, 200);
  return () => { cancelled = true; clearTimeout(t); };
}, [onSearch, activeQuery, activeTrigger]);              // :266 — onSearch identity in deps
```

With an inline `onSearch` prop (new identity each render), a parent re-rendering
faster than the 200ms window clears the pending timer and re-shows "Searching…"
before it can fire — the search never resolves. The intended pattern is in
`registry/hirael/components/multi-select.tsx:452-474`, which ref-stabilizes its
`loader`/`map` props (`loaderRef`/`mapRef`) and keys the effect on the query only.
`lazy-select` has the same latent shape in its search effect at `:463-482`.

## Commands you will need

| Purpose   | Command          | Expected on success |
| --------- | ---------------- | ------------------- |
| Install   | `pnpm install`   | exit 0              |
| Typecheck | `pnpm typecheck` | exit 0              |
| Lint      | `pnpm lint`      | exit 0              |
| Build     | `pnpm build`     | exit 0              |

## Suggested executor toolkit

- Use the `react-best-practices` / `vercel-react-best-practices` skill if
  available when writing the ref-stabilization in Bug D.
- Study `registry/hirael/components/multi-select.tsx:452-474` as the exemplar for
  the Bug D fix before writing it.

## Scope

**In scope** (modify only these):

- `registry/hirael/components/qr-code.tsx`
- `registry/hirael/components/lazy-select.tsx`
- `registry/hirael/components/rich-text-editor.tsx`
- `registry/hirael/components/mention-input.tsx`

**Out of scope**:

- `multi-select.tsx` — it's the correct exemplar; don't change it.
- Public prop/API shapes — do not add or rename props. Bug A's fallback must be
  internal (render an empty labelled SVG), not a new prop.
- Any demo in `registry/hirael/examples/*` — no API change means demos are untouched.

## Git workflow

- Branch: `advisor/003-component-bugs`
- Commit per bug (four focused commits), e.g. `fix: prevent QRCode from throwing during render on over-long value`.
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Bug A — qr-code fails soft instead of throwing

Wrap the body of the `useMemo` at `:548` in try/catch. On failure return an empty
matrix result (`{ d: "", dim: margin * 2 }` or equivalent) so the component renders
an empty `<svg role="img">` placeholder instead of throwing. Keep the existing
`title`/`aria` wiring so the empty state is still labelled.

**Verify**: `pnpm typecheck` exits 0. Reason through the code: an over-long `value`
now yields `d === ""` and renders an empty SVG, no throw. (There is no test runner;
confirm by reading the render path that a `null`/empty matrix is handled.)

### Step 2: Bug B — lazy-select always resets the loading flag

In the `finally` block (`:505-510`), always run `loadingMoreRef.current = false;
setLoadingMore(false);` unconditionally. Keep the `id === reqId.current` guard ONLY
around the state commit inside the `try` (`setOptions`/`pageRef`/`setHasMoreBoth`),
which already exists at `:499`. The stale-response guard prevents committing stale
data; the loading flag must reset regardless.

**Verify**: `pnpm typecheck` exits 0. Trace: after a stale response, `finally` now
clears `loadingMoreRef.current`, so the guard at `:485-490` allows the next
`loadMore`.

### Step 3: Bug C — clear the hide timer on unmount

Change the unmount effect at `:489` to also clear the hide timer, e.g.:

```tsx
React.useEffect(
  () => () => {
    cancelAnimationFrame(rafRef.current);
    clearHide();
  },
  [clearHide],
);
```

(`clearHide` is a stable `useCallback` with `[]` deps, so adding it to the
dependency array does not change unmount-only behavior.)

**Verify**: `pnpm typecheck` and `pnpm lint` exit 0 (no `react-hooks/exhaustive-deps`
warning on this effect).

### Step 4: Bug D — ref-stabilize the async search callbacks

In `mention-input.tsx`, mirror `multi-select.tsx:452-474`: store `onSearch` in a
ref updated in a no-dependency effect, read it inside the debounced timer, and
remove `onSearch` from the search effect's dependency array (key it on
`activeQuery`/`activeTrigger` only). Keep the `setLoading(true)` behavior but ensure
it only runs when a query is actually active. Apply the same ref-stabilization to
`lazy-select.tsx`'s search effect (`:463-482`) for its `loader`/`map` props.

**Verify**: `pnpm lint` exits 0 (the effect no longer lists the callback; confirm
no new exhaustive-deps warning), `pnpm typecheck` exits 0.

### Step 5: Full build

**Verify**: `pnpm build` exits 0.

## Test plan

No unit runner exists (documented gap). Verification is typecheck + lint + build
plus tracing each fixed path by reading. If you want runtime confidence, the
optional manual check is: run `pnpm dev`, open the component pages
(`/components/pickers/lazy-select`, `/components/inputs/qr-code`, etc.), and
exercise the fixed interaction. This is optional and not a done criterion (the
static export build is the gate).

## Done criteria

- [ ] `qr-code.tsx` no longer throws for over-long `value` (try/catch around the encode; renders empty labelled SVG)
- [ ] `lazy-select.tsx` `finally` resets `loadingMoreRef`/`setLoadingMore` unconditionally
- [ ] `rich-text-editor.tsx` unmount effect clears the hide timer
- [ ] `mention-input.tsx` (and `lazy-select.tsx` search effect) ref-stabilize the async callback and drop it from the effect deps
- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm lint` exits 0 (no new warnings)
- [ ] `pnpm build` exits 0
- [ ] No public prop/API changes (`git diff` touches only internals)
- [ ] Only the four in-scope files modified
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report if:

- Fixing Bug D would require changing `onSearch`'s call signature or the public
  props — it must not; report and stop.
- The `multi-select.tsx` ref pattern no longer exists at the cited lines (codebase
  drifted) — find the current pattern or STOP.
- Any fix requires touching a file outside the in-scope list.

## Maintenance notes

- Bug A's soft-fail changes user-visible behavior (empty QR instead of a crash);
  a reviewer should confirm the empty state is accessible and visually acceptable.
- The ref-stabilization pattern (Bug D) is the repo's convention for async
  callback props — new async-loading components should follow `multi-select`, not
  the pre-fix `mention-input`.
- These are prime candidates for the first render smoke tests if a test runner is
  added later (mount each demo, assert no throw).
