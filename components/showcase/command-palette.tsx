"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Boxes, Frame, LayoutTemplate } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/registry/hirael/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/hirael/ui/command";
import {
  CATEGORY_LABELS,
  COMPONENTS,
  REGISTRY,
  TEMPLATES,
  entryHref,
  type ComponentCategory,
} from "@/registry/hirael/registry-meta";

/**
 * The heavy half of the ⌘K palette — the project's own `dialog` + `command`
 * (cmdk) primitives. Loaded lazily (see command-menu.tsx) so cmdk only ships
 * to visitors who actually open search.
 */
export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  const components = COMPONENTS;
  const blocks = REGISTRY.filter((r) => r.category === "blocks");
  const templates = TEMPLATES;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-[14vh] w-[calc(100%-2rem)] max-w-lg translate-y-0 gap-0 overflow-hidden rounded-md border-border bg-popover p-0 shadow-2xl"
      >
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">
          Search across all components and blocks.
        </DialogDescription>
        <Command loop>
          <CommandInput placeholder="Search components and blocks…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Components">
              {components.map((c) => (
                <CommandItem
                  key={c.name}
                  value={`${c.title} ${c.name}`}
                  onSelect={() => go(entryHref(c))}
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
                  onSelect={() => go(entryHref(b))}
                >
                  <LayoutTemplate className="text-muted-foreground" />
                  <span>{b.title}</span>
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                    /{b.name}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Templates">
              {templates.map((t) => (
                <CommandItem
                  key={t.name}
                  value={`${t.title} ${t.name}`}
                  onSelect={() => go(entryHref(t))}
                >
                  <Frame className="text-muted-foreground" />
                  <span>{t.title}</span>
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                    /{t.name}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
