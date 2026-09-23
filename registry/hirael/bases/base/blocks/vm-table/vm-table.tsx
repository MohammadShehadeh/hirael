'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/base/ui/toggle-group';

export type VmState = 'running' | 'stopped' | 'starting' | 'stopping' | 'error' | 'suspended';

const vmStateMeta: Record<VmState, { dot: string; text: string; label: string; live?: boolean }> = {
  running: { dot: 'bg-success', text: 'text-success', label: 'Running' },
  stopped: {
    dot: 'bg-muted-foreground',
    text: 'text-muted-foreground',
    label: 'Stopped',
  },
  starting: {
    dot: 'bg-info',
    text: 'text-info',
    label: 'Starting',
    live: true,
  },
  stopping: {
    dot: 'bg-warning',
    text: 'text-warning',
    label: 'Stopping',
    live: true,
  },
  error: { dot: 'bg-destructive', text: 'text-destructive', label: 'Error' },
  suspended: {
    dot: 'bg-muted-foreground',
    text: 'text-muted-foreground',
    label: 'Suspended',
  },
};

interface VmTableProps extends React.ComponentProps<'table'> {
  caption?: React.ReactNode;
}

const VmTable = ({ className, caption, children, ...props }: VmTableProps) => {
  return (
    <div data-slot="vm-table-container" className="w-full overflow-x-auto rounded-lg border border-border">
      <table data-slot="vm-table" className={cn('w-full caption-bottom text-sm', className)} {...props}>
        {caption ? <caption className="p-3 text-xs text-muted-foreground">{caption}</caption> : null}
        {children}
      </table>
    </div>
  );
};

const VmTableHeader = ({ className, ...props }: React.ComponentProps<'thead'>) => {
  return (
    <thead
      data-slot="vm-table-header"
      className={cn('border-b border-border bg-muted/40 text-muted-foreground', className)}
      {...props}
    />
  );
};

const VmTableHead = ({ className, ...props }: React.ComponentProps<'th'>) => {
  return (
    <th
      data-slot="vm-table-head"
      className={cn('h-9 px-3 text-start align-middle font-medium whitespace-nowrap', 'text-xs uppercase', className)}
      {...props}
    />
  );
};

const VmTableBody = ({ className, ...props }: React.ComponentProps<'tbody'>) => {
  return <tbody data-slot="vm-table-body" className={cn('divide-y divide-border', className)} {...props} />;
};

const VmTableRow = ({ className, ...props }: React.ComponentProps<'tr'>) => {
  return <tr data-slot="vm-table-row" className={cn('transition-colors hover:bg-muted/40', className)} {...props} />;
};

const VmTableCell = ({ className, ...props }: React.ComponentProps<'td'>) => {
  return (
    <td data-slot="vm-table-cell" className={cn('px-3 py-2.5 align-middle whitespace-nowrap', className)} {...props} />
  );
};

interface VmTableNameProps extends Omit<React.ComponentProps<'td'>, 'id'> {
  id?: React.ReactNode;
}

const VmTableName = ({ id, className, children, ...props }: VmTableNameProps) => {
  return (
    <td data-slot="vm-table-name" className={cn('px-3 py-2.5 align-middle', className)} {...props}>
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{children}</span>
        {id ? <span className="text-xs text-muted-foreground">{id}</span> : null}
      </div>
    </td>
  );
};

interface VmStatusProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  state: VmState;
  children?: React.ReactNode;
}

const VmStatus = ({ state, className, children, ...props }: VmStatusProps) => {
  const meta = vmStateMeta[state];
  return (
    <span
      data-slot="vm-status"
      data-state={state}
      className={cn('inline-flex items-center gap-1.5 text-xs font-medium', meta.text, className)}
      {...props}
    >
      <span className="relative flex size-2">
        {meta.live ? (
          <span
            className={cn(
              'absolute inline-flex size-full animate-ping rounded-full opacity-75 motion-reduce:animate-none',
              meta.dot,
            )}
            aria-hidden
          />
        ) : null}
        <span className={cn('relative inline-flex size-2 rounded-full', meta.dot)} aria-hidden />
      </span>
      {children ?? meta.label}
    </span>
  );
};

export { VmTable, VmTableHeader, VmTableHead, VmTableBody, VmTableRow, VmTableCell, VmTableName, VmStatus };

const ENTER =
  'animate-in fade-in slide-in-from-bottom-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-1 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

type VmRow = {
  name: string;
  id: string;
  state: VmState;
  size: string;
  region: string;
  ip: string | null;
  uptime: string | null;
};

const VM_ROWS: VmRow[] = [
  {
    name: 'web-prod-01',
    id: 'i-0a1b2c3d',
    state: 'running',
    size: 'c6i.2xlarge',
    region: 'us-east-1',
    ip: '10.0.1.24',
    uptime: '42d',
  },
  {
    name: 'worker-prod-02',
    id: 'i-0e4f5a6b',
    state: 'running',
    size: 'c6i.xlarge',
    region: 'us-east-1',
    ip: '10.0.1.51',
    uptime: '42d',
  },
  {
    name: 'batch-runner-07',
    id: 'i-0c7d8e9f',
    state: 'starting',
    size: 'm6i.large',
    region: 'eu-west-2',
    ip: '10.1.2.13',
    uptime: null,
  },
  {
    name: 'db-replica-03',
    id: 'i-0b3c4d5e',
    state: 'error',
    size: 'r6i.4xlarge',
    region: 'eu-west-2',
    ip: '10.1.2.44',
    uptime: null,
  },
  {
    name: 'sandbox-14',
    id: 'i-0f6a7b8c',
    state: 'stopped',
    size: 't3.medium',
    region: 'ap-south-1',
    ip: null,
    uptime: null,
  },
  {
    name: 'staging-api-02',
    id: 'i-0d9e1f2a',
    state: 'suspended',
    size: 't3.large',
    region: 'ap-south-1',
    ip: null,
    uptime: null,
  },
];

const VM_FILTERS: { value: string; label: string; states: VmState[] }[] = [
  { value: 'all', label: 'All', states: ['running', 'starting', 'stopping', 'error', 'stopped', 'suspended'] },
  { value: 'running', label: 'Running', states: ['running'] },
  { value: 'pending', label: 'Pending', states: ['starting', 'stopping'] },
  { value: 'stopped', label: 'Stopped', states: ['stopped', 'suspended'] },
  { value: 'error', label: 'Error', states: ['error'] },
];

interface MutedValueProps {
  value: string | null;
}

const MutedValue = ({ value }: MutedValueProps) => value ?? <span className="text-muted-foreground/60">None</span>;

const VmTableBlock = () => {
  const [rows, setRows] = React.useState(VM_ROWS);
  const [filter, setFilter] = React.useState('all');
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  React.useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const activeFilter = VM_FILTERS.find((option) => option.value === filter) ?? VM_FILTERS[0];
  const visibleRows = rows.filter((row) => activeFilter.states.includes(row.state));
  const regionCount = new Set(rows.map((row) => row.region)).size;

  const setRowState = (id: string, patch: Partial<VmRow>) =>
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  const restart = (id: string) => {
    setRowState(id, { state: 'starting' });
    timers.current.push(setTimeout(() => setRowState(id, { state: 'running', uptime: '1m' }), 2400));
  };

  return (
    <section data-slot="vm-table-block" className="flex w-full justify-center bg-background p-6 sm:p-10">
      <div className={cn(ENTER, 'flex w-full max-w-3xl flex-col gap-3')}>
        <ToggleGroup
          variant="outline"
          size="sm"
          value={[filter]}
          onValueChange={([value]) => value && setFilter(value)}
          aria-label="Filter instances by status"
          className="max-w-full flex-wrap"
        >
          {VM_FILTERS.map((option) => {
            const count = rows.filter((row) => option.states.includes(row.state)).length;
            return (
              <ToggleGroupItem key={option.value} value={option.value}>
                {option.label}
                <span className="text-xs tabular-nums text-muted-foreground">{count}</span>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>

        <VmTable
          caption={
            filter === 'all'
              ? `${rows.length} instances across ${regionCount} regions`
              : `Showing ${visibleRows.length} of ${rows.length} instances`
          }
        >
          <VmTableHeader>
            <VmTableRow>
              <VmTableHead>Instance</VmTableHead>
              <VmTableHead>Status</VmTableHead>
              <VmTableHead>Size</VmTableHead>
              <VmTableHead>Region</VmTableHead>
              <VmTableHead>IP</VmTableHead>
              <VmTableHead className="text-end">Uptime</VmTableHead>
            </VmTableRow>
          </VmTableHeader>
          <VmTableBody key={filter} className={SWAP}>
            {visibleRows.length === 0 ? (
              <VmTableRow className="hover:bg-transparent">
                <VmTableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No instances are {activeFilter.label.toLowerCase()} right now.
                </VmTableCell>
              </VmTableRow>
            ) : (
              visibleRows.map((row) => (
                <VmTableRow key={row.id}>
                  <VmTableName id={row.id}>{row.name}</VmTableName>
                  <VmTableCell>
                    <span className="flex items-center gap-3">
                      <VmStatus key={row.state} state={row.state} className={SWAP} />
                      {row.state === 'error' ? (
                        <Button variant="outline" size="xs" onClick={() => restart(row.id)}>
                          Restart
                        </Button>
                      ) : null}
                    </span>
                  </VmTableCell>
                  <VmTableCell className="text-xs text-muted-foreground">{row.size}</VmTableCell>
                  <VmTableCell className="text-muted-foreground">{row.region}</VmTableCell>
                  <VmTableCell className="text-xs text-muted-foreground">
                    <span dir="ltr">
                      <MutedValue value={row.ip} />
                    </span>
                  </VmTableCell>
                  <VmTableCell className="text-end text-xs tabular-nums text-muted-foreground">
                    <MutedValue value={row.uptime} />
                  </VmTableCell>
                </VmTableRow>
              ))
            )}
          </VmTableBody>
        </VmTable>
      </div>
    </section>
  );
};

export default VmTableBlock;
