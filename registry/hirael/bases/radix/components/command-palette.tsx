'use client';

import * as React from 'react';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/registry/hirael/bases/radix/ui/command';

export interface CommandPaletteRecent {
  id: string;
  label: string;
}

const NEVER_CHANGES = () => () => {};

const useIsApple = () =>
  React.useSyncExternalStore(
    NEVER_CHANGES,
    () => /mac|iphone|ipad|ipod/i.test(navigator.userAgent),
    () => false,
  );

const NO_RECENTS: CommandPaletteRecent[] = [];

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;

  return target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])') !== null;
};

const parseRecents = (raw: string | null): CommandPaletteRecent[] => {
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return NO_RECENTS;

    return parsed.filter(
      (entry): entry is CommandPaletteRecent =>
        typeof entry === 'object' && entry !== null && typeof (entry as CommandPaletteRecent).id === 'string',
    );
  } catch {
    return NO_RECENTS;
  }
};

// Cached per raw string: useSyncExternalStore needs a stable snapshot for an unchanged value.
const recentsListeners = new Set<() => void>();
const recentsCache = new Map<string, { raw: string | null; value: CommandPaletteRecent[] }>();

// Answers for keys localStorage refused to write (private mode), so recents still last the visit.
const recentsMemory = new Map<string, CommandPaletteRecent[]>();

const subscribeRecents = (onStoreChange: () => void) => {
  recentsListeners.add(onStoreChange);
  window.addEventListener('storage', onStoreChange);

  return () => {
    recentsListeners.delete(onStoreChange);
    window.removeEventListener('storage', onStoreChange);
  };
};

const emitRecents = () => {
  for (const listener of recentsListeners) listener();
};

const recentsSnapshot = (key: string): CommandPaletteRecent[] => {
  const remembered = recentsMemory.get(key);
  if (remembered) return remembered;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    raw = null;
  }
  const cached = recentsCache.get(key);
  if (cached && cached.raw === raw) return cached.value;
  const value = parseRecents(raw);
  recentsCache.set(key, { raw, value });

  return value;
};

interface CommandPaletteContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
  pages: string[];
  activePage: string | null;
  pushPage: (page: string) => void;
  popPage: () => void;
  recents: CommandPaletteRecent[];
  recordRecent: (entry: CommandPaletteRecent) => void;
  clearRecents: () => void;
  shortcutLabel: string;
}

const CommandPaletteContext = React.createContext<CommandPaletteContextValue | null>(null);

const usePalette = () => {
  const ctx = React.useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error('CommandPalette compound parts must be used inside <CommandPalette>');
  }

  return ctx;
};

/** `null` is the top level. */
const PageContext = React.createContext<string | null>(null);

const RecentsContext = React.createContext(false);

export interface CommandPaletteProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Key that opens the palette with the platform modifier. `null` binds nothing. */
  shortcut?: string | null;
  /** localStorage key for recently chosen items. Omit to keep no history. */
  recentsKey?: string;
  maxRecents?: number;
  children?: React.ReactNode;
}

const CommandPalette = ({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  shortcut = 'k',
  recentsKey,
  maxRecents = 5,
  children,
}: CommandPaletteProps) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;

  const [query, setQuery] = React.useState('');
  const [pages, setPages] = React.useState<string[]>([]);

  // Keyed off the value itself, so a controlled close resets too.
  const [prevOpen, setPrevOpen] = React.useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (!open) {
      setQuery('');
      setPages([]);
    }
  }

  const isApple = useIsApple();

  const recents = React.useSyncExternalStore(
    subscribeRecents,
    () => (recentsKey ? recentsSnapshot(recentsKey) : NO_RECENTS),
    () => NO_RECENTS,
  );

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  React.useEffect(() => {
    if (!shortcut) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.key.toLowerCase() !== shortcut.toLowerCase()) return;
      if ((!event.metaKey && !event.ctrlKey) || event.shiftKey || event.altKey) return;
      if (!open && isEditableTarget(event.target)) return;
      event.preventDefault();
      setOpen(!open);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [shortcut, open, setOpen]);

  const pushPage = React.useCallback((page: string) => {
    setPages((prev) => [...prev, page]);
    setQuery('');
  }, []);

  const popPage = React.useCallback(() => {
    setPages((prev) => prev.slice(0, -1));
  }, []);

  const recordRecent = React.useCallback(
    (entry: CommandPaletteRecent) => {
      if (!recentsKey) return;
      const current = recentsSnapshot(recentsKey);
      const next = [entry, ...current.filter((r) => r.id !== entry.id)].slice(0, maxRecents);
      try {
        window.localStorage.setItem(recentsKey, JSON.stringify(next));
      } catch {
        recentsMemory.set(recentsKey, next);
      }
      emitRecents();
    },
    [recentsKey, maxRecents],
  );

  const clearRecents = React.useCallback(() => {
    if (!recentsKey) return;
    recentsMemory.delete(recentsKey);
    try {
      window.localStorage.removeItem(recentsKey);
    } catch {}
    emitRecents();
  }, [recentsKey]);

  const ctx = React.useMemo<CommandPaletteContextValue>(
    () => ({
      open,
      setOpen,
      query,
      setQuery,
      pages,
      activePage: pages[pages.length - 1] ?? null,
      pushPage,
      popPage,
      recents,
      recordRecent,
      clearRecents,
      shortcutLabel: shortcut ? `${isApple ? '⌘' : 'Ctrl '}${shortcut.toUpperCase()}` : '',
    }),
    [open, setOpen, query, pages, pushPage, popPage, recents, recordRecent, clearRecents, shortcut, isApple],
  );

  return <CommandPaletteContext.Provider value={ctx}>{children}</CommandPaletteContext.Provider>;
};

const CommandPaletteTrigger = ({ className, children, onClick, ...props }: React.ComponentProps<'button'>) => {
  const ctx = usePalette();

  return (
    <button
      type="button"
      data-slot="command-palette-trigger"
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        ctx.setOpen(true);
      }}
      className={cn(
        'inline-flex h-9 w-full max-w-xs items-center gap-2 rounded-sm border border-input bg-transparent px-3 text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground',
        className,
      )}
      {...props}
    >
      {children ?? <span>Search</span>}
      {ctx.shortcutLabel && (
        <kbd
          data-slot="command-palette-kbd"
          className="ms-auto rounded-[3px] border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
        >
          {ctx.shortcutLabel}
        </kbd>
      )}
    </button>
  );
};

export type CommandPaletteDialogProps = Omit<React.ComponentProps<typeof CommandDialog>, 'open' | 'onOpenChange'>;

const CommandPaletteDialog = ({ children, ...props }: CommandPaletteDialogProps) => {
  const ctx = usePalette();

  return (
    <CommandDialog open={ctx.open} onOpenChange={ctx.setOpen} showCloseButton={false} {...props}>
      {children}
    </CommandDialog>
  );
};

const CommandPaletteInput = ({
  className,
  placeholder = 'Type a command or search…',
  onKeyDown,
  ...props
}: Omit<React.ComponentProps<typeof CommandInput>, 'value' | 'onValueChange'>) => {
  const ctx = usePalette();

  return (
    <div
      data-slot="command-palette-input"
      className={cn(
        'flex items-center gap-2 border-b ps-3',
        '[&_[data-slot=command-input-wrapper]]:flex-1 [&_[data-slot=command-input-wrapper]]:border-b-0 [&_[data-slot=command-input-wrapper]]:ps-0',
      )}
    >
      <CommandPaletteBack />
      <CommandInput
        value={ctx.query}
        onValueChange={ctx.setQuery}
        placeholder={placeholder}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.defaultPrevented) return;
          if (e.key === 'Backspace' && ctx.query === '' && ctx.pages.length > 0) {
            e.preventDefault();
            ctx.popPage();
          }
        }}
        className={className}
        {...props}
      />
    </div>
  );
};

const CommandPaletteBack = ({ className, onClick, ...props }: React.ComponentProps<'button'>) => {
  const ctx = usePalette();
  if (ctx.pages.length === 0) return null;

  return (
    <button
      type="button"
      data-slot="command-palette-back"
      aria-label="Back"
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-[3px] bg-accent px-2 py-1 text-xs text-accent-foreground',
        className,
      )}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) ctx.popPage();
      }}
    >
      {ctx.pages[ctx.pages.length - 1]}
      <ChevronRight className="size-3 rtl:rotate-180" />
    </button>
  );
};

export interface CommandPalettePageProps {
  name: string;
  children?: React.ReactNode;
}

const CommandPalettePage = ({ name, children }: CommandPalettePageProps) => {
  const ctx = usePalette();
  if (ctx.activePage !== name) return null;

  return <PageContext.Provider value={name}>{children}</PageContext.Provider>;
};

const CommandPaletteGroup = ({ className, ...props }: React.ComponentProps<typeof CommandGroup>) => {
  const ctx = usePalette();
  const page = React.useContext(PageContext);
  if (ctx.activePage !== page) return null;

  return <CommandGroup data-slot="command-palette-group" className={className} {...props} />;
};

export interface CommandPaletteItemProps extends Omit<React.ComponentProps<typeof CommandItem>, 'onSelect'> {
  /** Stable id, used for recents. Omit for an item you never want remembered. */
  recentId?: string;
  /** @deprecated Use `recentId`. Still read as the recents id when `recentId` is absent; always forwarded to the DOM. */
  id?: string;
  label: string;
  /**
   * What the list matches and keys on. Defaults to the label, scoped by the
   * page or recents group the item sits in.
   */
  value?: string;
  /** Opens a `<CommandPalettePage>` with this name instead of running an action. */
  page?: string;
  /** Hint rendered at the end of the row, e.g. `⌘N`. */
  shortcut?: string;
  onSelect?: () => void;
  /** Closes the palette after running. Off automatically when `page` is set. */
  closeOnSelect?: boolean;
}

const CommandPaletteItem = ({
  recentId: recentIdProp,
  id,
  label,
  value,
  page,
  shortcut,
  onSelect,
  closeOnSelect = true,
  className,
  children,
  ...props
}: CommandPaletteItemProps) => {
  const ctx = usePalette();
  const scope = React.useContext(PageContext);
  const inRecents = React.useContext(RecentsContext);
  const itemValue = value ?? [inRecents ? 'recent' : scope, label].filter(Boolean).join(' ');
  const recentId = recentIdProp ?? id;

  return (
    <CommandItem
      id={id}
      data-slot="command-palette-item"
      value={itemValue}
      onSelect={() => {
        if (recentId) ctx.recordRecent({ id: recentId, label });
        onSelect?.();
        if (page) {
          ctx.pushPage(page);

          return;
        }
        if (closeOnSelect) ctx.setOpen(false);
      }}
      className={cn('gap-2', className)}
      {...props}
    >
      {children ?? label}
      {page && <ChevronRight className="ms-auto size-3.5 text-muted-foreground rtl:rotate-180" />}
      {shortcut && !page && (
        <kbd className="ms-auto rounded-[3px] border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {shortcut}
        </kbd>
      )}
    </CommandItem>
  );
};

export interface CommandPaletteRecentsProps {
  heading?: React.ReactNode;
  children: (recent: CommandPaletteRecent) => React.ReactNode;
}

/** Newest first. The child is a function because only the caller knows what a re-picked id does. */
const CommandPaletteRecents = ({ heading = 'Recent', children }: CommandPaletteRecentsProps) => {
  const ctx = usePalette();
  const page = React.useContext(PageContext);
  if (ctx.activePage !== page || ctx.recents.length === 0) return null;

  return (
    <>
      <CommandGroup heading={heading} data-slot="command-palette-recents">
        <RecentsContext.Provider value>
          {ctx.recents.map((recent) => (
            <React.Fragment key={recent.id}>{children(recent)}</React.Fragment>
          ))}
        </RecentsContext.Provider>
      </CommandGroup>
      <CommandSeparator />
    </>
  );
};

export {
  CommandPalette,
  CommandPaletteTrigger,
  CommandPaletteDialog,
  CommandPaletteInput,
  CommandPaletteBack,
  CommandPalettePage,
  CommandPaletteGroup,
  CommandPaletteItem,
  CommandPaletteRecents,
  CommandEmpty as CommandPaletteEmpty,
  CommandList as CommandPaletteList,
  usePalette as useCommandPalette,
};
