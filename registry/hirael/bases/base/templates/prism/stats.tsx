import { VideoBackdrop } from './primitives';

const STATS_VIDEO = '/media/templates/prism/stats.mp4';

const STATS = [
  { value: '200+', label: 'Sites launched' },
  { value: '98%', label: 'Client satisfaction' },
  { value: '3.2x', label: 'More conversions' },
  { value: '5 days', label: 'Average delivery' },
] as const;

export const Stats = () => {
  return (
    <section data-slot="stats" className="relative overflow-hidden px-6 py-32 md:px-16 lg:px-24">
      <VideoBackdrop src={STATS_VIDEO} fadeTop className="saturate-0" />

      <dl className="rise liquid-glass relative z-10 mx-auto grid max-w-6xl grid-cols-2 gap-8 rounded-3xl p-12 text-center md:p-16 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-2">
            <dt className="order-2 text-sm font-light text-foreground/60">{stat.label}</dt>
            <dd className="[font-family:var(--font-prism-serif)] text-4xl tracking-tight text-foreground italic tabular-nums md:text-5xl lg:text-6xl">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
