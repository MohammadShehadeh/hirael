import { ImageResponse } from 'next/og';

import { CATEGORY_LABELS, COMPONENTS, REGISTRY_BY_NAME } from '@/registry/hirael/registry-meta';

export const dynamic = 'force-static';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return COMPONENTS.map((entry) => ({
    category: entry.category,
    component: entry.name,
  }));
}

export default async function ComponentOpenGraphImage({
  params,
}: {
  params: Promise<{ category: string; component: string }>;
}) {
  const { component } = await params;
  const entry = REGISTRY_BY_NAME[component];
  const title = entry?.title ?? 'Hirael';
  const categoryLabel = entry ? CATEGORY_LABELS[entry.category] : 'Components';
  const description = entry?.description ?? "The components shadcn/ui doesn't ship.";

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: '#0D1117',
        color: '#E7E4DE',
        fontFamily: 'sans-serif',
        padding: 80,
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: 26,
          letterSpacing: 5,
          color: '#ADA69A',
          textTransform: 'uppercase',
          marginBottom: 28,
        }}
      >
        {categoryLabel}
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 86,
          fontWeight: 600,
          lineHeight: 1.1,
          maxWidth: 1000,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 32,
          fontSize: 30,
          color: '#99A0AD',
          maxWidth: 980,
        }}
      >
        {description.length > 140 ? `${description.slice(0, 137)}...` : description}
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 'auto',
          fontSize: 22,
          letterSpacing: 3,
          color: '#E7E4DE',
          textTransform: 'uppercase',
        }}
      >
        Hirael, a shadcn registry
      </div>
    </div>,
    { ...size },
  );
}
