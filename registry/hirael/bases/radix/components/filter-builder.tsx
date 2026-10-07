'use client';

import * as React from 'react';
import { Check, ChevronLeft, ListFilter, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Calendar } from '@/registry/hirael/bases/radix/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/registry/hirael/bases/radix/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/registry/hirael/bases/radix/ui/dropdown-menu';
import { Input } from '@/registry/hirael/bases/radix/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/radix/ui/popover';
import { useControllableState } from '@/registry/hirael/hooks/use-controllable-state';

export type FilterFieldType = 'option' | 'multiOption' | 'text' | 'number' | 'date';

export const FILTER_OPERATORS = {
  option: ['is', 'isNot'],
  multiOption: ['includesAny', 'includesAll', 'excludes'],
  text: ['contains', 'notContains', 'equals'],
  number: ['eq', 'neq', 'gt', 'lt', 'between'],
  date: ['before', 'after', 'between'],
} as const satisfies Record<FilterFieldType, readonly string[]>;

export type FilterOperator = (typeof FILTER_OPERATORS)[FilterFieldType][number];

export const DEFAULT_OPERATOR_LABELS: Record<FilterOperator, string> = {
  is: 'is',
  isNot: 'is not',
  includesAny: 'includes any of',
  includesAll: 'includes all of',
  excludes: 'excludes',
  contains: 'contains',
  notContains: 'does not contain',
  equals: 'is',
  eq: '=',
  neq: '≠',
  gt: '>',
  lt: '<',
  between: 'between',
  before: 'before',
  after: 'after',
};

export interface FilterOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface FilterField {
  /** Key used in each filter and passed to `getValue` in `applyFilters`. */
  id: string;
  label: string;
  icon?: React.ReactNode;
  type: FilterFieldType;
  /** Choices for `option` and `multiOption` fields. */
  options?: FilterOption[];
}

/** Values are option values, one text, one or two numbers, or one or two ISO dates (`yyyy-mm-dd`). */
export interface Filter {
  id: string;
  field: string;
  operator: FilterOperator;
  values: string[];
}

export interface FilterBuilderLabels {
  add: string;
  clear: string;
  remove: string;
  searchFields: string;
  searchOptions: string;
  noResults: string;
  empty: string;
  back: string;
  and: string;
  pickDate: string;
  selected: (count: number) => string;
}

const DEFAULT_LABELS: FilterBuilderLabels = {
  add: 'Filter',
  clear: 'Clear',
  remove: 'Remove filter',
  searchFields: 'Filter by…',
  searchOptions: 'Search…',
  noResults: 'No results',
  empty: 'Any',
  back: 'Back',
  and: 'and',
  pickDate: 'Pick a date',
  selected: (count) => `${count} selected`,
};

const toISODate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const fromISODate = (value: string | undefined) => {
  if (!value) return undefined;
  const [y, m, d] = value.split('-').map(Number);

  return new Date(y, m - 1, d);
};

/**
 * Keeps the rows that pass every filter. A filter with no values yet matches
 * everything, so a half-built filter never empties the list.
 */
export const applyFilters = <Row,>(
  rows: Row[],
  filters: Filter[],
  getValue: (row: Row, field: string) => unknown,
): Row[] =>
  rows.filter((row) =>
    filters.every((filter) => {
      const [a = '', b = ''] = filter.values;
      if (a === '' && b === '') return true;
      const raw = getValue(row, filter.field);
      switch (filter.operator) {
        case 'is':
          return filter.values.includes(String(raw));
        case 'isNot':
          return !filter.values.includes(String(raw));
        case 'includesAny':
          return (Array.isArray(raw) ? raw : [raw]).some((v) => filter.values.includes(String(v)));
        case 'includesAll': {
          const have = new Set((Array.isArray(raw) ? raw : [raw]).map(String));

          return filter.values.every((v) => have.has(v));
        }
        case 'excludes':
          return !(Array.isArray(raw) ? raw : [raw]).some((v) => filter.values.includes(String(v)));
        case 'contains':
          return String(raw ?? '')
            .toLocaleLowerCase()
            .includes(a.toLocaleLowerCase());
        case 'notContains':
          return !String(raw ?? '')
            .toLocaleLowerCase()
            .includes(a.toLocaleLowerCase());
        case 'equals':
          return String(raw ?? '').toLocaleLowerCase() === a.toLocaleLowerCase();
        case 'eq':
          return Number(raw) === Number(a);
        case 'neq':
          return Number(raw) !== Number(a);
        case 'gt':
          return Number(raw) > Number(a);
        case 'lt':
          return Number(raw) < Number(a);
        case 'between': {
          if (raw instanceof Date || typeof raw === 'string') {
            const day = raw instanceof Date ? toISODate(raw) : raw.slice(0, 10);

            return (a === '' || day >= a) && (b === '' || day <= b);
          }

          return (a === '' || Number(raw) >= Number(a)) && (b === '' || Number(raw) <= Number(b));
        }
        case 'before':
        case 'after': {
          const day = raw instanceof Date ? toISODate(raw) : String(raw).slice(0, 10);

          return filter.operator === 'before' ? day < a : day > a;
        }
        default:
          return true;
      }
    }),
  );

interface FilterBuilderContextValue {
  fields: FilterField[];
  fieldById: Map<string, FilterField>;
  filters: Filter[];
  add: (field: FilterField, values?: string[]) => string;
  update: (id: string, patch: Partial<Omit<Filter, 'id'>>) => void;
  remove: (id: string) => void;
  clear: () => void;
  labels: FilterBuilderLabels;
  operatorLabels: Record<FilterOperator, string>;
  /** Filter whose value editor should open right after it was added. */
  pendingEdit: string | null;
  setPendingEdit: (id: string | null) => void;
  locale: string;
}

const FilterBuilderContext = React.createContext<FilterBuilderContextValue | null>(null);

const useFilterBuilder = () => {
  const ctx = React.useContext(FilterBuilderContext);
  if (!ctx) {
    throw new Error('FilterBuilder compound parts must be used inside <FilterBuilder>');
  }

  return ctx;
};

export interface FilterBuilderProps extends Omit<React.ComponentProps<'div'>, 'defaultValue'> {
  /** What can be filtered on. */
  fields: FilterField[];
  value?: Filter[];
  defaultValue?: Filter[];
  onValueChange?: (filters: Filter[]) => void;
  labels?: Partial<FilterBuilderLabels>;
  /** Override operator wording, for example to translate it. */
  operatorLabels?: Partial<Record<FilterOperator, string>>;
  /** BCP 47 tag for dates in the chips. Defaults to `en-US` so server and client render the same text. */
  locale?: string;
}

const EMPTY: Filter[] = [];

const FilterBuilder = ({
  fields,
  value: valueProp,
  defaultValue = EMPTY,
  onValueChange,
  labels,
  operatorLabels,
  locale = 'en-US',
  className,
  ...props
}: FilterBuilderProps) => {
  const [filters, setFilters] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });
  const [pendingEdit, setPendingEdit] = React.useState<string | null>(null);
  const counter = React.useRef(0);

  const fieldById = React.useMemo(() => new Map(fields.map((field) => [field.id, field])), [fields]);

  const add = React.useCallback(
    (field: FilterField, values: string[] = []) => {
      counter.current += 1;
      const id = `${field.id}-${Date.now().toString(36)}-${counter.current}`;
      setFilters([...filters, { id, field: field.id, operator: FILTER_OPERATORS[field.type][0], values }]);

      return id;
    },
    [filters, setFilters],
  );

  const update = React.useCallback(
    (id: string, patch: Partial<Omit<Filter, 'id'>>) =>
      setFilters(filters.map((filter) => (filter.id === id ? { ...filter, ...patch } : filter))),
    [filters, setFilters],
  );

  const remove = React.useCallback(
    (id: string) => setFilters(filters.filter((filter) => filter.id !== id)),
    [filters, setFilters],
  );

  const clear = React.useCallback(() => setFilters([]), [setFilters]);

  const ctx = React.useMemo<FilterBuilderContextValue>(
    () => ({
      fields,
      fieldById,
      filters,
      add,
      update,
      remove,
      clear,
      labels: { ...DEFAULT_LABELS, ...labels },
      operatorLabels: { ...DEFAULT_OPERATOR_LABELS, ...operatorLabels },
      pendingEdit,
      setPendingEdit,
      locale,
    }),
    [fields, fieldById, filters, add, update, remove, clear, labels, operatorLabels, pendingEdit, locale],
  );

  return (
    <FilterBuilderContext.Provider value={ctx}>
      <div
        role="group"
        data-slot="filter-builder"
        className={cn('flex flex-wrap items-center gap-2', className)}
        {...props}
      />
    </FilterBuilderContext.Provider>
  );
};

interface OptionListProps {
  field: FilterField;
  values: string[];
  multiple: boolean;
  onChange: (values: string[]) => void;
}

const OptionList = ({ field, values, multiple, onChange }: OptionListProps) => {
  const { labels } = useFilterBuilder();

  return (
    <Command>
      <CommandInput placeholder={labels.searchOptions} />
      <CommandList>
        <CommandEmpty>{labels.noResults}</CommandEmpty>
        <CommandGroup>
          {(field.options ?? []).map((option) => {
            const checked = values.includes(option.value);

            return (
              <CommandItem
                key={option.value}
                value={`${option.label} ${option.value}`}
                onSelect={() => {
                  if (!multiple) onChange([option.value]);
                  else onChange(checked ? values.filter((v) => v !== option.value) : [...values, option.value]);
                }}
              >
                <span
                  aria-hidden
                  data-checked={checked || undefined}
                  className={cn(
                    'flex size-4 items-center justify-center border border-input text-primary-foreground data-checked:border-primary data-checked:bg-primary',
                    multiple ? 'rounded-[4px]' : 'rounded-full',
                  )}
                >
                  {checked && <Check className="size-3 text-primary-foreground" />}
                </span>
                {option.icon}
                <span className="truncate">{option.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export type FilterBuilderAddProps = Omit<React.ComponentProps<typeof Button>, 'children'>;

/** A button that lists the fields, then the options of the field you pick, and adds a filter. */
const FilterBuilderAdd = ({ variant = 'outline', size = 'sm', className, ...props }: FilterBuilderAddProps) => {
  const { fields, add, update, labels, setPendingEdit } = useFilterBuilder();
  const [open, setOpen] = React.useState(false);
  const [field, setField] = React.useState<FilterField | null>(null);
  const [draft, setDraft] = React.useState<{ id: string; values: string[] } | null>(null);

  const reset = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setField(null);
      setDraft(null);
    }
  };

  return (
    <Popover open={open} onOpenChange={reset}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size={size}
          data-slot="filter-builder-add"
          className={className}
          {...props}
        >
          <ListFilter />
          {labels.add}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-60 p-0" data-slot="filter-builder-add-content">
        {field && (field.type === 'option' || field.type === 'multiOption') ? (
          <div>
            <button
              type="button"
              onClick={() => {
                setField(null);
                setDraft(null);
              }}
              className="flex w-full items-center gap-1.5 border-b border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft aria-hidden className="size-3.5 rtl:rotate-180" />
              {labels.back}
              <span className="ms-auto font-medium text-foreground">{field.label}</span>
            </button>
            <OptionList
              field={field}
              values={draft?.values ?? []}
              multiple={field.type === 'multiOption'}
              onChange={(values) => {
                if (draft) update(draft.id, { values });
                setDraft({ id: draft?.id ?? add(field, values), values });
                if (field.type === 'option') reset(false);
              }}
            />
          </div>
        ) : (
          <Command>
            <CommandInput placeholder={labels.searchFields} />
            <CommandList>
              <CommandEmpty>{labels.noResults}</CommandEmpty>
              <CommandGroup>
                {fields.map((f) => (
                  <CommandItem
                    key={f.id}
                    value={`${f.label} ${f.id}`}
                    onSelect={() => {
                      if (f.type === 'option' || f.type === 'multiOption') {
                        setField(f);

                        return;
                      }
                      setPendingEdit(add(f));
                      reset(false);
                    }}
                  >
                    {f.icon}
                    {f.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
};

const chipPart =
  'inline-flex h-full items-center gap-1.5 px-2 text-xs outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent [&_svg]:size-3.5 [&_svg]:shrink-0';

interface ValueSummaryProps {
  filter: Filter;
  field: FilterField;
}

const ValueSummary = ({ filter, field }: ValueSummaryProps) => {
  const { labels, locale } = useFilterBuilder();
  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });
  const [a = '', b = ''] = filter.values;
  if (!a && !b) return <span className="text-muted-foreground">{labels.empty}</span>;
  if (field.type === 'option' || field.type === 'multiOption') {
    if (filter.values.length > 1) return <>{labels.selected(filter.values.length)}</>;
    const option = field.options?.find((o) => o.value === a);

    return (
      <>
        {option?.icon}
        {option?.label ?? a}
      </>
    );
  }
  const show = (v: string) => (field.type === 'date' ? dateFormat.format(fromISODate(v)) : v);
  if (filter.operator === 'between') {
    return (
      <span className="tabular-nums">
        {a ? show(a) : '…'} {labels.and} {b ? show(b) : '…'}
      </span>
    );
  }

  return <span className={cn('max-w-40 truncate', field.type !== 'text' && 'tabular-nums')}>{show(a)}</span>;
};

interface ValueEditorProps {
  filter: Filter;
  field: FilterField;
  onDone: () => void;
}

const ValueEditor = ({ filter, field, onDone }: ValueEditorProps) => {
  const { update, labels } = useFilterBuilder();
  const set = (values: string[]) => update(filter.id, { values });
  const [a = '', b = ''] = filter.values;

  if (field.type === 'option' || field.type === 'multiOption') {
    return (
      <OptionList
        field={field}
        values={filter.values}
        multiple={field.type === 'multiOption'}
        onChange={(values) => {
          set(values);
          if (field.type === 'option') onDone();
        }}
      />
    );
  }
  if (field.type === 'date') {
    const from = fromISODate(a);
    const to = fromISODate(b);

    return filter.operator === 'between' ? (
      <Calendar
        mode="range"
        selected={{ from, to }}
        defaultMonth={from}
        onSelect={(range) => set([range?.from ? toISODate(range.from) : '', range?.to ? toISODate(range.to) : ''])}
      />
    ) : (
      <Calendar
        mode="single"
        selected={from}
        defaultMonth={from}
        onSelect={(date) => {
          set(date ? [toISODate(date)] : []);
          if (date) onDone();
        }}
      />
    );
  }

  const numeric = field.type === 'number';

  return (
    <form
      className="flex items-center gap-2 p-2"
      onSubmit={(event) => {
        event.preventDefault();
        onDone();
      }}
    >
      <Input
        autoFocus
        type={numeric ? 'number' : 'text'}
        inputMode={numeric ? 'decimal' : undefined}
        value={a}
        aria-label={field.label}
        onChange={(event) => set(filter.operator === 'between' ? [event.target.value, b] : [event.target.value])}
      />
      {filter.operator === 'between' && (
        <>
          <span className="text-xs text-muted-foreground">{labels.and}</span>
          <Input
            type="number"
            inputMode="decimal"
            value={b}
            aria-label={`${field.label} ${labels.and}`}
            onChange={(event) => set([a, event.target.value])}
          />
        </>
      )}
    </form>
  );
};

export interface FilterBuilderChipProps extends React.ComponentProps<'div'> {
  filter: Filter;
}

/** One active filter: field, operator menu, value editor and a remove button. */
const FilterBuilderChip = ({ filter, className, ...props }: FilterBuilderChipProps) => {
  const { fieldById, update, remove, labels, operatorLabels, pendingEdit, setPendingEdit } = useFilterBuilder();
  const field = fieldById.get(filter.field);
  const [editing, setEditing] = React.useState(false);
  const open = editing || pendingEdit === filter.id;
  if (!field) return null;

  const setOpen = (next: boolean) => {
    setEditing(next);
    if (!next && pendingEdit === filter.id) setPendingEdit(null);
  };

  const changeOperator = (operator: FilterOperator) => {
    const keepFirst =
      operator === 'between' || filter.operator === 'between' || (field.type === 'option' && filter.values.length > 1);
    const values = keepFirst ? filter.values.slice(0, 1) : filter.values;
    update(filter.id, { operator, values });
  };

  return (
    <div
      data-slot="filter-builder-chip"
      className={cn(
        'inline-flex h-7 items-stretch divide-x divide-border overflow-hidden rounded-md border border-border bg-background text-xs shadow-xs rtl:divide-x-reverse',
        className,
      )}
      {...props}
    >
      <span className="inline-flex items-center gap-1.5 px-2 font-medium [&_svg]:size-3.5 [&_svg]:text-muted-foreground">
        {field.icon}
        {field.label}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" data-slot="filter-builder-operator" className={cn(chipPart, 'text-muted-foreground')}>
            {operatorLabels[filter.operator]}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuRadioGroup
            value={filter.operator}
            onValueChange={(operator) => changeOperator(operator as FilterOperator)}
          >
            {FILTER_OPERATORS[field.type].map((operator) => (
              <DropdownMenuRadioItem key={operator} value={operator}>
                {operatorLabels[operator]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button type="button" data-slot="filter-builder-value" className={chipPart}>
            <ValueSummary filter={filter} field={field} />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className={cn('p-0', field.type === 'date' ? 'w-auto' : 'w-60')}>
          <ValueEditor filter={filter} field={field} onDone={() => setOpen(false)} />
        </PopoverContent>
      </Popover>
      <button
        type="button"
        aria-label={`${labels.remove}: ${field.label}`}
        data-slot="filter-builder-remove"
        onClick={() => remove(filter.id)}
        className={cn(chipPart, 'px-1.5 text-muted-foreground')}
      >
        <X />
      </button>
    </div>
  );
};

/** Every active filter as a chip, in the order they were added. */
const FilterBuilderList = () => {
  const { filters } = useFilterBuilder();

  return (
    <>
      {filters.map((filter) => (
        <FilterBuilderChip key={filter.id} filter={filter} />
      ))}
    </>
  );
};

const FilterBuilderClear = ({
  variant = 'ghost',
  size = 'sm',
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'children'>) => {
  const { filters, clear, labels } = useFilterBuilder();
  if (filters.length === 0) return null;

  return (
    <Button type="button" variant={variant} size={size} data-slot="filter-builder-clear" onClick={clear} {...props}>
      {labels.clear}
    </Button>
  );
};

export { FilterBuilder, FilterBuilderAdd, FilterBuilderList, FilterBuilderChip, FilterBuilderClear, useFilterBuilder };
