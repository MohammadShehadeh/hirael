"use client";

import * as React from "react";

import { REGISTRY, getExamples } from "@/registry/hirael/registry-meta";

/**
 * Lazy preview registry, derived from the file layout — no hand-kept loader
 * list. Every block/template lives at `<kind>/<name>/<name>.tsx` and every
 * component demo at `examples/<slug>.tsx`, so the import path is computed from
 * the entry's name/category alone.
 *
 * The template-literal `import()`s below compile to bundler context modules
 * over `blocks/`, `templates/` and `examples/`, so adding an item is picked up
 * automatically — the file just has to follow the naming convention (which
 * `pnpm check:registry` enforces). registry-meta.ts stays data-only, so these
 * dynamic imports are what pull component code into the bundle, code-split per
 * preview — a route only loads what it renders.
 */
const loadExample = (slug: string) =>
  import(`./examples/${slug}`) as Promise<{ default: React.ComponentType }>;
const loadBlock = (name: string) =>
  import(`./blocks/${name}/${name}`) as Promise<{
    default: React.ComponentType;
  }>;
const loadTemplate = (name: string) =>
  import(`./templates/${name}/${name}`) as Promise<{
    default: React.ComponentType;
  }>;

// React.lazy identities must stay stable across renders or the preview
// remounts, so each is built once and cached at module scope by key. A failed
// import (unknown slug/name) resolves to a null component — a blank preview,
// matching the old missing-loader behavior instead of throwing.
const lazyCache = new Map<
  string,
  React.LazyExoticComponent<React.ComponentType>
>();

const lazyFor = (
  key: string,
  load: () => Promise<{ default: React.ComponentType }>,
) => {
  let Component = lazyCache.get(key);
  if (!Component) {
    Component = React.lazy(() =>
      load().catch(() => ({ default: () => null })),
    );
    lazyCache.set(key, Component);
  }
  return Component;
};

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
  return (
    <Render
      Component={lazyFor(`example:${name}`, () => loadExample(name))}
      fallback={fallback}
    />
  );
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
  const entry = REGISTRY.find((e) => e.name === name);

  if (entry?.category === "blocks") {
    return (
      <Render
        Component={lazyFor(`block:${name}`, () => loadBlock(name))}
        fallback={fallback}
      />
    );
  }
  if (entry?.category === "templates") {
    return (
      <Render
        Component={lazyFor(`template:${name}`, () => loadTemplate(name))}
        fallback={fallback}
      />
    );
  }

  const primary = getExamples(name)[0];
  if (!primary) return null;
  return (
    <Render
      Component={lazyFor(`example:${primary.slug}`, () =>
        loadExample(primary.slug),
      )}
      fallback={fallback}
    />
  );
}
