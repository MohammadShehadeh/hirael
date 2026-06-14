/* Illustration primitives — every tile composes from this small palette so
   the grid reads as one design system instead of seventeen sketches. */

const Bar = ({
  w = "w-full",
  tone = "bg-muted-foreground/15",
  className = "",
}: {
  w?: string;
  tone?: string;
  className?: string;
}) => <span className={`block h-1 rounded-full ${tone} ${w} ${className}`} />;

const AccentBar = ({
  w = "w-full",
  className = "",
}: {
  w?: string;
  className?: string;
}) => (
  <span
    className={`block h-1.5 rounded-full bg-primary/35 ${w} ${className}`}
  />
);

const Pill = ({
  w = "w-full",
  tone = "bg-muted-foreground/15",
  className = "",
}: {
  w?: string;
  tone?: string;
  className?: string;
}) => (
  <span
    className={`block h-3 rounded-sm border border-border ${tone} ${w} ${className}`}
  />
);

const Box = ({ className = "" }: { className?: string }) => (
  <span className={`block rounded-sm bg-muted-foreground/12 ${className}`} />
);

const AccentBox = ({ className = "" }: { className?: string }) => (
  <span className={`block rounded-sm bg-primary/30 ${className}`} />
);

/* -------------------------------------------------------------------------- */
/* Illustrations                                                              */
/* -------------------------------------------------------------------------- */
/* Each renders inside a 16:9 zone, centered. All compose from the primitives
   above so colors, weights, and corners stay coherent. */

export const IllAuth = () => (
  <div className="flex w-full max-w-[60%] flex-col gap-1.5">
    <Bar w="w-1/2" />
    <Pill />
    <Bar w="w-1/3" />
    <Pill />
    <AccentBar className="mt-0.5" />
  </div>
);

export const IllBlog = () => (
  <div className="grid w-full max-w-[80%] grid-cols-2 gap-2">
    {[0, 1].map((i) => (
      <div
        key={i}
        className="flex flex-col gap-1 rounded-sm border border-border p-1.5"
      >
        <Box className="h-6 w-full" />
        <Bar w="w-2/3" />
        <Bar w="w-1/2" tone="bg-muted-foreground/10" />
      </div>
    ))}
  </div>
);

export const IllContact = () => (
  <div className="flex w-full max-w-[70%] items-end gap-2">
    <div className="flex flex-1 flex-col gap-1.5">
      <Bar w="w-1/2" />
      <Pill />
      <Bar w="w-1/2" />
      <Pill />
    </div>
    <AccentBox className="size-6" />
  </div>
);

export const IllCta = () => (
  <div className="flex w-full max-w-[70%] flex-col items-center gap-2">
    <Bar w="w-3/4" />
    <Bar w="w-1/2" tone="bg-muted-foreground/10" />
    <div className="mt-1 flex gap-1.5">
      <Pill w="w-10" tone="bg-muted-foreground/10" />
      <Pill w="w-10" tone="bg-primary/30" />
    </div>
  </div>
);

export const IllFaq = () => (
  <div className="flex w-full max-w-[80%] flex-col gap-1 rounded-sm border border-border bg-card/40">
    {[
      { w: "w-3/4", emphasis: false },
      { w: "w-2/3", emphasis: true },
      { w: "w-1/2", emphasis: false },
    ].map((row, i) => (
      <div
        key={i}
        className={`flex items-center justify-between gap-2 px-2 py-1 ${i < 2 ? "border-b border-border" : ""}`}
      >
        <span
          className={`block h-1 rounded-full ${row.emphasis ? "bg-primary/35" : "bg-muted-foreground/15"} ${row.w}`}
        />
        <span className="block size-1.5 rounded-full bg-muted-foreground/20" />
      </div>
    ))}
  </div>
);

export const IllFeatures = () => (
  <div className="grid w-full max-w-[80%] grid-cols-3 gap-3">
    {[0, 1, 2].map((i) => (
      <div key={i} className="flex flex-col items-center gap-1">
        <AccentBox className="size-2.5" />
        <Bar w="w-3/4" />
        <Bar w="w-full" tone="bg-muted-foreground/10" />
      </div>
    ))}
  </div>
);

export const IllFooter = () => (
  <div className="grid w-full max-w-[80%] grid-cols-4 gap-2">
    {[3, 3, 3, 1].map((rows, c) => (
      <div key={c} className="flex flex-col gap-1">
        <AccentBar w="w-6" className="mb-0.5 h-1" />
        {Array.from({ length: rows }).map((_, r) => (
          <Bar key={r} w="w-full" />
        ))}
      </div>
    ))}
  </div>
);

export const IllHeader = () => (
  <div className="flex w-full max-w-[80%] items-center justify-between gap-2 rounded-sm border border-border bg-card/40 px-2 py-1.5">
    <span className="size-2.5 rounded-full bg-primary/35" />
    <div className="flex gap-1.5">
      <Bar w="w-5" />
      <Bar w="w-5" />
      <Bar w="w-5" />
    </div>
    <Pill w="w-8" tone="bg-primary/25" className="h-2" />
  </div>
);

export const IllHero = () => (
  <div className="flex w-full max-w-[60%] flex-col items-center gap-1.5">
    <Bar w="w-1/3" tone="bg-primary/25" />
    <Bar w="w-full" />
    <Bar w="w-3/4" />
    <div className="mt-1 flex gap-1.5">
      <Pill w="w-8" tone="bg-primary/30" />
      <Pill w="w-8" tone="bg-muted-foreground/10" />
    </div>
  </div>
);

export const IllGallery = () => (
  <div className="grid w-full max-w-[80%] grid-cols-4 gap-1">
    {Array.from({ length: 8 }).map((_, i) => (
      <Box key={i} className="aspect-square" />
    ))}
  </div>
);

export const IllIntegrations = () => (
  <div className="relative h-[70%] w-[70%]">
    <span className="absolute left-1/2 top-1/2 h-px w-[55%] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-border" />
    <span className="absolute left-1/2 top-1/2 h-px w-[55%] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-border" />
    <span className="absolute left-1/2 top-1/2 h-px w-[80%] -translate-x-1/2 -translate-y-1/2 bg-border" />
    <span className="absolute left-1/2 top-1/2 h-[80%] w-px -translate-x-1/2 -translate-y-1/2 bg-border" />
    <span className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-card" />
    <span className="absolute left-0 top-1/2 size-2.5 -translate-y-1/2 rounded-sm bg-muted-foreground/15" />
    <span className="absolute right-0 top-1/2 size-2.5 -translate-y-1/2 rounded-sm bg-muted-foreground/15" />
    <span className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 rounded-sm bg-muted-foreground/15" />
    <span className="absolute bottom-0 left-1/2 size-2.5 -translate-x-1/2 rounded-sm bg-primary/30" />
  </div>
);

export const IllLogoCloud = () => (
  <div className="flex w-full flex-col items-center gap-1.5">
    <div className="flex w-[80%] items-center gap-2 [mask-image:linear-gradient(to_right,transparent,black_30%,black_70%,transparent)]">
      <Pill w="w-full" tone="bg-muted-foreground/10" className="h-2.5" />
      <Pill w="w-full" tone="bg-muted-foreground/10" className="h-2.5" />
      <Pill w="w-full" tone="bg-muted-foreground/10" className="h-2.5" />
      <Pill w="w-full" tone="bg-muted-foreground/10" className="h-2.5" />
      <Pill w="w-full" tone="bg-muted-foreground/10" className="h-2.5" />
    </div>
    <div className="flex w-[60%] items-center gap-2 [mask-image:linear-gradient(to_right,transparent,black_30%,black_70%,transparent)]">
      <Pill w="w-full" tone="bg-muted-foreground/10" className="h-2.5" />
      <Pill w="w-full" tone="bg-muted-foreground/10" className="h-2.5" />
      <Pill w="w-full" tone="bg-muted-foreground/10" className="h-2.5" />
    </div>
  </div>
);

export const IllNotFound = () => (
  <div className="flex flex-col items-center gap-1">
    <span
      className="font-mono text-2xl font-semibold leading-none tracking-tight text-muted-foreground/35"
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      404
    </span>
    <Bar w="w-12" tone="bg-muted-foreground/10" />
  </div>
);

export const IllPricing = () => (
  <div className="grid w-full max-w-[80%] grid-cols-3 items-end gap-1.5">
    {[
      { h: "h-10", accent: false },
      { h: "h-14", accent: true },
      { h: "h-12", accent: false },
    ].map((col, i) => (
      <div
        key={i}
        className={`flex ${col.h} flex-col gap-1 rounded-sm border border-border ${col.accent ? "bg-card" : "bg-card/30"} p-1.5`}
      >
        <Bar w="w-1/2" />
        <AccentBar w="w-3/4" className="mt-auto" />
        <Bar w="w-full" tone="bg-muted-foreground/10" />
      </div>
    ))}
  </div>
);

export const IllTestimonial = () => (
  <div className="flex w-full max-w-[70%] flex-col gap-2">
    <span className="font-mono text-xl leading-none text-muted-foreground/30">
      &ldquo;
    </span>
    <div className="flex flex-col gap-1 -mt-2">
      <Bar w="w-full" />
      <Bar w="w-3/4" />
    </div>
    <div className="mt-1 flex items-center gap-1.5">
      <span className="size-3 rounded-full bg-muted-foreground/25" />
      <Bar w="w-12" tone="bg-muted-foreground/25" />
    </div>
  </div>
);

export const IllAppShell = () => (
  <div className="flex h-[70%] w-full max-w-[80%] gap-1.5">
    <div className="flex w-1/4 flex-col gap-1 rounded-sm border border-border bg-card/40 p-1.5">
      <AccentBar w="w-full" className="h-1" />
      <Bar w="w-3/4" />
      <Bar w="w-full" />
      <Bar w="w-2/3" />
    </div>
    <div className="flex flex-1 flex-col gap-1 rounded-sm border border-border bg-card/30 p-1.5">
      <Bar w="w-1/3" tone="bg-primary/30" />
      <div className="mt-auto grid grid-cols-3 gap-1">
        <Box className="h-2.5" />
        <Box className="h-2.5" />
        <Box className="h-2.5" />
      </div>
    </div>
  </div>
);

export const IllEcommerce = () => (
  <div className="grid w-full max-w-[80%] grid-cols-3 gap-2">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="flex flex-col gap-1 rounded-sm border border-border p-1.5"
      >
        <Box className="aspect-square w-full" />
        <Bar w="w-3/4" />
        <div className="flex items-center justify-between gap-1">
          <AccentBar w="w-1/2" className="h-1" />
          <span className="block size-2 rounded-sm bg-muted-foreground/20" />
        </div>
      </div>
    ))}
  </div>
);

export const IllDashboard = () => (
  <div className="flex h-[70%] w-full max-w-[80%] flex-col gap-1.5">
    <div className="grid grid-cols-3 gap-1.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex flex-col gap-0.5 rounded-sm border border-border bg-card/40 p-1"
        >
          <Bar w="w-2/3" />
          <AccentBar w="w-1/2" className="h-1.5" />
        </div>
      ))}
    </div>
    <div className="flex flex-1 items-end gap-1 rounded-sm border border-border bg-card/40 p-1.5">
      {[40, 70, 50, 80, 35, 60, 90].map((h, i) => (
        <span
          key={i}
          className="block w-1.5 rounded-xs bg-primary/30"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  </div>
);
