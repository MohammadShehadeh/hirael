import type * as React from 'react';

const setRef = <T>(ref: React.Ref<T> | undefined, node: T | null) => {
  if (typeof ref === 'function') return ref(node);
  if (ref) ref.current = node;
};

/**
 * Fans one node out to several refs: a part's own, plus whatever the consumer
 * passed. Cleanup functions returned by callback refs (React 19) are kept, so
 * a consumer ref that observes the node is torn down instead of called with null.
 */
export const composeRefs =
  <T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> =>
  (node) => {
    const cleanups = refs.map((ref) => setRef(ref, node));
    if (!cleanups.some((cleanup) => typeof cleanup === 'function')) return;
    return () => {
      cleanups.forEach((cleanup, i) => {
        if (typeof cleanup === 'function') cleanup();
        else setRef(refs[i], null);
      });
    };
  };
