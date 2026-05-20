import { ShowcaseSidebar } from "@/components/showcase/sidebar"

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh">
      <ShowcaseSidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}
