import * as React from 'react';

export interface DemoModule {
  default: React.ComponentType;
}

type LazyDemoComponent = React.LazyExoticComponent<React.ComponentType>;

// Cached at module scope: a new React.lazy identity per render would remount the preview.
const lazyCache = new Map<string, LazyDemoComponent>();

export const lazyDemo = (key: string, load: () => Promise<DemoModule>) => {
  let Component = lazyCache.get(key);
  if (!Component) {
    Component = React.lazy(() => load().catch(() => ({ default: () => null })));
    lazyCache.set(key, Component);
  }

  return Component;
};

export interface LazyDemoProps {
  Component?: LazyDemoComponent;
  fallback: React.ReactNode;
}

export const LazyDemo = ({ Component, fallback }: LazyDemoProps) => {
  if (!Component) return null;

  return (
    <React.Suspense fallback={fallback}>
      <Component />
    </React.Suspense>
  );
};
