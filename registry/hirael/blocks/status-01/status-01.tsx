"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/hirael/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/hirael/ui/tooltip";

type DayStatus = "operational" | "degraded" | "outage";
type UpdateStatus = "resolved" | "monitoring" | "identified" | "investigating";

const DAYS = 90;

const DOT_COLOR: Record<DayStatus, string> = {
  operational: "bg-success",
  degraded: "bg-warning",
  outage: "bg-destructive",
};

const STATUS_LABEL: Record<DayStatus, string> = {
  operational: "Operational",
  degraded: "Degraded",
  outage: "Outage",
};

const UPDATE_TONE: Record<UpdateStatus, string> = {
  resolved: "text-success",
  monitoring: "text-info",
  identified: "text-warning",
  investigating: "text-destructive",
};

const UPDATE_LABEL: Record<UpdateStatus, string> = {
  resolved: "Resolved",
  monitoring: "Monitoring",
  identified: "Identified",
  investigating: "Investigating",
};

interface Day {
  status: DayStatus;
  note: string;
}

// Sample data: day 0 is the oldest, day 89 is today.
const buildDays = (
  exceptions: Record<number, { status: DayStatus; note: string }>,
): Array<Day> => {
  return Array.from({ length: DAYS }, (_, i) => {
    const ex = exceptions[i];
    return {
      status: ex?.status ?? "operational",
      note: ex?.note ?? "No incidents recorded.",
    };
  });
};

const SERVICES = [
  {
    name: "API",
    uptime: "99.98%",
    days: buildDays({
      51: {
        status: "degraded",
        note: "Elevated latency from a slow query. Fixed with an index.",
      },
    }),
  },
  { name: "Dashboard", uptime: "100%", days: buildDays({}) },
  {
    name: "Runners",
    uptime: "99.91%",
    days: buildDays({
      68: {
        status: "outage",
        note: "Queue stalled for 34 minutes after a bad deploy. Rolled back.",
      },
      80: {
        status: "degraded",
        note: "Delayed run starts while a node pool recycled.",
      },
    }),
  },
  { name: "Webhooks", uptime: "100%", days: buildDays({}) },
];

const INCIDENTS = [
  {
    date: "July 31, 2026",
    title: "Elevated API error rate",
    impact: "Minor",
    updates: [
      {
        status: "resolved" as const,
        time: "14:20 UTC",
        message:
          "Error rates are back to baseline. The slow query now runs against an index.",
      },
      {
        status: "monitoring" as const,
        time: "13:05 UTC",
        message: "A fix is deployed and error rates are dropping.",
      },
      {
        status: "identified" as const,
        time: "12:30 UTC",
        message:
          "A query without an index was saturating the primary database.",
      },
    ],
  },
  {
    date: "July 17, 2026",
    title: "Delayed run starts",
    impact: "Minor",
    updates: [
      {
        status: "resolved" as const,
        time: "09:15 UTC",
        message:
          "Queue times are back to normal. We added headroom to the runner pool.",
      },
      {
        status: "investigating" as const,
        time: "08:40 UTC",
        message: "Runs are starting slower than usual. We are investigating.",
      },
    ],
  },
];

const daysAgoLabel = (i: number) => {
  const ago = DAYS - 1 - i;
  if (ago === 0) return "Today";
  if (ago === 1) return "Yesterday";
  return `${ago} days ago`;
};

const Status01 = () => {
  return (
    <section
      data-slot="status"
      className="flex min-h-svh w-full justify-center bg-background px-6 py-16 md:py-24"
    >
      <div className="grid w-full max-w-3xl gap-12 md:gap-16">
        <div data-slot="status-header" className="flex flex-col gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Status
          </span>
          <h1 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">
            All systems, at a glance
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Live service health, ninety days of history and every incident we
            have written up.
          </p>
        </div>

        <div
          data-slot="status-banner"
          className="flex items-center gap-4 border border-border bg-card p-5"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
            <Check aria-hidden className="size-6" />
          </span>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-lg font-semibold">All systems operational</h2>
            <p className="text-sm tabular-nums text-muted-foreground">
              Checked a minute ago
            </p>
          </div>
        </div>

        <div data-slot="status-uptime" className="w-full">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-2xl font-medium tracking-tight">
                Historical uptime
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                99.97% across all services over the last 90 days.
              </p>
            </div>
            <ul className="flex items-center gap-4">
              {(Object.keys(DOT_COLOR) as Array<DayStatus>).map((status) => (
                <li
                  key={status}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <span
                    aria-hidden
                    className={cn("size-2 rounded-full", DOT_COLOR[status])}
                  />
                  {STATUS_LABEL[status]}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-7 border border-border p-6">
            {SERVICES.map((service) => (
              <div key={service.name} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{service.name}</span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {service.uptime}
                  </span>
                </div>
                <div className="flex h-8 items-stretch gap-px">
                  {service.days.map((day, i) => (
                    <Tooltip key={i}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-label={`${daysAgoLabel(i)}: ${STATUS_LABEL[day.status]}`}
                          className={cn(
                            "h-full flex-1 rounded-[1px] opacity-80 transition-opacity hover:opacity-100 focus-visible:opacity-100",
                            DOT_COLOR[day.status],
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="flex w-52 flex-col gap-1.5 text-start">
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium tabular-nums">
                            {daysAgoLabel(i)}
                          </span>
                          <span className="flex items-center gap-1.5 text-[11px]">
                            <span
                              aria-hidden
                              className={cn(
                                "size-1.5 rounded-full",
                                DOT_COLOR[day.status],
                              )}
                            />
                            {STATUS_LABEL[day.status]}
                          </span>
                        </span>
                        <span className="text-[11px]/relaxed opacity-80">
                          {day.note}
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>90 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        <div data-slot="status-incidents" className="w-full">
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-medium tracking-tight">
              Past incidents
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Every incident gets a public write-up, resolved or not.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {INCIDENTS.map((incident) => (
              <div
                key={incident.title}
                data-slot="status-incident"
                className="flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" aria-hidden />
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">
                    {incident.date}
                  </span>
                  <span className="h-px flex-1 bg-border" aria-hidden />
                </div>
                <div className="border border-border bg-card p-5">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-semibold">{incident.title}</h3>
                    <Badge variant="secondary">{incident.impact}</Badge>
                  </div>

                  <ol className="mt-4 flex flex-col gap-4">
                    {incident.updates.map((update) => (
                      <li
                        key={update.time}
                        className="grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-1"
                      >
                        <Badge
                          variant="outline"
                          className={UPDATE_TONE[update.status]}
                        >
                          {UPDATE_LABEL[update.status]}
                        </Badge>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {update.time}
                        </span>
                        <p className="col-start-2 text-sm/relaxed text-muted-foreground">
                          {update.message}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Status01;
