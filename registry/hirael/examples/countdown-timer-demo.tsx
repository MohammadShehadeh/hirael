"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { CountdownTimer } from "@/registry/hirael/components/countdown-timer";

export default function CountdownTimerDemo() {
  const t = useT();

  const labels = t({
    en: {
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
    },
    ar: {
      days: "أيام",
      hours: "ساعات",
      minutes: "دقائق",
      seconds: "ثوانٍ",
    },
  });

  const [launchTarget] = React.useState(
    () => Date.now() + (3 * 86400 + 7 * 3600 + 24 * 60 + 30) * 1000,
  );
  const [saleTarget] = React.useState(
    () => Date.now() + (5 * 3600 + 32 * 60 + 10) * 1000,
  );
  const [shortTarget, setShortTarget] = React.useState(
    () => Date.now() + 10_000,
  );
  const [completedAt, setCompletedAt] = React.useState<string | null>(null);

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Boxed · product launch", ar: "صناديق · إطلاق منتج" })}
        </p>
        <CountdownTimer target={launchTarget} labels={labels} />
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: "Inline · hideZeroDays",
            ar: "بالسطر · إخفاء الأيام الصفرية",
          })}
        </p>
        <CountdownTimer
          variant="inline"
          hideZeroDays
          target={saleTarget}
          labels={labels}
        />
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Minimal · inside a sentence", ar: "مبسّط · داخل جملة" })}
        </p>
        <div className="text-sm text-muted-foreground">
          {t({
            en: "Early-bird pricing ends in",
            ar: "ينتهي سعر الحجز المبكر خلال",
          })}{" "}
          <CountdownTimer
            variant="minimal"
            target={launchTarget}
            className="align-baseline font-medium text-foreground"
          />{" "}
          {t({ en: "Lock in your seat now.", ar: "احجز مقعدك الآن." })}
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: "onComplete · 10 second countdown",
            ar: "onComplete · عدّ تنازلي 10 ثوانٍ",
          })}
        </p>
        <CountdownTimer
          variant="inline"
          hideZeroDays
          target={shortTarget}
          labels={labels}
          onComplete={() => setCompletedAt(new Date().toLocaleTimeString())}
          completeContent={
            <span className="text-xl font-semibold text-primary">
              {t({ en: "We're live!", ar: "انطلقنا!" })}
            </span>
          }
        />
        {completedAt ? (
          <p className="text-xs text-muted-foreground">
            {t({
              en: `onComplete fired at ${completedAt}`,
              ar: `أُطلق onComplete عند ${completedAt}`,
            })}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => {
            setCompletedAt(null);
            setShortTarget(Date.now() + 10_000);
          }}
          className="mt-1 w-fit rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
        >
          {t({ en: "Restart", ar: "إعادة التشغيل" })}
        </button>
      </div>
    </div>
  );
}
