'use client';

import { useT } from '@/lib/demo-locale';
import { Marquee } from '@/registry/hirael/bases/base/components/marquee';

const brands = ['Vercel', 'Linear', 'Stripe', 'Supabase', 'Raycast', 'Framer', 'Resend', 'Clerk'];

interface ChipProps {
  children: React.ReactNode;
}

const Chip = ({ children }: ChipProps) => {
  return (
    <span className="inline-flex items-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground">
      {children}
    </span>
  );
};

const MarqueeDemo = () => {
  const t = useT();

  return (
    <div className="grid w-full max-w-2xl min-w-0 gap-8">
      <div className="grid min-w-0 gap-2">
        <p className="text-xs text-muted-foreground uppercase">
          {t({
            en: 'Pause on hover · edge fade',
            ar: 'إيقاف عند المرور · تلاشٍ عند الحواف',
          })}
        </p>
        <div className="relative w-full min-w-0 overflow-hidden py-1">
          <Marquee pauseOnHover duration={28}>
            {brands.map((b) => (
              <Chip key={b}>{b}</Chip>
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>

      <div className="grid min-w-0 gap-2">
        <p className="text-xs text-muted-foreground uppercase">{t({ en: 'Reverse direction', ar: 'اتجاه معكوس' })}</p>
        <div className="relative w-full min-w-0 overflow-hidden py-1">
          <Marquee reverse pauseOnHover duration={28}>
            {brands.map((b) => (
              <Chip key={b}>{b}</Chip>
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default MarqueeDemo;
