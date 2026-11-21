import { CATEGORY_BY_SLUG } from '@/components/block-categories';
import { OG_CONTENT_TYPE, OG_SIZE, ogCard, ogShotCard } from '@/lib/og';
import { readOgShot } from '@/lib/og-shots';
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

interface BlockRouteParams {
  category: string;
  block: string;
}

interface BlockOpenGraphImageProps {
  params: Promise<BlockRouteParams>;
}

export default async function BlockOpenGraphImage({ params }: BlockOpenGraphImageProps) {
  const { category, block } = await params;
  const entry = REGISTRY_BY_NAME[block];
  const kicker = CATEGORY_BY_SLUG[category]?.title ?? 'Blocks';
  const title = entry?.title ?? 'Hirael';
  const shot = readOgShot(block);
  if (shot) return ogShotCard({ kicker, title, shot });

  return ogCard({
    kicker,
    title,
    description: entry?.description ?? 'Section blocks you copy into your repo.',
  });
}
