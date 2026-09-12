import { ImageResponse } from 'next/og';

import { HIRAEL_LOCKUP_VIEWBOX, HIRAEL_MARK_PATH, HIRAEL_WORDMARK_PATH } from '@/lib/logo-paths';
import { SITE } from '@/lib/site';
import { COMPONENTS, REGISTRY } from '@/registry/hirael/registry-meta';

export const dynamic = 'force-static';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${SITE.description} - ${SITE.name}`;

export default function OpenGraphImage() {
  const components = COMPONENTS.length;
  const blocks = REGISTRY.filter((r) => r.category === 'blocks').length;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0D1117',
        color: '#E7E4DE',
        fontFamily: 'serif',
        padding: 80,
      }}
    >
      <svg width="646" height="190" viewBox={HIRAEL_LOCKUP_VIEWBOX} fill="#E7E4DE">
        <path d={HIRAEL_MARK_PATH} />
        <path d={HIRAEL_WORDMARK_PATH} />
      </svg>
      <div
        style={{
          marginTop: 28,
          fontSize: 28,
          letterSpacing: 6,
          marginRight: -6,
          color: '#ADA69A',
          textTransform: 'uppercase',
        }}
      >
        Longing · Memory · Light
      </div>
      <div
        style={{
          marginTop: 72,
          fontSize: 24,
          color: '#99A0AD',
          fontFamily: 'sans-serif',
          letterSpacing: 0.5,
          marginRight: -0.5,
        }}
      >
        {SITE.description}
      </div>
      <div
        style={{
          marginTop: 20,
          fontSize: 20,
          color: '#E7E4DE',
          fontFamily: 'monospace',
          letterSpacing: 3,
          marginRight: -3,
          textTransform: 'uppercase',
        }}
      >
        {`${components} components and ${blocks} blocks for shadcn`}
      </div>
    </div>,
    { ...size },
  );
}
