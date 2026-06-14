"use client"

import * as React from "react"

/**
 * Lazy registry of preview components, keyed by registry entry name.
 *
 * registry-meta.ts is intentionally data-only so that importing it (from the
 * sidebar, server pages, the sitemap) never drags component code into a
 * bundle. The actual demo/block modules live behind dynamic imports here and
 * are code-split per entry — a route only loads the preview it renders.
 */
const DEMO_LOADERS: Record<
  string,
  () => Promise<{ default: React.ComponentType }>
> = {
  "multi-select": () => import("@/registry/hirael/multi-select/multi-select.demo"),
  "number-range": () => import("@/registry/hirael/number-range/number-range.demo"),
  "year-picker": () => import("@/registry/hirael/year-picker/year-picker.demo"),
  "tag-input": () => import("@/registry/hirael/tag-input/tag-input.demo"),
  "combobox": () => import("@/registry/hirael/combobox/combobox.demo"),
  "lazy-select": () => import("@/registry/hirael/lazy-select/lazy-select.demo"),
  "password-input": () => import("@/registry/hirael/password-input/password-input.demo"),
  "currency-input": () => import("@/registry/hirael/currency-input/currency-input.demo"),
  "phone-input": () => import("@/registry/hirael/phone-input/phone-input.demo"),
  "file-dropzone": () => import("@/registry/hirael/file-dropzone/file-dropzone.demo"),
  "stat-card": () => import("@/registry/hirael/stat-card/stat-card.demo"),
  "rating": () => import("@/registry/hirael/rating/rating.demo"),
  "timeline": () => import("@/registry/hirael/timeline/timeline.demo"),
  "kbd": () => import("@/registry/hirael/kbd/kbd.demo"),
  "callout": () => import("@/registry/hirael/callout/callout.demo"),
  "scroll-progress": () => import("@/registry/hirael/scroll-progress/scroll-progress.demo"),
  "hero-01": () => import("@/registry/hirael/blocks/hero-01/hero-01"),
  "hero-02": () => import("@/registry/hirael/blocks/hero-02/hero-02"),
  "hero-03": () => import("@/registry/hirael/blocks/hero-03/hero-03"),
  "feature-01": () => import("@/registry/hirael/blocks/feature-01/feature-01"),
  "feature-02": () => import("@/registry/hirael/blocks/feature-02/feature-02"),
  "pricing-01": () => import("@/registry/hirael/blocks/pricing-01/pricing-01"),
  "pricing-02": () => import("@/registry/hirael/blocks/pricing-02/pricing-02"),
  "testimonial-01": () => import("@/registry/hirael/blocks/testimonial-01/testimonial-01"),
  "testimonial-02": () => import("@/registry/hirael/blocks/testimonial-02/testimonial-02"),
  "cta-01": () => import("@/registry/hirael/blocks/cta-01/cta-01"),
  "cta-02": () => import("@/registry/hirael/blocks/cta-02/cta-02"),
  "cta-03": () => import("@/registry/hirael/blocks/cta-03/cta-03"),
  "faq-01": () => import("@/registry/hirael/blocks/faq-01/faq-01"),
  "faq-02": () => import("@/registry/hirael/blocks/faq-02/faq-02"),
  "faq-03": () => import("@/registry/hirael/blocks/faq-03/faq-03"),
  "faq-04": () => import("@/registry/hirael/blocks/faq-04/faq-04"),
  "login-01": () => import("@/registry/hirael/blocks/login-01/login-01"),
  "login-02": () => import("@/registry/hirael/blocks/login-02/login-02"),
  "signup-01": () => import("@/registry/hirael/blocks/signup-01/signup-01"),
  "forgot-password-01": () =>
    import("@/registry/hirael/blocks/forgot-password-01/forgot-password-01"),
  "otp-verify-01": () => import("@/registry/hirael/blocks/otp-verify-01/otp-verify-01"),
  "header-01": () => import("@/registry/hirael/blocks/header-01/header-01"),
  "footer-01": () => import("@/registry/hirael/blocks/footer-01/footer-01"),
  "not-found-01": () => import("@/registry/hirael/blocks/not-found-01/not-found-01"),
  "month-picker": () => import("@/registry/hirael/month-picker/month-picker.demo"),
  "time-picker": () => import("@/registry/hirael/time-picker/time-picker.demo"),
  "color-picker": () => import("@/registry/hirael/color-picker/color-picker.demo"),
  "avatar-stack": () => import("@/registry/hirael/avatar-stack/avatar-stack.demo"),
  "announcement-bar": () => import("@/registry/hirael/announcement-bar/announcement-bar.demo"),
  "empty-state": () => import("@/registry/hirael/empty-state/empty-state.demo"),
  "logo-cloud-01": () => import("@/registry/hirael/blocks/logo-cloud-01/logo-cloud-01"),
  "contact-01": () => import("@/registry/hirael/blocks/contact-01/contact-01"),
  "blog-01": () => import("@/registry/hirael/blocks/blog-01/blog-01"),
  "dashboard-01": () => import("@/registry/hirael/blocks/dashboard-01/dashboard-01"),
  "dashboard-02": () => import("@/registry/hirael/blocks/dashboard-02/dashboard-02"),
  "dashboard-03": () => import("@/registry/hirael/blocks/dashboard-03/dashboard-03"),
  "dashboard-04": () => import("@/registry/hirael/blocks/dashboard-04/dashboard-04"),
  "dashboard-05": () => import("@/registry/hirael/blocks/dashboard-05/dashboard-05"),
  "ecommerce-01": () => import("@/registry/hirael/blocks/ecommerce-01/ecommerce-01"),
  "ecommerce-02": () => import("@/registry/hirael/blocks/ecommerce-02/ecommerce-02"),
  "integrations-01": () => import("@/registry/hirael/blocks/integrations-01/integrations-01"),
  "image-gallery-01": () => import("@/registry/hirael/blocks/image-gallery-01/image-gallery-01"),
  "app-shell-01": () => import("@/registry/hirael/blocks/app-shell-01/app-shell-01"),
  "app-shell-02": () => import("@/registry/hirael/blocks/app-shell-02/app-shell-02"),
  "app-shell-03": () => import("@/registry/hirael/blocks/app-shell-03/app-shell-03"),
  "app-shell-04": () => import("@/registry/hirael/blocks/app-shell-04/app-shell-04"),
  "spinner": () => import("@/registry/hirael/spinner/spinner.demo"),
  "copy-button": () => import("@/registry/hirael/copy-button/copy-button.demo"),
  "marquee": () => import("@/registry/hirael/marquee/marquee.demo"),
  "tree-view": () => import("@/registry/hirael/tree-view/tree-view.demo"),
  "animated-number": () => import("@/registry/hirael/animated-number/animated-number.demo"),
  "stepper": () => import("@/registry/hirael/stepper/stepper.demo"),
  "sortable": () => import("@/registry/hirael/sortable/sortable.demo"),
  "date-picker": () => import("@/registry/hirael/date-picker/date-picker.demo"),
  "date-range-picker": () => import("@/registry/hirael/date-range-picker/date-range-picker.demo"),
  "mention-input": () => import("@/registry/hirael/mention-input/mention-input.demo"),
  "inline-edit": () => import("@/registry/hirael/inline-edit/inline-edit.demo"),
  "signature-pad": () => import("@/registry/hirael/signature-pad/signature-pad.demo"),
  "image-cropper": () => import("@/registry/hirael/image-cropper/image-cropper.demo"),
  "image-compare": () => import("@/registry/hirael/image-compare/image-compare.demo"),
  "lightbox": () => import("@/registry/hirael/lightbox/lightbox.demo"),
  "countdown-timer": () => import("@/registry/hirael/countdown-timer/countdown-timer.demo"),
  "qr-code": () => import("@/registry/hirael/qr-code/qr-code.demo"),
  "calendar-heatmap": () => import("@/registry/hirael/calendar-heatmap/calendar-heatmap.demo"),
  "code-block": () => import("@/registry/hirael/code-block/code-block.demo"),
  "masonry": () => import("@/registry/hirael/masonry/masonry.demo"),
  "audio-player": () => import("@/registry/hirael/audio-player/audio-player.demo"),
  "media-input": () => import("@/registry/hirael/media-input/media-input.demo"),
  "tour": () => import("@/registry/hirael/tour/tour.demo"),
  "activity-feed": () => import("@/registry/hirael/activity-feed/activity-feed.demo"),
  "audit-log": () => import("@/registry/hirael/audit-log/audit-log.demo"),
  "blur-reveal": () => import("@/registry/hirael/blur-reveal/blur-reveal.demo"),
  "text-reveal": () => import("@/registry/hirael/text-reveal/text-reveal.demo"),
  "scroll-reveal": () => import("@/registry/hirael/scroll-reveal/scroll-reveal.demo"),
  "spotlight-card": () => import("@/registry/hirael/spotlight-card/spotlight-card.demo"),
  "magnetic-button": () => import("@/registry/hirael/magnetic-button/magnetic-button.demo"),
  "cursor-glow": () => import("@/registry/hirael/cursor-glow/cursor-glow.demo"),
  "tilt-card": () => import("@/registry/hirael/tilt-card/tilt-card.demo"),
  "morphing-dialog": () => import("@/registry/hirael/morphing-dialog/morphing-dialog.demo"),
  "dock": () => import("@/registry/hirael/dock/dock.demo"),
  "floating-action-button": () => import("@/registry/hirael/floating-action-button/floating-action-button.demo"),
  "floating-toolbar": () => import("@/registry/hirael/floating-toolbar/floating-toolbar.demo"),
  "split-view": () => import("@/registry/hirael/split-view/split-view.demo"),
  "resizable-panels": () => import("@/registry/hirael/resizable-panels/resizable-panels.demo"),
  "inspector-panel": () => import("@/registry/hirael/inspector-panel/inspector-panel.demo"),
  "kpi-grid": () => import("@/registry/hirael/kpi-grid/kpi-grid.demo"),
  "quick-actions": () => import("@/registry/hirael/quick-actions/quick-actions.demo"),
  "notifications": () => import("@/registry/hirael/notifications/notifications.demo"),
  "billing-card": () => import("@/registry/hirael/billing-card/billing-card.demo"),
  "subscription-plans": () => import("@/registry/hirael/subscription-plans/subscription-plans.demo"),
  "api-keys": () => import("@/registry/hirael/api-keys/api-keys.demo"),
  "usage-dashboard": () => import("@/registry/hirael/usage-dashboard/usage-dashboard.demo"),
  "creative-studio": () =>
    import("@/registry/hirael/templates/creative-studio/creative-studio"),
  "agency-landing": () =>
    import("@/registry/hirael/templates/agency-landing/agency-landing"),
  "usd-halo": () => import("@/registry/hirael/templates/usd-halo/usd-halo"),
}

// React.lazy defers the import until first render, so creating every demo
// component eagerly at module scope costs nothing and keeps component
// identities stable across renders.
const DEMOS: Record<
  string,
  React.LazyExoticComponent<React.ComponentType>
> = Object.fromEntries(
  Object.entries(DEMO_LOADERS).map(([name, load]) => [name, React.lazy(load)])
)

export function RegistryDemo({
  name,
  fallback = null,
}: {
  name: string
  fallback?: React.ReactNode
}) {
  const Demo = DEMOS[name]
  if (!Demo) return null
  return (
    <React.Suspense fallback={fallback}>
      <Demo />
    </React.Suspense>
  )
}
