'use client';

import * as React from 'react';
import { Check, ChevronDown, X, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/base/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/registry/hirael/bases/base/ui/command';

export interface MultiSelectOption {
  value: string;
  label: string;
  group?: string;
  disabled?: boolean;
}

interface MultiSelectContextValue {
  value: string[];
  setValue: (next: string[]) => void;
  options: MultiSelectOption[];
  setOptions: React.Dispatch<React.SetStateAction<MultiSelectOption[]>>;
  open: boolean;
  setOpen: (open: boolean) => void;
  search: string;
  setSearch: (s: string) => void;
  maxCount?: number;
  disabled?: boolean;
  loading?: boolean;
  toggle: (v: string) => void;
  remove: (v: string) => void;
  clear: () => void;
}

const MultiSelectContext = React.createContext<MultiSelectContextValue | null>(null);

const useMultiSelect = () => {
  const ctx = React.useContext(MultiSelectContext);
  if (!ctx) {
    throw new Error('MultiSelect compound components must be used inside <MultiSelect>');
  }
  return ctx;
};

export interface MultiSelectProps {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  options?: MultiSelectOption[];
  maxCount?: number;
  disabled?: boolean;
  loading?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

const MultiSelect = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  options: optionsProp = [],
  maxCount,
  disabled,
  loading,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: MultiSelectProps) => {
  const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue ?? []);
  const value = valueProp ?? internalValue;
  const setValue = React.useCallback(
    (next: string[]) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const [extraOptions, setExtraOptions] = React.useState<MultiSelectOption[]>([]);
  const options = React.useMemo(() => [...optionsProp, ...extraOptions], [optionsProp, extraOptions]);

  const [search, setSearch] = React.useState('');

  const toggle = React.useCallback(
    (v: string) => {
      const exists = value.includes(v);
      if (exists) {
        setValue(value.filter((x) => x !== v));
      } else {
        if (maxCount !== undefined && value.length >= maxCount) return;
        setValue([...value, v]);
      }
    },
    [value, setValue, maxCount],
  );

  const remove = React.useCallback((v: string) => setValue(value.filter((x) => x !== v)), [value, setValue]);

  const clear = React.useCallback(() => setValue([]), [setValue]);

  const ctx = React.useMemo<MultiSelectContextValue>(
    () => ({
      value,
      setValue,
      options,
      setOptions: setExtraOptions,
      open,
      setOpen,
      search,
      setSearch,
      maxCount,
      disabled,
      loading,
      toggle,
      remove,
      clear,
    }),
    [value, setValue, options, open, setOpen, search, maxCount, disabled, loading, toggle, remove, clear],
  );

  return (
    <MultiSelectContext.Provider value={ctx}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </MultiSelectContext.Provider>
  );
};

interface MultiSelectTriggerProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  placeholder?: string;
  className?: string;
  children?: React.ReactNode | ((ctx: MultiSelectContextValue) => React.ReactNode);
}

const MultiSelectTrigger = ({ placeholder = 'Select…', className, children, ...props }: MultiSelectTriggerProps) => {
  const ctx = useMultiSelect();
  const selected = ctx.options.filter((o) => ctx.value.includes(o.value));

  return (
    <PopoverTrigger
      render={
        <button
          type="button"
          role="combobox"
          aria-expanded={ctx.open}
          aria-haspopup="listbox"
          disabled={ctx.disabled}
          data-slot="multi-select-trigger"
          data-state={ctx.open ? 'open' : 'closed'}
          className={cn(
            'group flex min-h-9 w-full items-center justify-between gap-2 rounded-sm border border-input bg-transparent px-2 py-1 text-start text-sm outline-none transition-colors',
            'hover:border-ring/60 focus-visible:border-ring',
            'data-open:border-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          {...props}
        />
      }
    >
      {typeof children === 'function' ? (
        children(ctx)
      ) : children ? (
        children
      ) : (
        <>
          <span className="flex flex-1 flex-wrap items-center gap-1">
            {selected.length === 0 ? (
              <span className="px-1 text-muted-foreground">{placeholder}</span>
            ) : (
              selected.map((opt) => (
                <Badge key={opt.value} variant="default" className="gap-1 pe-1">
                  {opt.label}
                  <span
                    aria-hidden
                    onPointerDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      ctx.remove(opt.value);
                    }}
                    className="ms-0.5 inline-flex size-3.5 items-center justify-center rounded-[2px] text-primary-foreground/70 hover:bg-primary-foreground/20 hover:text-primary-foreground"
                  >
                    <X className="size-2.5" />
                  </span>
                </Badge>
              ))
            )}
          </span>
          <span className="flex shrink-0 items-center gap-1.5 text-muted-foreground">
            {selected.length > 0 && (
              <span className="font-mono text-[10px] tabular-nums">
                {selected.length}
                {ctx.maxCount ? `/${ctx.maxCount}` : ''}
              </span>
            )}
            <ChevronDown className={cn('size-3.5 transition-transform duration-150', ctx.open && 'rotate-180')} />
          </span>
        </>
      )}
    </PopoverTrigger>
  );
};

interface MultiSelectContentProps extends React.ComponentProps<typeof PopoverContent> {
  searchPlaceholder?: string;
  emptyMessage?: string;
  showSelectAll?: boolean;
  showClear?: boolean;
  selectAllLabel?: string;
  clearLabel?: string;
  children?: React.ReactNode;
}

const MultiSelectContent = ({
  className,
  searchPlaceholder = 'Search…',
  emptyMessage = 'Nothing found.',
  showSelectAll = true,
  showClear = true,
  selectAllLabel = 'Select all',
  clearLabel = 'Clear',
  children,
  ...props
}: MultiSelectContentProps) => {
  const ctx = useMultiSelect();

  const enabled = ctx.options.filter((o) => !o.disabled);
  const allSelected = enabled.length > 0 && enabled.every((o) => ctx.value.includes(o.value));
  const showSelectAllItem = showSelectAll && enabled.length > 0;
  const showClearItem = showClear && ctx.value.length > 0 && !(showSelectAllItem && allSelected);

  const groups = React.useMemo(() => {
    const map = new Map<string | undefined, MultiSelectOption[]>();
    for (const opt of ctx.options) {
      const key = opt.group;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(opt);
    }
    return Array.from(map.entries());
  }, [ctx.options]);

  return (
    <PopoverContent
      align="start"
      sideOffset={6}
      data-slot="multi-select-content"
      className={cn('w-(--anchor-width) min-w-[14rem] p-0', className)}
      initialFocus={false}
      {...props}
    >
      <Command shouldFilter loop>
        <CommandInput placeholder={searchPlaceholder} value={ctx.search} onValueChange={ctx.setSearch} />
        <CommandList>
          {ctx.loading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              Loading…
            </div>
          ) : (
            <>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              {children ??
                groups.map(([group, items]) => (
                  <CommandGroup key={group ?? '__default'} heading={group}>
                    {items.map((opt) => (
                      <MultiSelectItem key={opt.value} option={opt} />
                    ))}
                  </CommandGroup>
                ))}
              {(showSelectAllItem || showClearItem) && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    {showSelectAllItem && (
                      <CommandItem
                        onSelect={() => {
                          if (allSelected) {
                            ctx.clear();
                          } else {
                            const next = enabled.map((o) => o.value).slice(0, ctx.maxCount ?? Infinity);
                            ctx.setValue(next);
                          }
                        }}
                        className="justify-between"
                      >
                        <span className="font-mono text-[10px] uppercase tracking-[0.08em]">
                          {allSelected ? clearLabel : selectAllLabel}
                        </span>
                        <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                          {ctx.value.length} / {enabled.length}
                        </span>
                      </CommandItem>
                    )}
                    {showClearItem && (
                      <CommandItem onSelect={() => ctx.clear()} className="justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-[0.08em]">{clearLabel}</span>
                        <X className="size-3 text-muted-foreground" />
                      </CommandItem>
                    )}
                  </CommandGroup>
                </>
              )}
            </>
          )}
        </CommandList>
      </Command>
    </PopoverContent>
  );
};

interface MultiSelectItemProps extends Omit<
  React.ComponentProps<typeof CommandItem>,
  'value' | 'onSelect' | 'children'
> {
  option: MultiSelectOption;
  children?: React.ReactNode;
}

const MultiSelectItem = ({ option, children, className, ...props }: MultiSelectItemProps) => {
  const ctx = useMultiSelect();
  const selected = ctx.value.includes(option.value);
  const atCap = !selected && ctx.maxCount !== undefined && ctx.value.length >= ctx.maxCount;

  return (
    <CommandItem
      value={`${option.label} ${option.value}`}
      disabled={option.disabled || atCap}
      onSelect={() => ctx.toggle(option.value)}
      data-slot="multi-select-item"
      className={cn('justify-between', className)}
      {...props}
    >
      <span className="min-w-0 truncate">{children ?? option.label}</span>
      <span
        aria-hidden
        className={cn(
          'flex size-4 items-center justify-center rounded-[2px] border border-border transition-colors',
          selected && 'border-primary bg-primary text-primary-foreground',
        )}
      >
        {selected && <Check className="size-2.5" strokeWidth={3} />}
      </span>
    </CommandItem>
  );
};

export const useAsyncOptions = <T,>(
  loader: (query: string) => Promise<T[]>,
  map: (item: T) => MultiSelectOption,
  { debounce = 200 }: { debounce?: number } = {},
) => {
  const [query, setQuery] = React.useState('');
  const [options, setOptions] = React.useState<MultiSelectOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<unknown>(null);
  const reqId = React.useRef(0);

  const loaderRef = React.useRef(loader);
  const mapRef = React.useRef(map);
  React.useEffect(() => {
    loaderRef.current = loader;
    mapRef.current = map;
  });

  React.useEffect(() => {
    const id = ++reqId.current;
    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await loaderRef.current(query);
        if (id === reqId.current) setOptions(result.map(mapRef.current));
      } catch (e) {
        if (id === reqId.current) setError(e);
      } finally {
        if (id === reqId.current) setLoading(false);
      }
    }, debounce);
    return () => clearTimeout(t);
  }, [query, debounce]);

  return { query, setQuery, options, loading, error };
};

export { MultiSelect, MultiSelectTrigger, MultiSelectContent, MultiSelectItem };
