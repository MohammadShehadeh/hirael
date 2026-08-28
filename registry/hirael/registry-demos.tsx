'use client';

import * as React from 'react';

import { DEFAULT_BASE, REGISTRY, getExamples, type RegistryBase } from '@/registry/hirael/registry-meta';

/**
 * Lazy preview registry, derived from the file layout — no hand-kept loader
 * list. Every block/template lives at `<kind>/<name>/<name>.tsx` and every
 * component demo at `examples/<slug>.tsx`, each under `bases/<base>/`, so the
 * import path is computed from the base and the entry's name/category alone.
 *
 * The template-literal `import()`s below compile to bundler context modules
 * over `bases/<base>/{blocks,templates,examples}/`, so adding an item is
 * picked up automatically — the file just has to follow the naming convention
 * (which `pnpm check:registry` enforces). registry-meta.ts stays data-only, so
 * these dynamic imports are what pull component code into the bundle,
 * code-split per preview — a route only loads what it renders.
 */
const loadExample = (base: RegistryBase, slug: string) =>
  import(`./bases/${base}/examples/${slug}`) as Promise<{
    default: React.ComponentType;
  }>;
const loadBlock = (base: RegistryBase, name: string) =>
  import(`./bases/${base}/blocks/${name}/${name}`) as Promise<{
    default: React.ComponentType;
  }>;
const loadTemplate = (base: RegistryBase, name: string) =>
  import(`./bases/${base}/templates/${name}/${name}`) as Promise<{
    default: React.ComponentType;
  }>;

// React.lazy identities must stay stable across renders or the preview
// remounts, so each is built once and cached at module scope by key. A failed
// import (unknown slug/name) resolves to a null component — a blank preview,
// matching the old missing-loader behavior instead of throwing.
const lazyCache = new Map<string, React.LazyExoticComponent<React.ComponentType>>();

const lazyFor = (key: string, load: () => Promise<{ default: React.ComponentType }>) => {
  let Component = lazyCache.get(key);
  if (!Component) {
    Component = React.lazy(() => load().catch(() => ({ default: () => null })));
    lazyCache.set(key, Component);
  }
  return Component;
};

const Render = ({
  Component,
  fallback,
}: {
  Component?: React.LazyExoticComponent<React.ComponentType>;
  fallback: React.ReactNode;
}) => {
  if (!Component) return null;
  return (
    <React.Suspense fallback={fallback}>
      <Component />
    </React.Suspense>
  );
};

/**
 * Render one component example by its slug (e.g. `tag-input-demo`) from the
 * given base's tree.
 */
export const RegistryExample = ({
  name,
  base = DEFAULT_BASE,
  fallback = null,
}: {
  name: string;
  base?: RegistryBase;
  fallback?: React.ReactNode;
}) => {
  return <Render Component={lazyFor(`${base}:example:${name}`, () => loadExample(base, name))} fallback={fallback} />;
};

/**
 * Render the representative preview for an entry: a block/template by its
 * name, or a component's primary (first) example. Used by grids, the theme
 * playground and `/embed/*`.
 */
export const RegistryDemo = ({
  name,
  base = DEFAULT_BASE,
  fallback = null,
}: {
  name: string;
  base?: RegistryBase;
  fallback?: React.ReactNode;
}) => {
  const entry = REGISTRY.find((e) => e.name === name);

  if (entry?.category === 'blocks') {
    return <Render Component={lazyFor(`${base}:block:${name}`, () => loadBlock(base, name))} fallback={fallback} />;
  }
  if (entry?.category === 'templates') {
    return (
      <Render Component={lazyFor(`${base}:template:${name}`, () => loadTemplate(base, name))} fallback={fallback} />
    );
  }

  const primary = getExamples(name)[0];
  if (!primary) return null;
  return (
    <Render
      Component={lazyFor(`${base}:example:${primary.slug}`, () => loadExample(base, primary.slug))}
      fallback={fallback}
    />
  );
};
