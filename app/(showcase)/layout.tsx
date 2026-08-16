import { ShowcaseSidebar } from "@/components/sidebar";
import { ShowcaseTopbar } from "@/components/topbar";
import { SiteFooter } from "@/components/site-footer";
import { getRepoStars } from "@/lib/github";
import { SidebarInset, SidebarProvider } from "@/registry/hirael/ui/sidebar";

export default async function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const stars = await getRepoStars();
  return (
    <SidebarProvider>
      <ShowcaseSidebar />
      <SidebarInset className="min-w-0">
        <ShowcaseTopbar stars={stars} />
        <main className="min-w-0 flex-1">{children}</main>
        <SiteFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}
