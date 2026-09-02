import { CATEGORY_BY_SLUG } from '@/components/block-categories';
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/lib/og';
import { REGISTRY, REGISTRY_BY_NAME, entryCategorySlug } from '@/registry/hirael/registry-meta';

export const dynamic = 'force-static';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return REGISTRY.filter((entry) => entry.category === 'blocks').map((entry) => ({
    category: entryCategorySlug(entry),
    block: entry.name,
  }));
}

export default async function BlockOpenGraphImage({
  params,
}: {
  params: Promise<{ category: string; block: string }>;
}) {
  const { category, block } = await params;
  const entry = REGISTRY_BY_NAME[block];

  return ogCard({
    kicker: CATEGORY_BY_SLUG[category]?.title ?? 'Blocks',
    title: entry?.title ?? 'Hirael',
    description: entry?.description ?? 'Section blocks you copy into your repo.',
  });
}
