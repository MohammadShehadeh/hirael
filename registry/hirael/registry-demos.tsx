"use client";

import * as React from "react";

import { getExamples } from "@/registry/hirael/registry-meta";

/**
 * Lazy preview registry. registry-meta.ts stays data-only so importing it
 * (sidebar, server pages, sitemap) never drags component code into a bundle;
 * the actual modules live behind the dynamic imports here and are code-split
 * per preview — a route only loads what it renders.
 */

/** Block & template previews, keyed by registry entry name. */
const BLOCK_LOADERS: Record<
  string,
  () => Promise<{ default: React.ComponentType }>
> = {
  "hero-01": () => import("@/registry/hirael/blocks/hero-01/hero-01"),
  "hero-02": () => import("@/registry/hirael/blocks/hero-02/hero-02"),
  "hero-03": () => import("@/registry/hirael/blocks/hero-03/hero-03"),
  "hero-04": () => import("@/registry/hirael/blocks/hero-04/hero-04"),
  "hero-05": () => import("@/registry/hirael/blocks/hero-05/hero-05"),
  "feature-01": () => import("@/registry/hirael/blocks/feature-01/feature-01"),
  "feature-02": () => import("@/registry/hirael/blocks/feature-02/feature-02"),
  "pricing-01": () => import("@/registry/hirael/blocks/pricing-01/pricing-01"),
  "pricing-02": () => import("@/registry/hirael/blocks/pricing-02/pricing-02"),
  "testimonial-01": () =>
    import("@/registry/hirael/blocks/testimonial-01/testimonial-01"),
  "testimonial-02": () =>
    import("@/registry/hirael/blocks/testimonial-02/testimonial-02"),
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
  "otp-verify-01": () =>
    import("@/registry/hirael/blocks/otp-verify-01/otp-verify-01"),
  "header-01": () => import("@/registry/hirael/blocks/header-01/header-01"),
  "footer-01": () => import("@/registry/hirael/blocks/footer-01/footer-01"),
  "not-found-01": () =>
    import("@/registry/hirael/blocks/not-found-01/not-found-01"),
  "logo-cloud-01": () =>
    import("@/registry/hirael/blocks/logo-cloud-01/logo-cloud-01"),
  "contact-01": () => import("@/registry/hirael/blocks/contact-01/contact-01"),
  "blog-01": () => import("@/registry/hirael/blocks/blog-01/blog-01"),
  "dashboard-01": () =>
    import("@/registry/hirael/blocks/dashboard-01/dashboard-01"),
  "dashboard-02": () =>
    import("@/registry/hirael/blocks/dashboard-02/dashboard-02"),
  "dashboard-03": () =>
    import("@/registry/hirael/blocks/dashboard-03/dashboard-03"),
  "dashboard-04": () =>
    import("@/registry/hirael/blocks/dashboard-04/dashboard-04"),
  "dashboard-05": () =>
    import("@/registry/hirael/blocks/dashboard-05/dashboard-05"),
  "ecommerce-01": () =>
    import("@/registry/hirael/blocks/ecommerce-01/ecommerce-01"),
  "ecommerce-02": () =>
    import("@/registry/hirael/blocks/ecommerce-02/ecommerce-02"),
  "integrations-01": () =>
    import("@/registry/hirael/blocks/integrations-01/integrations-01"),
  "image-gallery-01": () =>
    import("@/registry/hirael/blocks/image-gallery-01/image-gallery-01"),
  "app-shell-01": () =>
    import("@/registry/hirael/blocks/app-shell-01/app-shell-01"),
  "app-shell-02": () =>
    import("@/registry/hirael/blocks/app-shell-02/app-shell-02"),
  "app-shell-03": () =>
    import("@/registry/hirael/blocks/app-shell-03/app-shell-03"),
  "app-shell-04": () =>
    import("@/registry/hirael/blocks/app-shell-04/app-shell-04"),
  "creative-studio": () =>
    import("@/registry/hirael/templates/creative-studio/creative-studio"),
  "agency-landing": () =>
    import("@/registry/hirael/templates/agency-landing/agency-landing"),
  mindloop: () => import("@/registry/hirael/templates/mindloop/mindloop"),
  portfolio: () => import("@/registry/hirael/templates/portfolio/portfolio"),
  "usd-halo": () => import("@/registry/hirael/templates/usd-halo/usd-halo"),
  rivr: () => import("@/registry/hirael/templates/rivr/rivr"),
  velorah: () => import("@/registry/hirael/templates/velorah/velorah"),
  nexacore: () => import("@/registry/hirael/templates/nexacore/nexacore"),
  asme: () => import("@/registry/hirael/templates/asme/asme"),
  "hero-06": () => import("@/registry/hirael/blocks/hero-06/hero-06"),
  "hero-07": () => import("@/registry/hirael/blocks/hero-07/hero-07"),
  "hero-08": () => import("@/registry/hirael/blocks/hero-08/hero-08"),
  "testimonial-03": () =>
    import("@/registry/hirael/blocks/testimonial-03/testimonial-03"),
  "cta-04": () => import("@/registry/hirael/blocks/cta-04/cta-04"),
  "cta-05": () => import("@/registry/hirael/blocks/cta-05/cta-05"),
  "cta-06": () => import("@/registry/hirael/blocks/cta-06/cta-06"),
  "footer-02": () => import("@/registry/hirael/blocks/footer-02/footer-02"),
  "footer-03": () => import("@/registry/hirael/blocks/footer-03/footer-03"),
  "faq-05": () => import("@/registry/hirael/blocks/faq-05/faq-05"),
  "contact-02": () => import("@/registry/hirael/blocks/contact-02/contact-02"),
  "login-03": () => import("@/registry/hirael/blocks/login-03/login-03"),
  "app-shell-05": () =>
    import("@/registry/hirael/blocks/app-shell-05/app-shell-05"),
  "dashboard-06": () =>
    import("@/registry/hirael/blocks/dashboard-06/dashboard-06"),
};

/** Component examples, keyed by example slug (file basename in examples/). */
const EXAMPLE_LOADERS: Record<
  string,
  () => Promise<{ default: React.ComponentType }>
> = {
  "multi-select-demo": () =>
    import("@/registry/hirael/examples/multi-select-demo"),
  "number-range-demo": () =>
    import("@/registry/hirael/examples/number-range-demo"),
  "year-picker-demo": () =>
    import("@/registry/hirael/examples/year-picker-demo"),
  "tag-input-demo": () => import("@/registry/hirael/examples/tag-input-demo"),
  "tag-input-emails": () =>
    import("@/registry/hirael/examples/tag-input-emails"),
  "combobox-demo": () => import("@/registry/hirael/examples/combobox-demo"),
  "lazy-select-demo": () =>
    import("@/registry/hirael/examples/lazy-select-demo"),
  "password-input-demo": () =>
    import("@/registry/hirael/examples/password-input-demo"),
  "currency-input-demo": () =>
    import("@/registry/hirael/examples/currency-input-demo"),
  "phone-input-demo": () =>
    import("@/registry/hirael/examples/phone-input-demo"),
  "file-dropzone-demo": () =>
    import("@/registry/hirael/examples/file-dropzone-demo"),
  "stat-card-demo": () => import("@/registry/hirael/examples/stat-card-demo"),
  "rating-demo": () => import("@/registry/hirael/examples/rating-demo"),
  "timeline-demo": () => import("@/registry/hirael/examples/timeline-demo"),
  "kbd-demo": () => import("@/registry/hirael/examples/kbd-demo"),
  "callout-demo": () => import("@/registry/hirael/examples/callout-demo"),
  "scroll-progress-demo": () =>
    import("@/registry/hirael/examples/scroll-progress-demo"),
  "month-picker-demo": () =>
    import("@/registry/hirael/examples/month-picker-demo"),
  "time-picker-demo": () =>
    import("@/registry/hirael/examples/time-picker-demo"),
  "color-picker-demo": () =>
    import("@/registry/hirael/examples/color-picker-demo"),
  "avatar-stack-demo": () =>
    import("@/registry/hirael/examples/avatar-stack-demo"),
  "announcement-bar-demo": () =>
    import("@/registry/hirael/examples/announcement-bar-demo"),
  "spinner-demo": () => import("@/registry/hirael/examples/spinner-demo"),
  "copy-button-demo": () =>
    import("@/registry/hirael/examples/copy-button-demo"),
  "marquee-demo": () => import("@/registry/hirael/examples/marquee-demo"),
  "tree-view-demo": () => import("@/registry/hirael/examples/tree-view-demo"),
  "animated-number-demo": () =>
    import("@/registry/hirael/examples/animated-number-demo"),
  "stepper-demo": () => import("@/registry/hirael/examples/stepper-demo"),
  "sortable-demo": () => import("@/registry/hirael/examples/sortable-demo"),
  "date-picker-demo": () =>
    import("@/registry/hirael/examples/date-picker-demo"),
  "date-range-picker-demo": () =>
    import("@/registry/hirael/examples/date-range-picker-demo"),
  "date-range-picker-inline": () =>
    import("@/registry/hirael/examples/date-range-picker-inline"),
  "date-range-picker-bounded": () =>
    import("@/registry/hirael/examples/date-range-picker-bounded"),
  "mention-input-demo": () =>
    import("@/registry/hirael/examples/mention-input-demo"),
  "inline-edit-demo": () =>
    import("@/registry/hirael/examples/inline-edit-demo"),
  "signature-pad-demo": () =>
    import("@/registry/hirael/examples/signature-pad-demo"),
  "image-cropper-demo": () =>
    import("@/registry/hirael/examples/image-cropper-demo"),
  "image-compare-demo": () =>
    import("@/registry/hirael/examples/image-compare-demo"),
  "lightbox-demo": () => import("@/registry/hirael/examples/lightbox-demo"),
  "countdown-timer-demo": () =>
    import("@/registry/hirael/examples/countdown-timer-demo"),
  "qr-code-demo": () => import("@/registry/hirael/examples/qr-code-demo"),
  "calendar-heatmap-demo": () =>
    import("@/registry/hirael/examples/calendar-heatmap-demo"),
  "code-block-demo": () => import("@/registry/hirael/examples/code-block-demo"),
  "masonry-demo": () => import("@/registry/hirael/examples/masonry-demo"),
  "audio-player-demo": () =>
    import("@/registry/hirael/examples/audio-player-demo"),
  "media-input-demo": () =>
    import("@/registry/hirael/examples/media-input-demo"),
  "tour-demo": () => import("@/registry/hirael/examples/tour-demo"),
  "activity-feed-demo": () =>
    import("@/registry/hirael/examples/activity-feed-demo"),
  "audit-log-demo": () => import("@/registry/hirael/examples/audit-log-demo"),
  "blur-reveal-demo": () =>
    import("@/registry/hirael/examples/blur-reveal-demo"),
  "text-reveal-demo": () =>
    import("@/registry/hirael/examples/text-reveal-demo"),
  "scroll-reveal-demo": () =>
    import("@/registry/hirael/examples/scroll-reveal-demo"),
  "spotlight-card-demo": () =>
    import("@/registry/hirael/examples/spotlight-card-demo"),
  "magnetic-button-demo": () =>
    import("@/registry/hirael/examples/magnetic-button-demo"),
  "cursor-glow-demo": () =>
    import("@/registry/hirael/examples/cursor-glow-demo"),
  "tilt-card-demo": () => import("@/registry/hirael/examples/tilt-card-demo"),
  "morphing-dialog-demo": () =>
    import("@/registry/hirael/examples/morphing-dialog-demo"),
  "dock-demo": () => import("@/registry/hirael/examples/dock-demo"),
  "floating-action-button-demo": () =>
    import("@/registry/hirael/examples/floating-action-button-demo"),
  "floating-toolbar-demo": () =>
    import("@/registry/hirael/examples/floating-toolbar-demo"),
  "split-view-demo": () => import("@/registry/hirael/examples/split-view-demo"),
  "resizable-panels-demo": () =>
    import("@/registry/hirael/examples/resizable-panels-demo"),
  "inspector-panel-demo": () =>
    import("@/registry/hirael/examples/inspector-panel-demo"),
  "tenant-switcher-demo": () =>
    import("@/registry/hirael/examples/tenant-switcher-demo"),
  "kpi-grid-demo": () => import("@/registry/hirael/examples/kpi-grid-demo"),
  "quick-actions-demo": () =>
    import("@/registry/hirael/examples/quick-actions-demo"),
  "notifications-demo": () =>
    import("@/registry/hirael/examples/notifications-demo"),
  "billing-card-demo": () =>
    import("@/registry/hirael/examples/billing-card-demo"),
  "subscription-plans-demo": () =>
    import("@/registry/hirael/examples/subscription-plans-demo"),
  "api-keys-demo": () => import("@/registry/hirael/examples/api-keys-demo"),
  "usage-dashboard-demo": () =>
    import("@/registry/hirael/examples/usage-dashboard-demo"),
  "toc-demo": () => import("@/registry/hirael/examples/toc-demo"),
  "ai-chat-demo": () => import("@/registry/hirael/examples/ai-chat-demo"),
  "prompt-editor-demo": () =>
    import("@/registry/hirael/examples/prompt-editor-demo"),
  "ai-completion-input-demo": () =>
    import("@/registry/hirael/examples/ai-completion-input-demo"),
  "ai-tool-call-demo": () =>
    import("@/registry/hirael/examples/ai-tool-call-demo"),
  "agent-workflow-demo": () =>
    import("@/registry/hirael/examples/agent-workflow-demo"),
  "rag-citations-demo": () =>
    import("@/registry/hirael/examples/rag-citations-demo"),
  "query-builder-demo": () =>
    import("@/registry/hirael/examples/query-builder-demo"),
  "filter-builder-demo": () =>
    import("@/registry/hirael/examples/filter-builder-demo"),
  "permission-matrix-demo": () =>
    import("@/registry/hirael/examples/permission-matrix-demo"),
  "approval-workflow-demo": () =>
    import("@/registry/hirael/examples/approval-workflow-demo"),
  "json-viewer-demo": () =>
    import("@/registry/hirael/examples/json-viewer-demo"),
  "diff-viewer-demo": () =>
    import("@/registry/hirael/examples/diff-viewer-demo"),
  "log-viewer-demo": () =>
    import("@/registry/hirael/examples/log-viewer-demo"),
  "request-builder-demo": () =>
    import("@/registry/hirael/examples/request-builder-demo"),
  "terminal-demo": () => import("@/registry/hirael/examples/terminal-demo"),
  "command-palette-demo": () =>
    import("@/registry/hirael/examples/command-palette-demo"),
  "spotlight-search-demo": () =>
    import("@/registry/hirael/examples/spotlight-search-demo"),
  "discount-builder-demo": () =>
    import("@/registry/hirael/examples/discount-builder-demo"),
  "bundle-builder-demo": () =>
    import("@/registry/hirael/examples/bundle-builder-demo"),
  "vendor-comparison-demo": () =>
    import("@/registry/hirael/examples/vendor-comparison-demo"),
  "inventory-matrix-demo": () =>
    import("@/registry/hirael/examples/inventory-matrix-demo"),
  "variant-editor-demo": () =>
    import("@/registry/hirael/examples/variant-editor-demo"),
  "pricing-rules-builder-demo": () =>
    import("@/registry/hirael/examples/pricing-rules-builder-demo"),
  "upload-manager-demo": () =>
    import("@/registry/hirael/examples/upload-manager-demo"),
  "file-explorer-demo": () =>
    import("@/registry/hirael/examples/file-explorer-demo"),
  "asset-manager-demo": () =>
    import("@/registry/hirael/examples/asset-manager-demo"),
  "kanban-board-demo": () =>
    import("@/registry/hirael/examples/kanban-board-demo"),
  "nested-sortable-demo": () =>
    import("@/registry/hirael/examples/nested-sortable-demo"),
  "shipment-tracker-demo": () =>
    import("@/registry/hirael/examples/shipment-tracker-demo"),
  "auction-timeline-demo": () =>
    import("@/registry/hirael/examples/auction-timeline-demo"),
  "review-queue-demo": () =>
    import("@/registry/hirael/examples/review-queue-demo"),
  "role-manager-demo": () =>
    import("@/registry/hirael/examples/role-manager-demo"),
  "feature-flag-manager-demo": () =>
    import("@/registry/hirael/examples/feature-flag-manager-demo"),
  "keyboard-shortcuts-demo": () =>
    import("@/registry/hirael/examples/keyboard-shortcuts-demo"),
  "onboarding-demo": () => import("@/registry/hirael/examples/onboarding-demo"),
  "breadcrumb-generator-demo": () =>
    import("@/registry/hirael/examples/breadcrumb-generator-demo"),
  "advanced-search-bar-demo": () =>
    import("@/registry/hirael/examples/advanced-search-bar-demo"),
  "changelog-viewer-demo": () =>
    import("@/registry/hirael/examples/changelog-viewer-demo"),
  "release-notes-demo": () =>
    import("@/registry/hirael/examples/release-notes-demo"),
};

// React.lazy defers the import until first render, so building every preview
// eagerly at module scope costs nothing and keeps identities stable.
const lazyMap = (
  loaders: Record<string, () => Promise<{ default: React.ComponentType }>>,
) =>
  Object.fromEntries(
    Object.entries(loaders).map(([k, load]) => [k, React.lazy(load)]),
  ) as Record<string, React.LazyExoticComponent<React.ComponentType>>;

const BLOCKS = lazyMap(BLOCK_LOADERS);
const EXAMPLES = lazyMap(EXAMPLE_LOADERS);

function Render({
  Component,
  fallback,
}: {
  Component?: React.LazyExoticComponent<React.ComponentType>;
  fallback: React.ReactNode;
}) {
  if (!Component) return null;
  return (
    <React.Suspense fallback={fallback}>
      <Component />
    </React.Suspense>
  );
}

/** Render one component example by its slug (e.g. `tag-input-demo`). */
export function RegistryExample({
  name,
  fallback = null,
}: {
  name: string;
  fallback?: React.ReactNode;
}) {
  return <Render Component={EXAMPLES[name]} fallback={fallback} />;
}

/**
 * Render the representative preview for an entry: a block/template by its
 * name, or a component's primary (first) example. Used by grids, the theme
 * playground and `/embed/*`.
 */
export function RegistryDemo({
  name,
  fallback = null,
}: {
  name: string;
  fallback?: React.ReactNode;
}) {
  const block = BLOCKS[name];
  if (block) return <Render Component={block} fallback={fallback} />;
  const primary = getExamples(name)[0];
  return (
    <Render
      Component={primary ? EXAMPLES[primary.slug] : undefined}
      fallback={fallback}
    />
  );
}
