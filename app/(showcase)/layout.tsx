import { ShowcaseSidebar } from "@/components/showcase/sidebar"
import { ShowcaseTopbar } from "@/components/showcase/topbar"
import { SiteFooter } from "@/components/showcase/site-footer"
import {
  SidebarInset,
  SidebarProvider,
} from "@/registry/hirael/ui/sidebar"

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // The sidebar is permanently open on desktop and only toggleable on mobile
  // (via the Sheet). Forcing `open` locks the desktop state so neither the
  // (hidden) trigger nor the keyboard shortcut can collapse it.
  return (
    <SidebarProvider open>
      <ShowcaseSidebar />
      <SidebarInset className="min-w-0">
        <ShowcaseTopbar />
        <main className="min-w-0 flex-1">{children}</main>
        <SiteFooter />
      </SidebarInset>
    </SidebarProvider>
  )
}
