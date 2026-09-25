'use client';

import * as React from 'react';

import { lazyDemo, LazyDemo, type DemoModule } from '@/registry/hirael/registry-lazy';
import { DEFAULT_BASE, type RegistryBase } from '@/registry/hirael/registry-meta';

const loadTemplate = (base: RegistryBase, name: string) =>
  import(`./bases/${base}/templates/${name}/${name}`) as Promise<DemoModule>;

export interface RegistryTemplateProps {
  name: string;
  base?: RegistryBase;
  fallback?: React.ReactNode;
}

export const RegistryTemplate = ({ name, base = DEFAULT_BASE, fallback = null }: RegistryTemplateProps) => {
  return (
    <LazyDemo Component={lazyDemo(`${base}:template:${name}`, () => loadTemplate(base, name))} fallback={fallback} />
  );
};
