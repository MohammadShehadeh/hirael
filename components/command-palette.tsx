'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Boxes, Frame, History, LayoutTemplate, SlidersHorizontal, type LucideIcon } from 'lucide-react';

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
import { DOC_EXTRA_LINKS, DOC_PAGES, docHref, type DocLink } from '@/lib/docs-nav';
import { useCustomizer } from '@/components/customizer-sheet';
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
} satisfies Record<RecentKind, LucideIcon>;

const recentKind = (entry: RegistryEntryMeta): RecentKind => {
  if (entry.category === 'blocks') return 'block';
  if (entry.category === 'templates') return 'template';

  return 'component';
};

const docsOfKind = (kind: RecentKind) => SEARCH_INDEX.filter((doc) => recentKind(doc.entry) === kind);

const BROWSE_GROUPS = [
  { heading: 'Components', docs: docsOfKind('component') },
  { heading: 'Blocks', docs: docsOfKind('block') },
  { heading: 'Templates', docs: docsOfKind('template') },
];

const DOC_LINKS: DocLink[] = [
  ...DOC_PAGES.map((page) => ({ href: docHref(page.slug), title: page.title })),
  ...DOC_EXTRA_LINKS,
];

const matchesQuery = (text: string, query: string) => text.toLowerCase().includes(query.trim().toLowerCase());

interface QuickGroupsProps {
  query: string;
  onClose: () => void;
  onNavigate: (href: string) => void;
}

const QuickGroups = ({ query, onClose, onNavigate }: QuickGroupsProps) => {
  const { setIsOpen: setCustomizerOpen } = useCustomizer();
  const docLinks = query ? DOC_LINKS.filter((link) => matchesQuery(link.title, query)) : DOC_LINKS;
  const showCustomizer = !query || matchesQuery('registry customizer theme font radius base', query);

  return (
    <>
      {showCustomizer && (
        <CommandGroup heading="Actions">
          <CommandItem
            value="action:customizer"
            onSelect={() => {
              onClose();
              setCustomizerOpen(true);
            }}
          >
            <SlidersHorizontal className="text-muted-foreground" />
            <span>Open registry customizer</span>
          </CommandItem>
        </CommandGroup>
      )}
      {docLinks.length > 0 && (
        <CommandGroup heading="Docs">
          {docLinks.map((link) => (
            <CommandItem key={link.href} value={`doc:${link.href}`} onSelect={() => onNavigate(link.href)}>
              <BookOpen className="text-muted-foreground" />
              <span>{link.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      )}
    </>
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

interface PaletteListProps {
  query: string;
  onSelect: (item: RecentItem) => void;
  onClose: () => void;
  onNavigate: (href: string) => void;
}

const PaletteList = ({ query, onSelect, onClose, onNavigate }: PaletteListProps) => {
  const quickGroups = <QuickGroups query={query} onClose={onClose} onNavigate={onNavigate} />;

  if (!query) {
    return (
      <>
        <RecentGroup onSelect={onSelect} />
        {quickGroups}
        {BROWSE_GROUPS.map((group) => (
          <BrowseGroup key={group.heading} heading={group.heading} docs={group.docs} onSelect={onSelect} />
        ))}
      </>
    );
  }

  const results = searchIndex(SEARCH_INDEX, query);

  return (
    <>
      {results.length > 0 && (
        <CommandGroup heading="Results">
          {results.map((doc) => (
            <EntryItem key={doc.entry.name} doc={doc} onSelect={onSelect} />
          ))}
        </CommandGroup>
      )}
      {quickGroups}
    </>
  );
};

const PaletteFooter = () => (
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
);

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CommandPalette = ({ open, onOpenChange }: CommandPaletteProps) => {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const query = search.trim();

  const handleOpenChange = (next: boolean) => {
    if (!next) setSearch('');
    onOpenChange(next);
  };

  const handleNavigate = (href: string) => {
    handleOpenChange(false);
    router.push(href);
  };

  const handleSelect = (item: RecentItem) => {
    pushRecent(item);
    handleNavigate(item.href);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-[14vh] w-[calc(100%-2rem)] max-w-lg translate-y-0 gap-0 overflow-hidden p-0"
      >
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">Search components, blocks, templates and docs.</DialogDescription>
        <Command loop shouldFilter={false}>
          <CommandInput value={search} onValueChange={setSearch} placeholder="Search by name or what it does…" />
          <CommandList>
            <CommandEmpty>No results for “{query}”.</CommandEmpty>
            <PaletteList
              query={query}
              onSelect={handleSelect}
              onClose={() => handleOpenChange(false)}
              onNavigate={handleNavigate}
            />
          </CommandList>
        </Command>
        <PaletteFooter />
      </DialogContent>
    </Dialog>
  );
};
