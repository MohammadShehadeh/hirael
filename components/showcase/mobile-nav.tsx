"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutTemplate, Menu, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/registry/sabk/ui/sheet"
import { ThemeSheetTrigger } from "@/components/showcase/theme-sheet"
import {
  CATEGORY_LABELS,
  REGISTRY_BY_CATEGORY,
  type ComponentCategory,
} from "@/registry/sabk/registry-meta"

const ORDER: ComponentCategory[] = ["inputs", "pickers", "files"]

export function MobileTopBar() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b-2 border-border bg-background/90 px-4 backdrop-blur-md md:hidden">
      <Link href="/" className="flex items-baseline gap-2">
        <span className="text-base font-semibold tracking-[-0.04em]">
          sabk
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-forge">
          ◆ forge
        </span>
      </Link>

      <div className="flex items-center gap-1.5">
        <ThemeSheetTrigger />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open navigation"
              className="inline-flex size-9 items-center justify-center rounded-sm border-2 border-border bg-card text-foreground transition-colors hover:border-forge hover:text-forge focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Menu className="size-4" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-72 max-w-[85vw] p-0 sm:max-w-[85vw]"
          >
            <MobileNavBody />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

function MobileNavBody() {
  const blockCount = REGISTRY_BY_CATEGORY.blocks.length
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="border-b-2 border-sidebar-border px-5 py-4">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold tracking-[-0.04em]">
            sabk
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-forge">
            ◆ forge
          </span>
        </div>
        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
          shadcn&apos;s missing pieces
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <div className="mb-5">
          <div className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            Workspace
          </div>
          <ul className="flex flex-col">
            <li>
              <Link
                href="/theme"
                className={cn(
                  "group flex items-center justify-between rounded-sm px-3 py-2 text-sm transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <span className="inline-flex items-center gap-2 truncate">
                  <Sparkles className="size-3.5 text-forge" />
                  Theme playground
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/blocks"
                className={cn(
                  "group flex items-center justify-between rounded-sm px-3 py-2 text-sm transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <span className="inline-flex items-center gap-2 truncate">
                  <LayoutTemplate className="size-3.5 text-forge" />
                  Blocks
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                  {blockCount}
                </span>
              </Link>
            </li>
          </ul>
        </div>

        {ORDER.map((cat) => {
          const items = REGISTRY_BY_CATEGORY[cat]
          if (!items.length) return null
          return (
            <div key={cat} className="mb-5">
              <div className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {CATEGORY_LABELS[cat]}
              </div>
              <ul className="flex flex-col">
                {items.map((entry) => (
                  <li key={entry.name}>
                    <Link
                      href={`/${entry.name}`}
                      className="group flex items-center justify-between rounded-sm px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <span className="truncate">{entry.title}</span>
                      {entry.status === "planned" && (
                        <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                          soon
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </nav>

      <div className="border-t-2 border-sidebar-border px-5 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
          v0.1 · peer of shadcn
        </span>
      </div>
    </div>
  )
}
