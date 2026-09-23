'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Boxes, Frame, History, LayoutTemplate } from 'lucide-react';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/registry/hirael/bases/radix/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/registry/hirael/bases/radix/ui/command';
import { REGISTRY, entryHref, type RegistryEntryMeta } from '@/registry/hirael/registry-meta';
import { buildSearchIndex, searchIndex, type SearchDoc } from '@/lib/search';
import {
  pushRecent,
  recentsSnapshot,
  serverRecents,
  subscribeRecents,
  type RecentItem,
  type RecentKind,
} from '@/lib/recents';

const RECENT_KIND_LABELS: Record<RecentKind, string> = {
  component: 'Component',
  block: 'Block',
  template: 'Template',
};

const CATEGORY_HINT_CLASS = 'ms-auto shrink-0 text-xs uppercase text-muted-foreground';

const SEARCH_INDEX = buildSearchIndex(REGISTRY);

const KIND_ICONS = {
  component: Boxes,
  block: LayoutTemplate,
  template: Frame,
} satisfies Record<RecentKind, React.ComponentType<{ className?: string }>>;

const recentKind = (entry: RegistryEntryMeta): RecentKind => {
  if (entry.category === 'blocks') return 'block';
  if (entry.category === 'templates') return 'template';

  return 'component';
};

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CommandPalette = ({ open, onOpenChange }: CommandPaletteProps) => {
  const router = useRouter();
  const [search, setSearch] = React.useState('');

  const handleOpenChange = (next: boolean) => {
    if (!next) setSearch('');
    onOpenChange(next);
  };

  const handleSelect = (item: RecentItem) => {
    pushRecent(item);
    handleOpenChange(false);
    router.push(item.href);
  };

  const results = search.trim() ? searchIndex(SEARCH_INDEX, search) : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-[14vh] w-[calc(100%-2rem)] max-w-lg translate-y-0 gap-0 overflow-hidden p-0"
      >
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">Search across all components and blocks.</DialogDescription>
        <Command loop shouldFilter={false}>
          <CommandInput value={search} onValueChange={setSearch} placeholder="Search by name or what it does…" />
          <CommandList>
            <CommandEmpty>No results for “{search.trim()}”.</CommandEmpty>
            {results ? (
              results.length > 0 && (
                <CommandGroup heading="Results">
                  {results.map((doc) => (
                    <EntryItem key={doc.entry.name} doc={doc} onSelect={handleSelect} />
                  ))}
                </CommandGroup>
              )
            ) : (
              <>
                <RecentGroup onSelect={handleSelect} />
                <BrowseGroup
                  heading="Components"
                  docs={SEARCH_INDEX.filter((doc) => recentKind(doc.entry) === 'component')}
                  onSelect={handleSelect}
                />
                <BrowseGroup
                  heading="Blocks"
                  docs={SEARCH_INDEX.filter((doc) => recentKind(doc.entry) === 'block')}
                  onSelect={handleSelect}
                />
                <BrowseGroup
                  heading="Templates"
                  docs={SEARCH_INDEX.filter((doc) => recentKind(doc.entry) === 'template')}
                  onSelect={handleSelect}
                />
              </>
            )}
          </CommandList>
        </Command>
        <div className="flex items-center gap-4 border-t border-border bg-popover px-3 py-2 text-xs text-muted-foreground uppercase">
          <span className="inline-flex items-center gap-1.5">
            <Kbd>↑↓</Kbd> navigate
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Kbd>↵</Kbd> open
          </span>
          <span className="ms-auto inline-flex items-center gap-1.5">
            <Kbd>esc</Kbd> close
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface EntryItemProps {
  doc: SearchDoc;
  onSelect: (item: RecentItem) => void;
}

const EntryItem = ({ doc, onSelect }: EntryItemProps) => {
  const { entry } = doc;
  const kind = recentKind(entry);
  const Icon = KIND_ICONS[kind];

  return (
    <CommandItem
      value={entry.name}
      onSelect={() => onSelect({ name: entry.name, title: entry.title, href: entryHref(entry), kind })}
    >
      <Icon className="text-muted-foreground" />
      <span className="truncate">{entry.title}</span>
      <span className={CATEGORY_HINT_CLASS}>{doc.kindLabel}</span>
    </CommandItem>
  );
};

interface BrowseGroupProps {
  heading: string;
  docs: SearchDoc[];
  onSelect: (item: RecentItem) => void;
}

const BrowseGroup = ({ heading, docs, onSelect }: BrowseGroupProps) => {
  return (
    <CommandGroup heading={heading}>
      {docs.map((doc) => (
        <EntryItem key={doc.entry.name} doc={doc} onSelect={onSelect} />
      ))}
    </CommandGroup>
  );
};

interface KbdProps {
  children: React.ReactNode;
}

const Kbd = ({ children }: KbdProps) => {
  return <kbd className="rounded-sm border border-border bg-background px-1 py-0.5 leading-none">{children}</kbd>;
};

interface RecentGroupProps {
  onSelect: (item: RecentItem) => void;
}

const RecentGroup = ({ onSelect }: RecentGroupProps) => {
  const recents = React.useSyncExternalStore(subscribeRecents, recentsSnapshot, serverRecents);

  if (recents.length === 0) return null;

  return (
    <CommandGroup heading="Recent">
      {recents.map((item) => (
        <CommandItem key={item.href} value={`recent:${item.href}`} onSelect={() => onSelect(item)}>
          <History className="text-muted-foreground" />
          <span>{item.title}</span>
          <span className={CATEGORY_HINT_CLASS}>{RECENT_KIND_LABELS[item.kind]}</span>
        </CommandItem>
      ))}
    </CommandGroup>
  );
};
