import { ImageResponse } from 'next/og';

import { HIRAEL_ICON_PATH, HIRAEL_ICON_VIEWBOX } from '@/lib/logo-paths';

export const dynamic = 'force-static';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundImage: 'linear-gradient(180deg, #252C37 0%, #161B22 100%)',
      }}
    >
      <svg width="40" height="40" viewBox={HIRAEL_ICON_VIEWBOX} fill="#E7E4DE">
        <path d={HIRAEL_ICON_PATH} />
      </svg>
    </div>,
    { ...size },
  );
}
