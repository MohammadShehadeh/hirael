'use client';

import * as React from 'react';

const NEVER_CHANGES = () => () => {};

/** True on Apple platforms, so a shortcut hint can read ⌘ rather than Ctrl. */
export const useIsApple = (): boolean =>
  React.useSyncExternalStore(
    NEVER_CHANGES,
    () => /mac|iphone|ipad|ipod/i.test(navigator.userAgent),
    () => false,
  );
