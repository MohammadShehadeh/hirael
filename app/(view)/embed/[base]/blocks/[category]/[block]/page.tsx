import { notFound } from 'next/navigation';

import { DEFAULT_BASE, isRegistryBase } from '@/registry/hirael/registry-meta';

import { BlockEmbed } from '../../../../block-embed';
import { blockEmbedMetadata, blockEmbedParams, nestedEmbedBases } from '../../../../embed-routes';

export const dynamicParams = false;

export function generateStaticParams() {
  return nestedEmbedBases().flatMap((base) => blockEmbedParams().map((params) => ({ base, ...params })));
}

export const generateMetadata = blockEmbedMetadata;

interface BaseBlockEmbedRouteParams {
  base: string;
  category: string;
  block: string;
}

interface BaseBlockEmbedRouteProps {
  params: Promise<BaseBlockEmbedRouteParams>;
}

export default async function BaseBlockEmbedRoute({ params }: BaseBlockEmbedRouteProps) {
  const { base, category, block } = await params;
  if (!isRegistryBase(base) || base === DEFAULT_BASE) notFound();

  return <BlockEmbed base={base} category={category} block={block} />;
}
