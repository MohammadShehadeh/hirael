'use client';

import * as React from 'react';
import { LayoutGrid, List, Plus, Search, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/registry/hirael/bases/base/ui/dialog';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/registry/hirael/bases/base/ui/empty';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import { Input } from '@/registry/hirael/bases/base/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/registry/hirael/bases/base/ui/input-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/hirael/bases/base/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/base/ui/toggle-group';

type ListHeaderProps = React.ComponentProps<'header'>;

const ListHeader = ({ className, ...props }: ListHeaderProps) => {
  return <header data-slot="list-header" className={cn('flex flex-col gap-6', className)} {...props} />;
};

type ListHeaderRowProps = React.ComponentProps<'div'>;

const ListHeaderRow = ({ className, ...props }: ListHeaderRowProps) => {
  return (
    <div
      data-slot="list-header-row"
      className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}
      {...props}
    />
  );
};

type ListHeaderContentProps = React.ComponentProps<'div'>;

const ListHeaderContent = ({ className, ...props }: ListHeaderContentProps) => {
  return <div data-slot="list-header-content" className={cn('flex min-w-0 flex-col gap-1', className)} {...props} />;
};

type ListHeaderTitleProps = React.ComponentProps<'h1'>;

const ListHeaderTitle = ({ className, ...props }: ListHeaderTitleProps) => {
  return (
    <h1
      data-slot="list-header-title"
      className={cn('text-2xl font-semibold tracking-tight sm:text-3xl', className)}
      {...props}
    />
  );
};

type ListHeaderCountProps = React.ComponentProps<'p'>;

/** Live result count; announced politely when filters change it. */
const ListHeaderCount = ({ className, ...props }: ListHeaderCountProps) => {
  return (
    <p
      data-slot="list-header-count"
      aria-live="polite"
      className={cn('text-sm text-muted-foreground tabular-nums', className)}
      {...props}
    />
  );
};

type ListHeaderActionsProps = React.ComponentProps<'div'>;

const ListHeaderActions = ({ className, ...props }: ListHeaderActionsProps) => {
  return (
    <div data-slot="list-header-actions" className={cn('flex shrink-0 items-center gap-2', className)} {...props} />
  );
};

type ListHeaderToolbarProps = React.ComponentProps<'div'>;

const ListHeaderToolbar = ({ className, ...props }: ListHeaderToolbarProps) => {
  return (
    <div
      role="toolbar"
      data-slot="list-header-toolbar"
      className={cn('flex flex-col gap-2 border-y border-border py-3 md:flex-row md:items-center', className)}
      {...props}
    />
  );
};

export {
  ListHeader,
  ListHeaderRow,
  ListHeaderContent,
  ListHeaderTitle,
  ListHeaderCount,
  ListHeaderActions,
  ListHeaderToolbar,
};

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-2 duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;

const stagger = (index: number, step = 60): React.CSSProperties => ({ animationDelay: `${index * step}ms` });

type Status = 'paid' | 'due' | 'overdue';
type StatusFilter = 'all' | Status;
type Sort = 'newest' | 'oldest' | 'amount-desc' | 'amount-asc' | 'due';
type View = 'list' | 'grid';

interface Invoice {
  id: string;
  customer: string;
  amount: number;
  status: Status;
  issued: string;
  due: string;
}

const TODAY = '2026-09-24';

const INVOICES: readonly Invoice[] = [
  {
    id: 'INV-2041',
    customer: 'Alder Logistics',
    amount: 4280,
    status: 'paid',
    issued: '2026-07-20',
    due: '2026-08-19',
  },
  {
    id: 'INV-2042',
    customer: 'Brightline Dental',
    amount: 1150,
    status: 'paid',
    issued: '2026-07-22',
    due: '2026-08-21',
  },
  {
    id: 'INV-2043',
    customer: 'Cobalt Studio',
    amount: 3600,
    status: 'overdue',
    issued: '2026-07-25',
    due: '2026-08-24',
  },
  {
    id: 'INV-2044',
    customer: 'Driftwood Coffee',
    amount: 640,
    status: 'paid',
    issued: '2026-07-28',
    due: '2026-08-27',
  },
  {
    id: 'INV-2045',
    customer: 'Evergreen Legal',
    amount: 7920,
    status: 'paid',
    issued: '2026-07-31',
    due: '2026-08-30',
  },
  {
    id: 'INV-2046',
    customer: 'Fieldnote Press',
    amount: 1875.5,
    status: 'overdue',
    issued: '2026-08-03',
    due: '2026-09-02',
  },
  {
    id: 'INV-2047',
    customer: 'Granite Health',
    amount: 12400,
    status: 'paid',
    issued: '2026-08-05',
    due: '2026-09-04',
  },
  { id: 'INV-2048', customer: 'Harbor & Pine', amount: 2310, status: 'paid', issued: '2026-08-08', due: '2026-09-07' },
  {
    id: 'INV-2049',
    customer: 'Ironbark Supply',
    amount: 5045.75,
    status: 'overdue',
    issued: '2026-08-11',
    due: '2026-09-10',
  },
  { id: 'INV-2050', customer: 'Juniper Labs', amount: 980, status: 'paid', issued: '2026-08-14', due: '2026-09-13' },
  {
    id: 'INV-2051',
    customer: 'Kestrel Aviation',
    amount: 18750,
    status: 'overdue',
    issued: '2026-08-18',
    due: '2026-09-17',
  },
  { id: 'INV-2052', customer: 'Lumen Optics', amount: 2640, status: 'paid', issued: '2026-08-21', due: '2026-09-20' },
  { id: 'INV-2053', customer: 'Meridian Travel', amount: 3125, status: 'due', issued: '2026-08-25', due: '2026-09-24' },
  {
    id: 'INV-2054',
    customer: 'Northgate Realty',
    amount: 4400,
    status: 'due',
    issued: '2026-08-28',
    due: '2026-09-27',
  },
  { id: 'INV-2055', customer: 'Orchard Bakery', amount: 520, status: 'paid', issued: '2026-08-31', due: '2026-09-30' },
  {
    id: 'INV-2056',
    customer: 'Parallel Robotics',
    amount: 9860,
    status: 'due',
    issued: '2026-09-02',
    due: '2026-10-02',
  },
  { id: 'INV-2057', customer: 'Quarry Fitness', amount: 1390, status: 'due', issued: '2026-09-05', due: '2026-10-05' },
  {
    id: 'INV-2058',
    customer: 'Redwood Analytics',
    amount: 6275,
    status: 'paid',
    issued: '2026-09-08',
    due: '2026-10-08',
  },
  { id: 'INV-2059', customer: 'Saltmarsh Films', amount: 2980, status: 'due', issued: '2026-09-10', due: '2026-10-10' },
  {
    id: 'INV-2060',
    customer: 'Tidewater Marine',
    amount: 7150,
    status: 'due',
    issued: '2026-09-12',
    due: '2026-10-12',
  },
  {
    id: 'INV-2061',
    customer: 'Umber Architects',
    amount: 3480,
    status: 'due',
    issued: '2026-09-15',
    due: '2026-10-15',
  },
  {
    id: 'INV-2062',
    customer: 'Vantage Clinics',
    amount: 11200,
    status: 'due',
    issued: '2026-09-17',
    due: '2026-10-17',
  },
  {
    id: 'INV-2063',
    customer: 'Willow Pediatrics',
    amount: 1760,
    status: 'due',
    issued: '2026-09-19',
    due: '2026-10-19',
  },
  { id: 'INV-2064', customer: 'Yardline Sports', amount: 2245, status: 'due', issued: '2026-09-22', due: '2026-10-22' },
];

const STATUS_OPTIONS: readonly { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'paid', label: 'Paid' },
  { value: 'due', label: 'Due' },
  { value: 'overdue', label: 'Overdue' },
];

const SORT_OPTIONS: readonly { value: Sort; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'due', label: 'Due soonest' },
  { value: 'amount-desc', label: 'Highest amount' },
  { value: 'amount-asc', label: 'Lowest amount' },
];

const STATUS_LABEL: Record<Status, string> = { paid: 'Paid', due: 'Due', overdue: 'Overdue' };

const STATUS_DOT: Record<Status, string> = {
  paid: 'bg-success',
  due: 'bg-warning',
  overdue: 'bg-destructive',
};

const SORTERS: Record<Sort, (a: Invoice, b: Invoice) => number> = {
  newest: (a, b) => b.issued.localeCompare(a.issued) || b.id.localeCompare(a.id),
  oldest: (a, b) => a.issued.localeCompare(b.issued) || a.id.localeCompare(b.id),
  due: (a, b) => a.due.localeCompare(b.due),
  'amount-desc': (a, b) => b.amount - a.amount,
  'amount-asc': (a, b) => a.amount - b.amount,
};

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const moneyRounded = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(date));

const addDays = (date: string, days: number) => {
  const next = new Date(`${date}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + days);

  return next.toISOString().slice(0, 10);
};

const InvoiceStatus = ({ status }: { status: Status }) => (
  <Badge variant="outline" data-slot="invoice-status" data-status={status}>
    <span aria-hidden className={cn('size-1.5 rounded-full', STATUS_DOT[status])} />
    {STATUS_LABEL[status]}
  </Badge>
);

const PageHeader03 = () => {
  const [invoices, setInvoices] = React.useState<readonly Invoice[]>(INVOICES);
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState<StatusFilter>('all');
  const [sort, setSort] = React.useState<Sort>('newest');
  const [view, setView] = React.useState<View>('list');

  const needle = query.trim().toLowerCase();
  const filtered = invoices
    .filter((invoice) => status === 'all' || invoice.status === status)
    .filter(
      (invoice) =>
        needle === '' ||
        invoice.customer.toLowerCase().includes(needle) ||
        invoice.id.toLowerCase().includes(needle) ||
        money.format(invoice.amount).includes(needle),
    )
    .sort(SORTERS[sort]);

  const filtering = needle !== '' || status !== 'all';
  const outstanding = invoices
    .filter((invoice) => invoice.status !== 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const clearFilters = () => {
    setQuery('');
    setStatus('all');
  };

  const create = (customer: string, amount: number) => {
    const lastNumber = Math.max(...invoices.map((invoice) => Number(invoice.id.slice(4))));
    setInvoices((current) => [
      ...current,
      {
        id: `INV-${lastNumber + 1}`,
        customer,
        amount,
        status: 'due',
        issued: TODAY,
        due: addDays(TODAY, 30),
      },
    ]);
    clearFilters();
    setSort('newest');
  };

  const plural = (n: number) => (n === 1 ? 'invoice' : 'invoices');
  const statusLabel = status === 'all' ? '' : STATUS_LABEL[status].toLowerCase();

  return (
    <section data-slot="page-header-03" className="bg-background py-16 sm:py-20">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 md:px-10">
        <ListHeader>
          <ListHeaderRow>
            <ListHeaderContent>
              <ListHeaderTitle className={ENTER}>Invoices</ListHeaderTitle>
              <ListHeaderCount style={stagger(1, 80)} className={ENTER}>
                {filtering
                  ? `${filtered.length} of ${invoices.length} ${plural(invoices.length)}`
                  : `${invoices.length} ${plural(invoices.length)}, ${moneyRounded.format(outstanding)} outstanding`}
              </ListHeaderCount>
            </ListHeaderContent>
            <ListHeaderActions style={stagger(2, 80)} className={ENTER}>
              <NewInvoiceDialog onCreate={create} />
            </ListHeaderActions>
          </ListHeaderRow>

          <ListHeaderToolbar aria-label="Filter invoices" style={stagger(3, 80)} className={ENTER}>
            <InputGroup className="md:max-w-xs">
              <InputGroupAddon align="inline-start">
                <Search aria-hidden />
              </InputGroupAddon>
              <InputGroupInput
                type="search"
                aria-label="Search invoices"
                placeholder="Search customer or number"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </InputGroup>
            <div className="flex flex-wrap items-center gap-2 md:flex-1">
              <Select items={STATUS_OPTIONS} value={status} onValueChange={(value) => setStatus(value as StatusFilter)}>
                <SelectTrigger aria-label="Status" className="min-w-0 flex-1 md:w-40 md:flex-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select items={SORT_OPTIONS} value={sort} onValueChange={(value) => setSort(value as Sort)}>
                <SelectTrigger aria-label="Sort" className="min-w-0 flex-1 md:w-40 md:flex-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filtering ? (
                <Button type="button" variant="ghost" onClick={clearFilters} className={SWAP}>
                  <X aria-hidden />
                  Clear filters
                </Button>
              ) : null}
              <ToggleGroup
                variant="outline"
                value={[view]}
                onValueChange={([next]) => {
                  // Keep one view selected when the active one is clicked again.
                  if (next) setView(next as View);
                }}
                aria-label="Layout"
                className="ms-auto"
              >
                <ToggleGroupItem value="list" aria-label="List view">
                  <List aria-hidden />
                </ToggleGroupItem>
                <ToggleGroupItem value="grid" aria-label="Grid view">
                  <LayoutGrid aria-hidden />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </ListHeaderToolbar>
        </ListHeader>

        {filtered.length === 0 ? (
          <div className={cn(SWAP, 'rounded-lg border border-dashed border-border')}>
            <Empty data-slot="page-header-03-empty">
              <EmptyHeader>
                <EmptyTitle>No invoices match</EmptyTitle>
                <EmptyDescription>
                  {needle
                    ? `Nothing matches "${query.trim()}"${statusLabel ? ` in ${statusLabel} invoices` : ''}.`
                    : `There are no ${statusLabel} invoices.`}{' '}
                  Try another search or clear the filters.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        ) : view === 'list' ? (
          <div data-slot="page-header-03-list" key={`list-${sort}-${status}`} className="flex flex-col">
            <div
              aria-hidden
              className="hidden grid-cols-[6rem_1fr_6rem_6rem_7rem] gap-4 border-b border-border pb-2 text-xs text-muted-foreground uppercase sm:grid"
            >
              <span>Number</span>
              <span>Customer</span>
              <span>Due</span>
              <span>Status</span>
              <span className="text-end">Amount</span>
            </div>
            <ul className="flex flex-col divide-y divide-border">
              {filtered.map((invoice, index) => (
                <li
                  key={invoice.id}
                  data-slot="page-header-03-row"
                  style={stagger(Math.min(index, 8), 30)}
                  className={cn(
                    SWAP,
                    'grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-3 text-sm sm:grid-cols-[6rem_1fr_6rem_6rem_7rem]',
                  )}
                >
                  <span className="order-3 text-muted-foreground tabular-nums sm:order-none sm:text-foreground">
                    {invoice.id}
                  </span>
                  <span className="order-1 truncate font-medium sm:order-none">{invoice.customer}</span>
                  <span className="hidden text-muted-foreground tabular-nums sm:block">{formatDate(invoice.due)}</span>
                  <span className="order-2 justify-self-end sm:order-none sm:justify-self-start">
                    <InvoiceStatus status={invoice.status} />
                  </span>
                  <span className="order-4 text-end tabular-nums sm:order-none">{money.format(invoice.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ul
            data-slot="page-header-03-grid"
            key={`grid-${sort}-${status}`}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((invoice, index) => (
              <li
                key={invoice.id}
                data-slot="page-header-03-tile"
                style={stagger(Math.min(index, 8), 30)}
                className={cn(SWAP, 'flex flex-col gap-4 rounded-lg border border-border bg-card p-4')}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-sm font-medium">{invoice.customer}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{invoice.id}</span>
                  </div>
                  <InvoiceStatus status={invoice.status} />
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-lg font-semibold tabular-nums">{money.format(invoice.amount)}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">Due {formatDate(invoice.due)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

interface NewInvoiceDialogProps {
  onCreate: (customer: string, amount: number) => void;
}

const NewInvoiceDialog = ({ onCreate }: NewInvoiceDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const [customer, setCustomer] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const parsed = Number(amount);
  const customerError = customer.trim() === '' ? 'Enter a customer name.' : null;
  const amountError = !(parsed > 0) ? 'Enter an amount above zero.' : null;

  const reset = () => {
    setCustomer('');
    setAmount('');
    setSubmitted(false);
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (customerError || amountError) return;
    onCreate(customer.trim(), Math.round(parsed * 100) / 100);
    setOpen(false);
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger render={<Button type="button" />}>
        <Plus aria-hidden />
        New invoice
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={submit} noValidate className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>New invoice</DialogTitle>
            <DialogDescription>It is issued today and due in 30 days.</DialogDescription>
          </DialogHeader>
          <FieldGroup className="gap-4">
            <Field data-invalid={(submitted && Boolean(customerError)) || undefined}>
              <FieldLabel htmlFor="page-header-03-customer">Customer</FieldLabel>
              <Input
                id="page-header-03-customer"
                value={customer}
                autoComplete="off"
                placeholder="Harbor & Pine"
                aria-invalid={(submitted && Boolean(customerError)) || undefined}
                onChange={(event) => setCustomer(event.target.value)}
              />
              {submitted && customerError ? <FieldError>{customerError}</FieldError> : null}
            </Field>
            <Field data-invalid={(submitted && Boolean(amountError)) || undefined}>
              <FieldLabel htmlFor="page-header-03-amount">Amount in USD</FieldLabel>
              <Input
                id="page-header-03-amount"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="1200.00"
                value={amount}
                aria-invalid={(submitted && Boolean(amountError)) || undefined}
                onChange={(event) => setAmount(event.target.value)}
              />
              {submitted && amountError ? <FieldError>{amountError}</FieldError> : null}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create invoice</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PageHeader03;
