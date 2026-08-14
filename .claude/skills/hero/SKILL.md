---
name: hero
description: Build or edit Hirael hero blocks (registry/hirael/blocks/hero-*). Use when adding, redesigning, or reviewing a hero section so it is theme light/dark aware, reuses the shaders package correctly, and matches the catalog's hero language. Covers the token surface + mix-blend shader pattern, the glass-nav composition, RTL, and the registry plumbing.
---

# Hero blocks

Hero blocks are full landing-page tops shown standalone in the showcase and
copied verbatim into a consumer's repo. They must look intentional in **both
themes** — a consumer can be in light or dark, and there is no per-block
palette to hide behind. This is the rule heroes most often get wrong.

## Theme awareness is non-negotiable

Templates (`registry/hirael/templates/*`) are _self-contained palettes_ — they
hard-code `bg-[#EFEFEF]`, `text-white`, etc. and force one look. **Blocks are
not templates.** Copy the composition of the template heroes, never their
colors.

- **Surface = tokens.** Use `bg-card` (rounded card) or `bg-background`
  (full-bleed) with `text-foreground` / `text-card-foreground`,
  `border-border`, `text-muted-foreground`. **Never** build a "dark" hero with
  `bg-foreground text-background` — that inverts in dark mode (a light card
  with dark text) and the backdrop no longer matches. **Never** hard-code
  `text-white` / `bg-black` except over a photo (see below).
- **Primary `Button` is already theme-aware** (`bg-primary` flips per theme).
  Use the default and ghost/outline variants; don't restyle them to
  `bg-background text-foreground`.
- **`--accent-cool` is the cool non-neutral**, reserved for live/active dots
  (`style={{ background: "var(--accent-cool)" }}`). The warm taupe `--warm` is
  the brand tone for sheen and glows (warm-near, cool-far). Everything else is
  neutral slate/cream — don't introduce other hues.

The reference implementation for a theme-aware shader surface is
[`blocks/cta-03`](../../../registry/hirael/blocks/cta-03/cta-03.tsx).

## Animated backdrops: reuse the `shaders` package

Heroes with motion reuse the in-repo **`shaders`** package — not three.js,
not @paper-design. WebGL is client-only, so it must be a dynamic import:

```tsx
const HeroBackdrop = dynamic(() => import("./hero-0X-backdrop"), {
  ssr: false,
  loading: () => <div className="size-full bg-muted/20" />,
});
```

Layer it so **one grayscale shader reads in both themes** via mix-blend — the
same trick cta-03 uses:

```tsx
<div
  aria-hidden
  data-slot="hero-backdrop"
  className="pointer-events-none absolute inset-0 opacity-60 mix-blend-multiply dark:opacity-45 dark:mix-blend-screen"
>
  <HeroBackdrop active={active} />
</div>
```

- Shader colors are **grayscale hex** (`#ffffff`…`#5a5a5a`); use
  `outsideColor="transparent"` / `colorA="transparent"` for the neutral base so
  it disappears under both blends. `multiply` darkens the grays on a light
  surface, `screen` lightens them on a dark surface — so it's never inverted.
- The React build only exports a subset; useful ones: `Shader` (the canvas
  wrapper, takes `style`), `Swirl`, `Beam`, `Stripes`, `Aurora`, `Dither`,
  `DotGrid`, `FilmGrain`, `Vignette`, `Glow`. Props are partial — pass a
  subset. Verify prop names in
  `node_modules/shaders/dist/core/shaders/<Name>/index.d.ts`.
- Drive a subtle hover speed-up with an `active` boolean from the card's
  `onMouseEnter`/`onMouseLeave`.

Declare `dependencies: ["shaders", "lucide-react"]` and add the backdrop file
to the entry's `files` array (`{ path, target }`) in `registry-meta.ts`.

## Image heroes

A full-bleed `next/image` (`fill`, `priority`, `sizes="100vw"`) stays
theme-aware by fading into the page, not by going always-dark: overlay
`bg-gradient-to-t from-background via-background/80 to-background/20` and pin
content to the bottom on the solid-background area with `text-foreground`.
Put the nav in a glass pill (`bg-card/70 backdrop-blur border-border`) so it's
legible over the photo in both themes. Use real Unsplash IDs; `next/image`
works because `images.unoptimized` is set. Hard-coded light text is only OK
directly over a photo with a guaranteed-dark scrim.

## Composition (match the catalog)

- Glass pill **nav** (brand mark + links + a `Button` CTA), links hidden on
  mobile.
- Eyebrow **pill** (mono uppercase, or `bg-primary/5 text-primary`).
- `font-serif` display **headline**, `text-balance`, large `leading`/tracking.
- `text-muted-foreground` sub-copy, `text-pretty`.
- A primary `Button` + a ghost/outline `Button`, both `rounded-full`.
- Optional supporting row: stat strip, wordmark/logo cloud, or avatar
  social-proof (`next/image`).

## RTL & a11y

- Logical properties only: `ps/pe`, `ms/me`, `start/end`, `text-start/end`,
  `border-s/e`. Flip arrow icons with `rtl:rotate-180` (and the hover
  translate). Verify with the preview's RTL toggle.
- `data-slot="hero" | "hero-nav" | "hero-backdrop" | "hero-stats"` on slots.
  Decorative layers get `aria-hidden`; images get real `alt` (empty `alt=""`
  for pure-decoration avatars). One `<h1>`.

## Plumbing & checks

Edit `registry-meta.ts`, register the loader in `registry-demos.tsx`
(`"hero-0X": () => import(".../hero-0X")`), then run `pnpm registry:gen` and
`pnpm build`. `check:registry` enforces that `registryDependencies` exactly
matches the `@/registry/hirael/ui/*` modules imported (both directions) and
that every showcased entry has a demo loader.

## Copy

Plain, human, specific. Short labels, short sentences. No hype ("Pick a date",
not "Effortlessly select your desired date"). Match the existing catalog
descriptions.
