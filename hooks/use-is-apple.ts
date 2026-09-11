'use client';

import * as React from 'react';

const NEVER_CHANGES = () => () => {};

export const useIsApple = (): boolean =>
  React.useSyncExternalStore(
    NEVER_CHANGES,
    () => /mac|iphone|ipad|ipod/i.test(navigator.userAgent),
    () => false,
  );
