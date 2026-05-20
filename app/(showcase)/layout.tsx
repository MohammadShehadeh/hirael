import { MobileTopBar } from "@/components/showcase/mobile-nav"
import { ShowcaseSidebar } from "@/components/showcase/sidebar"

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh">
      <ShowcaseSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
