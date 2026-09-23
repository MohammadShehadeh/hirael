import { DocsHeader } from '@/components/docs-header';
import { DocsTabsBar } from '@/components/docs-tabs-bar';
import { DocsSidebar } from '@/components/sidebar';
import { SiteFooterCompact } from '@/components/site-footer';
import { SponsorsRail } from '@/components/sponsors-card';
import { getChangelog } from '@/lib/changelog';
import { getRepoStars } from '@/lib/github';

interface ShowcaseLayoutProps {
  children: React.ReactNode;
}

export default async function ShowcaseLayout({ children }: ShowcaseLayoutProps) {
  const [stars, changelog] = await Promise.all([getRepoStars(), getChangelog()]);
  const releases = changelog.entries.map((entry) => ({
    slug: entry.slug,
    label: entry.version ? `v${entry.version}` : entry.title,
    date: entry.displayDate,
  }));

  return (
    <div className="flex min-h-svh flex-col [--docs-layout-width:97rem] [--docs-rail-width:15rem] [--docs-sidebar-width:17rem]">
      <DocsHeader stars={stars} releases={releases} />
      <DocsTabsBar />
      <div className="mx-auto flex w-full max-w-(--docs-layout-width) flex-1">
        <DocsSidebar releases={releases} />
        <div className="relative flex min-w-0 flex-1 flex-col">
          <div
            aria-hidden
            className="bg-dot-grid pointer-events-none absolute inset-x-0 top-0 h-90 mask-[radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent_75%)]"
          />
          <main id="main-content" tabIndex={-1} className="relative min-w-0 flex-1 outline-none">
            {children}
          </main>
          <SiteFooterCompact />
        </div>
        <SponsorsRail />
      </div>
    </div>
  );
}
