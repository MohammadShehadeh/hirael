import type { Metadata } from 'next';

import { DEFAULT_BASE } from '@/registry/hirael/registry-meta';

import { TemplateEmbed, templateEmbedParams } from '../../embed-routes';

export const dynamicParams = false;

export function generateStaticParams() {
  return templateEmbedParams();
}

export const metadata: Metadata = { robots: { index: false } };

export default async function TemplateEmbedRoute({ params }: { params: Promise<{ template: string }> }) {
  const { template } = await params;
  return <TemplateEmbed base={DEFAULT_BASE} template={template} />;
}
