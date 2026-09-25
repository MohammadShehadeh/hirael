'use client';

import * as React from 'react';

import { lazyDemo, LazyDemo, type DemoModule } from '@/registry/hirael/registry-lazy';
import { DEFAULT_BASE, type RegistryBase } from '@/registry/hirael/registry-meta';

const loadBlock = (base: RegistryBase, name: string) =>
  import(`./bases/${base}/blocks/${name}/${name}`) as Promise<DemoModule>;

export interface RegistryBlockProps {
  name: string;
  base?: RegistryBase;
  fallback?: React.ReactNode;
}

export const RegistryBlock = ({ name, base = DEFAULT_BASE, fallback = null }: RegistryBlockProps) => {
  return <LazyDemo Component={lazyDemo(`${base}:block:${name}`, () => loadBlock(base, name))} fallback={fallback} />;
};
