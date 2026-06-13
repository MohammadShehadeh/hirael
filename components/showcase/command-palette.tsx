"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Boxes, Frame, LayoutTemplate } from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/hirael/ui/command"
import {
  CATEGORY_LABELS,
  COMPONENTS,
  REGISTRY,
  TEMPLATES,
  entryHref,
  type ComponentCategory,
} from "@/registry/hirael/registry-meta"

/**
 * The heavy half of the ⌘K palette — Radix dialog + the project's own
 * `command` (cmdk). Loaded lazily (see command-menu.tsx) so cmdk only ships
 * to visitors who actually open search.
 */
export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()

  const go = React.useCallback(
    (href: string) => {
      onOpenChange(false)
      router.push(href)
    },
    [router, onOpenChange]
  )

  const components = COMPONENTS
  const blocks = REGISTRY.filter((r) => r.category === "blocks")
  const templates = TEMPLATES

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-[14vh] z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-md border border-border bg-popover shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <DialogPrimitive.Title className="sr-only">
            Search
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Search across all components and blocks.
          </DialogPrimitive.Description>
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
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
