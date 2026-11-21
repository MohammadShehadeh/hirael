import { ImageResponse } from 'next/og';

import { OG_SHOT_SIZE } from '@/lib/og-shots';
import { SITE } from '@/lib/site';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

const clamp = (text: string, max: number) => {
  // The image renderer has no font for ⌘, so the card would come out blank.
  const clean = text.replaceAll('⌘', 'Cmd');

  return clean.length > max ? `${clean.slice(0, max - 3)}...` : clean;
};

export interface OgCardOptions {
  kicker: string;
  title: string;
  description: string;
}

export const ogCard = ({ kicker, title, description }: OgCardOptions) =>
  new ImageResponse(
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
        {kicker}
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
        {clamp(title, 46)}
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
        {clamp(description, 140)}
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
        {SITE.name}, a shadcn registry
      </div>
    </div>,
    { ...OG_SIZE },
  );

export interface OgShotCardOptions {
  kicker: string;
  title: string;
  /** The item's screenshot as a data URL, from `readOgShot`. */
  shot: string;
}

/** A card that leads with the item itself: title on top, its screenshot running off the bottom edge. */
export const ogShotCard = ({ kicker, title, shot }: OgShotCardOptions) =>
  new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#0D1117',
        color: '#E7E4DE',
        fontFamily: 'sans-serif',
        padding: '44px 56px 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{ display: 'flex', fontSize: 22, letterSpacing: 4, color: '#ADA69A', textTransform: 'uppercase' }}
          >
            {kicker}
          </div>
          <div style={{ display: 'flex', marginTop: 10, fontSize: 52, fontWeight: 600, lineHeight: 1.1 }}>
            {clamp(title, 34)}
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 22, letterSpacing: 3, color: '#99A0AD', textTransform: 'uppercase' }}>
          {SITE.name}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 30,
          flexGrow: 1,
          overflow: 'hidden',
          border: '1px solid #2A313C',
          borderBottom: 'none',
          borderRadius: '14px 14px 0 0',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- the card renderer draws plain img elements, not next/image */}
        <img src={shot} width={OG_SHOT_SIZE.width} height={OG_SHOT_SIZE.height} alt="" />
      </div>
    </div>,
    { ...OG_SIZE },
  );
