import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/tag-input';
import * as radix from '@/registry/hirael/bases/radix/components/tag-input';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))(
  'TagInput (%s)',
  (_, { TagInput, TagInputContainer, TagInputError, TagInputField, TagInputTags }) => {
    const setup = (props: React.ComponentProps<typeof TagInput> = {}) => {
      const onValueChange = vi.fn();
      render(
        <TagInput onValueChange={onValueChange} {...props}>
          <TagInputContainer>
            <TagInputTags />
            <TagInputField aria-label="Tags" />
          </TagInputContainer>
          <TagInputError />
        </TagInput>,
      );

      return { user: userEvent.setup(), field: screen.getByRole('textbox', { name: 'Tags' }), onValueChange };
    };

    it('should commit a tag on Enter and comma', async () => {
      const { user, field, onValueChange } = setup();
      await user.type(field, 'react{Enter}next,');
      expect(onValueChange).toHaveBeenLastCalledWith(['react', 'next']);
      expect(field).toHaveValue('');
    });

    it('should ignore case-insensitive duplicates', async () => {
      const { user, field, onValueChange } = setup({ defaultValue: ['React'] });
      await user.type(field, 'react{Enter}');
      expect(onValueChange).not.toHaveBeenCalled();
      expect(screen.getAllByText('React')).toHaveLength(1);
    });

    it('should split a pasted list', async () => {
      const { user, field, onValueChange } = setup();
      await user.click(field);
      await user.paste('a, b\nc');
      expect(onValueChange).toHaveBeenLastCalledWith(['a', 'b', 'c']);
    });

    it('should remove the last tag on Backspace with an empty draft', async () => {
      const { user, field, onValueChange } = setup({ defaultValue: ['a', 'b'] });
      await user.type(field, '{Backspace}');
      expect(onValueChange).toHaveBeenLastCalledWith(['a']);
    });

    it('should report the limit through the error slot', async () => {
      const { user, field } = setup({ defaultValue: ['a'], maxTags: 1 });
      await user.type(field, 'b{Enter}');
      expect(screen.getByRole('alert')).toHaveTextContent('Limit 1 tag.');
      expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    it('should not commit on Enter while an IME composition is active', async () => {
      const { user, field, onValueChange } = setup();
      await user.type(field, 'ni');
      fireEvent.keyDown(field, { key: 'Enter', isComposing: true });
      fireEvent.keyDown(field, { key: 'Enter', keyCode: 229 });
      expect(onValueChange).not.toHaveBeenCalled();
      expect(field).toHaveValue('ni');
    });

    it('should forward a consumer ref without breaking container focus', async () => {
      const ref = React.createRef<HTMLInputElement>();
      render(
        <TagInput>
          <TagInputContainer data-testid="container">
            <TagInputField ref={ref} aria-label="Tags" />
          </TagInputContainer>
        </TagInput>,
      );
      const field = screen.getByRole('textbox', { name: 'Tags' });
      expect(ref.current).toBe(field);
      fireEvent.mouseDown(screen.getByTestId('container'));
      expect(field).toHaveFocus();
    });
  },
);
