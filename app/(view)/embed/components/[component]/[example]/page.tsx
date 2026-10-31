import { DEFAULT_BASE } from '@/registry/hirael/registry-meta';

import { exampleEmbedMetadata, exampleEmbedParams } from '../../../embed-routes';
import { ExampleEmbed } from '../../../example-embed';

export const dynamicParams = false;

export function generateStaticParams() {
  return exampleEmbedParams();
}

export const generateMetadata = exampleEmbedMetadata;

interface ExampleEmbedRouteParams {
  component: string;
  example: string;
}

interface ExampleEmbedRouteProps {
  params: Promise<ExampleEmbedRouteParams>;
}

export default async function ExampleEmbedRoute({ params }: ExampleEmbedRouteProps) {
  const { component, example } = await params;

  return <ExampleEmbed base={DEFAULT_BASE} component={component} example={example} />;
}
