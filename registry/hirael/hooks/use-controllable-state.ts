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

  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [value, setValue] as const;
};
