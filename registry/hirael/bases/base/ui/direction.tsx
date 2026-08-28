'use client';

import * as React from 'react';
import { DirectionProvider as DirectionProviderPrimitive, useDirection } from '@base-ui/react/direction-provider';

function DirectionProvider({
  dir,
  direction,
  children,
}: DirectionProviderPrimitive.Props & {
  /** Radix-compatible alias of `direction`. */
  dir?: DirectionProviderPrimitive.Props['direction'];
}) {
  return <DirectionProviderPrimitive direction={direction ?? dir}>{children}</DirectionProviderPrimitive>;
}

export { DirectionProvider, useDirection };
