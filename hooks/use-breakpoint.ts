'use client';

import * as React from 'react';

const DEFAULT_BREAKPOINT = 1024;

export interface UseIsBreakpointOptions {
  breakpoint?: number;
}

export function useIsBreakpoint({ breakpoint = DEFAULT_BREAKPOINT }: UseIsBreakpointOptions = {}) {
  const [isBreakpoint, setIsBreakpoint] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handleChange = () => setIsBreakpoint(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [breakpoint]);

  return !!isBreakpoint;
}
