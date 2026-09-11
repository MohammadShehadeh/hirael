import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/lib/og';
import { SITE } from '@/lib/site';
import { CATEGORY_LABELS, COMPONENTS, REGISTRY_BY_NAME } from '@/registry/hirael/registry-meta';

export const dynamic = 'force-static';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return COMPONENTS.map((entry) => ({
    category: entry.category,
    component: entry.name,
  }));
}

interface ComponentOpenGraphImageProps {
  params: Promise<{ category: string; component: string }>;
}

export default async function ComponentOpenGraphImage({ params }: ComponentOpenGraphImageProps) {
  const { component } = await params;
  const entry = REGISTRY_BY_NAME[component];

  return ogCard({
    kicker: entry ? CATEGORY_LABELS[entry.category] : 'Components',
    title: entry?.title ?? 'Hirael',
    description: entry?.description ?? SITE.description,
  });
}
