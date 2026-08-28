'use client';

/**
 * Background MP4. Autoplays muted and loops; positioning and sizing come from
 * `className` so the same player serves the hero and the vertically flipped
 * footer.
 */
export const BackgroundVideo = ({ src, className }: { src: string; className?: string }) => (
  <video src={src} autoPlay muted loop playsInline aria-hidden="true" tabIndex={-1} className={className} />
);

export const BACKGROUND_VIDEO = '/media/templates/portfolio/background.mp4';
