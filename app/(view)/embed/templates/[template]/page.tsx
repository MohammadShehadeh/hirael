import { DEFAULT_BASE } from '@/registry/hirael/registry-meta';

import { templateEmbedMetadata, templateEmbedParams } from '../../embed-routes';
import { TemplateEmbed } from '../../template-embed';

export const dynamicParams = false;

export function generateStaticParams() {
  return templateEmbedParams();
}

export const generateMetadata = templateEmbedMetadata;

interface TemplateEmbedRouteProps {
  params: Promise<{ template: string }>;
}

export default async function TemplateEmbedRoute({ params }: TemplateEmbedRouteProps) {
  const { template } = await params;

  return <TemplateEmbed base={DEFAULT_BASE} template={template} />;
}
