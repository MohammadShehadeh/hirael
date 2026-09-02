import { DEFAULT_BASE } from '@/registry/hirael/registry-meta';

import { BlockEmbed, blockEmbedMetadata, blockEmbedParams } from '../../../embed-routes';

export const dynamicParams = false;

export function generateStaticParams() {
  return blockEmbedParams();
}

export const generateMetadata = blockEmbedMetadata;

export default async function BlockEmbedRoute({ params }: { params: Promise<{ category: string; block: string }> }) {
  const { category, block } = await params;
  return <BlockEmbed base={DEFAULT_BASE} category={category} block={block} />;
}
