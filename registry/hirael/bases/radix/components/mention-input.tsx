'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Spinner } from '@/registry/hirael/bases/radix/components/spinner';
import { composeRefs } from '@/registry/hirael/bases/radix/components/compose-refs';

export interface MentionItem {
  id: string;
  label: string;
  description?: string;
}

interface ActiveMention {
  start: number;
  trigger: string;
  query: string;
}

const MIRROR_PROPS = [
  'box-sizing',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'letter-spacing',
  'line-height',
  'text-transform',
  'word-spacing',
  'text-indent',
  'tab-size',
  'direction',
] as const;

const escapeForCharClass = (ch: string) => {
  return ch.replace(/[\\\]^-]/g, '\\$&');
};

const triggerCharClass = (triggers: string[]) => {
  return triggers.map(escapeForCharClass).join('');
};

export const getMentions = (value: string, trigger: string | string[] = '@'): string[] => {
  const triggers = Array.isArray(trigger) ? trigger : [trigger];
  const re = new RegExp(`(?:^|\\s)[${triggerCharClass(triggers)}]([\\w.\\-]+)`, 'g');
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(value)) !== null) out.push(m[1]);
  return out;
};

const getActiveMention = (text: string, caret: number, triggers: string[]): ActiveMention | null => {
  for (let i = caret - 1; i >= 0; i--) {
    const ch = text[i];
    if (/\s/.test(ch)) return null;
    if (triggers.includes(ch)) {
      if (i === 0 || /\s/.test(text[i - 1])) {
        return { start: i, trigger: ch, query: text.slice(i + 1, caret) };
      }
      return null;
    }
  }
  return null;
};

const measureCaret = (textarea: HTMLTextAreaElement, index: number) => {
  const style = window.getComputedStyle(textarea);
  const mirror = document.createElement('div');
  for (const prop of MIRROR_PROPS) {
    mirror.style.setProperty(prop, style.getPropertyValue(prop));
  }
  mirror.style.position = 'absolute';
  mirror.style.top = '0';
  mirror.style.left = '0';
  mirror.style.visibility = 'hidden';
  mirror.style.whiteSpace = 'pre-wrap';
  mirror.style.overflowWrap = 'break-word';
  mirror.style.width = `${textarea.offsetWidth}px`;
  mirror.textContent = textarea.value.slice(0, index);
  const marker = document.createElement('span');
  marker.textContent = '​';
  mirror.appendChild(marker);
  (textarea.parentElement ?? document.body).appendChild(mirror);
  const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
  const rect = {
    top: marker.offsetTop,
    left: marker.offsetLeft,
    height: lineHeight,
  };
  mirror.remove();
  return rect;
};

interface Segment {
  text: string;
  mention: boolean;
}

const segmentValue = (value: string, triggers: string[], known: Set<string>): Segment[] => {
  const re = new RegExp(`(^|\\s)([${triggerCharClass(triggers)}][\\w.\\-]+)`, 'g');
  const segments: Segment[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(value)) !== null) {
    const start = m.index + m[1].length;
    const token = m[2];
    if (!known.has(token.slice(1).toLowerCase())) continue;
    if (start > last) segments.push({ text: value.slice(last, start), mention: false });
    segments.push({ text: token, mention: true });
    last = start + token.length;
  }
  if (last < value.length) segments.push({ text: value.slice(last), mention: false });
  return segments;
};

const metrics = 'min-h-16 w-full rounded-sm border px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words';

interface MentionInputCtx {
  id: string;
  listboxId: string;
  open: boolean;
  loading: boolean;
  filteredItems: MentionItem[];
  activeIndex: number;
  activeTrigger: string | undefined;
  pos: { top: number; left: number };
  value: string;
  segments: Segment[];
  disabled?: boolean;
  placeholder?: string;
  name?: string;
  emptyMessage: string;
  loadingMessage: string;
  listLabel: string;
  popupRef: React.RefObject<HTMLDivElement | null>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  backdropRef: React.RefObject<HTMLDivElement | null>;
  select: (item: MentionItem) => void;
  setActiveIndex: (index: number) => void;
  /**
   * Caret, scroll sync and suggestion keys all read state from here, so the
   * handlers stay put and travel as one bundle for the textarea to spread.
   */
  textareaProps: Pick<React.ComponentProps<'textarea'>, 'onChange' | 'onSelect' | 'onScroll' | 'onKeyDown' | 'onBlur'>;
}

const MentionInputContext = React.createContext<MentionInputCtx | null>(null);

export const useMentionInput = () => {
  const ctx = React.useContext(MentionInputContext);
  if (!ctx) {
    throw new Error('MentionInput compound parts must be used inside <MentionInput>');
  }
  return ctx;
};

export interface MentionInputProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  items?: MentionItem[];
  onSearch?: (query: string, trigger: string) => Promise<MentionItem[]>;
  trigger?: string | string[];
  placeholder?: string;
  disabled?: boolean;
  maxRows?: number;
  onMention?: (item: MentionItem) => void;
  emptyMessage?: string;
  loadingMessage?: string;
  listLabel?: string;
  name?: string;
}

const MentionInput = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  items = [],
  onSearch,
  trigger = '@',
  placeholder,
  disabled,
  maxRows,
  onMention,
  emptyMessage = 'No results.',
  loadingMessage = 'Searching…',
  listLabel = 'Mention suggestions',
  name,
  className,
  children,
  ref,
  ...props
}: MentionInputProps) => {
  const id = React.useId();
  const listboxId = `${id}-listbox`;

  const triggers = React.useMemo(() => (Array.isArray(trigger) ? trigger : [trigger]), [trigger]);

  const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
  const value = valueProp ?? internalValue;
  const setValue = React.useCallback(
    (next: string) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const [mention, setMention] = React.useState<ActiveMention | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [asyncItems, setAsyncItems] = React.useState<MentionItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedLabels, setSelectedLabels] = React.useState<string[]>([]);
  const [pos, setPos] = React.useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const composedWrapperRef = React.useMemo(() => composeRefs(wrapperRef, ref), [ref]);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const backdropRef = React.useRef<HTMLDivElement | null>(null);
  const popupRef = React.useRef<HTMLDivElement | null>(null);
  const dismissedRef = React.useRef(false);

  const open = mention !== null && !disabled;

  const filtered = React.useMemo(() => {
    if (onSearch) return asyncItems;
    if (!mention) return [];
    const q = mention.query.toLowerCase();
    return items.filter((it) => it.label.toLowerCase().includes(q) || it.description?.toLowerCase().includes(q));
  }, [onSearch, asyncItems, items, mention]);

  const active = Math.min(activeIndex, Math.max(filtered.length - 1, 0));

  const known = React.useMemo(() => {
    const set = new Set<string>();
    for (const it of items) set.add(it.label.toLowerCase());
    for (const label of selectedLabels) set.add(label.toLowerCase());
    return set;
  }, [items, selectedLabels]);

  const segments = React.useMemo(() => segmentValue(value, triggers, known), [value, triggers, known]);

  const activeQuery = mention?.query;
  const activeTrigger = mention?.trigger;

  const onSearchRef = React.useRef(onSearch);
  React.useEffect(() => {
    onSearchRef.current = onSearch;
  });

  React.useEffect(() => {
    setActiveIndex(0);
  }, [activeQuery, activeTrigger]);

  React.useEffect(() => {
    if (!onSearchRef.current || activeQuery === undefined || activeTrigger === undefined) {
      return;
    }
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(() => {
      onSearchRef.current!(activeQuery, activeTrigger)
        .then((res) => {
          if (cancelled) return;
          setAsyncItems(res);
          setLoading(false);
        })
        .catch(() => {
          if (cancelled) return;
          setAsyncItems([]);
          setLoading(false);
        });
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [activeQuery, activeTrigger]);

  React.useLayoutEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    const style = window.getComputedStyle(ta);
    const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
    const borders = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    const max = maxRows
      ? lineHeight * maxRows + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + borders
      : Infinity;
    ta.style.height = `${Math.min(ta.scrollHeight + borders, max)}px`;
    ta.style.overflowY = ta.scrollHeight + borders > max ? 'auto' : 'hidden';
    const backdrop = backdropRef.current;
    if (backdrop) {
      backdrop.scrollTop = ta.scrollTop;
      backdrop.scrollLeft = ta.scrollLeft;
    }
  }, [value, maxRows]);

  React.useLayoutEffect(() => {
    if (!mention) return;
    const ta = textareaRef.current;
    const wrap = wrapperRef.current;
    const pop = popupRef.current;
    if (!ta || !wrap || !pop) return;
    const caret = measureCaret(ta, mention.start);
    const caretTop = caret.top - ta.scrollTop;
    const caretLeft = caret.left - ta.scrollLeft;
    const popRect = pop.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    let top = caretTop + caret.height + 4;
    const spaceBelow = window.innerHeight - (wrapRect.top + top);
    if (popRect.height > spaceBelow && wrapRect.top + caretTop - popRect.height - 4 > 0) {
      top = caretTop - popRect.height - 4;
    }
    let left = caretLeft;
    left = Math.min(left, wrap.clientWidth - popRect.width);
    left = Math.max(0, left);
    setPos({ top, left });
  }, [mention, filtered.length, loading]);

  React.useEffect(() => {
    if (!open) return;
    const close = () => setMention(null);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const el = document.getElementById(`${id}-option-${active}`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [open, active, id]);

  React.useEffect(() => {
    setSelectedLabels((prev) => {
      if (prev.length === 0) return prev;
      const present = new Set(getMentions(value, triggers).map((m) => m.toLowerCase()));
      const next = prev.filter((label) => present.has(label.toLowerCase()));
      return next.length === prev.length ? prev : next;
    });
  }, [value, triggers]);

  const detect = React.useCallback(
    (text: string, caret: number) => {
      const next = dismissedRef.current ? null : getActiveMention(text, caret, triggers);
      setMention((prev) => {
        if (prev === null && next === null) return prev;
        if (prev && next && prev.start === next.start && prev.trigger === next.trigger && prev.query === next.query) {
          return prev;
        }
        return next;
      });
    },
    [triggers],
  );

  const select = React.useCallback(
    (item: MentionItem) => {
      const ta = textareaRef.current;
      if (!ta || !mention) return;
      const caret = ta.selectionStart;
      const inserted = `${mention.trigger}${item.label} `;
      const next = value.slice(0, mention.start) + inserted + value.slice(caret);
      setValue(next);
      setSelectedLabels((prev) => (prev.includes(item.label) ? prev : [...prev, item.label]));
      onMention?.(item);
      setMention(null);
      const position = mention.start + inserted.length;
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(position, position);
      });
    },
    [mention, value, setValue, onMention],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!open) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(filtered.length ? (active + 1) % filtered.length : 0);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(filtered.length ? (active - 1 + filtered.length) % filtered.length : 0);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        const item = filtered[active];
        if (item) {
          e.preventDefault();
          select(item);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        dismissedRef.current = true;
        setMention(null);
      }
    },
    [open, filtered, active, select],
  );

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      dismissedRef.current = false;
      setValue(e.target.value);
      detect(e.target.value, e.target.selectionStart);
    },
    [setValue, detect],
  );

  const handleSelect = React.useCallback(
    (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
      detect(e.currentTarget.value, e.currentTarget.selectionStart);
    },
    [detect],
  );

  const handleScroll = React.useCallback(
    (e: React.UIEvent<HTMLTextAreaElement>) => {
      const backdrop = backdropRef.current;
      if (backdrop) {
        backdrop.scrollTop = e.currentTarget.scrollTop;
        backdrop.scrollLeft = e.currentTarget.scrollLeft;
      }
      if (open) setMention(null);
    },
    [open],
  );

  const handleBlur = React.useCallback(() => setMention(null), []);

  const textareaProps = React.useMemo<MentionInputCtx['textareaProps']>(
    () => ({
      onChange: handleChange,
      onSelect: handleSelect,
      onScroll: handleScroll,
      onKeyDown: handleKeyDown,
      onBlur: handleBlur,
    }),
    [handleChange, handleSelect, handleScroll, handleKeyDown, handleBlur],
  );

  const ctx = React.useMemo<MentionInputCtx>(
    () => ({
      id,
      listboxId,
      open,
      loading,
      filteredItems: filtered,
      activeIndex: active,
      activeTrigger,
      pos,
      value,
      segments,
      disabled,
      placeholder,
      name,
      emptyMessage,
      loadingMessage,
      listLabel,
      popupRef,
      textareaRef,
      backdropRef,
      select,
      setActiveIndex,
      textareaProps,
    }),
    [
      id,
      listboxId,
      open,
      loading,
      filtered,
      active,
      activeTrigger,
      pos,
      value,
      segments,
      disabled,
      placeholder,
      name,
      emptyMessage,
      loadingMessage,
      listLabel,
      select,
      textareaProps,
    ],
  );

  return (
    <MentionInputContext.Provider value={ctx}>
      <div
        ref={composedWrapperRef}
        data-slot="mention-input"
        data-disabled={disabled || undefined}
        className={cn('relative w-full', className)}
        {...props}
      >
        {children ?? (
          <>
            <MentionInputTextarea />
            <MentionInputList />
          </>
        )}
      </div>
    </MentionInputContext.Provider>
  );
};

type MentionInputTextareaProps = Omit<
  React.ComponentProps<'textarea'>,
  'value' | 'defaultValue' | 'name' | 'placeholder' | 'disabled'
>;

/** The consumer's handler runs first; the part's own is skipped once the event is default-prevented. */
const chainHandlers =
  <E extends React.SyntheticEvent>(theirs: ((event: E) => void) | undefined, ours: ((event: E) => void) | undefined) =>
  (event: E) => {
    theirs?.(event);
    if (!event.defaultPrevented) ours?.(event);
  };

const MentionInputTextarea = ({
  className,
  ref,
  onChange,
  onSelect,
  onScroll,
  onKeyDown,
  onBlur,
  ...props
}: MentionInputTextareaProps) => {
  const {
    id,
    listboxId,
    open,
    filteredItems,
    activeIndex,
    value,
    segments,
    disabled,
    placeholder,
    name,
    backdropRef,
    textareaRef,
    textareaProps,
  } = useMentionInput();
  const composedRef = React.useMemo(() => composeRefs(textareaRef, ref), [textareaRef, ref]);
  return (
    <>
      <div
        ref={backdropRef}
        aria-hidden
        data-slot="mention-input-backdrop"
        // The consumer's className lands on both layers so padding and font metrics
        // stay aligned; the transparent overrides come last and win.
        className={cn(
          metrics,
          className,
          'pointer-events-none absolute inset-0 overflow-hidden border-transparent text-transparent',
        )}
      >
        {segments.map((seg, i) =>
          seg.mention ? (
            <span
              key={i}
              data-slot="mention-input-mention"
              className="rounded-[3px] bg-primary/15 box-decoration-clone"
            >
              {seg.text}
            </span>
          ) : (
            <span key={i}>{seg.text}</span>
          ),
        )}
        {'​'}
      </div>
      <textarea
        ref={composedRef}
        rows={1}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-activedescendant={open && filteredItems[activeIndex] ? `${id}-option-${activeIndex}` : undefined}
        data-slot="mention-input-textarea"
        {...props}
        onChange={chainHandlers(onChange, textareaProps.onChange)}
        onSelect={chainHandlers(onSelect, textareaProps.onSelect)}
        onScroll={chainHandlers(onScroll, textareaProps.onScroll)}
        onKeyDown={chainHandlers(onKeyDown, textareaProps.onKeyDown)}
        onBlur={chainHandlers(onBlur, textareaProps.onBlur)}
        className={cn(
          metrics,
          'relative resize-none border-input bg-transparent outline-none transition-colors',
          'placeholder:text-muted-foreground',
          'focus-visible:border-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      />
    </>
  );
};

const MentionInputList = ({ className, style, children, ref, ...props }: React.ComponentProps<'div'>) => {
  const ctx = useMentionInput();
  const composedRef = React.useMemo(() => composeRefs(ctx.popupRef, ref), [ctx.popupRef, ref]);

  if (!ctx.open) return null;

  return (
    <div
      ref={composedRef}
      id={ctx.listboxId}
      role="listbox"
      aria-label={ctx.listLabel}
      data-slot="mention-input-list"
      style={{ ...style, top: ctx.pos.top, left: ctx.pos.left }}
      className={cn(
        'absolute z-50 max-h-60 w-64 overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md',
        className,
      )}
      {...props}
    >
      {children ??
        (ctx.loading ? (
          <div
            data-slot="mention-input-loading"
            className="flex items-center gap-2 px-2 py-2 text-xs text-muted-foreground"
          >
            <Spinner size="sm" />
            {ctx.loadingMessage}
          </div>
        ) : ctx.filteredItems.length === 0 ? (
          <div data-slot="mention-input-empty" className="px-2 py-2 text-xs text-muted-foreground">
            {ctx.emptyMessage}
          </div>
        ) : (
          ctx.filteredItems.map((item, i) => <MentionInputItem key={item.id} item={item} index={i} />)
        ))}
    </div>
  );
};

interface MentionInputItemProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  item: MentionItem;
  index: number;
  children?: React.ReactNode;
}

const MentionInputItem = ({
  item,
  index,
  className,
  children,
  onMouseDown,
  onClick,
  onMouseMove,
  ...props
}: MentionInputItemProps) => {
  const ctx = useMentionInput();
  const active = index === ctx.activeIndex;
  return (
    <div
      id={`${ctx.id}-option-${index}`}
      role="option"
      aria-selected={active}
      data-slot="mention-input-item"
      data-active={active || undefined}
      onMouseDown={(e) => {
        onMouseDown?.(e);
        if (e.defaultPrevented) return;
        // Keep focus in the textarea so the caret position survives the click.
        e.preventDefault();
      }}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        ctx.select(item);
      }}
      onMouseMove={(e) => {
        onMouseMove?.(e);
        if (e.defaultPrevented) return;
        ctx.setActiveIndex(index);
      }}
      className={cn(
        'flex cursor-default flex-col gap-0.5 rounded-sm px-2 py-1.5',
        active && 'bg-accent text-accent-foreground',
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          {/* bdi keeps the trigger glued to the handle in RTL text */}
          <bdi className="text-sm leading-none">
            {ctx.activeTrigger}
            {item.label}
          </bdi>
          {item.description && <span className="truncate text-xs text-muted-foreground">{item.description}</span>}
        </>
      )}
    </div>
  );
};

export { MentionInput, MentionInputTextarea, MentionInputList, MentionInputItem };
