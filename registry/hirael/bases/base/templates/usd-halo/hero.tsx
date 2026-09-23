import { Marquee, type MarqueeBrand, PillButton } from './primitives';

const HERO_IMAGE = '/media/templates/usd-halo/hero.jpg';

const HERO_BRANDS: MarqueeBrand[] = [
  {
    name: 'Stripe',
    style: {
      fontFamily: "Georgia, 'Times New Roman', serif",
      fontWeight: 700,
      letterSpacing: '-0.02em',
      fontSize: '15px',
    },
  },
  {
    name: 'Coinbase',
    style: {
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontWeight: 900,
      letterSpacing: '0.08em',
      fontSize: '13px',
      textTransform: 'uppercase',
    },
  },
  {
    name: 'Uniswap',
    style: {
      fontFamily: "'Trebuchet MS', sans-serif",
      fontWeight: 600,
      letterSpacing: '0.01em',
      fontSize: '15px',
      fontStyle: 'italic',
    },
  },
  {
    name: 'Aave',
    style: {
      fontFamily: "'Courier New', monospace",
      fontWeight: 700,
      letterSpacing: '0.12em',
      fontSize: '13px',
      textTransform: 'uppercase',
    },
  },
  {
    name: 'Compound',
    style: {
      fontFamily: "Palatino, 'Book Antiqua', serif",
      fontWeight: 400,
      letterSpacing: '-0.01em',
      fontSize: '16px',
    },
  },
  {
    name: 'MakerDAO',
    style: {
      fontFamily: "Impact, 'Arial Narrow', sans-serif",
      fontWeight: 400,
      letterSpacing: '0.04em',
      fontSize: '14px',
    },
  },
  {
    name: 'Chainlink',
    style: {
      fontFamily: 'Verdana, sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.03em',
      fontSize: '13px',
    },
  },
];

export const HeroSection = () => {
  return (
    <section className="flex flex-1 items-end px-6 pb-6 pt-20">
      <div className="relative mx-auto h-[calc(100dvh-96px)] w-full max-w-[88rem] overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_IMAGE})` }} />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/20 to-white/10" />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/85 via-white/40 to-transparent"
        />

        <div className="relative z-10 flex h-full flex-col items-start justify-start p-12 pt-36">
          <h1 className="mb-4 max-w-xl text-5xl font-medium leading-tight tracking-[-0.04em] text-black md:text-6xl">
            Your Wealth
            <br />
            Works
          </h1>

          <p className="mb-8 max-w-md text-base leading-relaxed text-black/70 [font-family:var(--font-inter),ui-sans-serif,system-ui,sans-serif] md:text-lg">
            An automated, reward-powered digital dollar built for native passive earnings and effortless connection into
            DeFi.
          </p>

          <PillButton label="Join us" large />

          <div className="mt-auto w-full max-w-md overflow-hidden pt-24">
            <Marquee
              brands={HERO_BRANDS}
              trackClass="marquee-track"
              keyframesName="marquee"
              durationSeconds={22}
              itemClass="mx-7 shrink-0 whitespace-nowrap text-black/80"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
