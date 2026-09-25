import { notFound } from 'next/navigation';

import { DEFAULT_BASE, isRegistryBase } from '@/registry/hirael/registry-meta';

import { exampleEmbedMetadata, exampleEmbedParams, nestedEmbedBases } from '../../../../embed-routes';
import { ExampleEmbed } from '../../../../example-embed';

export const dynamicParams = false;

export function generateStaticParams() {
  return nestedEmbedBases().flatMap((base) => exampleEmbedParams().map((params) => ({ base, ...params })));
}

export const generateMetadata = exampleEmbedMetadata;

interface BaseExampleEmbedRouteProps {
  params: Promise<{ base: string; component: string; example: string }>;
}

export default async function BaseExampleEmbedRoute({ params }: BaseExampleEmbedRouteProps) {
  const { base, component, example } = await params;
  if (!isRegistryBase(base) || base === DEFAULT_BASE) notFound();

  return <ExampleEmbed base={base} component={component} example={example} />;
}
