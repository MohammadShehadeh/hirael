"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import {
  ClusterMap,
  ClusterMapLegend,
  ClusterMapLegendItem,
  ClusterNode,
  type NodeHealth,
} from "@/registry/hirael/components/cluster-map";

// Deterministic pseudo-layout so the map reads the same every render.
const COLUMNS = 16;
const ROWS = 6;

function healthFor(i: number): NodeHealth {
  if (i % 37 === 0) return "critical";
  if (i % 11 === 0) return "warning";
  if (i % 9 === 0) return "idle";
  return "healthy";
}

export default function ClusterMapDemo() {
  const t = useT();
  const nodes = Array.from({ length: COLUMNS * ROWS }, (_, i) => ({
    id: i,
    health: healthFor(i),
    load: 0.4 + ((i * 7) % 60) / 100,
  }));

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {t({ en: "prod-cluster · 96 nodes", ar: "‏prod-cluster · 96 عقدة" })}
        </p>
        <ClusterMap columns={COLUMNS}>
          {nodes.map((node) => (
            <ClusterNode
              key={node.id}
              health={node.health}
              load={node.load}
              label={`node-${String(node.id + 1).padStart(3, "0")}`}
            />
          ))}
        </ClusterMap>
      </div>
      <ClusterMapLegend>
        <ClusterMapLegendItem health="healthy">
          {t({ en: "Healthy", ar: "سليمة" })}
        </ClusterMapLegendItem>
        <ClusterMapLegendItem health="warning">
          {t({ en: "Warning", ar: "تحذير" })}
        </ClusterMapLegendItem>
        <ClusterMapLegendItem health="critical">
          {t({ en: "Critical", ar: "حرجة" })}
        </ClusterMapLegendItem>
        <ClusterMapLegendItem health="idle">
          {t({ en: "Idle", ar: "خاملة" })}
        </ClusterMapLegendItem>
      </ClusterMapLegend>
    </div>
  );
}
