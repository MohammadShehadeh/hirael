import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/upload-queue';
import * as radix from '@/registry/hirael/bases/radix/components/upload-queue';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))('useUploadQueue (%s)', (_, { useUploadQueue }) => {
  // Ignores the abort signal, like an SDK without abort support, so every attempt settles on its own.
  const deferredUpload = () => {
    const settle: (() => void)[] = [];
    const upload = () => new Promise<void>((resolve) => settle.push(resolve));

    return { upload, settle };
  };

  it('should keep a canceled retry canceled when an earlier attempt settles late', async () => {
    const { upload, settle } = deferredUpload();
    const { result } = renderHook(() => useUploadQueue({ upload }));
    act(() => result.current.add([new File(['x'], 'a.txt')]));
    const { id } = result.current.items[0];

    act(() => result.current.cancel(id));
    act(() => result.current.retry(id));
    await act(async () => settle[0]());
    act(() => result.current.cancel(id));
    await act(async () => settle[1]());

    expect(result.current.items[0].status).toBe('canceled');
  });

  it('should mark an upload done when it settles without being canceled', async () => {
    const { upload, settle } = deferredUpload();
    const { result } = renderHook(() => useUploadQueue({ upload }));
    act(() => result.current.add([new File(['x'], 'a.txt')]));

    await act(async () => settle[0]());

    expect(result.current.items[0]).toMatchObject({ status: 'done', progress: 100 });
  });
});
