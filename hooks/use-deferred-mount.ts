'use client';

import * as React from 'react';

let isSettled = false;
let isScheduled = false;
const listeners = new Set<() => void>();

const settle = () => {
  isSettled = true;
  for (const listener of listeners) listener();
  listeners.clear();
};

// Safari has no requestIdleCallback.
const whenIdle = () => {
  if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(settle, { timeout: 2000 });
  else window.setTimeout(settle, 200);
};

const subscribeSettled = (onChange: () => void) => {
  if (isSettled) return () => {};
  listeners.add(onChange);
  if (!isScheduled) {
    isScheduled = true;
    if (document.readyState === 'complete') whenIdle();
    else window.addEventListener('load', whenIdle, { once: true });
  }

  return () => {
    listeners.delete(onChange);
  };
};

/** True once the window has loaded and the main thread has had an idle moment. Shared by every caller. */
const usePageSettled = () =>
  React.useSyncExternalStore(
    subscribeSettled,
    () => isSettled,
    () => false,
  );

export interface DeferredMountOptions {
  /** Mount right away, including in the server HTML. */
  eager?: boolean;
  rootMargin?: string;
}

/**
 * Holds back heavy content (a preview iframe boots a whole app on the page's main thread) until the page has
 * loaded and the element is near the viewport. Stays true once reached, so scrolling away doesn't reload it.
 */
export const useDeferredMount = (
  ref: React.RefObject<Element | null>,
  { eager = false, rootMargin = '200px' }: DeferredMountOptions = {},
): boolean => {
  const isPageSettled = usePageSettled();
  const [isNear, setIsNear] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (eager || isNear || !el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsNear(true);
      },
      { rootMargin },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [ref, eager, isNear, rootMargin]);

  return eager || (isPageSettled && isNear);
};
