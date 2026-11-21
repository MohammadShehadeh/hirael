import { OG_CONTENT_TYPE, OG_SIZE, ogCard, ogShotCard } from '@/lib/og';
import { readOgShot } from '@/lib/og-shots';
import { REGISTRY, REGISTRY_BY_NAME } from '@/registry/hirael/registry-meta';

export const dynamic = 'force-static';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return REGISTRY.filter((entry) => entry.category === 'templates').map((entry) => ({ template: entry.name }));
}

interface TemplateRouteParams {
  template: string;
}

interface TemplateOpenGraphImageProps {
  params: Promise<TemplateRouteParams>;
}

export default async function TemplateOpenGraphImage({ params }: TemplateOpenGraphImageProps) {
  const { template } = await params;
  const entry = REGISTRY_BY_NAME[template];
  const title = entry?.title ?? 'Hirael';
  const shot = readOgShot(template);
  if (shot) return ogShotCard({ kicker: 'Templates', title, shot });

  return ogCard({
    kicker: 'Templates',
    title,
    description: entry?.description ?? 'Full-page templates you copy into your repo.',
  });
}
