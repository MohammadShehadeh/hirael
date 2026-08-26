"use client";

import { Activity, Cpu, Gauge, Timer } from "lucide-react";

import { useT } from "@/lib/demo-locale";
import {
  MetricCard,
  MetricCardFooter,
  MetricCardHeader,
  MetricCardSpark,
  MetricCardTrend,
  MetricCardValue,
} from "@/registry/hirael/components/metric-card";

const MetricCardDemo = () => {
  const t = useT();

  return (
    <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard>
        <MetricCardHeader icon={<Cpu className="size-3.5" aria-hidden />}>
          {t({ en: "CPU load", ar: "حمل المعالج" })}
        </MetricCardHeader>
        <MetricCardValue unit="%">47</MetricCardValue>
        <MetricCardSpark
          tone="positive"
          points={[38, 41, 40, 44, 42, 39, 45, 47]}
        />
        <MetricCardFooter>
          <MetricCardTrend direction="up" tone="neutral">
            +6%
          </MetricCardTrend>{" "}
          {t({ en: "vs last hour", ar: "مقارنة بالساعة الماضية" })}
        </MetricCardFooter>
      </MetricCard>

      <MetricCard>
        <MetricCardHeader icon={<Timer className="size-3.5" aria-hidden />}>
          {t({ en: "p99 latency", ar: "زمن الاستجابة p99" })}
        </MetricCardHeader>
        <MetricCardValue unit="ms">312</MetricCardValue>
        <MetricCardSpark
          tone="critical"
          points={[180, 190, 210, 240, 260, 300, 290, 312]}
        />
        <MetricCardFooter>
          <MetricCardTrend direction="up" tone="critical">
            +38%
          </MetricCardTrend>{" "}
          {t({ en: "over budget", ar: "تجاوز الحد" })}
        </MetricCardFooter>
      </MetricCard>

      <MetricCard>
        <MetricCardHeader icon={<Activity className="size-3.5" aria-hidden />}>
          {t({ en: "Requests", ar: "الطلبات" })}
        </MetricCardHeader>
        <MetricCardValue unit={t({ en: "req/s", ar: "طلب/ث" })}>
          8.2k
        </MetricCardValue>
        <MetricCardSpark
          tone="neutral"
          points={[6, 6.4, 7, 6.8, 7.6, 8, 7.9, 8.2]}
        />
        <MetricCardFooter>
          <MetricCardTrend direction="up" tone="positive">
            +12%
          </MetricCardTrend>{" "}
          {t({ en: "steady", ar: "مستقر" })}
        </MetricCardFooter>
      </MetricCard>

      <MetricCard>
        <MetricCardHeader icon={<Gauge className="size-3.5" aria-hidden />}>
          {t({ en: "Error rate", ar: "معدل الأخطاء" })}
        </MetricCardHeader>
        <MetricCardValue unit="%">0.9</MetricCardValue>
        <MetricCardSpark
          tone="warning"
          points={[0.3, 0.4, 0.5, 0.4, 0.6, 0.8, 0.7, 0.9]}
        />
        <MetricCardFooter>
          <MetricCardTrend direction="up" tone="warning">
            +0.4pp
          </MetricCardTrend>{" "}
          {t({ en: "watch closely", ar: "راقب عن كثب" })}
        </MetricCardFooter>
      </MetricCard>
    </div>
  );
};

export default MetricCardDemo;
