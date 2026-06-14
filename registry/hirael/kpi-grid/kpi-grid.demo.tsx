"use client";

import {
  KpiCard,
  KpiCardDelta,
  KpiCardLabel,
  KpiCardSpark,
  KpiCardValue,
  KpiGrid,
} from "@/registry/hirael/ui/kpi-grid";

const KPIS = [
  {
    label: "Revenue",
    value: "$48.2k",
    trend: "up" as const,
    delta: "+12.4%",
    spark: [8, 10, 9, 13, 12, 16, 18],
  },
  {
    label: "Active users",
    value: "3,914",
    trend: "up" as const,
    delta: "+4.1%",
    spark: [20, 19, 22, 21, 24, 23, 26],
  },
  {
    label: "Churn",
    value: "1.8%",
    trend: "down" as const,
    delta: "-0.3%",
    spark: [6, 5, 5, 4, 4, 3, 3],
  },
  {
    label: "Avg. order",
    value: "$61.40",
    trend: "flat" as const,
    delta: "0.0%",
    spark: [12, 13, 12, 12, 13, 12, 12],
  },
];

export default function KpiGridDemo() {
  return (
    <KpiGrid className="w-full max-w-2xl">
      {KPIS.map((kpi) => (
        <KpiCard key={kpi.label}>
          <KpiCardLabel>{kpi.label}</KpiCardLabel>
          <KpiCardValue>{kpi.value}</KpiCardValue>
          <KpiCardDelta trend={kpi.trend}>{kpi.delta}</KpiCardDelta>
          <KpiCardSpark points={kpi.spark} />
        </KpiCard>
      ))}
    </KpiGrid>
  );
}
