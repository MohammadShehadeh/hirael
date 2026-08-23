import { ShowcaseSidebar } from "@/components/sidebar";
import { ShowcaseTopbar } from "@/components/topbar";
import { SiteFooterCompact } from "@/components/site-footer";
import { getChangelog } from "@/lib/changelog";
import { getRepoStars } from "@/lib/github";
import { SidebarInset, SidebarProvider } from "@/registry/hirael/ui/sidebar";

export default async function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stars, changelog] = await Promise.all([
    getRepoStars(),
    getChangelog(),
  ]);
  const releases = changelog.entries.map((entry) => ({
    slug: entry.slug,
    label: entry.version ? `v${entry.version}` : entry.title,
    date: entry.displayDate,
  }));
  return (
    <SidebarProvider>
      <ShowcaseSidebar releases={releases} />
      <SidebarInset className="min-w-0">
        <ShowcaseTopbar stars={stars} />
        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 outline-none">
          {children}
        </main>
        <SiteFooterCompact />
      </SidebarInset>
    </SidebarProvider>
  );
}
