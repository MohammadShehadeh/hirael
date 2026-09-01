'use client';

import * as React from 'react';
import { Check, ChevronDown, Loader2, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/base/ui/popover';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/registry/hirael/bases/base/ui/command';

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
  /** Initial / search page is loading. */
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

const LazySelect = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  options = [],
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

  // The selected option may live on a page that is no longer loaded (the user
  // searched or scrolled past it), so cache labels by value to keep the
  // trigger label stable across queries.
  const [labelCache, setLabelCache] = React.useState<Record<string, string>>({});
  React.useEffect(() => {
    if (options.length === 0) return;
    setLabelCache((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const o of options) {
        if (next[o.value] !== o.label) {
          next[o.value] = o.label;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [options]);

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
  children?: React.ReactNode | ((ctx: Ctx) => React.ReactNode);
}

const LazySelectTrigger = ({ placeholder = 'Select…', className, children, ...props }: LazySelectTriggerProps) => {
  const ctx = useLazySelect();
  const showClear = !children && ctx.clearable && ctx.value !== undefined && !ctx.disabled;

  return (
    <div data-slot="lazy-select-trigger-wrapper" className="relative w-full">
      <PopoverTrigger
        render={
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
              'group flex h-9 w-full items-center justify-between gap-2 rounded-sm border border-input bg-transparent px-2.5 text-start text-sm outline-none transition-colors',
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
            <span
              className={cn(
                'min-w-0 flex-1 truncate',
                ctx.selectedLabel === undefined && 'text-muted-foreground',
                // Reserve room for the overlaid clear button.
                showClear && 'pe-5',
              )}
            >
              {ctx.selectedLabel ?? placeholder}
            </span>
            <span className="flex shrink-0 items-center gap-1 text-muted-foreground">
              <ChevronDown className={cn('size-3.5 transition-transform duration-150', ctx.open && 'rotate-180')} />
            </span>
          </>
        )}
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
          // Overlaid because a button cannot nest a button; `end-7` sits it inside the chevron.
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

  // Lazy-load the next page when the bottom sentinel scrolls into view. Re-run
  // when the loaded set changes so a sentinel that is still in view (list
  // shorter than the viewport) keeps paging; the loader guards against
  // overlapping requests.
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
      className={cn('w-(--anchor-width) min-w-[14rem] p-0', className)}
      initialFocus={() => inputRef.current}
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
                  <div className="py-3 text-center text-[10px] font-mono uppercase tracking-[0.08em] text-muted-foreground">
                    {endMessage}
                  </div>
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
        ctx.setValue(selected ? undefined : option.value, option);
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

/**
 * Drives a lazily paginated, debounced-search option source. Nothing is
 * fetched until `enabled` is true (wire it to the open state for true
 * lazy-on-open loading); changing the query resets to the first page, and
 * `loadMore` appends the next one.
 */
export const useLazySelectOptions = <T,>(
  loader: (params: { query: string; page: number }) => Promise<LazyPage<T>>,
  map: (item: T) => LazySelectOption,
  { debounce = 250, enabled = true }: { debounce?: number; enabled?: boolean } = {},
) => {
  const [query, setQuery] = React.useState('');
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
      const res = await loader({ query, page: nextPage });
      if (id !== reqId.current) return;
      setOptions((prev) => [...prev, ...res.items.map(map)]);
      pageRef.current = nextPage;
      setHasMoreBoth(res.hasMore);
    } catch (e) {
      if (id === reqId.current) setError(e);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [enabled, query, loader, map, setHasMoreBoth]);

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
