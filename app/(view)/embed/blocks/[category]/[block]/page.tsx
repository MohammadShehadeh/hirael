import { DEFAULT_BASE } from '@/registry/hirael/registry-meta';

import { BlockEmbed } from '../../../block-embed';
import { blockEmbedMetadata, blockEmbedParams } from '../../../embed-routes';

export const dynamicParams = false;

export function generateStaticParams() {
  return blockEmbedParams();
}

export const generateMetadata = blockEmbedMetadata;

interface BlockEmbedRouteParams {
  category: string;
  block: string;
}

interface BlockEmbedRouteProps {
  params: Promise<BlockEmbedRouteParams>;
}

export default async function BlockEmbedRoute({ params }: BlockEmbedRouteProps) {
  const { category, block } = await params;

  return <BlockEmbed base={DEFAULT_BASE} category={category} block={block} />;
}
