import Link from "next/link"
import { Sparkles, LayoutTemplate } from "lucide-react"

import { cn } from "@/lib/utils"
import { ThemeSheetTrigger } from "@/components/showcase/theme-sheet"
import {
  CATEGORY_LABELS,
  REGISTRY_BY_CATEGORY,
  type ComponentCategory,
} from "@/registry/sabk/registry-meta"

export function ShowcaseSidebar({ active }: { active?: string }) {
  const order: ComponentCategory[] = ["inputs", "pickers", "files"]
  const blockCount = REGISTRY_BY_CATEGORY.blocks.length

  return (
    <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      <Link href="/" className="block border-b border-sidebar-border px-5 py-4">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold tracking-[-0.04em]">
            sabk
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground">
            ◆ forge
          </span>
        </div>
        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
          shadcn&apos;s missing pieces
        </p>
      </Link>

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
                  "group flex items-center justify-between rounded-sm px-3 py-1.5 text-sm transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  active === "theme" &&
                    "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <span className="inline-flex min-w-0 items-center gap-2 truncate">
                  <Sparkles className="size-3.5 text-foreground" />
                  Theme playground
                </span>
                {active === "theme" && (
                  <span className="size-1.5 rounded-full bg-foreground" />
                )}
              </Link>
            </li>
            <li>
              <Link
                href="/blocks"
                className={cn(
                  "group flex items-center justify-between rounded-sm px-3 py-1.5 text-sm transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  active === "blocks" &&
                    "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <span className="inline-flex min-w-0 items-center gap-2 truncate">
                  <LayoutTemplate className="size-3.5 text-foreground" />
                  Blocks
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                  {blockCount}
                </span>
              </Link>
            </li>
          </ul>
        </div>

        {order.map((cat) => {
          const items = REGISTRY_BY_CATEGORY[cat]
          if (!items.length) return null
          return (
            <div key={cat} className="mb-5">
              <div className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {CATEGORY_LABELS[cat]}
              </div>
              <ul className="flex flex-col">
                {items.map((entry) => {
                  const isActive = entry.name === active
                  return (
                    <li key={entry.name}>
                      <Link
                        href={`/${entry.name}`}
                        className={cn(
                          "group flex items-center justify-between rounded-sm px-3 py-1.5 text-sm transition-colors",
                          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          isActive &&
                            "bg-sidebar-accent text-sidebar-accent-foreground"
                        )}
                      >
                        <span className="min-w-0 truncate">{entry.title}</span>
                        {entry.status === "planned" && (
                          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                            soon
                          </span>
                        )}
                        {isActive && (
                          <span className="size-1.5 rounded-full bg-foreground" />
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </nav>

      <div className="flex items-center justify-between gap-2 border-t border-sidebar-border px-3 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
          v0.1 · peer of shadcn
        </span>
        <ThemeSheetTrigger />
      </div>
    </aside>
  )
}