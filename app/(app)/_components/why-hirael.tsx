import { Boxes, Download, Languages, Layers, MonitorSmartphone, SunMoon, type LucideIcon } from 'lucide-react';

import { SectionHeading } from '@/components/page-header';

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
}

const FEATURES: Feature[] = [
  {
    icon: Download,
    title: 'Copies into your repo',
    body: 'The shadcn CLI writes the files into your project. Nothing in node_modules, no version to bump, and every line is yours to change.',
  },
  {
    icon: Boxes,
    title: 'Built on shadcn',
    body: 'Radix or Base UI primitives, shadcn conventions and your components.json. It sits beside the shadcn components you already have and looks like them.',
  },
  {
    icon: Layers,
    title: 'Any framework',
    body: 'Next.js, Remix, Vite or Astro: anywhere shadcn/ui and Tailwind CSS already run, with no runtime package to add.',
  },
  {
    icon: SunMoon,
    title: 'Light and dark',
    body: 'Every item reads your CSS variables, so it takes on your palette in both themes with nothing to restyle.',
  },
  {
    icon: Languages,
    title: 'RTL, no config',
    body: 'Logical properties throughout, mirrored icons and arrow keys, so setting dir=rtl is the whole job.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Responsive by default',
    body: 'Each item is checked from phone width to ultra-wide, so it looks right at whatever size you ship.',
  },
];

const CARD_GRID_SQUARES: [number, number][][] = [
  [
    [8, 1],
    [10, 3],
    [9, 5],
  ],
  [
    [9, 2],
    [11, 4],
    [8, 6],
  ],
  [
    [10, 1],
    [8, 4],
    [11, 2],
  ],
  [
    [8, 2],
    [10, 5],
    [9, 1],
  ],
  [
    [11, 3],
    [9, 6],
    [8, 1],
  ],
  [
    [9, 4],
    [11, 1],
    [10, 6],
  ],
];

interface CardGridProps {
  id: string;
  squares: [number, number][];
}

const CardGrid = ({ id, squares }: CardGridProps) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 mask-[linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-linear-to-br from-primary/8 to-transparent mask-[radial-gradient(farthest-side_at_top,white,transparent)]">
        <svg aria-hidden className="absolute inset-0 h-full w-full fill-primary/10 stroke-primary/25">
          <defs>
            <pattern id={id} width={20} height={20} patternUnits="userSpaceOnUse" x="-12" y="4">
              <path d="M.5 20V.5H20" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
          <svg x="-12" y="4" className="overflow-visible">
            {squares.map(([col, row], i) => (
              <rect strokeWidth="0" key={`${col}-${row}-${i}`} width={21} height={21} x={col * 20} y={row * 20} />
            ))}
          </svg>
        </svg>
      </div>
    </div>
  );
};

export const WhyHirael = () => {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="w-full px-4 sm:px-6">
        <SectionHeading
          kicker="Why Hirael"
          title="Own the source, not a dependency."
          blurb="Every item follows shadcn conventions: compound parts, data-slot attributes, your components.json and theme tokens. The CLI writes the files into your repo, so you edit them like code you wrote."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="glass-panel glass-panel-lit group relative flex flex-col gap-5 overflow-hidden rounded-2xl p-7 transition-colors duration-200 hover:bg-card/70"
              >
                <CardGrid id={`why-grid-${i}`} squares={CARD_GRID_SQUARES[i % CARD_GRID_SQUARES.length]} />
                <span className="glass-panel-strong relative z-10 inline-flex size-11 shrink-0 items-center justify-center rounded-full">
                  <Icon className="size-4 text-foreground" />
                </span>
                <div className="relative z-10 flex flex-col gap-2">
                  <h3 className="text-base font-medium tracking-tight">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
