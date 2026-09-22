import * as React from 'react';
import Image from 'next/image';
import { Play, Rocket } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';

const RISE =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 70, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.61-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.49-1.11-1.49-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.13-4.55-5.04 0-1.11.39-2.02 1.03-2.74-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.04A9.4 9.4 0 0 1 12 7.04c.85 0 1.7.12 2.5.34 1.9-1.31 2.74-1.04 2.74-1.04.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.74 0 3.92-2.34 4.78-4.57 5.03.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  );
};

const Hero10 = () => {
  return (
    <section
      data-slot="hero"
      className="relative z-0 min-h-180 overflow-hidden rounded-sm border border-border bg-background pt-30"
    >
      <Image
        src="/media/blocks/hero-10/fractal-maze.jpg"
        alt="Fractal maze of interlocking paths"
        width={1920}
        height={1080}
        quality={75}
        priority
        className="absolute inset-0 h-full w-full object-cover dark:opacity-40 blur-[1px] md:blur-[2px]"
      />

      <div data-slot="hero-content" className="relative z-10 px-6">
        <div className="relative mx-auto mb-8 max-w-4xl space-y-4 text-center sm:mb-12 md:mb-16">
          <span
            className={cn(
              RISE,
              'inline-flex w-fit items-center gap-1 rounded-full border border-white/30 px-2 py-0.5 font-medium whitespace-nowrap text-white',
            )}
          >
            <Rocket aria-hidden className="size-3" />
            <span className="text-xs">Visual CI/CD editor</span>
          </span>

          <h1
            style={stagger(1)}
            className={cn(
              'relative text-balance text-5xl font-semibold leading-14 md:text-6xl lg:text-7xl xl:leading-16 text-white',
              RISE,
            )}
          >
            The visual control plane for your pipelines
          </h1>

          <p
            style={stagger(2)}
            className={cn(
              'mx-auto mt-8 w-full text-base tracking-tight text-white/75 sm:text-lg md:text-balance',
              RISE,
            )}
          >
            Arrange build, test, and deploy steps on a canvas, see which one failed and why, and have every change
            written back to your YAML.
          </p>

          <div
            data-slot="hero-actions"
            style={stagger(3)}
            className={cn('mx-auto my-8 flex flex-col items-center justify-center gap-4 sm:flex-row md:max-w-md', RISE)}
          >
            <Button render={<a href="#" className="group flex items-center gap-2" />} nativeButton={false} size="lg">
              <GithubIcon className="size-4" />
              Connect GitHub
            </Button>
            <Button
              render={<a href="#" className="group flex items-center gap-2" />}
              nativeButton={false}
              variant="secondary"
              size="lg"
            >
              <Play className="size-3.5 fill-current" />
              See how it works
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero10;
