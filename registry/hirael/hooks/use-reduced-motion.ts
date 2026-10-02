import * as React from 'react';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

const subscribe = (onStoreChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener('change', onStoreChange);

  return () => query.removeEventListener('change', onStoreChange);
};

/** Live `prefers-reduced-motion` match. The server and hydration render read `false`. */
export const useReducedMotion = () =>
  React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
