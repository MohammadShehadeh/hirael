import { DEFAULT_BASE } from '@/registry/hirael/registry-meta';

import { ExampleEmbed, exampleEmbedMetadata, exampleEmbedParams } from '../../../embed-routes';

export const dynamicParams = false;

export function generateStaticParams() {
  return exampleEmbedParams();
}

export const generateMetadata = exampleEmbedMetadata;

interface ExampleEmbedRouteProps {
  params: Promise<{ component: string; example: string }>;
}

export default async function ExampleEmbedRoute({ params }: ExampleEmbedRouteProps) {
  const { component, example } = await params;

  return <ExampleEmbed base={DEFAULT_BASE} component={component} example={example} />;
}
