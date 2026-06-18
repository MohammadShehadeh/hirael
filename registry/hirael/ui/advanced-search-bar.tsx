"use client";

import * as React from "react";
import { Search, X, ChevronDown, SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/hirael/ui/input-group";
import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";

export type SearchScopeItem = {
  value: string;
  label: string;
};

type RegisteredSuggestion = {
  value: string;
  onSelect?: (value: string) => void;
};

type Ctx = {
  scopes: SearchScopeItem[];
  scope: string;
  setScope: (next: string) => void;
  query: string;
  setQuery: (next: string) => void;
  tokens: string[];
  addToken: (token: string) => void;
  removeToken: (index: number) => void;
  open: boolean;
  setOpen: (next: boolean) => void;
  activeId: string | null;
  setActiveId: (next: string | null) => void;
  scopeOpen: boolean;
  setScopeOpen: (next: boolean) => void;
  registry: React.RefObject<Map<string, RegisteredSuggestion>>;
  listRef: React.RefObject<HTMLDivElement | null>;
  move: (delta: number) => void;
  select: (id: string) => void;
  commitQuery: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  rootId: string;
  listboxId: string;
};

const AdvancedSearchBarContext = React.createContext<Ctx | null>(null);

function useAdvancedSearchBar() {
  const ctx = React.useContext(AdvancedSearchBarContext);
  if (!ctx) {
    throw new Error(
      "AdvancedSearchBar compound parts must be used inside <AdvancedSearchBar>",
    );
  }
  return ctx;
}

const TOKEN_RE = /^([\w.-]+):(\S.*)$/;

function parseToken(raw: string): string | null {
  const text = raw.trim();
  const match = TOKEN_RE.exec(text);
  if (!match) return null;
  return `${match[1]}:${match[2].trim()}`;
}

export type AdvancedSearchBarProps = Omit<
  React.ComponentProps<"div">,
  "onChange"
> & {
  /** The selectable search scopes shown in the leading dropdown. */
  scopes?: SearchScopeItem[];
  /** The active scope value (controlled). */
  scope?: string;
  /** Default scope value when uncontrolled. */
  defaultScope?: string;
  /** Called when the active scope changes. */
  onScopeChange?: (scope: string) => void;
  /** The query text (controlled). */
  value?: string;
  /** Default query text when uncontrolled. */
  defaultValue?: string;
  /** Called when the query text changes. */
  onValueChange?: (value: string) => void;
  /** The active filter tokens, each `key:value` (controlled). */
  tokens?: string[];
  /** Default filter tokens when uncontrolled. */
  defaultTokens?: string[];
  /** Called when the active filter tokens change. */
  onTokensChange?: (tokens: string[]) => void;
};

function AdvancedSearchBar({
  scopes = [{ value: "all", label: "All" }],
  scope: scopeProp,
  defaultScope,
  onScopeChange,
  value: valueProp,
  defaultValue,
  onValueChange,
  tokens: tokensProp,
  defaultTokens,
  onTokensChange,
  className,
  children,
  ...props
}: AdvancedSearchBarProps) {
  const rootId = React.useId();
  const listboxId = `${rootId}-listbox`;

  const [internalScope, setInternalScope] = React.useState(
    defaultScope ?? scopes[0]?.value ?? "all",
  );
  const scope = scopeProp ?? internalScope;
  const setScope = React.useCallback(
    (next: string) => {
      if (scopeProp === undefined) setInternalScope(next);
      onScopeChange?.(next);
    },
    [scopeProp, onScopeChange],
  );

  const [internalQuery, setInternalQuery] = React.useState(defaultValue ?? "");
  const query = valueProp ?? internalQuery;
  const setQuery = React.useCallback(
    (next: string) => {
      if (valueProp === undefined) setInternalQuery(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const [internalTokens, setInternalTokens] = React.useState<string[]>(
    defaultTokens ?? [],
  );
  const tokens = tokensProp ?? internalTokens;
  const setTokens = React.useCallback(
    (next: string[]) => {
      if (tokensProp === undefined) setInternalTokens(next);
      onTokensChange?.(next);
    },
    [tokensProp, onTokensChange],
  );

  const addToken = React.useCallback(
    (token: string) => {
      const parsed = parseToken(token);
      if (!parsed) return;
      const current = tokensProp ?? internalTokens;
      if (current.includes(parsed)) return;
      setTokens([...current, parsed]);
    },
    [tokensProp, internalTokens, setTokens],
  );

  const removeToken = React.useCallback(
    (index: number) => {
      const current = tokensProp ?? internalTokens;
      setTokens(current.filter((_, i) => i !== index));
    },
    [tokensProp, internalTokens, setTokens],
  );

  const [open, setOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [scopeOpen, setScopeOpen] = React.useState(false);

  const registry = React.useRef<Map<string, RegisteredSuggestion>>(new Map());
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const optionIds = React.useCallback(() => {
    const list = listRef.current;
    if (!list) return [];
    return Array.from(
      list.querySelectorAll<HTMLElement>('[data-slot="search-suggestion"]'),
    ).map((el) => el.id);
  }, []);

  const move = React.useCallback(
    (delta: number) => {
      const ids = optionIds();
      if (ids.length === 0) return;
      setOpen(true);
      setActiveId((current) => {
        const at = current ? ids.indexOf(current) : -1;
        const base = at < 0 ? (delta > 0 ? -1 : 0) : at;
        const nextIndex = (base + delta + ids.length) % ids.length;
        const nextId = ids[nextIndex];
        requestAnimationFrame(() => {
          document
            .getElementById(nextId)
            ?.scrollIntoView({ block: "nearest" });
        });
        return nextId;
      });
    },
    [optionIds],
  );

  const commitQuery = React.useCallback(() => {
    const parsed = parseToken(query);
    if (parsed) {
      addToken(parsed);
      setQuery("");
    }
  }, [query, addToken, setQuery]);

  const select = React.useCallback(
    (id: string) => {
      const item = registry.current.get(id);
      if (!item) return;
      if (item.onSelect) {
        item.onSelect(item.value);
      } else if (parseToken(item.value)) {
        addToken(item.value);
        setQuery("");
      } else {
        setQuery(item.value);
      }
      setOpen(false);
      setActiveId(null);
      inputRef.current?.focus();
    },
    [addToken, setQuery],
  );

  const ctx = React.useMemo<Ctx>(
    () => ({
      scopes,
      scope,
      setScope,
      query,
      setQuery,
      tokens,
      addToken,
      removeToken,
      open,
      setOpen,
      activeId,
      setActiveId,
      scopeOpen,
      setScopeOpen,
      registry,
      listRef,
      move,
      select,
      commitQuery,
      inputRef,
      rootId,
      listboxId,
    }),
    [
      scopes,
      scope,
      setScope,
      query,
      setQuery,
      tokens,
      addToken,
      removeToken,
      open,
      activeId,
      scopeOpen,
      move,
      select,
      commitQuery,
      rootId,
      listboxId,
    ],
  );

  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open && !scopeOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setScopeOpen(false);
        setActiveId(null);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, scopeOpen]);

  return (
    <AdvancedSearchBarContext.Provider value={ctx}>
      <div
        ref={containerRef}
        data-slot="advanced-search-bar"
        className={cn("relative w-full", className)}
        {...props}
      >
        {children}
      </div>
    </AdvancedSearchBarContext.Provider>
  );
}

function SearchScope({
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children">) {
  const ctx = useAdvancedSearchBar();
  const active = ctx.scopes.find((s) => s.value === ctx.scope) ?? ctx.scopes[0];
  const menuId = `${ctx.rootId}-scope`;

  return (
    <div
      data-slot="search-scope"
      className={cn("relative shrink-0", className)}
      onKeyDown={(e) => {
        if (e.key === "Escape" && ctx.scopeOpen) {
          e.preventDefault();
          ctx.setScopeOpen(false);
        }
      }}
      {...props}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        data-slot="search-scope-trigger"
        aria-haspopup="menu"
        aria-expanded={ctx.scopeOpen}
        aria-controls={menuId}
        onClick={() => ctx.setScopeOpen(!ctx.scopeOpen)}
        className="h-7 gap-1 rounded-sm border-e border-input px-2 text-muted-foreground hover:text-foreground"
      >
        <span className="text-sm">{active?.label}</span>
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform",
            ctx.scopeOpen && "rotate-180",
          )}
        />
      </Button>
      {ctx.scopeOpen && (
        <div
          id={menuId}
          role="menu"
          aria-label="Search scope"
          data-slot="search-scope-menu"
          className="absolute top-full z-50 mt-1 min-w-36 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
        >
          {ctx.scopes.map((item) => (
            <button
              key={item.value}
              type="button"
              role="menuitemradio"
              aria-checked={item.value === ctx.scope}
              data-slot="search-scope-item"
              data-active={item.value === ctx.scope || undefined}
              onClick={() => {
                ctx.setScope(item.value);
                ctx.setScopeOpen(false);
                ctx.inputRef.current?.focus();
              }}
              className={cn(
                "flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-start text-sm outline-none",
                "hover:bg-accent hover:text-accent-foreground",
                item.value === ctx.scope && "bg-accent text-accent-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type SearchFieldProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  /** Placeholder shown in the text input. */
  placeholder?: string;
  /** Render the leading search icon. */
  icon?: boolean;
  /** Render the trailing filters button. */
  filters?: boolean;
};

function SearchField({
  className,
  placeholder = "Search…",
  icon = true,
  filters = false,
  children,
  ...props
}: SearchFieldProps) {
  const ctx = useAdvancedSearchBar();
  const { query, tokens, open, activeId, listboxId } = ctx;
  const hasQuery = query.length > 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      ctx.move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      ctx.move(-1);
    } else if (e.key === "Enter") {
      if (open && activeId) {
        e.preventDefault();
        ctx.select(activeId);
      } else if (parseToken(query)) {
        e.preventDefault();
        ctx.commitQuery();
      }
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        ctx.setOpen(false);
        ctx.setActiveId(null);
      }
    } else if (e.key === "Backspace" && query.length === 0 && tokens.length > 0) {
      ctx.removeToken(tokens.length - 1);
    }
  };

  return (
    <InputGroup
      data-slot="search-field"
      className={cn("h-auto min-h-9 flex-wrap gap-1 py-1 ps-2 pe-1", className)}
      {...props}
    >
      {icon && (
        <Search
          data-slot="search-field-icon"
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground"
        />
      )}
      {children}
      <InputGroupInput
        ref={ctx.inputRef}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={open && activeId ? activeId : undefined}
        data-slot="search-field-input"
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          const next = e.target.value;
          if (/\s$/.test(next) && parseToken(next)) {
            ctx.addToken(next);
            ctx.setQuery("");
            return;
          }
          ctx.setQuery(next);
          ctx.setOpen(true);
          ctx.setActiveId(null);
        }}
        onFocus={() => ctx.setOpen(true)}
        onKeyDown={handleKeyDown}
        className="w-auto min-w-32 flex-1 px-1"
      />
      {hasQuery && (
        <InputGroupButton
          type="button"
          size="icon-xs"
          variant="ghost"
          data-slot="search-field-clear"
          aria-label="Clear search"
          onClick={() => {
            ctx.setQuery("");
            ctx.setActiveId(null);
            ctx.inputRef.current?.focus();
          }}
          className="order-last text-muted-foreground"
        >
          <X />
        </InputGroupButton>
      )}
      {filters && (
        <InputGroupAddon align="inline-end" className="ps-0">
          <InputGroupButton
            type="button"
            size="icon-xs"
            variant="ghost"
            data-slot="search-field-filters"
            aria-label="Filters"
            className="text-muted-foreground"
          >
            <SlidersHorizontal />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}

function SearchTokens({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const ctx = useAdvancedSearchBar();
  if (ctx.tokens.length === 0 && !children) return null;
  return (
    <div
      data-slot="search-tokens"
      className={cn("flex flex-wrap items-center gap-1", className)}
      {...props}
    >
      {children ??
        ctx.tokens.map((token, i) => (
          <SearchToken key={`${token}-${i}`} index={i} />
        ))}
    </div>
  );
}

type SearchTokenProps = Omit<React.ComponentProps<typeof Badge>, "children"> & {
  /** Index of the token in the active filter list. */
  index: number;
  children?: React.ReactNode;
};

function SearchToken({ index, className, children, ...props }: SearchTokenProps) {
  const ctx = useAdvancedSearchBar();
  const token = ctx.tokens[index];
  if (token === undefined) return null;
  const [key, ...rest] = token.split(":");
  const val = rest.join(":");
  return (
    <Badge
      variant="secondary"
      data-slot="search-token"
      className={cn("gap-1 ps-2 pe-1 font-normal", className)}
      {...props}
    >
      <span className="min-w-0 truncate">
        {children ?? (
          <>
            <span className="text-muted-foreground">{key}:</span>
            {val}
          </>
        )}
      </span>
      <button
        type="button"
        tabIndex={-1}
        aria-label={`Remove ${token}`}
        onClick={() => ctx.removeToken(index)}
        className="inline-flex size-3.5 items-center justify-center rounded-[2px] text-secondary-foreground/70 transition-colors hover:bg-secondary-foreground/20 hover:text-secondary-foreground"
      >
        <X className="size-2.5" />
      </button>
    </Badge>
  );
}

function SearchSuggestions({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const ctx = useAdvancedSearchBar();
  if (!ctx.open) return null;

  return (
    <div
      ref={ctx.listRef}
      id={ctx.listboxId}
      role="listbox"
      aria-label="Suggestions"
      data-slot="search-suggestions"
      className={cn(
        "absolute top-full z-50 mt-1.5 max-h-80 w-full overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type SearchSuggestionGroupProps = React.ComponentProps<"div"> & {
  /** Heading shown above the group. */
  label?: React.ReactNode;
  /** Mark the group as live results, adding the active-state indicator. */
  live?: boolean;
};

function SearchSuggestionGroup({
  className,
  label,
  live = false,
  children,
  ...props
}: SearchSuggestionGroupProps) {
  return (
    <div
      role="group"
      data-slot="search-suggestion-group"
      className={cn("py-1 first:pt-0.5 last:pb-0.5", className)}
      {...props}
    >
      {label !== undefined && (
        <div
          data-slot="search-suggestion-group-label"
          className="flex items-center gap-1.5 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
        >
          {live && <span className="state-dot" aria-hidden />}
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

type SearchSuggestionProps = Omit<React.ComponentProps<"div">, "onSelect"> & {
  /** Inserted as the query, or added as a token when it reads `key:value`. */
  value: string;
  /** Optional leading icon. */
  icon?: React.ReactNode;
  /** Run instead of the default insert/add when this suggestion is chosen. */
  onSelect?: (value: string) => void;
};

function SearchSuggestion({
  value,
  icon,
  onSelect,
  className,
  children,
  ...props
}: SearchSuggestionProps) {
  const ctx = useAdvancedSearchBar();
  const id = React.useId();
  const { registry, activeId } = ctx;

  React.useEffect(() => {
    const map = registry.current;
    map.set(id, { value, onSelect });
    return () => {
      map.delete(id);
    };
  }, [registry, id, value, onSelect]);

  const active = activeId === id;

  return (
    <div
      id={id}
      role="option"
      aria-selected={active}
      data-slot="search-suggestion"
      data-active={active || undefined}
      onPointerDown={(e) => e.preventDefault()}
      onClick={() => ctx.select(id)}
      onMouseMove={() => {
        if (activeId !== id) ctx.setActiveId(id);
      }}
      className={cn(
        "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
        active && "bg-accent text-accent-foreground",
        className,
      )}
      {...props}
    >
      {icon !== undefined && (
        <span
          data-slot="search-suggestion-icon"
          className="flex size-4 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4"
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1 truncate text-start">
        {children ?? value}
      </span>
    </div>
  );
}

export {
  AdvancedSearchBar,
  SearchScope,
  SearchField,
  SearchTokens,
  SearchToken,
  SearchSuggestions,
  SearchSuggestionGroup,
  SearchSuggestion,
};
