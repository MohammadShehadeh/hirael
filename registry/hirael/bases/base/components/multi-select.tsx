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
  open: boolean;
  setOpen: (open: boolean) => void;
  maxCount?: number;
  disabled?: boolean;
  loading?: boolean;
  toggle: (v: string) => void;
  remove: (v: string) => void;
  clear: () => void;
  listboxId: string;
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
  name?: string;
  children?: React.ReactNode;
}

const NO_OPTIONS: MultiSelectOption[] = [];

const MultiSelect = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  options = NO_OPTIONS,
  maxCount,
  disabled,
  loading,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  name,
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

  const toggle = React.useCallback(
    (v: string) => {
      if (value.includes(v)) setValue(value.filter((x) => x !== v));
      else if (maxCount === undefined || value.length < maxCount) setValue([...value, v]);
    },
    [value, setValue, maxCount],
  );

  const remove = React.useCallback((v: string) => setValue(value.filter((x) => x !== v)), [value, setValue]);

  // Disabled options can't be toggled back on, so clearing keeps them.
  const clear = React.useCallback(
    () => setValue(value.filter((v) => options.some((o) => o.value === v && o.disabled))),
    [value, setValue, options],
  );

  const listboxId = React.useId();

  const ctx = React.useMemo<MultiSelectContextValue>(
    () => ({
      value,
      setValue,
      options,
      open,
      setOpen,
      maxCount,
      disabled,
      loading,
      toggle,
      remove,
      clear,
      listboxId,
    }),
    [value, setValue, options, open, setOpen, maxCount, disabled, loading, toggle, remove, clear, listboxId],
  );

  return (
    <MultiSelectContext.Provider value={ctx}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
      {name && value.map((v) => <input key={v} type="hidden" name={name} value={v} />)}
    </MultiSelectContext.Provider>
  );
};

// Div, not a button: chip remove buttons cannot nest inside a button.
interface MultiSelectTriggerProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  placeholder?: string;
  disabled?: boolean;
}

const MultiSelectTrigger = ({ placeholder = 'Select…', className, disabled, ...props }: MultiSelectTriggerProps) => {
  const ctx = useMultiSelect();
  const selected = ctx.options.filter((o) => ctx.value.includes(o.value));
  const isDisabled = ctx.disabled || disabled;

  return (
    <PopoverTrigger
      nativeButton={false}
      disabled={isDisabled}
      render={
        <div
          role="combobox"
          aria-controls={ctx.listboxId}
          aria-expanded={ctx.open}
          aria-haspopup="listbox"
          data-slot="multi-select-trigger"
          className={cn(
            'group flex min-h-9 w-full items-center justify-between gap-2 rounded-sm border border-input bg-transparent px-2 py-1 text-start text-sm transition-colors outline-none',
            'focus-within:border-ring hover:border-ring/60',
            'data-popup-open:border-ring',
            isDisabled && 'cursor-not-allowed opacity-50',
            className,
          )}
          {...props}
        />
      }
    >
      {selected.length > 0 && (
        <span
          data-slot="multi-select-chips"
          onClick={(event) => event.stopPropagation()}
          className="flex flex-wrap items-center gap-1"
        >
          {selected.map((opt) => (
            <Badge key={opt.value} variant="default" data-slot="multi-select-chip" className="gap-1 pe-1">
              {opt.label}
              {!isDisabled && (
                <button
                  type="button"
                  data-slot="multi-select-chip-remove"
                  aria-label={`Remove ${opt.label}`}
                  onClick={() => ctx.remove(opt.value)}
                  className="ms-0.5 inline-flex size-3.5 items-center justify-center rounded-[2px] text-primary-foreground/70 hover:bg-primary-foreground/20 hover:text-primary-foreground"
                >
                  <X className="size-2.5" />
                </button>
              )}
            </Badge>
          ))}
        </span>
      )}
      <span className="flex flex-1 flex-wrap items-center gap-1">
        {selected.length === 0 && <span className="px-1 text-muted-foreground">{placeholder}</span>}
      </span>
      <span className="flex shrink-0 items-center gap-1.5 text-muted-foreground">
        {selected.length > 0 && (
          <span className="text-[10px] tabular-nums">
            {selected.length}
            {ctx.maxCount ? `/${ctx.maxCount}` : ''}
          </span>
        )}
        <ChevronDown className="size-3.5 transition-transform duration-150 group-data-[popup-open]:rotate-180 motion-reduce:transition-none" />
      </span>
    </PopoverTrigger>
  );
};

interface MultiSelectContentProps extends React.ComponentProps<typeof PopoverContent> {
  searchPlaceholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  selectAllLabel?: string;
  clearLabel?: string;
  children?: React.ReactNode;
}

const MultiSelectContent = ({
  className,
  searchPlaceholder = 'Search…',
  emptyMessage = 'Nothing found.',
  loadingMessage = 'Loading…',
  selectAllLabel = 'Select all',
  clearLabel = 'Clear',
  children,
  ...props
}: MultiSelectContentProps) => {
  const ctx = useMultiSelect();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const enabled = ctx.options.filter((o) => !o.disabled);
  const locked = ctx.options.filter((o) => o.disabled && ctx.value.includes(o.value)).map((o) => o.value);
  const allSelected = enabled.length > 0 && enabled.every((o) => ctx.value.includes(o.value));
  const showSelectAllItem = enabled.length > 0;
  const showClearItem = ctx.value.length > locked.length && !(showSelectAllItem && allSelected);

  const groups = new Map<string | undefined, MultiSelectOption[]>();
  for (const opt of ctx.options) groups.set(opt.group, [...(groups.get(opt.group) ?? []), opt]);

  return (
    <PopoverContent
      align="start"
      sideOffset={6}
      data-slot="multi-select-content"
      className={cn('w-(--anchor-width) min-w-56 p-0', className)}
      initialFocus={() => inputRef.current}
      {...props}
    >
      <Command shouldFilter loop>
        <CommandInput ref={inputRef} placeholder={searchPlaceholder} />
        <CommandList id={ctx.listboxId}>
          {ctx.loading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              {loadingMessage}
            </div>
          ) : (
            <>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              {children ??
                [...groups].map(([group, items]) => (
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
                            const room = Math.max(0, (ctx.maxCount ?? Infinity) - locked.length);
                            ctx.setValue([...locked, ...enabled.map((o) => o.value).slice(0, room)]);
                          }
                        }}
                        className="justify-between"
                      >
                        <span className="text-xs uppercase">{allSelected ? clearLabel : selectAllLabel}</span>
                        <span className="text-[10px] text-muted-foreground tabular-nums">
                          {ctx.value.length} / {enabled.length}
                        </span>
                      </CommandItem>
                    )}
                    {showClearItem && (
                      <CommandItem onSelect={() => ctx.clear()} className="justify-between">
                        <span className="text-xs uppercase">{clearLabel}</span>
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

export { MultiSelect, MultiSelectTrigger, MultiSelectContent, MultiSelectItem };
