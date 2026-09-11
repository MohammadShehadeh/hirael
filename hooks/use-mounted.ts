'use client';

import * as React from 'react';

const NEVER_CHANGES = () => () => {};

/** `false` through the server render and hydration, `true` after, so browser-dependent markup hydrates against the static HTML first. */
export const useMounted = (): boolean =>
  React.useSyncExternalStore(
    NEVER_CHANGES,
    () => true,
    () => false,
  );
