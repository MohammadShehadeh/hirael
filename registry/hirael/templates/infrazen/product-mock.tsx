import { cn } from "@/lib/utils";

const NAV = ["Overview", "Deployments", "Regions", "Logs", "Metrics", "Access"];

const STATS = [
  { label: "Requests / min", value: "1.84M" },
  { label: "p50 latency", value: "38ms" },
  { label: "Uptime 30d", value: "99.99%" },
  { label: "Error rate", value: "0.01%" },
];

const DEPLOYS = [
  { hash: "a1f9c2e", branch: "main", env: "production", state: "Ready" },
  { hash: "7b3d018", branch: "main", env: "production", state: "Ready" },
  {
    hash: "c44e9af",
    branch: "feat/edge-cache",
    env: "preview",
    state: "Building",
  },
];

// Deterministic sparkline-style area chart so the mock renders identically on
// every build (no random, no layout shift).
const POINTS = [38, 30, 44, 36, 52, 41, 58, 49, 63, 55, 72, 64];

function AreaChart() {
  const w = 320;
  const h = 96;
  const max = 80;
  const step = w / (POINTS.length - 1);
  const coords = POINTS.map((p, i) => [i * step, h - (p / max) * h] as const);
  const line = coords.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `0,${h} ${line} ${w},${h}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="h-24 w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="infrazen-chart" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--zen)" stopOpacity="0.28" />
          <stop offset="1" stopColor="var(--zen)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#infrazen-chart)" />
      <polyline
        points={line}
        fill="none"
        stroke="var(--zen)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Faux Infrazen console: app chrome, sidebar, live metrics, chart, deploys. */
export function ProductMock({ className }: { className?: string }) {
  return (
    <div
      data-slot="product-mock"
      className={cn(
        "zen-ring overflow-hidden rounded-xl border border-border bg-card",
        className,
      )}
    >
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="zen-mono mx-auto rounded-md border border-border bg-background px-3 py-1 text-[11px] text-muted-foreground">
          infrazen.app / production
        </span>
      </div>

      <div className="grid sm:grid-cols-[160px_1fr]">
        {/* sidebar */}
        <nav className="hidden flex-col gap-1 border-e border-border p-3 sm:flex">
          {NAV.map((item, i) => (
            <span
              key={item}
              className={cn(
                "zen-mono rounded-md px-2.5 py-1.5 text-xs",
                i === 1
                  ? "bg-[var(--zen-soft)] text-[var(--zen)]"
                  : "text-muted-foreground",
              )}
            >
              {item}
            </span>
          ))}
        </nav>

        {/* main */}
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                Deployments
              </span>
              <span className="zen-mono inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-[var(--zen)]" />
                live
              </span>
            </div>
            <span className="zen-mono rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
              Deploy
            </span>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-card px-3 py-2.5">
                <div className="zen-mono text-base font-semibold text-foreground">
                  {stat.value}
                </div>
                <div className="zen-mono mt-0.5 text-[10px] text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border p-3">
            <div className="zen-mono mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Requests / min</span>
              <span className="text-[var(--zen)]">+12.4%</span>
            </div>
            <AreaChart />
          </div>

          <div className="flex flex-col gap-px overflow-hidden rounded-lg border border-border bg-border">
            {DEPLOYS.map((d) => (
              <div
                key={d.hash}
                className="flex items-center gap-3 bg-card px-3 py-2.5"
              >
                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    d.state === "Ready" ? "bg-[var(--zen)]" : "bg-amber-400/80",
                  )}
                />
                <span className="zen-mono text-xs text-foreground">
                  {d.hash}
                </span>
                <span className="zen-mono truncate text-[11px] text-muted-foreground">
                  {d.branch}
                </span>
                <span className="zen-mono ms-auto text-[10px] uppercase tracking-wide text-muted-foreground">
                  {d.env}
                </span>
                <span
                  className={cn(
                    "zen-mono text-[11px]",
                    d.state === "Ready"
                      ? "text-[var(--zen)]"
                      : "text-amber-400/90",
                  )}
                >
                  {d.state}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
