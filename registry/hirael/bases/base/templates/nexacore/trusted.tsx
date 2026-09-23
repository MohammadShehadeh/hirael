import { GradientText } from './primitives';
import { ServiceCard, type ServiceCardProps } from './service-card';

const TRUSTED_BG = '/media/templates/nexacore/trusted-bg.webp';

const CARDS: ServiceCardProps[] = [
  {
    label: 'Planning',
    level: 1,
    title: 'Turn new programs into structured plans without the noise.',
    bullets: ['Embedded program leads', 'Decision-ready roadmaps'],
  },
  {
    label: 'Procurement',
    level: 2,
    title: 'Source and qualify vendors with far less friction.',
    bullets: ['Cross-org scope alignment', 'End-to-end accountability'],
  },
  {
    label: 'Logistics',
    level: 3,
    title: 'Move the right materials on time without surprises.',
    bullets: ['Spec and fit validations', 'Change order ownership'],
  },
  {
    label: 'Commissioning',
    level: 4,
    title: 'Activate systems with complete context, not guesswork.',
    bullets: ['Uninterrupted workflows', 'Verified clean handoffs'],
  },
];

export const Trusted = () => {
  return (
    <section
      id="build"
      data-slot="trusted"
      className="relative flex flex-col items-center gap-[110px] bg-cover bg-center px-[clamp(16px,4vw,40px)] pt-[clamp(100px,12vw,180px)] pb-[clamp(100px,12vw,160px)]"
      style={{ backgroundImage: `url(${TRUSTED_BG})` }}
    >
      <div className="flex w-full max-w-[1200px] flex-col items-center gap-5 text-center">
        <h2 className="text-[length:clamp(32px,4vw,56px)] leading-[1.2] font-medium text-white">
          Relied on by enterprise teams
          <br />
          <GradientText>from groundbreak to go-live.</GradientText>
        </h2>
        <p className="text-[length:clamp(14px,1.25vw,18px)] text-[var(--nexa-lavender-2)]">
          Built for operational clarity through constant change. Proven across 530+ MW of critical infrastructure.
        </p>
      </div>

      <div className="grid w-full max-w-[1200px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card) => (
          <ServiceCard key={card.label} {...card} />
        ))}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[180px] bg-[linear-gradient(to_bottom,transparent,rgb(255,255,255))]"
      />
    </section>
  );
};
