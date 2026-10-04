import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDebouncedCallback, useDebouncedValue } from '@/registry/hirael/hooks/use-debounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should hold a value back until it stops changing', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'a' },
    });
    rerender({ value: 'ab' });
    act(() => vi.advanceTimersByTime(200));
    rerender({ value: 'abc' });
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe('a');
    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe('abc');
  });

  it('should call once with the latest arguments', () => {
    const spy = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(spy, 300));
    result.current(1);
    result.current(2);
    vi.advanceTimersByTime(300);
    expect(spy).toHaveBeenCalledExactlyOnceWith(2);
  });

  it('should run now on flush and never on cancel', () => {
    const spy = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(spy, 300));
    result.current('flushed');
    result.current.flush();
    expect(spy).toHaveBeenCalledExactlyOnceWith('flushed');
    result.current('canceled');
    result.current.cancel();
    vi.advanceTimersByTime(300);
    expect(spy).toHaveBeenCalledOnce();
  });

  it('should keep the same function across renders', () => {
    const { result, rerender } = renderHook(({ fn }) => useDebouncedCallback(fn, 300), {
      initialProps: { fn: () => {} },
    });
    const first = result.current;
    rerender({ fn: () => {} });
    expect(result.current).toBe(first);
  });
});
