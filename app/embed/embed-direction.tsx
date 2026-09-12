'use client';

import * as React from 'react';
import { DirectionProvider as BaseDirectionProvider } from '@base-ui/react/direction-provider';

import { DemoLocaleProvider } from '@/lib/demo-locale';
import { DirectionProvider } from '@/registry/hirael/bases/radix/ui/direction';

const subscribe = () => () => {};

/**
 * `?dir=rtl` lands on `<html>` before paint, but Radix and Base UI read direction from their own context and fall
 * back to LTR, which pins anchored content and roving focus the wrong way round. Feeding both contexts here keeps
 * every framed preview mirrored without each block having to opt in. The demo locale follows the same flag so
 * `useT()` strings switch to Arabic in framed component examples, as they did inline. The flag is `false` for the
 * server render and flips after hydration, so the subtree is keyed on it: demos that seed state or memoize
 * children at mount re-seed instead of keeping their English first render.
 */
export interface EmbedDirectionProps {
  children: React.ReactNode;
}

export const EmbedDirection = ({ children }: EmbedDirectionProps) => {
  const isRtl = React.useSyncExternalStore(
    subscribe,
    () => document.documentElement.getAttribute('dir') === 'rtl',
    () => false,
  );
  const dir = isRtl ? 'rtl' : 'ltr';

  return (
    <DirectionProvider dir={dir}>
      <BaseDirectionProvider direction={dir}>
        <DemoLocaleProvider key={dir} locale={isRtl ? 'ar' : 'en'}>
          {children}
        </DemoLocaleProvider>
      </BaseDirectionProvider>
    </DirectionProvider>
  );
};
