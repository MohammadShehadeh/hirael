"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { Rating } from "@/registry/hirael/components/rating";

const RatingDemo = () => {
  const t = useT();
  const [value, setValue] = React.useState(3.5);

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Interactive · whole stars", ar: "تفاعلي · نجوم كاملة" })}
        </p>
        <Rating
          defaultValue={4}
          aria-label={t({ en: "Overall rating", ar: "التقييم العام" })}
        />
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Controlled · half steps", ar: "متحكَّم به · أنصاف خطوات" })}
        </p>
        <div className="flex items-center gap-3">
          <Rating
            value={value}
            onValueChange={setValue}
            step={0.5}
            aria-label={t({ en: "Half-step rating", ar: "تقييم بنصف خطوة" })}
          />
          <span className="font-mono text-sm tabular-nums text-muted-foreground">
            {value.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Read-only display", ar: "عرض للقراءة فقط" })}
        </p>
        <div className="flex items-center gap-2">
          <Rating value={4.5} step={0.5} readOnly size="sm" />
          <span className="text-xs text-muted-foreground">
            {t({ en: "4.5 · 1,284 reviews", ar: "4.5 · 1,284 مراجعة" })}
          </span>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Sizes", ar: "الأحجام" })}
        </p>
        <div className="flex items-center gap-6">
          <Rating
            defaultValue={3}
            size="sm"
            aria-label={t({ en: "Small", ar: "صغير" })}
          />
          <Rating
            defaultValue={3}
            size="md"
            aria-label={t({ en: "Medium", ar: "متوسط" })}
          />
          <Rating
            defaultValue={3}
            size="lg"
            aria-label={t({ en: "Large", ar: "كبير" })}
          />
        </div>
      </div>
    </div>
  );
};

export default RatingDemo;
