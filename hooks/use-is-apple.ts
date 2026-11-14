'use client';

import * as React from 'react';

import { subscribeNever } from '@/lib/subscribe-never';

export const useIsApple = (): boolean =>
  React.useSyncExternalStore(
    subscribeNever,
    () => /mac|iphone|ipad|ipod/i.test(navigator.userAgent),
    () => false,
  );
