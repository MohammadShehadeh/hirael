"use client";

import { useT } from "@/lib/demo-locale";
import {
  KpiCard,
  KpiCardDelta,
  KpiCardLabel,
  KpiCardSpark,
  KpiCardValue,
  KpiGrid,
} from "@/registry/hirael/components/kpi-grid";

export default function KpiGridDemo() {
  const t = useT();

  const KPIS = [
    {
      key: "revenue",
      label: t({ en: "Revenue", ar: "الإيرادات" }),
      value: "$48.2k",
      trend: "up" as const,
      delta: "+12.4%",
      spark: [8, 10, 9, 13, 12, 16, 18],
    },
    {
      key: "active-users",
      label: t({ en: "Active users", ar: "المستخدمون النشطون" }),
      value: "3,914",
      trend: "up" as const,
      delta: "+4.1%",
      spark: [20, 19, 22, 21, 24, 23, 26],
    },
    {
      key: "churn",
      label: t({ en: "Churn", ar: "معدل التسرّب" }),
      value: "1.8%",
      trend: "down" as const,
      delta: "-0.3%",
      spark: [6, 5, 5, 4, 4, 3, 3],
    },
    {
      key: "avg-order",
      label: t({ en: "Avg. order", ar: "متوسط الطلب" }),
      value: "$61.40",
      trend: "flat" as const,
      delta: "0.0%",
      spark: [12, 13, 12, 12, 13, 12, 12],
    },
  ];

  return (
    <KpiGrid className="w-full max-w-2xl">
      {KPIS.map((kpi) => (
        <KpiCard key={kpi.key}>
          <KpiCardLabel>{kpi.label}</KpiCardLabel>
          <KpiCardValue>{kpi.value}</KpiCardValue>
          <KpiCardDelta trend={kpi.trend}>{kpi.delta}</KpiCardDelta>
          <KpiCardSpark points={kpi.spark} />
        </KpiCard>
      ))}
    </KpiGrid>
  );
}
