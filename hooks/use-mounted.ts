'use client';

import * as React from 'react';

import { subscribeNever } from '@/lib/subscribe-never';

/** False until after hydration, so browser-only markup matches the server HTML first. */
export const useMounted = (): boolean =>
  React.useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
