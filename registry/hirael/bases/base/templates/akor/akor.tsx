import { cn } from '@/lib/utils';

import { About } from './about';
import { sora } from './fonts';
import { Footer } from './footer';
import { Hero } from './hero';
import { Navbar } from './navbar';
import { Services } from './services';
import { AkorStyles } from './styles';

const Akor = () => {
  return (
    <div
      className={cn(
        'akor',
        sora.variable,
        'relative min-h-svh bg-background [font-family:var(--font-akor-sans),ui-sans-serif,sans-serif] text-foreground antialiased',
      )}
    >
      <AkorStyles />
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Footer />
    </div>
  );
};

export default Akor;
