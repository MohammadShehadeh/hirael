"use client";

import { useT } from "@/lib/demo-locale";
import { Spinner } from "@/registry/hirael/ui/spinner";

export default function SpinnerDemo() {
  const t = useT();

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Variants", ar: "الأنواع" })}
        </p>
        <div className="flex items-center gap-10 text-foreground">
          <div className="flex flex-col items-center gap-2">
            <Spinner variant="circle" size="lg" />
            <span className="font-mono text-[10px] text-muted-foreground">
              {t({ en: "circle", ar: "دائرة" })}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner variant="dots" size="lg" />
            <span className="font-mono text-[10px] text-muted-foreground">
              {t({ en: "dots", ar: "نقاط" })}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner variant="bars" size="lg" />
            <span className="font-mono text-[10px] text-muted-foreground">
              {t({ en: "bars", ar: "أعمدة" })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Sizes", ar: "الأحجام" })}
        </p>
        <div className="flex items-center gap-6 text-foreground">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: "Inherits text color · in context",
            ar: "يرث لون النص · ضمن السياق",
          })}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-primary">
            <Spinner />
          </span>
          <span className="text-destructive">
            <Spinner variant="dots" />
          </span>
          <button
            type="button"
            disabled
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground opacity-90"
          >
            <Spinner size="sm" />
            {t({ en: "Saving…", ar: "جارٍ الحفظ…" })}
          </button>
        </div>
      </div>
    </div>
  );
}
