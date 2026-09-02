import { DEFAULT_BASE } from '@/registry/hirael/registry-meta';

import { TemplateEmbed, templateEmbedMetadata, templateEmbedParams } from '../../embed-routes';

export const dynamicParams = false;

export function generateStaticParams() {
  return templateEmbedParams();
}

export const generateMetadata = templateEmbedMetadata;

export default async function TemplateEmbedRoute({ params }: { params: Promise<{ template: string }> }) {
  const { template } = await params;
  return <TemplateEmbed base={DEFAULT_BASE} template={template} />;
}
