import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/description-list';
import * as radix from '@/registry/hirael/bases/radix/components/description-list';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))(
  'DescriptionList (%s)',
  (_, { DescriptionList, DescriptionListDetails, DescriptionListItem, DescriptionListTerm }) => {
    it('should pair each term with its value in a description list', () => {
      render(
        <DescriptionList>
          <DescriptionListItem>
            <DescriptionListTerm>Status</DescriptionListTerm>
            <DescriptionListDetails>Active</DescriptionListDetails>
          </DescriptionListItem>
        </DescriptionList>,
      );
      expect(screen.getByRole('term')).toHaveTextContent('Status');
      expect(screen.getByRole('definition')).toHaveTextContent('Active');
    });

    it('should mark the layout for styling', () => {
      const { container } = render(<DescriptionList orientation="vertical" divided />);
      const list = container.querySelector('[data-slot="description-list"]');
      expect(list).toHaveAttribute('data-orientation', 'vertical');
      expect(list).toHaveAttribute('data-divided');
    });
  },
);
