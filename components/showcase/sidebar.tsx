import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  CATEGORY_LABELS,
  REGISTRY_BY_CATEGORY,
  type ComponentCategory,
} from "@/registry/sabk/registry-meta"

export function ShowcaseSidebar({ active }: { active?: string }) {
  const order: ComponentCategory[] = ["inputs", "pickers", "files"]

  return (
    <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r-2 border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      <Link href="/" className="block border-b-2 border-sidebar-border px-5 py-4">
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
      </Link>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
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
                        <span className="truncate">{entry.title}</span>
                        {entry.status === "planned" && (
                          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                            soon
                          </span>
                        )}
                        {isActive && (
                          <span className="size-1.5 rounded-full bg-forge" />
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

      <div className="border-t-2 border-sidebar-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
        v0.1 · peer of shadcn
      </div>
    </aside>
  )
}
