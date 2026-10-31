import { notFound } from 'next/navigation';

import { DEFAULT_BASE, isRegistryBase } from '@/registry/hirael/registry-meta';

import { nestedEmbedBases, templateEmbedMetadata, templateEmbedParams } from '../../../embed-routes';
import { TemplateEmbed } from '../../../template-embed';

export const dynamicParams = false;

export function generateStaticParams() {
  return nestedEmbedBases().flatMap((base) => templateEmbedParams().map((params) => ({ base, ...params })));
}

export const generateMetadata = templateEmbedMetadata;

interface BaseTemplateEmbedRouteParams {
  base: string;
  template: string;
}

interface BaseTemplateEmbedRouteProps {
  params: Promise<BaseTemplateEmbedRouteParams>;
}

export default async function BaseTemplateEmbedRoute({ params }: BaseTemplateEmbedRouteProps) {
  const { base, template } = await params;
  if (!isRegistryBase(base) || base === DEFAULT_BASE) notFound();

  return <TemplateEmbed base={base} template={template} />;
}
