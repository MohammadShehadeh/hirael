"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, CornerDownLeft, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/registry/hirael/ui/dialog";
import { Kbd, KbdGroup } from "@/registry/hirael/ui/kbd";

type RegisteredItem = {
  id: string;
  value: string;
  text: string;
  onSelect?: () => void;
};

type SpotlightContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
  inputId: string;
  listId: string;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  matches: (value: string, text: string) => boolean;
  register: (item: RegisteredItem) => () => void;
  getItems: () => RegisteredItem[];
  select: (item: RegisteredItem) => void;
  version: number;
  keyHandlerRef: React.RefObject<
    ((event: React.KeyboardEvent) => void) | null
  >;
};

const SpotlightContext = React.createContext<SpotlightContextValue | null>(
  null,
);

function useSpotlight() {
  const ctx = React.useContext(SpotlightContext);
  if (!ctx) {
    throw new Error(
      "SpotlightSearch parts must be used inside <SpotlightSearch>",
    );
  }
  return ctx;
}

type SpotlightGroupContextValue = {
  reportVisible: (id: string, visible: boolean) => void;
};

const SpotlightGroupContext =
  React.createContext<SpotlightGroupContextValue | null>(null);

export type SpotlightSearchProps = React.ComponentProps<typeof Dialog> & {
  /** Keyboard shortcut letter that opens the overlay with Ctrl/Cmd held, e.g. "k". Pass null to disable. */
  shortcut?: string | null;
};

function SpotlightSearch({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  shortcut = "k",
  children,
  ...props
}: SpotlightSearchProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;

  const [query, setQuery] = React.useState("");
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      if (!next) setQuery("");
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const reactId = React.useId();
  const inputId = `${reactId}-input`;
  const listId = `${reactId}-list`;

  const itemsRef = React.useRef<Map<string, RegisteredItem>>(new Map());
  const orderRef = React.useRef<string[]>([]);
  const keyHandlerRef = React.useRef<
    ((event: React.KeyboardEvent) => void) | null
  >(null);
  const [version, setVersion] = React.useState(0);

  const register = React.useCallback((item: RegisteredItem) => {
    itemsRef.current.set(item.id, item);
    if (!orderRef.current.includes(item.id)) {
      orderRef.current.push(item.id);
    }
    setVersion((v) => v + 1);
    return () => {
      itemsRef.current.delete(item.id);
      orderRef.current = orderRef.current.filter((id) => id !== item.id);
      setVersion((v) => v + 1);
    };
  }, []);

  const getItems = React.useCallback(
    () =>
      orderRef.current
        .map((id) => itemsRef.current.get(id))
        .filter((item): item is RegisteredItem => item !== undefined),
    [],
  );

  const matches = React.useCallback((value: string, text: string) => {
    const q = query.trim().toLowerCase();
    if (q === "") return true;
    return value.toLowerCase().includes(q) || text.toLowerCase().includes(q);
  }, [query]);

  const select = React.useCallback(
    (item: RegisteredItem) => {
      item.onSelect?.();
      setOpen(false);
    },
    [setOpen],
  );

  React.useEffect(() => {
    if (typeof window === "undefined" || !shortcut) return;
    const key = shortcut.toLowerCase();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === key && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcut, open, setOpen]);

  const value = React.useMemo<SpotlightContextValue>(
    () => ({
      open,
      setOpen,
      query,
      setQuery,
      inputId,
      listId,
      activeId,
      setActiveId,
      matches,
      register,
      getItems,
      select,
      version,
      keyHandlerRef,
    }),
    [
      open,
      setOpen,
      query,
      inputId,
      listId,
      activeId,
      matches,
      register,
      getItems,
      select,
      version,
    ],
  );

  return (
    <SpotlightContext.Provider value={value}>
      <Dialog open={open} onOpenChange={setOpen} {...props}>
        {children}
      </Dialog>
    </SpotlightContext.Provider>
  );
}

function SpotlightSearchTrigger(
  props: React.ComponentProps<typeof DialogTrigger>,
) {
  return <DialogTrigger data-slot="spotlight-search-trigger" {...props} />;
}

export type SpotlightSearchInputProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange"
> & {
  /** Label announced to assistive tech for the search field. */
  label?: string;
};

function SpotlightSearchInput({
  className,
  label = "Search",
  placeholder = "Search",
  onKeyDown,
  ...props
}: SpotlightSearchInputProps) {
  const { query, setQuery, inputId, listId, activeId, keyHandlerRef } =
    useSpotlight();

  return (
    <div
      data-slot="spotlight-search-input-wrapper"
      className="flex items-center gap-3 border-b border-border px-5"
    >
      <Search
        data-slot="spotlight-search-icon"
        className="size-5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        id={inputId}
        data-slot="spotlight-search-input"
        type="text"
        role="combobox"
        aria-expanded
        aria-controls={listId}
        aria-activedescendant={activeId ?? undefined}
        aria-label={label}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder={placeholder}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (!event.defaultPrevented) keyHandlerRef.current?.(event);
        }}
        className={cn(
          "h-14 w-full bg-transparent text-lg text-foreground outline-none placeholder:text-muted-foreground",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function SpotlightSearchResults({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const {
    listId,
    activeId,
    setActiveId,
    getItems,
    matches,
    select,
    version,
    keyHandlerRef,
  } = useSpotlight();
  const ref = React.useRef<HTMLDivElement>(null);

  const visible = React.useCallback(
    () => getItems().filter((item) => matches(item.value, item.text)),
    [getItems, matches],
  );

  React.useEffect(() => {
    const items = visible();
    if (items.length === 0) {
      if (activeId !== null) setActiveId(null);
      return;
    }
    if (!activeId || !items.some((item) => item.id === activeId)) {
      setActiveId(items[0].id);
    }
  }, [activeId, setActiveId, visible, version]);

  React.useEffect(() => {
    if (!activeId || !ref.current) return;
    const el = ref.current.querySelector<HTMLElement>(
      `[data-item-id="${CSS.escape(activeId)}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeId]);

  const navKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      const items = visible();
      const move = (delta: number) => {
        if (items.length === 0) return;
        const current = items.findIndex((item) => item.id === activeId);
        const base = current === -1 ? (delta > 0 ? -1 : 0) : current;
        const next = (base + delta + items.length) % items.length;
        setActiveId(items[next].id);
      };
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          move(1);
          break;
        case "ArrowUp":
          event.preventDefault();
          move(-1);
          break;
        case "Enter": {
          event.preventDefault();
          const item = items.find((entry) => entry.id === activeId);
          if (item) select(item);
          break;
        }
      }
    },
    [visible, activeId, setActiveId, select],
  );

  React.useEffect(() => {
    keyHandlerRef.current = navKeyDown;
    return () => {
      if (keyHandlerRef.current === navKeyDown) keyHandlerRef.current = null;
    };
  }, [navKeyDown, keyHandlerRef]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    navKeyDown(event);
    if (event.defaultPrevented) return;
    const items = visible();
    switch (event.key) {
      case "Home":
        event.preventDefault();
        if (items.length > 0) setActiveId(items[0].id);
        break;
      case "End":
        event.preventDefault();
        if (items.length > 0) setActiveId(items[items.length - 1].id);
        break;
    }
  }

  return (
    <div
      ref={ref}
      id={listId}
      data-slot="spotlight-search-results"
      role="listbox"
      aria-label="Search results"
      onKeyDown={handleKeyDown}
      className={cn(
        "max-h-80 overflow-y-auto overscroll-contain p-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SpotlightSearchGroup({
  className,
  heading,
  children,
  ...props
}: React.ComponentProps<"div"> & { heading?: React.ReactNode }) {
  const [visibleIds, setVisibleIds] = React.useState<Set<string>>(
    () => new Set(),
  );

  const reportVisible = React.useCallback((id: string, visible: boolean) => {
    setVisibleIds((prev) => {
      const has = prev.has(id);
      if (visible === has) return prev;
      const next = new Set(prev);
      if (visible) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const contextValue = React.useMemo<SpotlightGroupContextValue>(
    () => ({ reportVisible }),
    [reportVisible],
  );

  const hidden = visibleIds.size === 0;

  return (
    <SpotlightGroupContext.Provider value={contextValue}>
      <div
        data-slot="spotlight-search-group"
        role="group"
        hidden={hidden}
        className={cn(hidden && "hidden", "py-1", className)}
        {...props}
      >
        {heading != null ? (
          <div
            data-slot="spotlight-search-group-heading"
            className="px-3 pb-1.5 pt-2 text-start font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
          >
            {heading}
          </div>
        ) : null}
        {children}
      </div>
    </SpotlightGroupContext.Provider>
  );
}

export type SpotlightSearchItemProps = Omit<
  React.ComponentProps<"div">,
  "onSelect"
> & {
  /** Text matched against the query, alongside the title and description. */
  value: string;
  /** Leading icon or thumbnail rendered at the start of the row. */
  icon?: React.ReactNode;
  /** Secondary line shown under the title. */
  description?: React.ReactNode;
  /** End-aligned category tag or meta shown opposite the title. */
  meta?: React.ReactNode;
  /** Called when the row is chosen by click or Enter. */
  onSelect?: () => void;
};

function SpotlightSearchItem({
  className,
  value,
  icon,
  description,
  meta,
  onSelect,
  children,
  ...props
}: SpotlightSearchItemProps) {
  const { register, matches, activeId, setActiveId, select } = useSpotlight();
  const group = React.useContext(SpotlightGroupContext);
  const id = React.useId();

  const text = React.useMemo(() => {
    const parts: string[] = [];
    if (typeof children === "string") parts.push(children);
    if (typeof description === "string") parts.push(description);
    return parts.join(" ");
  }, [children, description]);

  const onSelectRef = React.useRef(onSelect);
  React.useEffect(() => {
    onSelectRef.current = onSelect;
  });

  React.useEffect(
    () =>
      register({
        id,
        value,
        text,
        onSelect: () => onSelectRef.current?.(),
      }),
    [id, value, text, register],
  );

  const visible = matches(value, text);

  React.useEffect(() => {
    group?.reportVisible(id, visible);
    return () => group?.reportVisible(id, false);
  }, [group, id, visible]);

  if (!visible) return null;

  const active = activeId === id;

  return (
    <div
      id={id}
      data-item-id={id}
      data-slot="spotlight-search-item"
      data-active={active || undefined}
      role="option"
      aria-selected={active}
      onPointerMove={() => {
        if (!active) setActiveId(id);
      }}
      onClick={() =>
        select({ id, value, text, onSelect: () => onSelectRef.current?.() })
      }
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 outline-none",
        "data-[active]:bg-accent data-[active]:text-accent-foreground",
        className,
      )}
      {...props}
    >
      {icon != null ? (
        <span
          data-slot="spotlight-search-item-icon"
          className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-card text-muted-foreground [&_img]:size-full [&_img]:object-cover [&_svg:not([class*='size-'])]:size-4"
        >
          {icon}
        </span>
      ) : null}
      <span
        data-slot="spotlight-search-item-body"
        className="flex min-w-0 flex-1 flex-col gap-0.5 text-start"
      >
        <span
          data-slot="spotlight-search-item-title"
          className="truncate text-sm font-medium text-foreground"
        >
          {children}
        </span>
        {description != null ? (
          <span
            data-slot="spotlight-search-item-description"
            className="truncate text-xs text-muted-foreground"
          >
            {description}
          </span>
        ) : null}
      </span>
      {meta != null ? (
        <span
          data-slot="spotlight-search-item-meta"
          className="ms-auto shrink-0 rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
        >
          {meta}
        </span>
      ) : null}
    </div>
  );
}

function SpotlightSearchEmpty({
  className,
  children = "No results",
  ...props
}: React.ComponentProps<"div">) {
  const { getItems, matches } = useSpotlight();
  const hasVisible = getItems().some((item) => matches(item.value, item.text));
  if (hasVisible) return null;

  return (
    <div
      data-slot="spotlight-search-empty"
      role="status"
      className={cn(
        "px-3 py-10 text-center text-sm text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SpotlightSearchFooter({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="spotlight-search-footer"
      className={cn(
        "flex items-center gap-4 border-t border-border px-5 py-2.5 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <span className="inline-flex items-center gap-1.5">
            <KbdGroup>
              <Kbd
                aria-label="Up arrow"
                className="h-5 min-w-5 px-1 text-[11px]"
              >
                <ArrowUp className="size-3" />
              </Kbd>
              <Kbd
                aria-label="Down arrow"
                className="h-5 min-w-5 px-1 text-[11px]"
              >
                <ArrowDown className="size-3" />
              </Kbd>
            </KbdGroup>
            to navigate
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Kbd
              aria-label="Enter"
              className="h-5 min-w-5 px-1 text-[11px]"
            >
              <CornerDownLeft className="size-3" />
            </Kbd>
            to open
          </span>
        </>
      )}
    </div>
  );
}

export type SpotlightSearchContentProps = React.ComponentProps<
  typeof DialogContent
> & {
  /** Accessible title for the dialog; visually hidden. */
  title?: string;
};

function SpotlightSearchContent({
  className,
  children,
  title = "Search",
  ...props
}: SpotlightSearchContentProps) {
  return (
    <DialogContent
      data-slot="spotlight-search-content"
      showCloseButton={false}
      aria-describedby={undefined}
      className={cn(
        "glass-panel-strong top-[18%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl",
        className,
      )}
      {...props}
    >
      <DialogTitle className="sr-only">{title}</DialogTitle>
      {children}
    </DialogContent>
  );
}

export {
  SpotlightSearch,
  SpotlightSearchTrigger,
  SpotlightSearchContent,
  SpotlightSearchInput,
  SpotlightSearchResults,
  SpotlightSearchGroup,
  SpotlightSearchItem,
  SpotlightSearchEmpty,
  SpotlightSearchFooter,
};
