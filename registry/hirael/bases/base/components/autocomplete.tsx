'use client';

import * as React from 'react';
import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { Loader2Icon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { composeRefs } from '@/registry/hirael/bases/base/components/compose-refs';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/registry/hirael/bases/base/ui/input-group';
import { Popover } from '@/registry/hirael/bases/base/ui/popover';

export interface AutocompleteOption {
  /** The text written into the input when the suggestion is picked. */
  value: string;
  /** Secondary line shown under the suggestion. */
  description?: string;
  /** Suggestions sharing a group render under one heading, in first-seen order. */
  group?: string;
  /** Shown but can't be highlighted or picked. */
  disabled?: boolean;
}

export type AutocompleteStatus = 'idle' | 'loading' | 'empty' | 'error';

interface AutocompleteEntry {
  option: AutocompleteOption;
  index: number;
}

interface AutocompleteGroupData {
  label?: string;
  entries: AutocompleteEntry[];
}

interface SearchResult {
  query: string;
  options: AutocompleteOption[];
  error: boolean;
}

/** Prefix matches first, then matches anywhere in the value, case-insensitive. */
export const filterAutocompleteOptions = (options: AutocompleteOption[], query: string) => {
  const q = query.toLowerCase();
  const starts: AutocompleteOption[] = [];
  const contains: AutocompleteOption[] = [];
  for (const option of options) {
    const value = option.value.toLowerCase();
    if (value.startsWith(q)) starts.push(option);
    else if (value.includes(q)) contains.push(option);
  }

  return [...starts, ...contains];
};

const groupOptions = (options: AutocompleteOption[]) => {
  const groups: AutocompleteGroupData[] = [];
  const byLabel = new Map<string | undefined, AutocompleteGroupData>();
  for (const option of options) {
    let group = byLabel.get(option.group);
    if (!group) {
      group = { label: option.group, entries: [] };
      byLabel.set(option.group, group);
      groups.push(group);
    }
    group.entries.push({ option, index: -1 });
  }
  // Indexes follow the rendered order, so arrow keys walk the list top to bottom.
  let index = 0;
  for (const group of groups) {
    for (const entry of group.entries) entry.index = index++;
  }

  return groups;
};

const completionFor = (option: AutocompleteOption | undefined, typed: string) => {
  if (!option || option.disabled || !typed) return '';
  if (option.value.length <= typed.length) return '';
  if (!option.value.toLowerCase().startsWith(typed.toLowerCase())) return '';

  return option.value.slice(typed.length);
};

interface AutocompleteContextValue {
  id: string;
  listboxId: string;
  value: string;
  query: string;
  options: AutocompleteOption[];
  groups: AutocompleteGroupData[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  visible: boolean;
  status: AutocompleteStatus;
  loading: boolean;
  completion: string;
  inlineComplete: boolean;
  disabled?: boolean;
  name?: string;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  select: (option: AutocompleteOption) => void;
  inputHandlers: Pick<React.ComponentProps<'input'>, 'onChange' | 'onKeyDown' | 'onFocus' | 'onBlur'>;
}

const AutocompleteContext = React.createContext<AutocompleteContextValue | null>(null);

export const useAutocomplete = () => {
  const ctx = React.useContext(AutocompleteContext);
  if (!ctx) {
    throw new Error('Autocomplete compound parts must be used inside <Autocomplete>');
  }

  return ctx;
};

export interface AutocompleteProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'onSelect'> {
  /** The typed text. Any text is valid; suggestions only help fill it in. */
  value?: string;
  /** Initial text when uncontrolled. */
  defaultValue?: string;
  /** Called on every keystroke and when a suggestion is picked. */
  onValueChange?: (value: string) => void;
  /** Called with the final text when a suggestion is picked or Enter is pressed. */
  onValueCommit?: (value: string) => void;
  /** Called with the full suggestion when one is picked. */
  onOptionSelect?: (option: AutocompleteOption) => void;
  /** Local suggestions, filtered as you type. Ignored when `onSearch` is set. */
  items?: AutocompleteOption[];
  /** Loads suggestions for a query. The signal aborts when a newer query replaces it. */
  onSearch?: (query: string, signal: AbortSignal) => Promise<AutocompleteOption[]>;
  /** Replaces the default prefix-first filter for local `items`. */
  filter?: (options: AutocompleteOption[], query: string) => AutocompleteOption[];
  /** Milliseconds to wait after the last keystroke before calling `onSearch`. */
  debounce?: number;
  /** Characters needed before suggestions appear. */
  minLength?: number;
  /** Most local suggestions or recent entries to show. */
  limit?: number;
  /** Shows the rest of the top match as ghost text; Tab or the forward arrow key accepts it. */
  inlineComplete?: boolean;
  /** Earlier entries, shown when the input is empty. */
  recent?: string[];
  /** Heading above the recent entries. */
  recentLabel?: string;
  disabled?: boolean;
  /** Submits the typed text with a form. */
  name?: string;
}

const NO_OPTIONS: AutocompleteOption[] = [];
const NO_RECENT: string[] = [];

const Autocomplete = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  onOptionSelect,
  items = NO_OPTIONS,
  onSearch,
  filter = filterAutocompleteOptions,
  debounce = 250,
  minLength = 1,
  limit = 8,
  inlineComplete = false,
  recent = NO_RECENT,
  recentLabel = 'Recent',
  disabled,
  name,
  className,
  children,
  ...props
}: AutocompleteProps) => {
  const id = React.useId();
  const listboxId = `${id}-listbox`;
  const anchorRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
  const value = valueProp ?? internalValue;
  const setValue = React.useCallback(
    (next: string) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [result, setResult] = React.useState<SearchResult | null>(null);

  const query = value.trim();
  const showRecent = query.length === 0 && recent.length > 0;
  const searchable = query.length >= minLength;
  const searchQuery = onSearch && open && !disabled && searchable ? query : null;
  const loading = searchQuery !== null && result?.query !== searchQuery;

  const onSearchRef = React.useRef(onSearch);
  React.useEffect(() => {
    onSearchRef.current = onSearch;
  });

  React.useEffect(() => {
    if (searchQuery === null) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      onSearchRef.current?.(searchQuery, controller.signal).then(
        (options) => {
          if (!controller.signal.aborted) setResult({ query: searchQuery, options, error: false });
        },
        () => {
          if (!controller.signal.aborted) setResult({ query: searchQuery, options: [], error: true });
        },
      );
    }, debounce);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, debounce]);

  const options = React.useMemo<AutocompleteOption[]>(() => {
    if (showRecent) return recent.slice(0, limit).map((entry) => ({ value: entry, group: recentLabel }));
    if (!searchable) return NO_OPTIONS;
    // Stale results stay up while the next query loads, so the list doesn't flicker.
    if (onSearch) return result?.options ?? NO_OPTIONS;

    return filter(items, query).slice(0, limit);
  }, [showRecent, recent, limit, recentLabel, searchable, onSearch, result, filter, items, query]);

  const groups = React.useMemo(() => groupOptions(options), [options]);
  const ordered = React.useMemo(() => groups.flatMap((group) => group.entries.map((entry) => entry.option)), [groups]);

  let status: AutocompleteStatus = 'idle';
  if (!showRecent && searchable) {
    if (loading) status = 'loading';
    else if (onSearch && result?.error) status = 'error';
    else if (ordered.length === 0) status = 'empty';
  }

  const visible = open && !disabled && (ordered.length > 0 || status !== 'idle');

  const [lastQuery, setLastQuery] = React.useState(query);
  if (lastQuery !== query) {
    setLastQuery(query);
    setActiveIndex(-1);
  }
  const active = visible && activeIndex < ordered.length ? activeIndex : -1;

  const candidate = active >= 0 ? ordered[active] : ordered.find((option) => completionFor(option, value));
  const completion = inlineComplete && visible ? completionFor(candidate, value) : '';

  const select = React.useCallback(
    (option: AutocompleteOption) => {
      if (option.disabled) return;
      setValue(option.value);
      setOpen(false);
      onOptionSelect?.(option);
      onValueCommit?.(option.value);
    },
    [setValue, onOptionSelect, onValueCommit],
  );

  const close = React.useCallback(() => setOpen(false), []);

  const move = React.useCallback(
    (step: 1 | -1) => {
      const count = ordered.length;
      if (count === 0) return;
      let next = active;
      for (let i = 0; i < count; i++) {
        next = next + step;
        if (next >= count) next = 0;
        if (next < 0) next = count - 1;
        if (!ordered[next].disabled) {
          setActiveIndex(next);

          return;
        }
      }
    },
    [ordered, active],
  );

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      // Enter confirming an IME composition must not pick a suggestion.
      if (event.nativeEvent.isComposing || event.keyCode === 229) return;
      const input = event.currentTarget;
      const forward = getComputedStyle(input).direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
      const caretAtEnd = input.selectionStart === input.selectionEnd && input.selectionEnd === input.value.length;

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowUp':
          event.preventDefault();
          if (!visible) setOpen(true);
          else move(event.key === 'ArrowDown' ? 1 : -1);
          break;
        case 'Enter':
          if (visible && active >= 0) {
            event.preventDefault();
            select(ordered[active]);
          } else if (query) {
            setOpen(false);
            onValueCommit?.(value);
          }
          break;
        case 'Escape':
          if (visible) {
            event.preventDefault();
            setOpen(false);
          } else if (value) {
            event.preventDefault();
            setValue('');
          }
          break;
        case 'Tab':
          if (completion && candidate && !event.shiftKey) {
            event.preventDefault();
            select(candidate);
          }
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          if (event.key === forward && completion && candidate && caretAtEnd) {
            event.preventDefault();
            select(candidate);
          }
          break;
      }
    },
    [visible, move, active, select, ordered, query, onValueCommit, value, setValue, completion, candidate],
  );

  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
      setOpen(true);
    },
    [setValue],
  );

  const onFocus = React.useCallback(() => {
    if (!value) setOpen(true);
  }, [value]);

  const inputHandlers = React.useMemo<AutocompleteContextValue['inputHandlers']>(
    () => ({ onChange, onKeyDown, onFocus, onBlur: close }),
    [onChange, onKeyDown, onFocus, close],
  );

  React.useEffect(() => {
    if (active < 0) return;
    document.getElementById(`${id}-option-${active}`)?.scrollIntoView?.({ block: 'nearest' });
  }, [active, id]);

  const ctx = React.useMemo<AutocompleteContextValue>(
    () => ({
      id,
      listboxId,
      value,
      query,
      options: ordered,
      groups,
      activeIndex: active,
      setActiveIndex,
      visible,
      status,
      loading,
      completion,
      inlineComplete,
      disabled,
      name,
      anchorRef,
      inputRef,
      select,
      inputHandlers,
    }),
    [
      id,
      listboxId,
      value,
      query,
      ordered,
      groups,
      active,
      visible,
      status,
      loading,
      completion,
      inlineComplete,
      disabled,
      name,
      select,
      inputHandlers,
    ],
  );

  return (
    <AutocompleteContext.Provider value={ctx}>
      <Popover
        open={visible}
        onOpenChange={(next, details) => {
          if (next) return;
          // The input handles Escape itself (close, then clear), and pressing the input isn't outside.
          if (details.reason === 'escape-key') return;
          const target = details.event?.target;
          if (target instanceof Node && anchorRef.current?.contains(target)) return;
          setOpen(false);
        }}
      >
        <div data-slot="autocomplete" className={cn('w-full', className)} {...props}>
          {children}
        </div>
      </Popover>
    </AutocompleteContext.Provider>
  );
};

/**
 * The consumer's handler runs first; the part's own is skipped once that handler prevents default.
 * An event that arrived already prevented (a popover's document listener) still reaches the part.
 */
const chainHandlers =
  <E extends React.SyntheticEvent>(theirs: ((event: E) => void) | undefined, ours: ((event: E) => void) | undefined) =>
  (event: E) => {
    const arrivedPrevented = event.defaultPrevented;
    theirs?.(event);
    if (arrivedPrevented || !event.defaultPrevented) ours?.(event);
  };

interface AutocompleteInputProps extends Omit<React.ComponentProps<'input'>, 'value' | 'defaultValue' | 'name'> {
  /** Classes for the `<input>` itself; `className` goes on the surrounding group. */
  inputClassName?: string;
  /** Addons such as a leading icon, rendered inside the input group. */
  children?: React.ReactNode;
}

const AutocompleteInput = ({
  className,
  inputClassName,
  children,
  disabled,
  ref,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
  ...props
}: AutocompleteInputProps) => {
  const {
    id,
    listboxId,
    value,
    visible,
    activeIndex,
    completion,
    inlineComplete,
    loading,
    name,
    anchorRef,
    inputRef,
    inputHandlers,
    disabled: rootDisabled,
  } = useAutocomplete();
  const ghostRef = React.useRef<HTMLDivElement>(null);
  const isDisabled = rootDisabled || disabled;
  const composedRef = React.useMemo(() => composeRefs(inputRef, ref), [inputRef, ref]);

  // The ghost copies the input's measured box, so it lines up whatever padding the input group applies.
  React.useLayoutEffect(() => {
    const input = inputRef.current;
    const ghost = ghostRef.current;
    if (!input || !ghost) return;
    const style = getComputedStyle(input);
    ghost.style.left = `${input.offsetLeft}px`;
    ghost.style.top = `${input.offsetTop}px`;
    ghost.style.width = `${input.offsetWidth}px`;
    ghost.style.height = `${input.offsetHeight}px`;
    ghost.style.lineHeight = `${input.offsetHeight}px`;
    ghost.style.paddingLeft = `${parseFloat(style.paddingLeft) + parseFloat(style.borderLeftWidth)}px`;
    ghost.style.paddingRight = `${parseFloat(style.paddingRight) + parseFloat(style.borderRightWidth)}px`;
    ghost.style.fontFamily = style.fontFamily;
    ghost.style.fontSize = style.fontSize;
    ghost.style.fontWeight = style.fontWeight;
    ghost.style.letterSpacing = style.letterSpacing;
    // Once the text scrolls inside the input the overlay can't line up, so it steps aside.
    ghost.style.visibility = input.scrollLeft === 0 ? '' : 'hidden';
  });

  return (
    <InputGroup
      ref={anchorRef}
      data-slot="autocomplete-control"
      data-disabled={isDisabled ? 'true' : undefined}
      className={className}
    >
      {children}
      {completion && (
        <div
          ref={ghostRef}
          aria-hidden
          dir="auto"
          data-slot="autocomplete-ghost"
          className="pointer-events-none absolute overflow-hidden text-sm whitespace-pre text-muted-foreground"
        >
          <span className="invisible">{value}</span>
          {completion}
        </div>
      )}
      <InputGroupInput
        ref={composedRef}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-autocomplete={inlineComplete ? 'both' : 'list'}
        aria-expanded={visible}
        aria-controls={visible ? listboxId : undefined}
        aria-activedescendant={activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined}
        // Ghost text only lines up when the input and overlay share the typed text's direction.
        dir={inlineComplete && value ? 'auto' : undefined}
        data-slot="autocomplete-input"
        name={name}
        value={value}
        disabled={isDisabled}
        className={inputClassName}
        {...props}
        onChange={chainHandlers(onChange, inputHandlers.onChange)}
        onKeyDown={chainHandlers(onKeyDown, inputHandlers.onKeyDown)}
        onFocus={chainHandlers(onFocus, inputHandlers.onFocus)}
        onBlur={chainHandlers(onBlur, inputHandlers.onBlur)}
      />
      {loading && (
        <InputGroupAddon align="inline-end" data-slot="autocomplete-spinner">
          <Loader2Icon className="animate-spin" />
        </InputGroupAddon>
      )}
    </InputGroup>
  );
};

interface AutocompleteContentProps
  extends
    Omit<PopoverPrimitive.Popup.Props, 'children' | 'className'>,
    Pick<PopoverPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'> {
  className?: string;
  /** Accessible name for the suggestion list. */
  label?: string;
  /** Shown when nothing matches the typed text. */
  emptyMessage?: React.ReactNode;
  /** Shown while `onSearch` is loading and there is nothing to show yet. */
  loadingMessage?: React.ReactNode;
  /** Shown when `onSearch` rejects. */
  errorMessage?: React.ReactNode;
  /** Renders a suggestion's content. Defaults to the value with the match in bold, plus its description. */
  renderOption?: (option: AutocompleteOption) => React.ReactNode;
}

const AutocompleteContent = ({
  className,
  align = 'start',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 6,
  label = 'Suggestions',
  emptyMessage = 'No suggestions.',
  loadingMessage = 'Searching…',
  errorMessage = 'Could not load suggestions.',
  renderOption,
  ...props
}: AutocompleteContentProps) => {
  const ctx = useAutocomplete();
  const message = { idle: null, loading: loadingMessage, empty: emptyMessage, error: errorMessage }[ctx.status];

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        anchor={ctx.anchorRef}
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          role="presentation"
          data-slot="autocomplete-content"
          className={cn(
            'z-50 flex w-(--anchor-width) min-w-48 origin-(--transform-origin) flex-col rounded-md bg-popover p-1 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
            className,
          )}
          {...props}
          // Focus never leaves the input: the list is driven through aria-activedescendant.
          initialFocus={false}
          finalFocus={false}
          onMouseDown={(event) => event.preventDefault()}
        >
          <div
            id={ctx.listboxId}
            role="listbox"
            aria-label={label}
            data-slot="autocomplete-list"
            className="max-h-72 scroll-py-1 overflow-y-auto"
          >
            {ctx.groups.map((group, groupIndex) =>
              group.label ? (
                <div
                  key={`${groupIndex}-${group.label}`}
                  role="group"
                  aria-labelledby={`${ctx.id}-group-${groupIndex}`}
                  data-slot="autocomplete-group"
                >
                  <div
                    id={`${ctx.id}-group-${groupIndex}`}
                    data-slot="autocomplete-group-label"
                    className="px-2 py-1.5 text-xs font-medium text-muted-foreground"
                  >
                    {group.label}
                  </div>
                  {group.entries.map(({ option, index }) => (
                    <AutocompleteItem key={`${index}-${option.value}`} option={option} index={index}>
                      {renderOption?.(option)}
                    </AutocompleteItem>
                  ))}
                </div>
              ) : (
                group.entries.map(({ option, index }) => (
                  <AutocompleteItem key={`${index}-${option.value}`} option={option} index={index}>
                    {renderOption?.(option)}
                  </AutocompleteItem>
                ))
              ),
            )}
          </div>
          {ctx.options.length === 0 && message && (
            <div
              role="status"
              data-slot="autocomplete-status"
              data-status={ctx.status}
              className="flex items-center justify-center gap-2 px-2 py-5 text-sm text-muted-foreground"
            >
              {ctx.status === 'loading' && <Loader2Icon className="size-4 animate-spin" />}
              {message}
            </div>
          )}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
};

interface AutocompleteItemProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  option: AutocompleteOption;
  /** Position in the rendered list, used for keyboard highlight. */
  index: number;
  children?: React.ReactNode;
}

const AutocompleteItem = ({
  option,
  index,
  className,
  children,
  onClick,
  onMouseMove,
  ...props
}: AutocompleteItemProps) => {
  const ctx = useAutocomplete();
  const active = index === ctx.activeIndex;

  return (
    <div
      id={`${ctx.id}-option-${index}`}
      role="option"
      aria-selected={active}
      aria-disabled={option.disabled || undefined}
      data-slot="autocomplete-item"
      data-active={active || undefined}
      data-disabled={option.disabled || undefined}
      onMouseMove={(event) => {
        onMouseMove?.(event);
        if (!event.defaultPrevented && !active && !option.disabled) ctx.setActiveIndex(index);
      }}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) ctx.select(option);
      }}
      className={cn(
        'flex cursor-default flex-col gap-0.5 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none',
        'data-[active]:bg-accent data-[active]:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <AutocompleteHighlight text={option.value} />
          {option.description && (
            <span data-slot="autocomplete-item-description" className="truncate text-xs text-muted-foreground">
              {option.description}
            </span>
          )}
        </>
      )}
    </div>
  );
};

interface AutocompleteHighlightProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  /** The full text to render. */
  text: string;
  /** The part to emphasize. Defaults to the typed text. */
  query?: string;
}

const AutocompleteHighlight = ({ text, query, className, ...props }: AutocompleteHighlightProps) => {
  const ctx = React.useContext(AutocompleteContext);
  const needle = (query ?? ctx?.query ?? '').toLowerCase();
  const at = needle ? text.toLowerCase().indexOf(needle) : -1;

  return (
    <span data-slot="autocomplete-highlight" className={cn('truncate', className)} {...props}>
      {at < 0 ? (
        text
      ) : (
        <>
          {text.slice(0, at)}
          <mark data-slot="autocomplete-match" className="bg-transparent font-semibold text-current">
            {text.slice(at, at + needle.length)}
          </mark>
          {text.slice(at + needle.length)}
        </>
      )}
    </span>
  );
};

export { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem, AutocompleteHighlight };
