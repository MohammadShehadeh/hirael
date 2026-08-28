'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Boxes, Frame, History, LayoutTemplate } from 'lucide-react';
import { useCommandState } from 'cmdk';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/registry/hirael/bases/radix/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/registry/hirael/bases/radix/ui/command';
import {
  BLOCK_KIND_LABELS,
  CATEGORY_LABELS,
  COMPONENTS,
  REGISTRY,
  TEMPLATES,
  entryHref,
  type ComponentCategory,
} from '@/registry/hirael/registry-meta';
import { pushRecent, readRecents, type RecentItem } from '@/lib/recents';

/**
 * The heavy half of the ⌘K palette — the project's own `dialog` + `command`
 * (cmdk) primitives. Loaded lazily (see command-menu.tsx) so cmdk only ships
 * to visitors who actually open search.
 */
export const CommandPalette = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const router = useRouter();

  const go = (item: RecentItem) => {
    pushRecent(item);
    onOpenChange(false);
    router.push(item.href);
  };

  const components = COMPONENTS;
  const blocks = REGISTRY.filter((r) => r.category === 'blocks');
  const templates = TEMPLATES;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-[14vh] w-[calc(100%-2rem)] max-w-lg translate-y-0 gap-0 overflow-hidden rounded-md border-border bg-popover p-0 shadow-2xl"
      >
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">Search across all components and blocks.</DialogDescription>
        <Command loop>
          <CommandInput placeholder="Search by name or what it does…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <RecentGroup open={open} onSelect={go} />
            <CommandGroup heading="Components">
              {components.map((c) => (
                <CommandItem
                  key={c.name}
                  value={`${c.title} ${c.name}`}
                  keywords={[c.description, CATEGORY_LABELS[c.category as ComponentCategory]]}
                  onSelect={() =>
                    go({
                      name: c.name,
                      title: c.title,
                      href: entryHref(c),
                      kind: 'component',
                    })
                  }
                >
                  <Boxes className="text-muted-foreground" />
                  <span>{c.title}</span>
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                    {CATEGORY_LABELS[c.category as ComponentCategory]}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Blocks">
              {blocks.map((b) => (
                <CommandItem
                  key={b.name}
                  value={`${b.title} ${b.name}`}
                  keywords={[b.description, b.blockKind ?? '']}
                  onSelect={() =>
                    go({
                      name: b.name,
                      title: b.title,
                      href: entryHref(b),
                      kind: 'block',
                    })
                  }
                >
                  <LayoutTemplate className="text-muted-foreground" />
                  <span>{b.title}</span>
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                    {b.blockKind ? BLOCK_KIND_LABELS[b.blockKind] : 'Block'}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Templates">
              {templates.map((t) => (
                <CommandItem
                  key={t.name}
                  value={`${t.title} ${t.name}`}
                  keywords={[t.description]}
                  onSelect={() =>
                    go({
                      name: t.name,
                      title: t.title,
                      href: entryHref(t),
                      kind: 'template',
                    })
                  }
                >
                  <Frame className="text-muted-foreground" />
                  <span>{t.title}</span>
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                    Template
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="flex items-center gap-4 border-t border-border bg-popover px-3 py-2 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Kbd>↑↓</Kbd> navigate
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Kbd>↵</Kbd> open
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5">
            <Kbd>esc</Kbd> close
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Kbd = ({ children }: { children: React.ReactNode }) => {
  return <kbd className="rounded-sm border border-border bg-background px-1 py-0.5 leading-none">{children}</kbd>;
};

/** Previously opened items, shown only while the query is empty. Re-reads on
 * every open so navigation elsewhere in the tab is reflected immediately. */
const RecentGroup = ({ open, onSelect }: { open: boolean; onSelect: (item: RecentItem) => void }) => {
  const search = useCommandState((state) => state.search);
  const [recents, setRecents] = React.useState<RecentItem[]>([]);

  React.useEffect(() => {
    if (open) setRecents(readRecents());
  }, [open]);

  if (search || recents.length === 0) return null;

  return (
    <CommandGroup heading="Recent">
      {recents.map((item) => (
        <CommandItem
          key={item.href}
          value={`${item.title} ${item.name}`}
          keywords={['recent']}
          onSelect={() => onSelect(item)}
        >
          <History className="text-muted-foreground" />
          <span>{item.title}</span>
          <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
            {item.kind === 'component' ? 'Component' : item.kind === 'block' ? 'Block' : 'Template'}
          </span>
        </CommandItem>
      ))}
    </CommandGroup>
  );
};
