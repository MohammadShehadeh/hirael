import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/toc';
import * as radix from '@/registry/hirael/bases/radix/components/toc';

const registry = {
  radix,
  base,
};

// The jsdom viewport is 768px tall, so the activation line sits at 192px.
const TOPS: Record<string, number> = { intro: -300, setup: 60, usage: 150, api: 500 };
const IDS = Object.keys(TOPS);

const Headings = () => (
  <>
    {IDS.map((id) => (
      <h2 key={id} id={id}>
        {id}
      </h2>
    ))}
  </>
);

describe.each(Object.entries(registry))(
  'TableOfContents (%s)',
  (_, { TableOfContents, TableOfContentsList, TableOfContentsLink }) => {
    beforeEach(() => {
      vi.spyOn(window, 'scrollY', 'get').mockReturnValue(500);
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
        return DOMRect.fromRect({ x: 0, y: TOPS[this.id] ?? 0, width: 100, height: 32 });
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should activate the last heading above the activation line', () => {
      render(
        <>
          <Headings />
          <TableOfContents items={IDS.map((id) => ({ id, text: id, level: 2 }))} />
        </>,
      );
      expect(screen.getByRole('link', { name: 'usage' })).toHaveAttribute('aria-current', 'location');
      expect(screen.getByRole('link', { name: 'setup' })).not.toHaveAttribute('aria-current');
    });

    it('should track the active heading in the compound form', () => {
      render(
        <>
          <Headings />
          <TableOfContents>
            <TableOfContentsList>
              {IDS.map((id) => (
                <li key={id}>
                  <TableOfContentsLink href={`#${id}`}>{id}</TableOfContentsLink>
                </li>
              ))}
            </TableOfContentsList>
          </TableOfContents>
        </>,
      );
      expect(screen.getByRole('link', { name: 'usage' })).toHaveAttribute('aria-current', 'location');
    });

    it('should name the nav from a string label', () => {
      render(<TableOfContents items={[{ id: 'intro', text: 'intro', level: 2 }]} label="Contents" />);
      expect(screen.getByRole('navigation', { name: 'Contents' })).toBeInTheDocument();
    });
  },
);
