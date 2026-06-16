# Design tokens & visual language

The canonical token definitions live in [app/globals.css](../app/globals.css).
This file is the orientation; when you change a token, a font, or the
radius/motion scale, update the matching section here in the same commit.

## Theme model

Tokens are defined with Tailwind v4's `@theme inline` plus plain CSS custom
properties. **Dark is the default canvas** (`:root`); `.light` swaps to a
white-canvas inverse. The dark palette is declared on `:root, .dark` (not just
`:root`) so a nested `.dark` region forces dark tokens even while the page is in
light mode — that's how an always-dark block (an image hero over a dark photo,
say) stays dark and high-contrast in both site modes, matching the standard
shadcn `.dark` contract.

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

The Hirael brand board, in OKLCH. **Dark is a cool blue-slate canvas**
(`#0D1117` bg, `#1A1F29` raised, `#2E3440` fills) under **warm cream ink**
(`#E7E4DE`). Two non-neutrals, each with a job: a **warm taupe** (`#ADA69A`,
`--warm`) is the brand tone, and a **single cool blue** (`--accent-cool`) is
reserved for live/active state. Light is the faithful inverse — a warm
near-white canvas (`#F4F2EC`) under slate ink (`#161B22`).

| Token                                                  | Role                                              |
| ------------------------------------------------------ | ------------------------------------------------- |
| `--background` / `--foreground`                        | Canvas + primary text                             |
| `--card` / `--card-foreground`                         | Raised surfaces                                   |
| `--popover` / `--popover-foreground`                   | Floating surfaces                                 |
| `--primary` / `--primary-foreground`                   | Emphasis — cream on dark, slate on light          |
| `--secondary` / `--muted` / `--accent`                 | Quiet slate fills (share a value in dark)         |
| `--muted-foreground`                                   | Secondary text                                    |
| `--border` (1px) / `--input` / `--ring`                | Hairline edges + focus                            |
| `--destructive` / `--success` / `--warning` / `--info` | Status (shipped by Callout)                       |
| `--chart-1…5`                                          | Data viz (taupe + cool-blue + slate ramp)         |
| `--sidebar*`                                           | Sidebar surface set                               |
| **`--warm`** / `--warm-foreground` / `--warm-glow`     | **Brand warm tone — taupe, decoration & sheen**   |
| **`--accent-cool`**                                    | **The cool non-neutral — live/active state ONLY** |
| `--accent-cool-glow` / `--halo-cool` / `--halo-warm`   | Soft glows (cool-far + taupe-near)                |

Rules:

- **Use tokens, never hard-coded colors.** No hex/rgb/oklch literals in
  component source — reach for `--background / --foreground / --border /
--primary / --accent` and friends.
- **`--accent-cool` is reserved for live/active state** (the pulsing
  `state-dot`, "Latest" markers, active indicators). Don't spend it on
  generic accents or decoration — that's what makes it read as "live."
- **`--warm` is the brand tone** — taupe sheen on the wordmark, halo glows,
  warm decoration. It's a quiet metal, not a call-to-action; pair it _with_
  the cool accent (warm-near, cool-far), never as a substitute for it.
- Borders are **1px and soft** (`--border` is cream at ~9% in dark).

## Radius

Derived from a single `--radius: 0.65rem`, following shadcn's standard scale:

| Token         | Value          |
| ------------- | -------------- |
| `--radius-sm` | `radius − 4px` |
| `--radius-md` | `radius − 2px` |
| `--radius-lg` | `radius`       |
| `--radius-xl` | `radius + 4px` |

## Typography

Loaded via `next/font` in [app/layout.tsx](../app/layout.tsx):

| Family                 | CSS var        | Used for                                                              |
| ---------------------- | -------------- | --------------------------------------------------------------------- |
| **Inter**              | `--font-sans`  | Body and UI — the default face                                        |
| **Geist Mono**         | `--font-mono`  | Code, install commands, identifiers, eyebrow labels                   |
| **Cormorant Garamond** | `--font-serif` | Display headings (`.text-display`), the brand wordmark, serif accents |

Display headings (the landing hero, section titles, `/changelog`, 404 and
error) use the serif **`.text-display`** utility — Cormorant at weight 500
with tight tracking — for an editorial, elegant feel that ties the chrome to
the premium templates. A serif _italic_ span carries a single emphasis word
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
- `.ambient-halo` — large soft radial glows (taupe-near, cool-far) that drift
  slowly; depth behind the hero and focal bands.
- `.glass-panel` — translucent blurred panel with a hairline border and a
  faint cool shadow; focal containers only, never whole sections.
- `.glass-panel-strong` — denser glass (≈78% card) for floating chrome (the
  site-header pill) and the footer anchor panel, where the surface should
  read near-solid while still passing texture through.
- `.glass-panel-lit` — adds a masked gradient hairline rim (bright at top and
  bottom, fading on the sides) for the "liquid glass" sheen. Token-only, so
  both themes get the lit edge. Layer it on a focal container that already has
  a radius + plain hairline border (the landing hero panel and feature cards);
  not for whole sections.
- `.text-display` — serif display type (Cormorant 500, tight tracking) for
  large headings; pair with mono eyebrows and sans body.
- `.shadow-elevated` — token-only soft elevation (scales with `--foreground`,
  no hard-coded color) for focal cards and the footer panel.
- `.wordmark-watermark` — oversized, very-low-contrast serif "Hirael" used as
  a clipped backdrop behind the footer's legal bar.
- `.wordmark-cutout` — same oversized serif "Hirael", but the glyphs are
  filled with the dot-grid texture (clipped to the type via `background-clip:
text`) so the textured layer reads as showing _through_ the letters. Used in
  the footer; monochrome and low-contrast, still texture not text.
- `container` (`@utility`: centered, `max-width: 1280px`, `1rem` inline
  padding) — the page/section width wrapper. Put it on the outer wrapper of a
  page or section to center, cap width, and add the gutter in one class.
- `.no-scrollbar` — hide scrollbars on scroll regions.
