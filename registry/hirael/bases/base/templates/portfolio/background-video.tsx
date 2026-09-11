'use client';

export const BackgroundVideo = ({ src, className }: { src: string; className?: string }) => (
  <video src={src} autoPlay muted loop playsInline aria-hidden="true" tabIndex={-1} className={className} />
);

export const BACKGROUND_VIDEO = '/media/templates/portfolio/background.mp4';
