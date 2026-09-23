'use client';

import * as React from 'react';

import { DEFAULT_BASE, REGISTRY, getExamples, type RegistryBase } from '@/registry/hirael/registry-meta';

// Template-literal `import()`s compile to context modules over `<kind>/<name>/<name>.tsx` and
// `examples/<slug>.tsx`, so an item following that layout needs no entry here.
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

// Cached at module scope: a new React.lazy identity per render would remount the preview.
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
