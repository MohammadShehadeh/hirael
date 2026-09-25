'use client';

import * as React from 'react';

import { lazyDemo, LazyDemo, type DemoModule } from '@/registry/hirael/registry-lazy';
import { DEFAULT_BASE, getExamples, type RegistryBase } from '@/registry/hirael/registry-meta';

// Template-literal `import()`s compile to context modules over `examples/<slug>.tsx`, so an example following
// that layout needs no entry here. Blocks and templates load from their own modules because Next preloads the
// fonts of every chunk a page can reach, and one template import would add every template's fonts to the page.
const loadExample = (base: RegistryBase, slug: string) =>
  import(`./bases/${base}/examples/${slug}`) as Promise<DemoModule>;

export interface RegistryExampleProps {
  name: string;
  base?: RegistryBase;
  fallback?: React.ReactNode;
}

export const RegistryExample = ({ name, base = DEFAULT_BASE, fallback = null }: RegistryExampleProps) => {
  return (
    <LazyDemo Component={lazyDemo(`${base}:example:${name}`, () => loadExample(base, name))} fallback={fallback} />
  );
};

/** A component's first example. */
export const RegistryDemo = ({ name, base = DEFAULT_BASE, fallback = null }: RegistryExampleProps) => {
  const primary = getExamples(name)[0];
  if (!primary) return null;

  return <RegistryExample name={primary.slug} base={base} fallback={fallback} />;
};
