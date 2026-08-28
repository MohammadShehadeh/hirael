import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { DEFAULT_BASE, isRegistryBase } from '@/registry/hirael/registry-meta';

import { TemplateEmbed, nestedEmbedBases, templateEmbedParams } from '../../../embed-routes';

export const dynamicParams = false;

export function generateStaticParams() {
  return nestedEmbedBases().flatMap((base) => templateEmbedParams().map((params) => ({ base, ...params })));
}

export const metadata: Metadata = { robots: { index: false } };

export default async function BaseTemplateEmbedRoute({
  params,
}: {
  params: Promise<{ base: string; template: string }>;
}) {
  const { base, template } = await params;
  if (!isRegistryBase(base) || base === DEFAULT_BASE) notFound();
  return <TemplateEmbed base={base} template={template} />;
}
