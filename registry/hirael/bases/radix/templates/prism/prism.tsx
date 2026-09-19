import { cn } from '@/lib/utils';

import { Benefits } from './benefits';
import { Cta } from './cta';
import { Features } from './features';
import { barlow, instrumentSerif } from './fonts';
import { Hero } from './hero';
import { Navbar } from './navbar';
import { Process } from './process';
import { Stats } from './stats';
import { PrismStyles } from './styles';
import { Testimonials } from './testimonials';

const Prism = () => {
  return (
    <div
      className={cn(
        'prism',
        barlow.variable,
        instrumentSerif.variable,
        'relative min-h-svh bg-background text-foreground antialiased',
      )}
      style={{
        fontFamily: 'var(--font-prism-sans), ui-sans-serif, sans-serif',
      }}
    >
      <PrismStyles />
      <Navbar />
      <Hero />
      <Process />
      <Features />
      <Benefits />
      <Stats />
      <Testimonials />
      <Cta />
    </div>
  );
};

export default Prism;
