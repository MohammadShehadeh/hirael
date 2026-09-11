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

const CATEGORY_HINT_CLASS = 'ms-auto font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground';

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CommandPalette = ({ open, onOpenChange }: CommandPaletteProps) => {
  const router = useRouter();

  const handleSelect = (item: RecentItem) => {
    pushRecent(item);
    onOpenChange(false);
    router.push(item.href);
  };

  const blocks = REGISTRY.filter((entry) => entry.category === 'blocks');

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
            <RecentGroup onSelect={handleSelect} />
            <CommandGroup heading="Components">
              {COMPONENTS.map((component) => (
                <CommandItem
                  key={component.name}
                  value={`${component.title} ${component.name}`}
                  keywords={[component.description, CATEGORY_LABELS[component.category as ComponentCategory]]}
                  onSelect={() =>
                    handleSelect({
                      name: component.name,
                      title: component.title,
                      href: entryHref(component),
                      kind: 'component',
                    })
                  }
                >
                  <Boxes className="text-muted-foreground" />
                  <span>{component.title}</span>
                  <span className={CATEGORY_HINT_CLASS}>
                    {CATEGORY_LABELS[component.category as ComponentCategory]}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Blocks">
              {blocks.map((block) => (
                <CommandItem
                  key={block.name}
                  value={`${block.title} ${block.name}`}
                  keywords={[block.description, block.blockKind ?? '']}
                  onSelect={() =>
                    handleSelect({
                      name: block.name,
                      title: block.title,
                      href: entryHref(block),
                      kind: 'block',
                    })
                  }
                >
                  <LayoutTemplate className="text-muted-foreground" />
                  <span>{block.title}</span>
                  <span className={CATEGORY_HINT_CLASS}>
                    {block.blockKind ? BLOCK_KIND_LABELS[block.blockKind] : 'Block'}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Templates">
              {TEMPLATES.map((template) => (
                <CommandItem
                  key={template.name}
                  value={`${template.title} ${template.name}`}
                  keywords={[template.description]}
                  onSelect={() =>
                    handleSelect({
                      name: template.name,
                      title: template.title,
                      href: entryHref(template),
                      kind: 'template',
                    })
                  }
                >
                  <Frame className="text-muted-foreground" />
                  <span>{template.title}</span>
                  <span className={CATEGORY_HINT_CLASS}>Template</span>
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
          <span className="ms-auto inline-flex items-center gap-1.5">
            <Kbd>esc</Kbd> close
          </span>
        </div>
      </DialogContent>
    </Dialog>
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
  const search = useCommandState((state) => state.search);
  const recents = React.useSyncExternalStore(subscribeRecents, recentsSnapshot, serverRecents);

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
          <span className={CATEGORY_HINT_CLASS}>{RECENT_KIND_LABELS[item.kind]}</span>
        </CommandItem>
      ))}
    </CommandGroup>
  );
};
