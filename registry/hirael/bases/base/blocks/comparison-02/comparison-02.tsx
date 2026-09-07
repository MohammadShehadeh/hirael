import { Check, Minus } from 'lucide-react';

import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { cn } from '@/lib/utils';

type Cell = boolean | string;

interface Column {
  name: string;
  summary: string;
  featured?: boolean;
}

const COLUMNS: readonly Column[] = [
  { name: 'Build it yourself', summary: 'Full control, and every hour of it is yours' },
  { name: 'Hirael', summary: 'The source lands in your repo and stays there', featured: true },
  { name: 'Component library', summary: 'Fast to add, harder to bend later' },
];

const ROWS: readonly { label: string; cells: readonly [Cell, Cell, Cell] }[] = [
  { label: 'You own the source', cells: [true, true, false] },
  { label: 'Ships without a runtime dependency', cells: [true, true, false] },
  { label: 'Time to a working combobox', cells: ['Two days', 'One command', 'One command'] },
  { label: 'Restyle without fighting internals', cells: [true, true, false] },
  { label: 'Right-to-left handled out of the box', cells: [false, true, 'Sometimes'] },
  { label: 'Light and dark both designed, not derived', cells: [false, true, 'Sometimes'] },
  { label: 'Upgrades arrive on someone else’s schedule', cells: [false, false, true] },
];

const CellValue = ({ value }: { value: Cell }) => {
  if (typeof value === 'string') {
    return <span className="text-sm text-muted-foreground">{value}</span>;
  }
  return value ? (
    <>
      <Check aria-hidden className="size-4 text-foreground" />
      <span className="sr-only">Yes</span>
    </>
  ) : (
    <>
      <Minus aria-hidden className="size-4 text-muted-foreground/50" />
      <span className="sr-only">No</span>
    </>
  );
};

const Comparison02 = () => {
  return (
    <section className="bg-background py-20 sm:py-28" aria-labelledby="comparison-02-heading">
      <div className="container w-full max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="comparison-02-heading" className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
            Three ways to get a date range picker
          </h2>
          <p className="mt-4 text-muted-foreground">
            Only one of them leaves you with code you can read on a Friday afternoon and change on a Monday morning.
          </p>
        </div>

        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[42rem] border-collapse text-start">
            <caption className="sr-only">Comparing three ways to add a component to a project</caption>
            <thead>
              <tr>
                <th scope="col" className="w-1/3 p-4 text-start align-bottom">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    Approach
                  </span>
                </th>
                {COLUMNS.map((column) => (
                  <th
                    key={column.name}
                    scope="col"
                    className={cn(
                      'p-4 text-start align-bottom',
                      column.featured && 'rounded-t-md border border-b-0 border-border bg-card',
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base font-medium">{column.name}</span>
                      {column.featured && (
                        <Badge variant="secondary" className="font-mono text-[10px] uppercase tracking-[0.1em]">
                          This one
                        </Badge>
                      )}
                    </span>
                    <span className="mt-1 block text-sm font-normal text-muted-foreground">{column.summary}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label} className="border-t border-border">
                  <th scope="row" className="p-4 text-start text-sm font-normal">
                    {row.label}
                  </th>
                  {row.cells.map((cell, index) => (
                    <td
                      key={COLUMNS[index].name}
                      className={cn('p-4 align-middle', COLUMNS[index].featured && 'border-x border-border bg-card')}
                    >
                      <span className="flex items-center">
                        <CellValue value={cell} />
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-border">
                <td />
                {COLUMNS.map((column) => (
                  <td
                    key={column.name}
                    className={cn('p-4', column.featured && 'rounded-b-md border-x border-b border-border bg-card')}
                  >
                    {column.featured && (
                      <Button size="sm" className="w-full">
                        Browse the registry
                      </Button>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Comparison02;
