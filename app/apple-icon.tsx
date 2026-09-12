import { ImageResponse } from 'next/og';

import { HIRAEL_ICON_PATH, HIRAEL_ICON_VIEWBOX } from '@/lib/logo-paths';

export const dynamic = 'force-static';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 22,
        backgroundImage: 'linear-gradient(180deg, #252C37 0%, #161B22 100%)',
      }}
    >
      <svg width="112" height="112" viewBox={HIRAEL_ICON_VIEWBOX} fill="#E7E4DE">
        <path d={HIRAEL_ICON_PATH} />
      </svg>
    </div>,
    { ...size },
  );
}
