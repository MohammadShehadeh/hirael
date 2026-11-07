import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/blocks/env-editor/env-editor';
import * as radix from '@/registry/hirael/bases/radix/blocks/env-editor/env-editor';

const registry = { radix, base };

describe.each(Object.entries(registry))(
  'EnvEditor (%s)',
  (_, { EnvEditor, EnvEditorFooter, EnvEditorTable, parseDotEnv }) => {
    it('should keep escaped quotes inside a double-quoted value', () => {
      expect(parseDotEnv('APP_CONFIG="{\\"region\\":\\"eu\\"}"')).toEqual([
        { key: 'APP_CONFIG', value: '{"region":"eu"}' },
      ]);
    });

    it('should expand \\n and keep a literal backslash in a double-quoted value', () => {
      expect(parseDotEnv('KEY="line one\\nC:\\\\temp\\x"')).toEqual([{ key: 'KEY', value: 'line one\nC:\\temp\\x' }]);
    });

    it('should count a deleted first row as one unsaved change', async () => {
      // No ids, so rows are told apart by the editor's own identity, not by position.
      const rows = ['A', 'B', 'C', 'D', 'E'].map((key) => ({ key: `KEY_${key}`, value: key.toLowerCase() }));
      render(
        <EnvEditor defaultValue={rows}>
          <EnvEditorTable />
          <EnvEditorFooter />
        </EnvEditor>,
      );
      await userEvent.setup().click(screen.getByRole('button', { name: 'Delete KEY_A' }));
      expect(screen.getByText('1 unsaved change')).toBeInTheDocument();
    });

    it('should count an edited value once', async () => {
      const user = userEvent.setup();
      render(
        <EnvEditor
          defaultValue={[
            { key: 'KEY_A', value: 'a' },
            { key: 'KEY_B', value: 'b' },
          ]}
        >
          <EnvEditorTable />
          <EnvEditorFooter />
        </EnvEditor>,
      );
      await user.type(screen.getAllByRole('textbox', { name: 'Value' })[0], 'x');
      expect(screen.getByText('1 unsaved change')).toBeInTheDocument();
    });
  },
);
