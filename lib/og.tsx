import { ImageResponse } from 'next/og';

import { SITE } from '@/lib/site';

/** The social card behind all three detail routes: components, blocks, templates. */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

// `next/og` fetches a font per glyph it can't cover and Google Fonts has none
// for the Command key, so a ⌘K description fails the fetch and renders blank.
const spellGlyphs = (text: string) => text.replaceAll('⌘', 'Cmd');

/** Cut rather than wrap off the bottom of the card. */
const clamp = (text: string, max: number) => {
  const clean = spellGlyphs(text);
  return clean.length > max ? `${clean.slice(0, max - 3)}...` : clean;
};

export const ogCard = ({ kicker, title, description }: { kicker: string; title: string; description: string }) =>
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
