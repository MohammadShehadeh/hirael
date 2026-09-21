import type { Metadata } from 'next';

import { LandingCatalog } from '@/components/landing-catalog';
import { getChangelog } from '@/lib/changelog';
import { getLatestCatalog } from '@/lib/detail-extras';
import { listingMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';

import { BleedRule } from './_components/bleed-rule';
import { ClosingCta } from './_components/closing-cta';
import { FeaturedComponents } from './_components/featured-components';
import { FullTemplates } from './_components/full-templates';
import { Hero } from './_components/hero';
import { SectionBlocks } from './_components/section-blocks';
import { SideRails } from './_components/side-rails';
import { WhyHirael } from './_components/why-hirael';

export const metadata: Metadata = listingMetadata({
  path: '/',
  title: SITE.tagline,
  description: SITE.longDescription,
  keywords: [...SITE.keywords],
});

const CATALOG_PREVIEW_COUNT = 2;

export default async function LandingPage() {
  const [changelog, latest] = await Promise.all([getChangelog(), getLatestCatalog(CATALOG_PREVIEW_COUNT)]);

  return (
    <div className="page-rails mx-auto w-[calc(100%-1rem)] max-w-370 flex-1 sm:w-[calc(100%-1.5rem)]">
      <div className="relative mx-auto max-w-6xl">
        <SideRails />
        <Hero latestRelease={changelog.entries[0] ?? null} />
        <BleedRule />
        <LandingCatalog items={latest} />
        <BleedRule />
        <WhyHirael />
        <FeaturedComponents />
        <SectionBlocks />
        <FullTemplates />
        <BleedRule />
        <ClosingCta />
      </div>
    </div>
  );
}
