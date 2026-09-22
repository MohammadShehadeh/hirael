import type * as React from 'react';

const setRef = <T>(ref: React.Ref<T> | undefined, node: T | null) => {
  if (typeof ref === 'function') return ref(node);
  if (ref) ref.current = node;
};

/** Merges refs, returning React 19 callback-ref cleanups so consumer refs are torn down, not called with null. */
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
