'use client';

import * as React from 'react';

const NEVER_CHANGES = () => () => {};

/** False until after hydration, so browser-only markup matches the server HTML first. */
export const useMounted = (): boolean =>
  React.useSyncExternalStore(
    NEVER_CHANGES,
    () => true,
    () => false,
  );
