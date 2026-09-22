import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getRepoStars } from '@/lib/github';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps) {
  const stars = await getRepoStars();

  return (
    <div data-slot="layout" className="group/layout flex min-h-svh flex-col overflow-x-clip bg-background">
      <SiteHeader stars={stars} />
      <main id="main-content" tabIndex={-1} className="flex min-h-0 flex-1 flex-col outline-none">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
