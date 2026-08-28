import type { ReactNode } from 'react';
import { Check, X } from 'lucide-react';

import { GradientText } from './primitives';

const FREEDOM_VIDEO = '/media/templates/nexacore/freedom.mp4';

const NEGATIVES = [
  'Reactive firefighting when foundational issues surface too late',
  'Bloated coordination overhead drains bandwidth from core teams',
  "Constant re-verification because source data can't be trusted",
  'Fragmented vendor relations produce mismatched deliverables',
  'Scattered specs and decisions buried across siloed systems',
];

const POSITIVES = [
  'Layered dependency maps eliminate costly surprises at every phase',
  'Streamlined team handoffs deliver production-ready outcomes fast',
  'Live validation loops keep requirements locked across all stages',
  'Unified vendor management through a single accountable contact',
  'Centralized context and clear records accelerate every decision',
];

const ControlGlyph = () => {
  return (
    <svg width="19" height="18" viewBox="0 0 17 16" fill="none" aria-hidden className="shrink-0">
      <path
        d="M8.5 14C8.5 14 1.5 9.8 1.5 5.4C1.5 3.2 3.2 1.8 5 1.8C6.5 1.8 7.8 2.8 8.5 4C9.2 2.8 10.5 1.8 12 1.8C13.8 1.8 15.5 3.2 15.5 5.4C15.5 9.8 8.5 14 8.5 14Z"
        fill="rgb(200, 111, 255)"
      />
    </svg>
  );
};

const PointRow = ({ children, positive }: { children: ReactNode; positive?: boolean }) => {
  return (
    <div
      className="nexa-soft-shadow flex items-center gap-3 rounded-[18px] bg-white"
      style={{ padding: 'clamp(12px, 0.97vw, 16px) clamp(14px, 1.25vw, 20px)' }}
    >
      <span
        className="flex shrink-0 items-center justify-center"
        style={{
          width: 'clamp(16px, 1.25vw, 20px)',
          height: 'clamp(16px, 1.25vw, 20px)',
        }}
      >
        {positive ? (
          <Check className="size-full text-[var(--nexa-blue)]" strokeWidth={2.5} />
        ) : (
          <X className="size-full text-[var(--nexa-lavender-3)]" strokeWidth={2.5} />
        )}
      </span>
      <span
        className={positive ? 'text-[var(--nexa-navy)]' : 'text-[var(--nexa-lavender-3)]'}
        style={{ fontSize: 'clamp(13px, 1.15vw, 17px)' }}
      >
        {children}
      </span>
    </div>
  );
};

export const Freedom = () => {
  return (
    <section
      id="method"
      data-slot="freedom"
      className="flex flex-col items-center bg-white"
      style={{
        padding: 'clamp(48px, 6vw, 80px) clamp(16px, 3vw, 40px)',
        gap: 36,
      }}
    >
      <div className="flex flex-col items-center gap-9 text-center">
        <span
          className="inline-flex items-center gap-2 rounded-full bg-[var(--nexa-chip)] font-medium text-[var(--nexa-navy)]"
          style={{ padding: '0.9vw 1.25vw', fontSize: 18 }}
        >
          <ControlGlyph />
          Control
        </span>
        <h2
          className="font-medium text-[var(--nexa-navy)]"
          style={{ fontSize: 'clamp(32px, 4vw, 56px)', lineHeight: 1.15 }}
        >
          Stop absorbing the chaos.
          <br />
          <GradientText className="inline-block" style={{ paddingBottom: '0.3vw' }}>
            Run with confidence.
          </GradientText>
        </h2>
      </div>

      <div
        className="flex w-full flex-col items-center lg:grid lg:items-start"
        style={{
          gridTemplateColumns: '26vw 1fr 26vw',
          columnGap: 36,
          rowGap: 24,
          padding: '0 clamp(0px, 2.92vw, 40px)',
        }}
      >
        <div className="order-2 flex w-full flex-col lg:order-none" style={{ gap: 12 }}>
          {NEGATIVES.map((text) => (
            <PointRow key={text}>{text}</PointRow>
          ))}
        </div>

        <div className="order-first flex w-full justify-center lg:order-none">
          <div
            className="relative"
            style={{
              borderRadius: '50%',
              overflow: 'hidden',
              width: 'clamp(200px, 22vw, 400px)',
              height: 'clamp(200px, 22vw, 400px)',
            }}
          >
            <video
              src={FREEDOM_VIDEO}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden
              style={{
                width: '160%',
                height: '160%',
                objectFit: 'cover',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>
        </div>

        <div className="order-3 flex w-full flex-col lg:order-none" style={{ gap: 12 }}>
          {POSITIVES.map((text) => (
            <PointRow key={text} positive>
              {text}
            </PointRow>
          ))}
        </div>
      </div>
    </section>
  );
};
