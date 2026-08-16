"use client";

import * as React from "react";

const DEFAULT_BREAKPOINT = 1024;

export function useIsBreakpoint({ breakpoint = DEFAULT_BREAKPOINT }: { breakpoint?: number } = {}) {
  const [isBreakpoint, setIsBreakpoint] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => setIsBreakpoint(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return !!isBreakpoint;
}
