# Design tokens & visual language

The canonical token definitions live in [app/globals.css](../app/globals.css).
This file is the orientation; when you change a token, a font, or the
radius/motion scale, update the matching section here in the same commit.

## Theme model

Tokens are defined with Tailwind v4's `@theme inline` plus plain CSS custom
properties. **Dark is the default canvas** (`:root`); `.light` swaps to a
white-canvas inverse.

```
@custom-variant dark  (&:is(.dark *));
@custom-variant light (&:is(.light *));
```

The mode script always sets a class on `<html>` — `.dark` in dark mode,
`.light` in light mode — so `dark:` utilities follow the standard shadcn
convention and registry components behave on this site exactly as they do in
a consumer app. Never assume light-first; both modes must work for every
item. Toggle from the header to verify.

## Palette

Near-monochrome **zinc in OKLCH** — clean grays with the faintest cool cast.
The only non-neutral is a single cool blue.

| Token | Role |
| --- | --- |
| `--background` / `--foreground` | Canvas + primary text |
| `--card` / `--card-foreground` | Raised surfaces |
| `--popover` / `--popover-foreground` | Floating surfaces |
| `--primary` / `--primary-foreground` | Emphasis / primary actions |
| `--secondary` / `--muted` / `--accent` | Quiet fills (share a value in dark) |
| `--muted-foreground` | Secondary text |
| `--border` (1px) / `--input` / `--ring` | Hairline edges + focus |
| `--destructive` / `--success` / `--warning` / `--info` | Status (shipped by Callout) |
| `--chart-1…5` | Data viz |
| `--sidebar*` | Sidebar surface set |
| **`--accent-cool`** | **The one non-neutral — live/active state ONLY** |
| `--accent-cool-glow` / `--halo-cool` / `--halo-warm` | Soft glows behind the accent |

Rules:

- **Use tokens, never hard-coded colors.** No hex/rgb/oklch literals in
  component source — reach for `--background / --foreground / --border /
  --primary / --accent` and friends.
- **`--accent-cool` is reserved for live/active state** (the pulsing
  `state-dot`, "Latest" markers, active indicators). Don't spend it on
  generic accents or decoration — that's what makes it read as "live."
- Borders are **1px and soft** (`--border` is white at ~10% in dark).

## Radius

Derived from a single `--radius: 0.65rem`, following shadcn's standard scale:

| Token | Value |
| --- | --- |
| `--radius-sm` | `radius − 4px` |
| `--radius-md` | `radius − 2px` |
| `--radius-lg` | `radius` |
| `--radius-xl` | `radius + 4px` |

## Typography

Loaded via `next/font` in [app/layout.tsx](../app/layout.tsx):

| Family | CSS var | Used for |
| --- | --- | --- |
| **Inter** | `--font-sans` | Body and UI — the default face |
| **Geist Mono** | `--font-mono` | Code, install commands, identifiers, eyebrow labels |
| **Cormorant Garamond** | `--font-serif` | Display headings (`.text-display`), the brand wordmark, serif accents |

Display headings (the landing hero, section titles, `/changelog`, 404 and
error) use the serif **`.text-display`** utility — Cormorant at weight 500
with tight tracking — for an editorial, elegant feel that ties the chrome to
the premium templates. A serif *italic* span carries a single emphasis word
(the landing hero italicizes "doesn't"); the italic style is loaded via
`next/font` in `app/layout.tsx` and `app/global-error.tsx`. Body and UI stay
**sans** (Inter). Eyebrow labels are the recurring `font-mono
text-[10px]/[11px] uppercase tracking-[0.16em–0.18em] text-muted-foreground`
pattern — reuse it for new section/eyebrow labels (the `/changelog` header
follows it).

## Motion

Short and restrained: **120–180ms, ease-out** for UI transitions. The one
ambient exception is `.state-dot`, which pulses on a **3s cycle** — that's
system-feedback pacing (a "live" heartbeat), not UI animation, so don't
speed it up to feel like a hover effect. Respect `prefers-reduced-motion`
in any new motion (AnimatedNumber and CountdownTimer already do).

## Custom utilities

Defined in `globals.css`, reuse rather than re-rolling:

- `.rule-gradient` — hairline rule that fades at the edges (editorial
  section divider; preferred over a solid `border-t` between sections).
- `.state-dot` — pulsing cool dot for live/active indicators.
- `.bg-dot-grid` — faint monochrome dot-grid texture (hero background).
- `.ambient-halo` — large soft radial glows (warm-near, cool-far) that drift
  slowly; depth behind the hero and focal bands.
- `.glass-panel` — translucent blurred panel with a hairline border and a
  faint cool shadow; focal containers only, never whole sections.
- `.glass-panel-strong` — denser glass (≈78% card) for floating chrome (the
  site-header pill) and the footer anchor panel, where the surface should
  read near-solid while still passing texture through.
- `.text-display` — serif display type (Cormorant 500, tight tracking) for
  large headings; pair with mono eyebrows and sans body.
- `.shadow-elevated` — token-only soft elevation (scales with `--foreground`,
  no hard-coded color) for focal cards and the footer panel.
- `.wordmark-watermark` — oversized, very-low-contrast serif "Hirael" used as
  a clipped backdrop behind the footer's legal bar.
- `.corner-mark` — small `+` blueprint marker for section corners.
- `.container` (`mx-auto w-full max-w-6xl`) / `.cpx` (`px-4 lg:px-6`) —
  page width + horizontal padding.
- `.no-scrollbar` — hide scrollbars on scroll regions.
