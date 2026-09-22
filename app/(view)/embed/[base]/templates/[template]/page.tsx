import { notFound } from 'next/navigation';

import { DEFAULT_BASE, isRegistryBase } from '@/registry/hirael/registry-meta';

import { TemplateEmbed, nestedEmbedBases, templateEmbedMetadata, templateEmbedParams } from '../../../embed-routes';

export const dynamicParams = false;

export function generateStaticParams() {
  return nestedEmbedBases().flatMap((base) => templateEmbedParams().map((params) => ({ base, ...params })));
}

export const generateMetadata = templateEmbedMetadata;

interface BaseTemplateEmbedRouteProps {
  params: Promise<{ base: string; template: string }>;
}

export default async function BaseTemplateEmbedRoute({ params }: BaseTemplateEmbedRouteProps) {
  const { base, template } = await params;
  if (!isRegistryBase(base) || base === DEFAULT_BASE) notFound();
  return <TemplateEmbed base={base} template={template} />;
}
