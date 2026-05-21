import { cookies } from "next/headers"

import { ShowcaseSidebar } from "@/components/showcase/sidebar"
import { Separator } from "@/registry/sabk/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/sabk/ui/sidebar"

export default async function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <ShowcaseSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background/85 px-3 backdrop-blur-md md:hidden">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-1 h-5" />
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold tracking-[-0.04em]">
              sabk
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground">
              ◆ forge
            </span>
          </div>
        </header>
        <div className="hidden md:flex md:h-10 md:items-center md:gap-2 md:px-3">
          <SidebarTrigger className="-ml-1" />
        </div>
        <main className="min-w-0 flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
