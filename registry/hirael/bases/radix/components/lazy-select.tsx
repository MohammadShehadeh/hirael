'use client';

import * as React from 'react';
import { Check, ChevronDown, Loader2, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/radix/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/registry/hirael/bases/radix/ui/command';

export interface LazySelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface Ctx {
  value: string | undefined;
  setValue: (next: string | undefined, option?: LazySelectOption) => void;
  selectedLabel: string | undefined;
  options: LazySelectOption[];
  open: boolean;
  setOpen: (next: boolean) => void;
  search: string;
  setSearch: (next: string) => void;
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  disabled?: boolean;
  clearable: boolean;
  listboxId: string;
}

const LazySelectContext = React.createContext<Ctx | null>(null);

const useLazySelect = () => {
  const ctx = React.useContext(LazySelectContext);
  if (!ctx) {
    throw new Error('LazySelect compound parts must be used inside <LazySelect>');
  }

  return ctx;
};

export interface LazySelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  options?: LazySelectOption[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSearchChange?: (search: string) => void;
  /** Called when the list is scrolled near the bottom and more pages exist. */
  onLoadMore?: () => void;
  /** The first page, or the first page of a new search, is loading. */
  loading?: boolean;
  /** A subsequent page is being appended. */
  loadingMore?: boolean;
  /** Whether another page is available to lazy-load. */
  hasMore?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  name?: string;
  children?: React.ReactNode;
}

const NO_OPTIONS: LazySelectOption[] = [];

const LazySelect = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  options = NO_OPTIONS,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onSearchChange,
  onLoadMore,
  loading,
  loadingMore,
  hasMore,
  disabled,
  clearable = true,
  name,
  children,
}: LazySelectProps) => {
  const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue);
  const value = valueProp !== undefined ? valueProp : internalValue;

  const [labelCache, setLabelCache] = React.useState<Record<string, string>>({});
  let pendingLabels: Record<string, string> | null = null;
  for (const option of options) {
    if (labelCache[option.value] === option.label) continue;
    pendingLabels ??= { ...labelCache };
    pendingLabels[option.value] = option.label;
  }
  if (pendingLabels) setLabelCache(pendingLabels);

  const setValue = React.useCallback(
    (next: string | undefined, option?: LazySelectOption) => {
      if (option) {
        setLabelCache((prev) =>
          prev[option.value] === option.label ? prev : { ...prev, [option.value]: option.label },
        );
      }
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

  const [search, setSearchState] = React.useState('');
  const setSearch = React.useCallback(
    (next: string) => {
      setSearchState(next);
      onSearchChange?.(next);
    },
    [onSearchChange],
  );

  const listboxId = React.useId();

  const selectedLabel = value !== undefined ? (labelCache[value] ?? value) : undefined;

  const ctx = React.useMemo<Ctx>(
    () => ({
      value,
      setValue,
      selectedLabel,
      options,
      open,
      setOpen,
      search,
      setSearch,
      loading,
      loadingMore,
      hasMore,
      onLoadMore,
      disabled,
      clearable,
      listboxId,
    }),
    [
      value,
      setValue,
      selectedLabel,
      options,
      open,
      setOpen,
      search,
      setSearch,
      loading,
      loadingMore,
      hasMore,
      onLoadMore,
      disabled,
      clearable,
      listboxId,
    ],
  );

  return (
    <LazySelectContext.Provider value={ctx}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
      {name && <input type="hidden" name={name} value={value ?? ''} />}
    </LazySelectContext.Provider>
  );
};

interface LazySelectTriggerProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  placeholder?: string;
  className?: string;
}

const LazySelectTrigger = ({ placeholder = 'Select…', className, ...props }: LazySelectTriggerProps) => {
  const ctx = useLazySelect();
  const showClear = ctx.clearable && ctx.value !== undefined && !ctx.disabled;

  return (
    <div data-slot="lazy-select-trigger-wrapper" className="relative w-full">
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-controls={ctx.listboxId}
          aria-expanded={ctx.open}
          aria-haspopup="listbox"
          disabled={ctx.disabled}
          data-slot="lazy-select-trigger"
          data-state={ctx.open ? 'open' : 'closed'}
          className={cn(
            'group flex h-9 w-full items-center justify-between gap-2 rounded-sm border border-input bg-transparent px-2.5 text-start text-sm transition-colors outline-none',
            'hover:border-ring/60 focus-visible:border-ring',
            'data-[state=open]:border-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          {...props}
        >
          <span
            className={cn(
              'min-w-0 flex-1 truncate',
              ctx.selectedLabel === undefined && 'text-muted-foreground',
              showClear && 'pe-5',
            )}
          >
            {ctx.selectedLabel ?? placeholder}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-muted-foreground">
            <ChevronDown
              className={cn(
                'size-3.5 transition-transform duration-150 motion-reduce:transition-none',
                ctx.open && 'rotate-180',
              )}
            />
          </span>
        </button>
      </PopoverTrigger>
      {showClear && (
        <button
          type="button"
          aria-label="Clear"
          data-slot="lazy-select-clear"
          onClick={(e) => {
            e.stopPropagation();
            ctx.setValue(undefined);
          }}
          className="absolute end-7 top-1/2 inline-flex size-4 -translate-y-1/2 items-center justify-center rounded-[2px] text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  );
};

interface LazySelectContentProps extends React.ComponentProps<typeof PopoverContent> {
  searchPlaceholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  loadingMoreMessage?: string;
  endMessage?: string;
  children?: React.ReactNode;
}

const LazySelectContent = ({
  className,
  searchPlaceholder = 'Search…',
  emptyMessage = 'Nothing found.',
  loadingMessage = 'Loading…',
  loadingMoreMessage = 'Loading more…',
  endMessage,
  children,
  ...props
}: LazySelectContentProps) => {
  const ctx = useLazySelect();
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const onLoadMore = ctx.onLoadMore;

  React.useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !ctx.open || !ctx.hasMore || !onLoadMore) return;
    const root = el.closest("[data-slot='command-list']");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { root: root as Element | null, rootMargin: '80px' },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [ctx.open, ctx.hasMore, ctx.loading, ctx.loadingMore, ctx.options.length, onLoadMore]);

  return (
    <PopoverContent
      align="start"
      sideOffset={6}
      data-slot="lazy-select-content"
      className={cn('w-(--radix-popover-trigger-width) min-w-[14rem] p-0', className)}
      onOpenAutoFocus={(e) => {
        e.preventDefault();
        inputRef.current?.focus();
      }}
      {...props}
    >
      <Command shouldFilter={false} loop>
        <CommandInput ref={inputRef} placeholder={searchPlaceholder} value={ctx.search} onValueChange={ctx.setSearch} />
        <CommandList id={ctx.listboxId}>
          {ctx.loading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              {loadingMessage}
            </div>
          ) : (
            <>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <div className="p-1">
                {children ?? ctx.options.map((opt) => <LazySelectItem key={opt.value} option={opt} />)}
              </div>
              {ctx.hasMore ? (
                <div
                  ref={sentinelRef}
                  data-slot="lazy-select-loader"
                  className="flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground"
                >
                  <Loader2 className="size-3.5 animate-spin" />
                  {loadingMoreMessage}
                </div>
              ) : (
                endMessage &&
                ctx.options.length > 0 && (
                  <div className="py-3 text-center text-xs text-muted-foreground uppercase">{endMessage}</div>
                )
              )}
            </>
          )}
        </CommandList>
      </Command>
    </PopoverContent>
  );
};

interface LazySelectItemProps extends Omit<
  React.ComponentProps<typeof CommandItem>,
  'value' | 'onSelect' | 'children'
> {
  option: LazySelectOption;
  children?: React.ReactNode;
}

const LazySelectItem = ({ option, children, className, ...props }: LazySelectItemProps) => {
  const ctx = useLazySelect();
  const selected = ctx.value === option.value;

  return (
    <CommandItem
      value={option.value}
      disabled={option.disabled}
      onSelect={() => {
        if (!selected) ctx.setValue(option.value, option);
        else if (ctx.clearable) ctx.setValue(undefined);
        ctx.setOpen(false);
      }}
      data-slot="lazy-select-item"
      className={cn('justify-between', className)}
      {...props}
    >
      <span className="min-w-0 truncate">{children ?? option.label}</span>
      {selected && <Check className="size-3.5 text-foreground" strokeWidth={3} />}
    </CommandItem>
  );
};

export type LazyPage<T> = {
  items: T[];
  hasMore: boolean;
};

interface LazySelectLoaderParams {
  query: string;
  page: number;
}

interface UseLazySelectOptionsOptions {
  debounce?: number;
  enabled?: boolean;
}

/** Fetches nothing until `enabled`; wire it to the open state to load on open. */
export const useLazySelectOptions = <T,>(
  loader: (params: LazySelectLoaderParams) => Promise<LazyPage<T>>,
  map: (item: T) => LazySelectOption,
  { debounce = 250, enabled = true }: UseLazySelectOptionsOptions = {},
) => {
  const [query, setQueryState] = React.useState('');
  const [options, setOptions] = React.useState<LazySelectOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(false);
  const [error, setError] = React.useState<unknown>(null);

  const reqId = React.useRef(0);
  const pageRef = React.useRef(0);
  const loadingRef = React.useRef(false);
  const loadingMoreRef = React.useRef(false);
  const hasMoreRef = React.useRef(false);
  const queryRef = React.useRef(query);

  const loaderRef = React.useRef(loader);
  const mapRef = React.useRef(map);
  React.useEffect(() => {
    loaderRef.current = loader;
    mapRef.current = map;
  });

  const setLoadingBoth = React.useCallback((next: boolean) => {
    loadingRef.current = next;
    setLoading(next);
  }, []);
  const setHasMoreBoth = React.useCallback((next: boolean) => {
    hasMoreRef.current = next;
    setHasMore(next);
  }, []);

  // Clear the old results as soon as the query changes, so the sentinel can't
  // fetch the old query's next page during the debounce.
  const setQuery = React.useCallback(
    (next: string) => {
      if (next === queryRef.current) return;
      queryRef.current = next;
      setQueryState(next);
      if (!enabled) return;
      reqId.current += 1;
      pageRef.current = 0;
      setLoadingBoth(true);
      setHasMoreBoth(false);
      setOptions([]);
    },
    [enabled, setLoadingBoth, setHasMoreBoth],
  );

  React.useEffect(() => {
    if (!enabled) return;
    const id = ++reqId.current;
    const t = setTimeout(async () => {
      setLoadingBoth(true);
      setError(null);
      try {
        const res = await loaderRef.current({ query, page: 0 });
        if (id !== reqId.current) return;
        setOptions(res.items.map(mapRef.current));
        pageRef.current = 0;
        setHasMoreBoth(res.hasMore);
      } catch (e) {
        if (id === reqId.current) setError(e);
      } finally {
        if (id === reqId.current) setLoadingBoth(false);
      }
    }, debounce);

    return () => clearTimeout(t);
  }, [query, enabled, debounce, setLoadingBoth, setHasMoreBoth]);

  const loadMore = React.useCallback(async () => {
    if (!enabled || loadingRef.current || loadingMoreRef.current || !hasMoreRef.current) {
      return;
    }
    const id = reqId.current;
    const nextPage = pageRef.current + 1;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      const res = await loaderRef.current({ query: queryRef.current, page: nextPage });
      if (id !== reqId.current) return;
      setOptions((prev) => [...prev, ...res.items.map(mapRef.current)]);
      pageRef.current = nextPage;
      setHasMoreBoth(res.hasMore);
    } catch (e) {
      if (id === reqId.current) setError(e);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [enabled, setHasMoreBoth]);

  return {
    query,
    setQuery,
    options,
    loading,
    loadingMore,
    hasMore,
    error,
    loadMore,
  };
};

export { LazySelect, LazySelectTrigger, LazySelectContent, LazySelectItem };
