import * as React from 'react';

/**
 * Live match for a CSS media query, like `(min-width: 768px)`. The server and
 * hydration render read `serverValue`, so markup never mismatches; the real
 * match takes over right after.
 */
export const useMediaQuery = (query: string, serverValue = false) => {
  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onStoreChange);

      return () => list.removeEventListener('change', onStoreChange);
    },
    [query],
  );

  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
};
