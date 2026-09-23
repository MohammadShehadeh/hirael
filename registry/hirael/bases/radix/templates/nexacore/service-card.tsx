import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

interface ServiceIconProps {
  level: number;
}

const ServiceIcon = ({ level }: ServiceIconProps) => {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-[17px] w-[17px] shrink-0 text-[var(--nexa-accent)]">
      <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.3" />
      {level >= 2 ? <circle cx="11.5" cy="4.5" r="2" fill="currentColor" /> : null}
      {level >= 3 ? <circle cx="4" cy="11" r="3" fill="currentColor" /> : null}
      {level >= 4 ? <circle cx="12" cy="12" r="4" fill="currentColor" /> : null}
    </svg>
  );
};

const Bullet = () => {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="mt-1.5 h-3.5 w-3.5 shrink-0 text-[var(--nexa-accent)]">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="2.5" fill="currentColor" />
    </svg>
  );
};

export interface ServiceCardProps {
  label: string;
  level: number;
  title: string;
  bullets: string[];
}

export const ServiceCard = ({ label, level, title, bullets }: ServiceCardProps) => {
  return (
    <div
      data-slot="service-card"
      className="nexa-blur-card group relative flex h-[clamp(320px,32vw,500px)] cursor-pointer flex-col overflow-hidden rounded-[36px] bg-[var(--nexa-card-dark)]"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-[1] h-[55%] translate-y-[-30%] bg-[radial-gradient(120%_90%_at_50%_0%,rgba(200,111,255,0.45),transparent_70%),linear-gradient(160deg,rgba(28,78,255,0.35),rgba(10,5,20,0)_60%)] opacity-70 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-[1] h-[55%] translate-y-full bg-[linear-gradient(to_top,rgba(10,5,20,0.95)_60%,transparent)] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
      />

      <div className="relative z-[2] flex h-full flex-col px-[clamp(18px,2.36vw,36px)] py-[clamp(16px,1.94vw,32px)]">
        <span
          data-slot="service-card-badge"
          className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-[var(--nexa-badge)] px-[clamp(10px,1.25vw,20px)] py-[clamp(6px,0.7vw,12px)] text-white [&>svg]:size-[17px]"
        >
          <ServiceIcon level={level} />
          <span className="text-[length:clamp(12px,0.97vw,15px)]">{label}</span>
        </span>

        <div className="flex-grow" />

        <h3 className="text-[length:clamp(16px,1.7vw,24px)] font-medium leading-snug text-white transition-transform duration-500 group-hover:-translate-y-2">
          {title}
        </h3>

        <ul className="mt-4 flex flex-col gap-2.5">
          {bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-2 text-[length:clamp(12px,1vw,15px)] text-[var(--nexa-lavender-2)]"
            >
              <Bullet />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <div
          className={cn(
            'max-h-0 translate-y-5 overflow-hidden opacity-0 transition-all duration-500',
            'group-hover:max-h-20 group-hover:translate-y-0 group-hover:opacity-100',
          )}
        >
          <Button
            type="button"
            className="mt-4 h-auto w-full"
            style={{
              padding: 'clamp(10px, 0.9vw, 14px) 0',
              fontSize: 'clamp(13px, 1.1vw, 16px)',
            }}
          >
            Learn more
            <ArrowRight className="size-4 rtl:-scale-x-100" />
          </Button>
        </div>
      </div>
    </div>
  );
};
