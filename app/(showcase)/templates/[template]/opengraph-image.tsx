import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/lib/og';
import { REGISTRY, REGISTRY_BY_NAME } from '@/registry/hirael/registry-meta';

export const dynamic = 'force-static';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return REGISTRY.filter((entry) => entry.category === 'templates').map((entry) => ({ template: entry.name }));
}

export default async function TemplateOpenGraphImage({ params }: { params: Promise<{ template: string }> }) {
  const { template } = await params;
  const entry = REGISTRY_BY_NAME[template];

  return ogCard({
    kicker: 'Templates',
    title: entry?.title ?? 'Hirael',
    description: entry?.description ?? 'Full-page templates you copy into your repo.',
  });
}
