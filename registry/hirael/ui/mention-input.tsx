"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Spinner } from "@/registry/hirael/ui/spinner";

export type MentionItem = {
  id: string;
  label: string;
  description?: string;
};

type ActiveMention = {
  start: number;
  trigger: string;
  query: string;
};

const MIRROR_PROPS = [
  "box-sizing",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "border-top-width",
  "border-right-width",
  "border-bottom-width",
  "border-left-width",
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "letter-spacing",
  "line-height",
  "text-transform",
  "word-spacing",
  "text-indent",
  "tab-size",
  "direction",
] as const;

function escapeForCharClass(ch: string) {
  return ch.replace(/[\\\]^-]/g, "\\$&");
}

function triggerCharClass(triggers: string[]) {
  return triggers.map(escapeForCharClass).join("");
}

export function getMentions(
  value: string,
  trigger: string | string[] = "@",
): string[] {
  const triggers = Array.isArray(trigger) ? trigger : [trigger];
  const re = new RegExp(
    `(?:^|\\s)[${triggerCharClass(triggers)}]([\\w.\\-]+)`,
    "g",
  );
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(value)) !== null) out.push(m[1]);
  return out;
}

function getActiveMention(
  text: string,
  caret: number,
  triggers: string[],
): ActiveMention | null {
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
}

function measureCaret(textarea: HTMLTextAreaElement, index: number) {
  const style = window.getComputedStyle(textarea);
  const mirror = document.createElement("div");
  for (const prop of MIRROR_PROPS) {
    mirror.style.setProperty(prop, style.getPropertyValue(prop));
  }
  mirror.style.position = "absolute";
  mirror.style.top = "0";
  mirror.style.left = "0";
  mirror.style.visibility = "hidden";
  mirror.style.whiteSpace = "pre-wrap";
  mirror.style.overflowWrap = "break-word";
  mirror.style.width = `${textarea.offsetWidth}px`;
  mirror.textContent = textarea.value.slice(0, index);
  const marker = document.createElement("span");
  marker.textContent = "​";
  mirror.appendChild(marker);
  (textarea.parentElement ?? document.body).appendChild(mirror);
  const lineHeight =
    parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
  const rect = {
    top: marker.offsetTop,
    left: marker.offsetLeft,
    height: lineHeight,
  };
  mirror.remove();
  return rect;
}

type Segment = { text: string; mention: boolean };

function segmentValue(
  value: string,
  triggers: string[],
  known: Set<string>,
): Segment[] {
  const re = new RegExp(
    `(^|\\s)([${triggerCharClass(triggers)}][\\w.\\-]+)`,
    "g",
  );
  const segments: Segment[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(value)) !== null) {
    const start = m.index + m[1].length;
    const token = m[2];
    if (!known.has(token.slice(1).toLowerCase())) continue;
    if (start > last)
      segments.push({ text: value.slice(last, start), mention: false });
    segments.push({ text: token, mention: true });
    last = start + token.length;
  }
  if (last < value.length)
    segments.push({ text: value.slice(last), mention: false });
  return segments;
}

export type MentionInputProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
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
  name?: string;
};

function MentionInput({
  value: valueProp,
  defaultValue,
  onValueChange,
  items = [],
  onSearch,
  trigger = "@",
  placeholder,
  disabled,
  maxRows,
  onMention,
  emptyMessage = "No results.",
  name,
  className,
  ...props
}: MentionInputProps) {
  const id = React.useId();
  const listboxId = `${id}-listbox`;

  const triggers = React.useMemo(
    () => (Array.isArray(trigger) ? trigger : [trigger]),
    [trigger],
  );

  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
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
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const backdropRef = React.useRef<HTMLDivElement | null>(null);
  const popupRef = React.useRef<HTMLDivElement | null>(null);
  const dismissedRef = React.useRef(false);

  const open = mention !== null && !disabled;

  const filtered = React.useMemo(() => {
    if (onSearch) return asyncItems;
    if (!mention) return [];
    const q = mention.query.toLowerCase();
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(q) ||
        it.description?.toLowerCase().includes(q),
    );
  }, [onSearch, asyncItems, items, mention]);

  const active = Math.min(activeIndex, Math.max(filtered.length - 1, 0));

  const known = React.useMemo(() => {
    const set = new Set<string>();
    for (const it of items) set.add(it.label.toLowerCase());
    for (const label of selectedLabels) set.add(label.toLowerCase());
    return set;
  }, [items, selectedLabels]);

  const segments = React.useMemo(
    () => segmentValue(value, triggers, known),
    [value, triggers, known],
  );

  const activeQuery = mention?.query;
  const activeTrigger = mention?.trigger;

  React.useEffect(() => {
    setActiveIndex(0);
  }, [activeQuery, activeTrigger]);

  React.useEffect(() => {
    if (!onSearch || activeQuery === undefined || activeTrigger === undefined) {
      return;
    }
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(() => {
      onSearch(activeQuery, activeTrigger)
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
  }, [onSearch, activeQuery, activeTrigger]);

  React.useLayoutEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const style = window.getComputedStyle(ta);
    const lineHeight =
      parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
    const borders =
      parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    const max = maxRows
      ? lineHeight * maxRows +
        parseFloat(style.paddingTop) +
        parseFloat(style.paddingBottom) +
        borders
      : Infinity;
    ta.style.height = `${Math.min(ta.scrollHeight + borders, max)}px`;
    ta.style.overflowY = ta.scrollHeight + borders > max ? "auto" : "hidden";
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
    if (
      popRect.height > spaceBelow &&
      wrapRect.top + caretTop - popRect.height - 4 > 0
    ) {
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
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, [open]);

  const detect = React.useCallback(
    (text: string, caret: number) => {
      const next = dismissedRef.current
        ? null
        : getActiveMention(text, caret, triggers);
      setMention((prev) => {
        if (prev === null && next === null) return prev;
        if (
          prev &&
          next &&
          prev.start === next.start &&
          prev.trigger === next.trigger &&
          prev.query === next.query
        ) {
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
      const next =
        value.slice(0, mention.start) + inserted + value.slice(caret);
      setValue(next);
      setSelectedLabels((prev) =>
        prev.includes(item.label) ? prev : [...prev, item.label],
      );
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(filtered.length ? (active + 1) % filtered.length : 0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(
        filtered.length ? (active - 1 + filtered.length) % filtered.length : 0,
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      const item = filtered[active];
      if (item) {
        e.preventDefault();
        select(item);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      dismissedRef.current = true;
      setMention(null);
    }
  };

  const metrics =
    "min-h-16 w-full rounded-sm border px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words";

  return (
    <div
      ref={wrapperRef}
      role="combobox"
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-controls={listboxId}
      data-slot="mention-input"
      data-disabled={disabled || undefined}
      className={cn("relative w-full", className)}
      {...props}
    >
      <div
        ref={backdropRef}
        aria-hidden
        data-slot="mention-input-backdrop"
        className={cn(
          metrics,
          "pointer-events-none absolute inset-0 overflow-hidden border-transparent text-transparent",
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
        {"​"}
      </div>
      <textarea
        ref={textareaRef}
        rows={1}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-activedescendant={
          open && filtered[active] ? `${id}-option-${active}` : undefined
        }
        data-slot="mention-input-textarea"
        onChange={(e) => {
          dismissedRef.current = false;
          setValue(e.target.value);
          detect(e.target.value, e.target.selectionStart);
        }}
        onSelect={(e) => {
          detect(e.currentTarget.value, e.currentTarget.selectionStart);
        }}
        onScroll={(e) => {
          const backdrop = backdropRef.current;
          if (backdrop) {
            backdrop.scrollTop = e.currentTarget.scrollTop;
            backdrop.scrollLeft = e.currentTarget.scrollLeft;
          }
          if (open) setMention(null);
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => setMention(null)}
        className={cn(
          metrics,
          "relative resize-none border-input bg-transparent outline-none transition-colors",
          "placeholder:text-muted-foreground",
          "focus-visible:border-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      />
      {open && (
        <div
          ref={popupRef}
          id={listboxId}
          role="listbox"
          aria-label="Mention suggestions"
          data-slot="mention-input-list"
          style={{ top: pos.top, left: pos.left }}
          className="absolute z-50 max-h-60 w-64 overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
        >
          {loading ? (
            <div
              data-slot="mention-input-loading"
              className="flex items-center gap-2 px-2 py-2 text-xs text-muted-foreground"
            >
              <Spinner size="sm" />
              Searching…
            </div>
          ) : filtered.length === 0 ? (
            <div
              data-slot="mention-input-empty"
              className="px-2 py-2 text-xs text-muted-foreground"
            >
              {emptyMessage}
            </div>
          ) : (
            filtered.map((item, i) => (
              <div
                key={item.id}
                id={`${id}-option-${i}`}
                role="option"
                aria-selected={i === active}
                data-slot="mention-input-item"
                data-active={i === active || undefined}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(item)}
                onMouseMove={() => setActiveIndex(i)}
                className={cn(
                  "flex cursor-default flex-col gap-0.5 rounded-sm px-2 py-1.5",
                  i === active && "bg-accent text-accent-foreground",
                )}
              >
                <span className="text-sm leading-none">
                  {mention?.trigger}
                  {item.label}
                </span>
                {item.description && (
                  <span className="truncate text-xs text-muted-foreground">
                    {item.description}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export { MentionInput };
