import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { DEFAULT_BASE, isRegistryBase } from '@/registry/hirael/registry-meta';

import { BlockEmbed, blockEmbedParams, nestedEmbedBases } from '../../../../embed-routes';

export const dynamicParams = false;

export function generateStaticParams() {
  return nestedEmbedBases().flatMap((base) => blockEmbedParams().map((params) => ({ base, ...params })));
}

export const metadata: Metadata = { robots: { index: false } };

export default async function BaseBlockEmbedRoute({
  params,
}: {
  params: Promise<{ base: string; category: string; block: string }>;
}) {
  const { base, category, block } = await params;
  if (!isRegistryBase(base) || base === DEFAULT_BASE) notFound();
  return <BlockEmbed base={base} category={category} block={block} />;
}
