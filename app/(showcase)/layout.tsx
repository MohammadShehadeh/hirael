import { cookies } from "next/headers"

import { ShowcaseSidebar } from "@/components/showcase/sidebar"
import { ShowcaseTopbar } from "@/components/showcase/topbar"
import { SiteFooter } from "@/components/showcase/site-footer"
import {
  SidebarInset,
  SidebarProvider,
} from "@/registry/new-york/ui/sidebar"

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
      <SidebarInset className="min-w-0">
        <ShowcaseTopbar />
        <main className="min-w-0 flex-1">{children}</main>
        <SiteFooter />
      </SidebarInset>
    </SidebarProvider>
  )
}
