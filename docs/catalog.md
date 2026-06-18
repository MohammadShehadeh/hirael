# Catalog — components, blocks & templates

The canonical source for every item is
[registry/hirael/registry-meta.ts](../registry/hirael/registry-meta.ts);
`registry.json` is generated from it (`pnpm registry:gen`). This file is the
human-readable index — when you add or rename an item, update the matching
table here in the same change.

The catalog spans three tiers: **components** (single UI primitives),
**blocks** (marketing / app sections), and full-page templates. As of the
last update: **110 registry UI items** (108 standalone components + 2
distribution-only primitives), **56 section blocks**, and **9 templates**.
Counts come from `registry.json`; the landing page derives its counts from
`registry-meta.ts`, so treat that file as the truth if these drift.

Each component installs with:

```bash
npx shadcn@latest add https://hirael.com/r/<name>.json
```

The `Registry deps` column lists the upstream shadcn primitives an item
pulls in (resolved from `ui.shadcn.com` at install time) — its npm
`dependencies` are declared separately in `registry-meta.ts`.

Every item is browsed under its category segment: components at
`/components/<category>/<name>`, blocks at `/blocks/<category>/<name>`, each
with a category listing page (`/components/<category>`, `/blocks/<category>`)
and a breadcrumb trail. Build links with `entryHref(entry)` from
`registry-meta.ts`; the old flat URLs 301 to the nested ones. See
[conventions.md → Routing & URLs](./conventions.md#routing--urls).

## Components

#### Inputs (13)

| Component             | Registry deps                  | What it is                                                                                |
| --------------------- | ------------------------------ | ----------------------------------------------------------------------------------------- |
| `advanced-search-bar` | `badge`, `button`, `input-group` | Power search field with a scope selector, removable filter tokens and a grouped suggestions dropdown with keyboard nav. |
| `combobox`            | `input-group`                  | Searchable select on Base UI: single or multiple selection, chips, grouped options, clear button. |
| `currency-input`      | `input-group`                  | Locale-aware grouping with currency-symbol prefix and configurable decimal precision.     |
| `inline-edit`         | `button`, `input`, `spinner`, `textarea` | Click-to-edit text with preview, validation, async submit and confirm/cancel.   |
| `lazy-select`         | `command`, `popover`           | Autocomplete single-select that defers loading until open and pages through results on scroll. |
| `mention-input`       | `spinner`                      | @-mention textarea with caret-anchored autocomplete, highlighted chips and async search.  |
| `multi-select`        | `badge`, `command`, `popover`  | Chip-based multi-select with command-palette dropdown, search, select-all and async loader. |
| `number-range`        | `input`, `slider`              | Two-thumb slider paired with synced number inputs.                                        |
| `password-input`      | `input-group`                  | Show/hide toggle with an optional pluggable strength meter.                                |
| `phone-input`         | `command`, `input-group`, `popover` | Country dial-code dropdown with E.164 output.                                         |
| `rating`              | —                              | Star rating with hover preview, half-star precision, read-only mode and sizes.            |
| `signature-pad`       | `button`                       | Canvas signature capture with per-stroke undo, theme-aware re-inking and PNG/JPEG export. |
| `tag-input`           | `badge`                        | Chip input with paste-to-split, dedupe, a validation hook and max tags.                   |

#### Pickers (6)

| Component           | Registry deps                    | What it is                                                                       |
| ------------------- | -------------------------------- | ------------------------------------------------------------------------------- |
| `color-picker`      | `input`, `popover`, `tabs`       | SV gradient + hue slider with HEX / RGB / HSL tabs, eyedropper and recent swatches. |
| `date-picker`       | `button`, `popover`              | Single-date picker with month grid, keyboard nav and bounds. No date library.   |
| `date-range-picker` | `button`, `popover`, `separator` | Dual-month range picker with hover preview, presets and bounds. No date library. |
| `month-picker`      | `button`, `popover`              | 4×3 month grid with year stepper, keyboard nav, bounds, single or range mode.   |
| `time-picker`       | `popover`, `tabs`                | Hour, minute and optional second scroll columns with 12/24h modes and steps.    |
| `year-picker`       | `button`, `popover`              | Decade-grid year picker with keyboard nav, bounds, single or range mode.        |

#### Files (6)

| Component        | Registry deps        | What it is                                                                              |
| ---------------- | -------------------- | -------------------------------------------------------------------------------------- |
| `asset-manager`  | `badge`, `button`    | Media library with a thumbnail grid or list, search, multi-select and a detail inspector. |
| `file-dropzone`  | —                    | Drag-drop + click upload zone with previews, accept and max-size validation.           |
| `file-explorer`  | `breadcrumb`, `button` | Two-pane file browser with a folder tree, a breadcrumb path and a list or grid view.  |
| `image-cropper`  | `slider`             | Pan-and-zoom image cropper with rect or round mask and canvas export via ref.          |
| `media-input`    | `button`             | Local media file picker that previews via an object URL. Nothing leaves the browser.   |
| `upload-manager` | `button`, `progress` | Upload queue with per-file progress and status, retry / cancel / remove and a summary. |

#### Data display (18)

| Component           | Registry deps                      | What it is                                                                            |
| ------------------- | ---------------------------------- | ------------------------------------------------------------------------------------ |
| `activity-feed`     | —                                  | Avatar-led event feed with a connecting rail, timestamps, quoted bodies and dividers. |
| `animated-number`   | —                                  | Count-up number that tweens to its target with Intl formatting and reduced-motion.   |
| `approval-workflow` | —                                  | Rail-connected approval chain with approver, timestamp and approve / reject on the current step. |
| `audit-log`         | `collapsible`                      | Compliance event log with expandable rows revealing actor, action, status and metadata. |
| `auction-timeline`  | `badge`                            | Live auction panel with the leading bid, a countdown, a live status and a bid-history timeline. |
| `avatar-stack`      | —                                  | Overlapping avatar group with size and spacing variants and a numeric overflow chip. |
| `calendar-heatmap`  | `tooltip`                          | GitHub-style contribution heatmap with labels, tooltips and a legend.                |
| `countdown-timer`   | —                                  | Count-down-to-date timer with boxed / inline / minimal variants and a hook.          |
| `filter-builder`    | `badge`, `button`, `input`, `select` | Flat field / operator / value filters with an add row, removable chips and clear all. |
| `kanban-board`      | `badge`, `button`                  | Column board with cards you drag between and within columns (native DnD) and keyboard moves. |
| `nested-sortable`   | `button`                           | Drag-to-reorder outline with nesting (indent / outdent), pointer and keyboard control. |
| `permission-matrix` | `checkbox`                         | Roles by permissions checkbox grid with grouped rows, a sticky column and master toggles. |
| `query-builder`     | `button`, `input`, `select`        | Nested AND / OR query of field, operator and value rules, with add and remove at every level. |
| `shipment-tracker`  | —                                  | Order delivery stages as a connected stepper with a live current stage and an event history. |
| `sortable`          | —                                  | Drag-to-reorder list with pointer and keyboard sorting and announcements. No dnd-kit. |
| `stat-card`         | —                                  | Compact metric card with label, value and an up / down / flat trend chip.            |
| `timeline`          | —                                  | Vertical event timeline with default or icon dots, tone variants and labelled parts. |
| `tree-view`         | `collapsible`                      | Collapsible nested tree for file explorers and hierarchical data, with selection.    |

#### AI (6)

| Component             | Registry deps  | What it is                                                                              |
| --------------------- | -------------- | -------------------------------------------------------------------------------------- |
| `agent-workflow`      | —              | Rail-connected trace of an agent run: thought, tool and output steps with status and detail. |
| `ai-chat`             | `button`       | Chat thread with role-aligned bubbles, avatars, a typing indicator and an auto-growing composer. |
| `ai-completion-input` | —              | Text field with an inline ghost completion you accept with Tab. The suggestion is supplied by you. |
| `ai-tool-call`        | `collapsible`  | Collapsible view of an LLM tool call with status and pretty-printed argument and result JSON. |
| `prompt-editor`       | —              | Prompt template editor that highlights `{{variable}}` tokens and counts characters and tokens. |
| `rag-citations`       | —              | Grounded answer with inline citation markers that cross-link to source cards.          |

#### Developer (5)

| Component         | Registry deps                    | What it is                                                                              |
| ----------------- | -------------------------------- | -------------------------------------------------------------------------------------- |
| `diff-viewer`     | —                                | Line-level text diff with unified or split mode, line numbers and add / remove gutters. |
| `json-viewer`     | —                                | Collapsible, syntax-highlighted JSON tree with type-colored values. Dependency-free.   |
| `log-viewer`      | `button`, `input-group`          | Monospace log stream with per-line level, level filter chips, search highlight and a live tail. |
| `request-builder` | `button`, `input`, `select`, `tabs` | Compose an HTTP request with params, headers and body, and a response panel.         |
| `terminal`        | —                                | Presentational terminal with window chrome, scrollback, history and a command handler. |

#### Commerce (6)

| Component               | Registry deps                       | What it is                                                                          |
| ----------------------- | ----------------------------------- | ---------------------------------------------------------------------------------- |
| `bundle-builder`        | `badge`, `button`, `input`, `select` | Assemble a product bundle with quantity steppers, a bundle discount and live savings. |
| `discount-builder`      | `badge`, `button`, `input`, `select` | Configure a percentage, fixed or free-shipping discount with conditions and a summary. |
| `inventory-matrix`      | `input`                             | Editable stock grid of variants by location with totals and low / out-of-stock highlighting. |
| `pricing-rules-builder` | `badge`, `button`, `input`, `select` | Top-down conditional pricing rules of the form when condition then price action.   |
| `variant-editor`        | `badge`, `button`, `input`          | Define product option axes and edit the generated variant rows (price, SKU, stock). |
| `vendor-comparison`     | `badge`                             | Compare vendors across grouped features with boolean / text cells and a recommended column. |

#### Display & feedback (15)

| Component          | Registry deps                    | What it is                                                                            |
| ------------------ | -------------------------------- | ------------------------------------------------------------------------------------ |
| `announcement-bar` | —                                | Top-of-page banner with default / primary / muted tones, dismiss and persistence.    |
| `audio-player`     | `button`, `slider`               | Composable audio player with scrub-safe seek, skip, time readouts, volume and rate.  |
| `callout`          | —                                | MDX-style admonition with info / success / warning / error / neutral variants.       |
| `changelog-viewer` | `badge`                          | Vertical timeline of versioned releases with grouped change sections and a latest marker. |
| `code-block`       | `badge`, `button`, `copy-button` | Code display with dependency-free token highlighting, line numbers and diff gutters.  |
| `copy-button`      | —                                | Click-to-copy button with copied feedback and a non-secure-context clipboard fallback. |
| `image-compare`    | —                                | Before/after comparison slider with a draggable, keyboard-accessible divider.        |
| `kbd`              | —                                | 3D tactile keycap with `KbdGroup` for chords and `KbdDisplay` for inline keys.       |
| `lightbox`         | —                                | Fullscreen image lightbox with gallery nav, zoom, swipe and a thumbnail strip.       |
| `marquee`          | —                                | Infinite scrolling row or column with pause-on-hover, reverse and vertical modes.    |
| `masonry`          | —                                | True masonry layout that balances children into the shortest column. Dependency-free. |
| `qr-code`          | —                                | Dependency-free QR code generator rendering crisp SVG with `currentColor` theming.   |
| `release-notes`    | `badge`                          | Single-release what's-new card with a version badge, date, title and highlights.     |
| `scroll-progress`  | —                                | Fixed reading progress bar. Tracks document scroll or a scoped container ref.        |
| `spinner`          | —                                | Loading indicator with circle, dots and bars variants and an accessible label.       |

#### Navigation (15)

| Component                | Registry deps              | What it is                                                                            |
| ------------------------ | -------------------------- | ------------------------------------------------------------------------------------ |
| `breadcrumb-generator`   | `breadcrumb`, `dropdown-menu` | Generate a breadcrumb trail from a path or items, with middle-collapse into a dropdown. |
| `command-palette`        | `command`, `kbd`           | Cmd+K command launcher with grouped actions, icons, shortcuts and a global hotkey.    |
| `dock`                   | —                          | macOS-style dock with cursor magnification: icons scale and spring past the pointer.  |
| `floating-action-button` | —                          | Expanding speed-dial FAB that rotates open to stagger secondary actions.              |
| `floating-toolbar`       | —                          | Floating pill toolbar for text selection and canvas actions.                         |
| `inspector-panel`        | `collapsible`              | Design-tool inspector with a header, collapsible sections and label/control rows.    |
| `keyboard-shortcuts`     | `dialog`, `kbd`            | Shortcuts cheat-sheet dialog opened with `?`, grouped by area and searchable.         |
| `onboarding`             | `button`, `progress`       | Multi-step onboarding wizard with a progress header, per-step panels and a finish state. |
| `resizable-panels`       | —                          | Composable resizable panel groups with keyboard-accessible handles and minimums.     |
| `spotlight-search`       | `dialog`, `kbd`            | Centered search overlay with a large field, grouped rich results and keyboard nav.    |
| `split-view`             | —                          | Two-pane master/detail layout with a draggable divider and keyboard resize.          |
| `stepper`                | —                          | Multi-step progress indicator, horizontal or vertical, with a compound API.          |
| `tenant-switcher`        | `popover`, `command`       | Workspace / organization / project switcher with a grouped, searchable list.         |
| `toc`                    | —                          | On-this-page navigation that tracks the active heading with a moving marker.          |
| `tour`                   | `button`                   | Onboarding spotlight that dims the page and walks users through steps.                |

#### Animation (8)

| Component         | Registry deps | What it is                                                                                  |
| ----------------- | ------------- | ------------------------------------------------------------------------------------------- |
| `blur-reveal`     | —             | Reveals content with a blur, fade and lift as it scrolls into view. Reduced-motion aware.   |
| `cursor-glow`     | —             | Ambient glow layer that follows the pointer across its container.                           |
| `magnetic-button` | —             | Button that pulls toward the cursor and springs back on leave.                              |
| `morphing-dialog` | —             | A trigger card that morphs into a centered dialog via shared-layout animation.              |
| `scroll-reveal`   | —             | Fades and slides content in from any direction as it enters the viewport.                   |
| `spotlight-card`  | —             | Card surface with a soft spotlight that tracks the cursor and fades in on hover.            |
| `text-reveal`     | —             | Staggered text entrance that masks and slides each word, character or line into place.      |
| `tilt-card`       | —             | 3D pointer tilt with optional cursor-following glare. Reduced-motion aware.                 |

#### Widgets (3)

| Component       | Registry deps | What it is                                                                                |
| --------------- | ------------- | ---------------------------------------------------------------------------------------- |
| `kpi-grid`      | —             | Hairline-joined grid of KPI tiles with a delta chip and a dependency-free sparkline.     |
| `notifications` | —             | Notification panel with per-item media, title, description, time and an unread marker.    |
| `quick-actions` | —             | Grid of dashboard shortcut tiles with icon, label and description. `asChild` for links.  |

#### SaaS (7)

| Component              | Registry deps              | What it is                                                                            |
| ---------------------- | -------------------------- | ------------------------------------------------------------------------------------ |
| `api-keys`             | `button`                   | API key manager with reveal/hide, copy-to-clipboard, key metadata and a create action. |
| `billing-card`         | —                          | Current-plan summary with price, a usage meter, billing detail rows and footer actions. |
| `feature-flag-manager` | `badge`                    | Searchable feature flags with key, environments, rollout and an accessible on/off toggle. |
| `review-queue`         | `badge`, `button`, `kbd`   | Work a moderation queue one item at a time with approve / reject / skip and shortcuts. |
| `role-manager`         | `badge`, `button`, `checkbox` | Two-pane role admin with a grouped permission checklist; system roles are read-only. |
| `subscription-plans`   | `button`                   | In-app plan selector with featured and current states, a badge and per-plan action.  |
| `usage-dashboard`      | —                          | Metered usage panel with per-resource progress bars that tint near and over the limit. |

> The SaaS "Audit Logs" view is served by the `audit-log` component (Data
> display) rather than a near-duplicate entry.

#### Primitives — distribution-only (2)

| Component        | Registry deps | What it is                                                                                                                                         |
| ---------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accordion`      | —             | Radix-powered accordion primitive used by the FAQ blocks. Listed in `DISTRIBUTION_ONLY` so it ships in the registry without its own showcase page. |
| `calendar-utils` | —             | Dependency-free date helpers (month grids, day math, keyboard-grid navigation) shared by `date-picker` and `date-range-picker`.                   |

## Blocks

Marketing and app section blocks live under
[registry/hirael/blocks/](../registry/hirael/blocks/). Each declares a
`blockKind` and `blockTagline` in `registry-meta.ts`; the block index groups
them by kind. Browse at [hirael.com/blocks](https://hirael.com/blocks); each
kind has a category page at `/blocks/<category>` and its blocks at
`/blocks/<category>/<name>`. The URL slug can differ from the kind key
(`feature` → `features`, `login` → `auth`, `faq` → `faqs`) — see
`BLOCK_KIND_SLUGS`.

| Kind           | Blocks                                                                                         | What it covers                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero           | `hero-01`, `hero-02`, `hero-03`, `hero-04`, `hero-05`, `hero-06`, `hero-07`, `hero-08`         | Landing hero sections — headline, sub-copy, CTAs. `hero-01` light-beam shader card with glass nav + stat footer, `hero-02` animated gradient-bar shader with wordmark strip, `hero-03` editorial faded-grid with a logo cloud, `hero-04` full-bleed image banner with a scrim, `hero-05` aurora shader card with a glass panel + avatar social proof, `hero-06` centered personal hero with a live badge, stat row and geometric accents, `hero-07` centered word-by-word reveal with beam line-art, `hero-08` framed token-lit panel with a window preview. Shader backdrops (`hero-01/02/05`) reuse the `shaders` package and load client-side only. |
| Feature        | `feature-01`, `feature-02`                                                                     | Feature grids and alternating feature rows.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Pricing        | `pricing-01`, `pricing-02`                                                                     | Tiered pricing tables with feature lists and highlighted plan.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Testimonial    | `testimonial-01`, `testimonial-02`, `testimonial-03`                                           | Quote cards and testimonial walls. `testimonial-03` is a centered statement quote with a serif display heading and a highlighted phrase.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Call-to-action | `cta-01`, `cta-02`, `cta-03`, `cta-04`, `cta-05`, `cta-06`                                     | Conversion bands with headline and action. `cta-04` centered get-in-touch with a glow dome and social icons, `cta-05` scroll-lit glow with email + call actions, `cta-06` framed gradient panel with a motion reveal.                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| FAQ            | `faq-01`, `faq-02`, `faq-03`, `faq-04`, `faq-05`                                               | Accordion and two-column FAQ layouts. `faq-05` is a split two-column layout with a divider and single-open accordion.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Auth           | `login-01`, `login-02`, `login-03`, `signup-01`, `forgot-password-01`, `otp-verify-01`         | Login, sign-up, password reset and OTP verification forms. `login-03` is a split-screen GitHub-only sign-in with a decorative animated-paths aside.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Header         | `header-01`                                                                                    | Site header / top navigation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Footer         | `footer-01`, `footer-02`, `footer-03`                                                          | Multi-column site footer. `footer-02` rounded-top brand + capped link columns with a radial tint, `footer-03` boxed panel with a brand block and ghost social buttons.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 404            | `not-found-01`                                                                                 | Not-found page section.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Logo cloud     | `logo-cloud-01`                                                                                | Trusted-by logo strip.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Contact        | `contact-01`, `contact-02`                                                                     | Contact form with details column. `contact-02` is a bordered info grid (email, location, social) with social pills.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Blog           | `blog-01`                                                                                      | Blog index / article grid.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| E-commerce     | `ecommerce-01`, `ecommerce-02`                                                                 | Product grid and product detail layouts.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Dashboard      | `dashboard-01`, `dashboard-02`, `dashboard-03`, `dashboard-04`, `dashboard-05`, `dashboard-06` | Analytics and admin dashboard layouts. `dashboard-06` is a pipeline overview with stat cards, a clickable runs bar chart and a breakdown panel.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Integrations   | `integrations-01`                                                                              | Integration / app directory grid.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Image gallery  | `image-gallery-01`                                                                             | Responsive image gallery.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| App shell      | `app-shell-01`, `app-shell-02`, `app-shell-03`, `app-shell-04`, `app-shell-05`                 | Sidebar + topbar application shells. `app-shell-05` is an inset collapsible sidebar with grouped nav, an account menu and a breadcrumb header.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

> Block previews render in two places: inline on the block category page and
> framed inside `app/embed/blocks/[category]/[block]/` (an isolated route so a
> block's own layout can't leak the showcase chrome into the preview).

## Templates

Full, multi-section pages built in the Hirael style — complete layouts you
copy into your repo with the shadcn CLI and edit like any other file. They
live under [registry/hirael/templates/](../registry/hirael/templates/),
browse at [hirael.com/templates](https://hirael.com/templates), and preview
framed inside `app/embed/templates/[template]/`.

| Template          | Dependencies                      | What it is                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `creative-studio` | `framer-motion`, `lucide-react`   | Dark, cinematic creative-studio landing page: full-viewport hero with an animated backdrop and pull-up wordmark, a scroll-revealed about section, and a staggered feature-card grid. Self-contained warm-cream palette.                                                                                                                                                        |
| `agency-landing`  | `shaders`, `lucide-react`         | Bright, shader-lit agency landing page: full-viewport hero with an animated WebGL backdrop and pill navigation, an editorial about section, a featured-work grid of autoplaying video cards, and a dark closing footer with a call to action. Self-contained light palette, Hirael branding.                                                                                   |
| `mindloop`        | `framer-motion`, `hls.js`         | Dark, monochrome newsletter / content landing page: a full-screen video hero with an inline subscribe form, an answer-engine section, scroll-revealed mission copy, a four-up feature grid and an HLS streaming-video call to action. Self-contained pure-black palette, Inter + Instrument Serif, liquid-glass accents.                                                       |
| `portfolio`       | `gsap`, `framer-motion`, `hls.js` | Dark, single-page personal portfolio: a counter loading screen, an HLS video hero with a floating nav and a cycling role line, a bento work grid, a journal list, a scroll-pinned parallax gallery with lightbox, count-up stats and a video contact footer. Self-contained dark palette.                                                                                      |
| `usd-halo`        | `lucide-react`                    | Premium fintech landing page for a stablecoin: a full-bleed video hero with a custom halo wordmark and an infinite brand marquee, a meet-the-product card grid, a backers marquee, and a use-modes split with an autoplaying video panel, closing on a dark anchor footer. Self-contained light palette, Manrope + Inter type.                                                 |
| `velorah`         | `hls.js`                          | Dark, premium landing page for an electric RV brand: a full-screen video hero with liquid-glass navigation, a centered tagline, a split feature card with switchable tabs, an HLS streaming statement with a stats row, a video preorder call to action and a multi-column footer. Self-contained pure-black palette, Inter + Instrument Serif type.                           |
| `rivr`            | `framer-motion`, `lucide-react`   | DeFi staking landing page for a fluid-asset protocol: a video hero on a rounded card with glass stat cards and a carved documentation corner, a metrics band, a bento feature grid, a video call to action and a light footer. Self-contained light palette, Helvetica system type.                                                                                            |
| `nexacore`        | `hls.js`, `lucide-react`          | Light enterprise-infrastructure landing page: a floating pill navbar that shrinks on scroll, a full-screen video hero, a dark service-card grid that unfolds on hover, a chaos-versus-control split around a circular streaming video, and a four-pillar delivery staircase. Self-contained navy-and-lavender palette with multi-stop brand gradients, Plus Jakarta Sans type. |
| `asme`            | `framer-motion`, `lucide-react`   | Dark, liquid-glass marketing landing page: a full-viewport hero with a cross-fading background video, a frosted glass pill nav and an inline email form, then scroll-revealed about, featured-video, philosophy and services sections, closing on a multi-column footer. Self-contained pure-black palette, Inter + Instrument Serif type, liquid-glass surfaces throughout.   |

A template is one `registry-meta.ts` entry (`category: "templates"`) whose
`files` list every file in its folder, so the CLI installs the whole
page set under `components/templates/<name>/`. Templates may ship their own
fonts and a self-contained palette rather than the site's design tokens.
