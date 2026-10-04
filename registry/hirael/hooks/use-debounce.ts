import * as React from 'react';

/** `value`, held back until it has stopped changing for `delay` milliseconds. */
export const useDebouncedValue = <T>(value: T, delay = 300) => {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);

    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
};

export interface DebouncedCallback<Args extends unknown[]> {
  (...args: Args): void;
  /** Drops the pending call. */
  cancel: () => void;
  /** Runs the pending call now instead of waiting. */
  flush: () => void;
}

/**
 * A stable function that runs `callback` once calls stop for `delay`
 * milliseconds. Always calls the latest `callback`, so it never needs to be
 * recreated, and drops a pending call on unmount.
 */
export const useDebouncedCallback = <Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay = 300,
): DebouncedCallback<Args> => {
  const callbackRef = React.useRef(callback);
  const timerRef = React.useRef<number | undefined>(undefined);
  const pendingRef = React.useRef<Args | null>(null);

  React.useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  React.useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return React.useMemo(() => {
    const flush = () => {
      window.clearTimeout(timerRef.current);
      const args = pendingRef.current;
      pendingRef.current = null;
      if (args) callbackRef.current(...args);
    };
    const cancel = () => {
      window.clearTimeout(timerRef.current);
      pendingRef.current = null;
    };
    const debounced = ((...args: Args) => {
      pendingRef.current = args;
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(flush, delay);
    }) as DebouncedCallback<Args>;
    debounced.cancel = cancel;
    debounced.flush = flush;

    return debounced;
  }, [delay]);
};
