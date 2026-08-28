import type { Metadata } from 'next';

import { DEFAULT_BASE } from '@/registry/hirael/registry-meta';

import { BlockEmbed, blockEmbedParams } from '../../../embed-routes';

export const dynamicParams = false;

export function generateStaticParams() {
  return blockEmbedParams();
}

export const metadata: Metadata = { robots: { index: false } };

export default async function BlockEmbedRoute({ params }: { params: Promise<{ category: string; block: string }> }) {
  const { category, block } = await params;
  return <BlockEmbed base={DEFAULT_BASE} category={category} block={block} />;
}
