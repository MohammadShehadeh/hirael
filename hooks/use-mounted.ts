'use client';

import * as React from 'react';

const NEVER_CHANGES = () => () => {};

/**
 * `false` through the server render and hydration, `true` from then on. Gates
 * markup that must hydrate against the static HTML before it can reflect what
 * the visitor's browser actually knows.
 */
export const useMounted = (): boolean =>
  React.useSyncExternalStore(
    NEVER_CHANGES,
    () => true,
    () => false,
  );
