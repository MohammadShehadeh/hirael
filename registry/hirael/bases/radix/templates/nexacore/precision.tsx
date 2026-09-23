import { BrandMark, GradientText } from './primitives';

const PRECISION_BG = '/media/templates/nexacore/precision-bg.webp';

interface Pillar {
  label: string;
  start: number;
  bottom: number;
  items: string[];
}

const PILLARS: Pillar[] = [
  {
    label: 'Scopes',
    start: 2.8,
    bottom: 7,
    items: ['conditions', 'capacity', 'specs', 'timelines'],
  },
  {
    label: 'Integrates',
    start: 22.4,
    bottom: 9.08,
    items: ['civil', 'mechanical', 'electrical', 'controls'],
  },
  {
    label: 'Certifies',
    start: 41.2,
    bottom: 11.16,
    items: ['redundancy', 'testing', 'compliance', 'sign-offs'],
  },
  {
    label: 'Activates',
    start: 61.1,
    bottom: 13.24,
    items: ['cutover', 'runbooks', 'handoff', 'SLAs'],
  },
];

const DeliveryGlyph = () => {
  return (
    <svg width="19" height="18" viewBox="0 0 17 16" fill="none" aria-hidden className="shrink-0">
      <circle cx="8.5" cy="8" r="7" stroke="#c86fff" strokeWidth="1.2" />
      <rect x="8" y="0" width="1" height="3" fill="rgb(200, 111, 255)" />
      <rect x="8" y="13" width="1" height="3" fill="rgb(200, 111, 255)" />
      <rect x="0" y="7.5" width="3" height="1" fill="rgb(200, 111, 255)" />
      <rect x="14" y="7.5" width="3" height="1" fill="rgb(200, 111, 255)" />
    </svg>
  );
};

interface PillarChipProps {
  label: string;
  small?: boolean;
}

const PillarChip = ({ label, small }: PillarChipProps) => {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-[20px] bg-[linear-gradient(135deg,rgb(255,255,255),rgba(255,255,255,0.6))] font-medium text-[var(--nexa-navy)]"
      style={{
        fontSize: small ? 15 : 18,
        padding: small ? '10px 18px' : '0.972vw 1.736vw',
      }}
    >
      <BrandMark
        style={
          small
            ? { width: 16, height: 16 }
            : {
                width: '1.111vw',
                height: '1.111vw',
                minWidth: 16,
                minHeight: 16,
              }
        }
      />
      {label}
    </span>
  );
};

const DesktopStaircase = () => {
  return (
    <div className="relative hidden h-[31.94vw] w-[82.292vw] sm:block">
      {PILLARS.map((pillar) => (
        <div
          key={pillar.label}
          className="absolute flex flex-col items-center"
          style={{
            insetInlineStart: `${pillar.start}vw`,
            bottom: `${pillar.bottom}vw`,
          }}
        >
          <PillarChip label={pillar.label} />
          <div className="relative mt-[8px]">
            <div className="nexa-grad-line-bg h-[14.24vw] w-px" />
            <div className="absolute start-[1.94vw] top-[0.56vw] flex flex-col gap-[4px] text-[var(--nexa-navy)]">
              {pillar.items.map((item) => (
                <span key={item} className="px-[1.04vw] py-[0.69vw] text-[16px] whitespace-nowrap">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const MobileStack = () => {
  return (
    <div className="flex w-full flex-col gap-10 sm:hidden">
      {PILLARS.map((pillar, i) => {
        const end = i % 2 === 1;
        return (
          <div key={pillar.label} className={end ? 'flex flex-col items-end' : 'flex flex-col items-start'}>
            <PillarChip label={pillar.label} small />
            <div className="mt-4 flex gap-4" style={{ flexDirection: end ? 'row-reverse' : 'row' }}>
              <div className="nexa-grad-line-bg min-h-[120px] w-px shrink-0" />
              <div className="flex flex-col" style={{ alignItems: end ? 'flex-end' : 'flex-start' }}>
                {pillar.items.map((item) => (
                  <span key={item} className="py-[8px] text-[14px] text-[rgb(100,80,160)]">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Precision = () => {
  return (
    <section
      id="thinking"
      data-slot="precision"
      className="flex flex-col items-center gap-[clamp(32px,4vw,56px)] bg-cover bg-center bg-no-repeat px-[clamp(16px,4vw,60px)] pt-[clamp(48px,8vw,120px)] pb-[clamp(48px,5.56vw,80px)] text-center"
      style={{ backgroundImage: `url(${PRECISION_BG})` }}
    >
      <div className="flex flex-col items-center">
        <span className="inline-flex items-center gap-2 rounded-[36px] bg-[rgb(249,249,249)] px-[clamp(12px,1.25vw,20px)] py-[clamp(8px,0.9vw,14px)] text-[length:clamp(14px,1.1vw,18px)] font-medium text-[var(--nexa-navy)]">
          <DeliveryGlyph />
          Structured Delivery
        </span>

        <h2 className="mt-[22px] max-w-[clamp(700px,60vw,900px)] text-[length:clamp(28px,4vw,56px)] font-medium leading-[1.15] text-[var(--nexa-navy)]">
          <span className="block sm:whitespace-nowrap">One integrated, end-to-end system.</span>
          <GradientText className="block pb-[0.3vw]">Compounding operational value.</GradientText>
        </h2>

        <p className="mt-6 text-[length:clamp(15px,1.2vw,20px)] text-[var(--nexa-lavender)]">
          NexaCore teams capture, align, validate and deliver exactly what keeps your programs on track.
        </p>
      </div>

      <div className="w-full max-w-[82.292vw]">
        <DesktopStaircase />
        <MobileStack />
      </div>
    </section>
  );
};
