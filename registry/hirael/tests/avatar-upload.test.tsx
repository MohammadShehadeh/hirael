import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/avatar-upload';
import * as radix from '@/registry/hirael/bases/radix/components/avatar-upload';

const registry = {
  radix,
  base,
};

const image = (name: string) => new File(['x'], name, { type: 'image/png' });

// Drops on the dropzone root the way a browser does, so react-dropzone reads the files from dataTransfer.
const drop = (container: HTMLElement, files: File[]) => {
  const root = container.querySelector('[data-slot="avatar-upload"]');
  if (!root) throw new Error('AvatarUpload root not found');
  fireEvent.drop(root, {
    dataTransfer: {
      files,
      items: files.map((file) => ({ kind: 'file', type: file.type, getAsFile: () => file })),
      types: ['Files'],
    },
  });
};

describe.each(Object.entries(registry))('AvatarUpload (%s)', (_, { AvatarUpload }) => {
  it('should use the first image of a multi-file drop without reporting an error', async () => {
    const onError = vi.fn();
    const onValueChange = vi.fn();
    const { container } = render(<AvatarUpload crop={false} onError={onError} onValueChange={onValueChange} />);

    drop(container, [image('a.png'), image('b.png')]);

    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith(expect.stringMatching(/^data:image\/png/)));
    expect(onError).not.toHaveBeenCalled();
  });

  it('should still report a file that is not an image', async () => {
    const onError = vi.fn();
    const { container } = render(<AvatarUpload crop={false} onError={onError} />);

    drop(container, [new File(['x'], 'notes.txt', { type: 'text/plain' })]);

    await waitFor(() => expect(onError).toHaveBeenCalledWith(expect.objectContaining({ reason: 'type' })));
  });
});
