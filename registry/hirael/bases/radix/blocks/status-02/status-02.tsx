import { Activity, Timer, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Sparkline, type SparklineTone } from '@/registry/hirael/bases/radix/components/sparkline';

type ServiceStatus = 'operational' | 'degraded' | 'outage';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const STATUS_LABEL: Record<ServiceStatus, string> = {
  operational: 'Operational',
  degraded: 'Degraded',
  outage: 'Outage',
};

const STATUS_TONE: Record<ServiceStatus, SparklineTone> = {
  operational: 'success',
  degraded: 'warning',
  outage: 'destructive',
};

const STATUS_DOT: Record<ServiceStatus, string> = {
  operational: 'bg-success',
  degraded: 'bg-warning',
  outage: 'bg-destructive',
};

const STATUS_BORDER: Record<ServiceStatus, string> = {
  operational: 'border-border',
  degraded: 'border-warning/40',
  outage: 'border-destructive/40',
};

const STATUS_TEXT: Record<ServiceStatus, string> = {
  operational: 'text-success',
  degraded: 'text-warning',
  outage: 'text-destructive',
};

interface Service {
  name: string;
  status: ServiceStatus;
  uptime: string;
  response: string;
  /** Response time in ms, oldest first. */
  history: number[];
}

const SERVICES: readonly Service[] = [
  {
    name: 'API',
    status: 'operational',
    uptime: '99.98%',
    response: '142ms',
    history: [148, 141, 144, 139, 146, 143, 138, 142, 147, 140, 143, 141, 145, 139, 142, 144, 140, 142],
  },
  {
    name: 'Web app',
    status: 'operational',
    uptime: '100%',
    response: '88ms',
    history: [92, 88, 90, 86, 89, 91, 87, 90, 88, 86, 89, 92, 88, 87, 90, 88, 89, 88],
  },
  {
    name: 'Authentication',
    status: 'degraded',
    uptime: '99.62%',
    response: '410ms',
    history: [180, 190, 205, 220, 240, 262, 280, 300, 318, 340, 352, 366, 380, 388, 396, 402, 408, 410],
  },
  {
    name: 'Webhooks',
    status: 'operational',
    uptime: '99.91%',
    response: '165ms',
    history: [170, 164, 168, 162, 166, 171, 163, 165, 169, 161, 166, 168, 164, 170, 165, 163, 167, 165],
  },
  {
    name: 'CDN',
    status: 'operational',
    uptime: '100%',
    response: '24ms',
    history: [30, 27, 25, 28, 24, 26, 23, 25, 27, 24, 22, 25, 26, 23, 24, 25, 23, 24],
  },
  {
    name: 'Database',
    status: 'operational',
    uptime: '99.99%',
    response: '51ms',
    history: [54, 50, 52, 49, 53, 51, 50, 52, 55, 50, 51, 49, 52, 53, 50, 51, 52, 51],
  },
];

const Status02 = () => {
  return (
    <section data-slot="status" className="bg-background py-20 sm:py-28" aria-labelledby="status-02-heading">
      <div className="mx-auto w-full max-w-5xl px-4">
        <div data-slot="status-header" className="max-w-xl">
          <p className={cn(ENTER, 'text-sm text-muted-foreground')}>Health checks every 30 seconds</p>
          <h2
            id="status-02-heading"
            style={stagger(1)}
            className={cn(ENTER, 'mt-3 font-serif text-3xl font-medium tracking-tight text-balance sm:text-4xl')}
          >
            Service health at a glance
          </h2>
          <p style={stagger(2)} className={cn(ENTER, 'mt-4 text-pretty text-muted-foreground')}>
            Response time, uptime and live status for every service, side by side, so a regression never hides.
          </p>
        </div>

        <ul data-slot="status-list" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <li
              key={service.name}
              data-slot="status-card"
              data-status={service.status}
              style={stagger(index, 60, 160)}
              className={cn(
                ENTER,
                'flex flex-col gap-4 rounded-xl border bg-card p-4 text-card-foreground',
                STATUS_BORDER[service.status],
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-medium">{service.name}</h3>
                <span aria-hidden className={cn('size-2 rounded-full', STATUS_DOT[service.status])} />
              </div>

              <div className="flex flex-col gap-2">
                <Sparkline
                  data={service.history}
                  variant="area"
                  curve
                  min={0}
                  max={Math.max(...service.history) * 1.4}
                  tone={STATUS_TONE[service.status]}
                  label={`${service.name} response time, last ${service.history.length} checks`}
                  className="h-12 w-full"
                />
                <p className={cn('text-xs font-medium', STATUS_TEXT[service.status])}>{STATUS_LABEL[service.status]}</p>
              </div>

              <dl className="grid grid-cols-2 divide-x divide-border rounded-lg border border-border rtl:divide-x-reverse">
                <Metric icon={Activity} label="Uptime" value={service.uptime} />
                <Metric icon={Timer} label="Response" value={service.response} />
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

interface MetricProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

const Metric = ({ icon: Icon, label, value }: MetricProps) => {
  return (
    <div className="flex flex-col gap-1.5 p-3">
      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon aria-hidden className="size-3" />
        {label}
      </dt>
      <dd className="text-lg font-semibold tabular-nums">{value}</dd>
    </div>
  );
};

export default Status02;
