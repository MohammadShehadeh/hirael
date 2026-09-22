'use client';

import * as React from 'react';
import { DirectionProvider as BaseDirectionProvider } from '@base-ui/react/direction-provider';

import { DemoLocaleProvider } from '@/lib/demo-locale';
import { DirectionProvider } from '@/registry/hirael/bases/radix/ui/direction';

// Direction is set before paint and does not change, so there is nothing to subscribe to.
const subscribe = () => () => {};

export interface EmbedDirectionProps {
  children: React.ReactNode;
}

/**
 * Radix and Base UI ignore `dir` on the document and follow their own providers.
 * The server render is always left to right, so the demo remounts once direction is known.
 */
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
