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
  "faq-01": () => import("@/registry/hirael/blocks/faq-01/faq-01"),
  "faq-02": () => import("@/registry/hirael/blocks/faq-02/faq-02"),
  "faq-03": () => import("@/registry/hirael/blocks/faq-03/faq-03"),
  "login-01": () => import("@/registry/hirael/blocks/login-01/login-01"),
  "login-02": () => import("@/registry/hirael/blocks/login-02/login-02"),
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
  "ecommerce-01": () => import("@/registry/hirael/blocks/ecommerce-01/ecommerce-01"),
  "ecommerce-02": () => import("@/registry/hirael/blocks/ecommerce-02/ecommerce-02"),
  "integrations-01": () => import("@/registry/hirael/blocks/integrations-01/integrations-01"),
  "image-gallery-01": () => import("@/registry/hirael/blocks/image-gallery-01/image-gallery-01"),
  "app-shell-01": () => import("@/registry/hirael/blocks/app-shell-01/app-shell-01"),
  "app-shell-02": () => import("@/registry/hirael/blocks/app-shell-02/app-shell-02"),
  "spinner": () => import("@/registry/hirael/spinner/spinner.demo"),
  "copy-button": () => import("@/registry/hirael/copy-button/copy-button.demo"),
  "marquee": () => import("@/registry/hirael/marquee/marquee.demo"),
  "tree-view": () => import("@/registry/hirael/tree-view/tree-view.demo"),
  "animated-number": () => import("@/registry/hirael/animated-number/animated-number.demo"),
  "stepper": () => import("@/registry/hirael/stepper/stepper.demo"),
}

const cache = new Map<string, React.LazyExoticComponent<React.ComponentType>>()

function getLazy(name: string) {
  let c = cache.get(name)
  if (!c) {
    const load = DEMO_LOADERS[name]
    if (!load) return null
    c = React.lazy(load)
    cache.set(name, c)
  }
  return c
}

export function RegistryDemo({
  name,
  fallback = null,
}: {
  name: string
  fallback?: React.ReactNode
}) {
  const Demo = getLazy(name)
  if (!Demo) return null
  return (
    <React.Suspense fallback={fallback}>
      <Demo />
    </React.Suspense>
  )
}
