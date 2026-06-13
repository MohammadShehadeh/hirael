# Catalog — components, blocks & templates

The canonical source for every item is
[registry/hirael/registry-meta.ts](../registry/hirael/registry-meta.ts);
`registry.json` is generated from it (`pnpm registry:gen`). This file is the
human-readable index — when you add or rename an item, update the matching
table here in the same change.

The catalog spans three tiers: **components** (single UI primitives),
**blocks** (marketing / app sections), and **templates** (full, multi-section
pages). As of the last update: **46 registry UI items** (45 standalone
components + 1 distribution-only primitive), **39 section blocks**, and
**1 template**. Counts come from `registry.json`; the landing page derives
its counts from `registry-meta.ts`, so treat that file as the truth if these
drift.

Each component installs with:

```bash
npx shadcn@latest add https://hirael.com/r/<name>.json
```

The `Registry deps` column lists the upstream shadcn primitives an item
pulls in (resolved from `ui.shadcn.com` at install time) — its npm
`dependencies` are declared separately in `registry-meta.ts`.

## Components

#### Inputs (12)

| Component | Registry deps | What it is |
| --- | --- | --- |
| `combobox` | `command`, `popover` | Searchable single-select with debounced async loader, group headings and clearable selection. |
| `currency-input` | `input-group` | Locale-aware grouping with currency-symbol prefix and configurable decimal precision. |
| `inline-edit` | `button`, `input`, `spinner`, `textarea` | Click-to-edit text with preview, validation, async submit and confirm/cancel controls. Input and textarea modes. |
| `lazy-select` | `command`, `popover` | Autocomplete single-select that defers loading until open and pages through results on scroll. Debounced server-side search with a pluggable lazy paginator hook. |
| `mention-input` | `spinner` | @-mention textarea with caret-anchored autocomplete, highlighted mention chips, async search and multiple trigger characters. |
| `multi-select` | `badge`, `command`, `popover` | Chip-based multi-select with command-palette dropdown, search, select-all and async loader. Compound and single-prop APIs. |
| `number-range` | `input`, `slider` | Two-thumb slider paired with synced number inputs. Min/max/step, currency or unit formatting, keyboard-first. |
| `password-input` | `input-group` | Show/hide toggle with an optional pluggable strength meter. Compound and single-prop APIs. |
| `phone-input` | `command`, `input-group`, `popover` | Country dial-code dropdown with E.164 output. Compound and single-prop APIs. |
| `rating` | — | Star rating with hover preview, half-star precision, read-only mode and sm / md / lg sizes. |
| `signature-pad` | `button` | Canvas signature capture with velocity-based ink, per-stroke undo, theme-aware re-inking and PNG/JPEG export via ref. |
| `tag-input` | `badge` | Chip input with paste-to-split, dedupe, validation hook, max tags. Compound and single-prop APIs. |

#### Pickers (6)

| Component | Registry deps | What it is |
| --- | --- | --- |
| `color-picker` | `input`, `popover`, `tabs` | SV gradient + hue slider with HEX / RGB / HSL tabs, eyedropper (where supported) and recent swatches. |
| `date-picker` | `button`, `popover` | Single-date picker with month grid, keyboard nav, min/max bounds and disabled dates. Inline DateCalendar, no date library. |
| `date-range-picker` | `button`, `popover`, `separator` | Dual-month range picker with hover preview, presets, min/max bounds and keyboard nav. Inline DateRangeCalendar, no date library. |
| `month-picker` | `button`, `popover` | 4×3 month grid with year stepper, keyboard nav, min/max bounds, single or range mode. |
| `time-picker` | `popover`, `tabs` | Hour, minute and optional second scroll columns with 12/24h modes, step intervals and keyboard nav. |
| `year-picker` | `button`, `popover` | Decade-grid year picker with keyboard nav, min/max bounds, single or range mode. |

#### Files (3)

| Component | Registry deps | What it is |
| --- | --- | --- |
| `file-dropzone` | — | Drag-drop + click upload zone with previews, accept and max-size validation. Compound and single-prop APIs. |
| `image-cropper` | `slider` | Pan-and-zoom image cropper with rect or round mask, fixed aspect frame, pinch / wheel / keyboard control and canvas export via ref. |
| `media-input` | `button` | Local media file picker that previews via an object URL; empty-state prompt, replace and clear, size validation. Nothing leaves the browser. |

#### Data display (10)

| Component | Registry deps | What it is |
| --- | --- | --- |
| `activity-feed` | — | Avatar-led event feed with a connecting rail, actor and action lines, timestamps, quoted bodies and date dividers. Compound API. |
| `animated-number` | — | Count-up number that tweens to its target with easing, Intl formatting (currency, compact, percent), prefix/suffix and reduced-motion support. |
| `audit-log` | — | Compliance-style event log with expandable rows that reveal actor, action, status and request metadata. Compound disclosure API. |
| `avatar-stack` | — | Overlapping avatar group with size and spacing variants, image or fallback, a numeric overflow chip, and `asChild` items so each avatar can be a link or button. |
| `calendar-heatmap` | `tooltip` | GitHub-style contribution heatmap with month and weekday labels, tooltips, configurable intensity scale and a legend. |
| `countdown-timer` | — | Count-down-to-date timer with boxed / inline / minimal variants, a `useCountdown` hook, digit animation and completion content. |
| `sortable` | — | Drag-to-reorder list with pointer and keyboard sorting, handle or whole-item dragging, and live-region announcements. No dnd-kit. |
| `stat-card` | — | Compact metric card with label, value, and an up/down/flat trend chip. Compound and single-prop APIs. |
| `timeline` | — | Vertical event timeline with default or icon dots, tone variants and labelled time / title / description parts. |
| `tree-view` | — | Collapsible nested tree for file explorers and hierarchical data, with auto folder/file icons, depth indentation, selection and keyboard focus. |

#### Display & feedback (14)

| Component | Registry deps | What it is |
| --- | --- | --- |
| `announcement-bar` | — | Top-of-page banner with default / primary / muted tones, optional dismiss button and localStorage persistence. |
| `audio-player` | `button`, `slider` | Composable audio player with play/pause, scrub-safe seek with buffered tint, skip, time readouts, volume and playback rate. |
| `callout` | — | MDX-style admonition with info / success / warning / error / neutral variants. Ships `--info` / `--success` / `--warning` theme tokens. |
| `code-block` | `badge`, `button`, `copy-button` | Code display with dependency-free token highlighting, line numbers, line highlights, diff gutters, copy button and collapsible max-height. |
| `copy-button` | — | Click-to-copy button with copied feedback, icon-only or labelled, ghost / outline variants and a non-secure-context clipboard fallback. |
| `empty-state` | — | Dashed-bordered empty-state surface with media slot, title, description and an action row. |
| `image-compare` | — | Before/after comparison slider with a draggable, keyboard-accessible divider, horizontal or vertical orientation and hover-follow mode. |
| `kbd` | — | 3D tactile keycap with hover lift and pressed states. Compound API with `KbdGroup` for chords and `KbdDisplay` for inline keys. |
| `lightbox` | — | Fullscreen image lightbox on Radix Dialog with gallery navigation, zoom and pan, swipe gestures, captions and a thumbnail strip. |
| `marquee` | — | Infinite scrolling row or column for logos and testimonials, with pause-on-hover, reverse and vertical modes. Keyframes inline, zero config. |
| `masonry` | — | True masonry layout that balances children into the shortest column by measured height, order-preserving, responsive, dependency-free. |
| `qr-code` | — | Dependency-free QR code generator rendering crisp SVG, with L/M/Q/H error correction, quiet-zone control and `currentColor` theming. |
| `scroll-progress` | — | Fixed reading progress bar. Tracks document scroll by default or a scoped container ref. |
| `spinner` | — | Loading indicator with circle, dots and bars variants, sm / md / lg sizes. Inherits text color and ships an accessible status label. |

#### Navigation (2)

| Component | Registry deps | What it is |
| --- | --- | --- |
| `stepper` | — | Multi-step progress indicator with horizontal and vertical orientation, completed / active / inactive states, clickable steps and a compound API. |
| `tour` | `button` | Onboarding spotlight that dims the page around a target element and walks users through steps with a positioned coach-mark card. |

#### Animation (7)

| Component | Registry deps | What it is |
| --- | --- | --- |
| `blur-reveal` | — | Reveals content with a blur, fade and lift as it scrolls into view. Configurable delay, duration and threshold; respects reduced-motion. |
| `cursor-glow` | — | Ambient glow layer that follows the pointer across its container and fades when it leaves. Drop it behind heroes, grids or feature panels. |
| `magnetic-button` | — | Button that pulls toward the cursor and springs back on leave. Adjustable strength, `asChild` to wrap a link, respects reduced-motion. |
| `scroll-reveal` | — | Fades and slides content in from any direction as it enters the viewport. Configurable distance, delay and replay; respects reduced-motion. |
| `spotlight-card` | — | Card surface with a soft spotlight that tracks the cursor and fades in on hover. Built on design tokens, no hard-coded colors. |
| `text-reveal` | — | Staggered text entrance that masks and slides each word, character or line into place on scroll. Respects reduced-motion. |
| `tilt-card` | — | 3D pointer tilt with optional cursor-following glare and configurable max angle, scale and perspective. Respects reduced-motion. |

#### Primitives — distribution-only (1)

| Component | Registry deps | What it is |
| --- | --- | --- |
| `accordion` | — | Radix-powered accordion primitive used by the FAQ blocks. Listed in `DISTRIBUTION_ONLY` so it ships in the registry without its own showcase page. |

## Blocks

Marketing and app section blocks live under
[registry/hirael/blocks/](../registry/hirael/blocks/). Each declares a
`blockKind` and `blockTagline` in `registry-meta.ts`; the block index groups
them by kind. Browse at [hirael.com/blocks](https://hirael.com/blocks).

| Kind | Blocks | What it covers |
| --- | --- | --- |
| Hero | `hero-01`, `hero-02`, `hero-03` | Landing hero sections — headline, sub-copy, CTAs, supporting visual. |
| Feature | `feature-01`, `feature-02` | Feature grids and alternating feature rows. |
| Pricing | `pricing-01`, `pricing-02` | Tiered pricing tables with feature lists and highlighted plan. |
| Testimonial | `testimonial-01`, `testimonial-02` | Quote cards and testimonial walls. |
| Call-to-action | `cta-01`, `cta-02` | Conversion bands with headline and action. |
| FAQ | `faq-01`, `faq-02`, `faq-03`, `faq-04` | Accordion and two-column FAQ layouts. |
| Auth | `login-01`, `login-02`, `signup-01`, `forgot-password-01`, `otp-verify-01` | Login, sign-up, password reset and OTP verification forms. |
| Header | `header-01` | Site header / top navigation. |
| Footer | `footer-01` | Multi-column site footer. |
| 404 | `not-found-01` | Not-found page section. |
| Logo cloud | `logo-cloud-01` | Trusted-by logo strip. |
| Contact | `contact-01` | Contact form with details column. |
| Blog | `blog-01` | Blog index / article grid. |
| E-commerce | `ecommerce-01`, `ecommerce-02` | Product grid and product detail layouts. |
| Dashboard | `dashboard-01`, `dashboard-02`, `dashboard-03`, `dashboard-04`, `dashboard-05` | Analytics and admin dashboard layouts. |
| Integrations | `integrations-01` | Integration / app directory grid. |
| Image gallery | `image-gallery-01` | Responsive image gallery. |
| App shell | `app-shell-01`, `app-shell-02`, `app-shell-03`, `app-shell-04` | Sidebar + topbar application shells. |

> Block previews render in two places: inline on the block index and
> framed inside `app/embed/blocks/[block]/` (an isolated route so a block's
> own layout can't leak the showcase chrome into the preview).

## Templates

Full, multi-section pages built in the Hirael style — complete layouts you
copy into your repo with the shadcn CLI and edit like any other file. They
live under [registry/hirael/templates/](../registry/hirael/templates/),
browse at [hirael.com/templates](https://hirael.com/templates), and preview
framed inside `app/embed/templates/[template]/`.

| Template | Dependencies | What it is |
| --- | --- | --- |
| `creative-studio` | `framer-motion`, `lucide-react` | Dark, cinematic creative-studio landing page: full-viewport hero with an animated backdrop and pull-up wordmark, a scroll-revealed about section, and a staggered feature-card grid. Self-contained warm-cream palette. |

A template is one `registry-meta.ts` entry (`category: "templates"`) whose
`sourceFiles` list every file in its folder, so the CLI installs the whole
page set under `components/templates/<name>/`. Templates may ship their own
fonts and a self-contained palette rather than the site's design tokens.
