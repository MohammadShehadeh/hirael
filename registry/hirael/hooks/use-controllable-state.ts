import * as React from 'react';

interface UseControllableStateParams<T> {
  /** The controlled value. `undefined` hands control to the internal state. */
  prop: T | undefined;
  /** Starting value while uncontrolled. */
  defaultProp: T;
  // Method syntax keeps the parameter bivariant, so a handler typed for the non-empty value still fits.
  /** Fires on every change, controlled or not. */
  onChange?(value: T): void;
}

/** A value that is either controlled through `prop` or kept internally, with one setter for both. */
export const useControllableState = <T>({ prop, defaultProp, onChange }: UseControllableStateParams<T>) => {
  const [uncontrolled, setUncontrolled] = React.useState(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolled;

  // Read through a ref so an inline `onChange` doesn't give the setter a new identity every render,
  // which would defeat the memoized context values built on it.
  const onChangeRef = React.useRef(onChange);
  React.useLayoutEffect(() => {
    onChangeRef.current = onChange;
  });

  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) setUncontrolled(next);
      onChangeRef.current?.(next);
    },
    [isControlled],
  );

  return [value, setValue] as const;
};
