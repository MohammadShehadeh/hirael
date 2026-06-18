"use client";

import {
  FeatureFlagItem,
  FeatureFlagList,
  FeatureFlagManager,
  FeatureFlagManagerToolbar,
  FeatureFlagSwitch,
  type FeatureFlag,
} from "@/registry/hirael/ui/feature-flag-manager";

const FLAGS: FeatureFlag[] = [
  {
    id: "new-checkout",
    name: "New checkout",
    key: "NEW_CHECKOUT",
    description: "One-page checkout with saved cards.",
    enabled: true,
    environments: ["dev", "staging", "prod"],
    rollout: 25,
  },
  {
    id: "dark-mode",
    name: "Dark mode",
    key: "DARK_MODE",
    description: "System-aware theme switching.",
    enabled: true,
    environments: ["dev", "staging", "prod"],
  },
  {
    id: "ai-search",
    name: "AI search",
    key: "AI_SEARCH",
    description: "Semantic search across the catalog.",
    enabled: false,
    environments: ["dev", "staging"],
    rollout: 10,
  },
  {
    id: "bulk-export",
    name: "Bulk export",
    key: "BULK_EXPORT",
    description: "Export reports as CSV in the background.",
    enabled: false,
    environments: ["dev"],
  },
  {
    id: "live-collab",
    name: "Live collaboration",
    key: "LIVE_COLLAB",
    description: "Edit documents together in real time.",
    enabled: true,
    environments: ["dev", "staging"],
    rollout: 50,
  },
];

const ROW: FeatureFlag = {
  id: "beta-banner",
  name: "Beta banner",
  key: "BETA_BANNER",
  enabled: true,
  environments: ["prod"],
};

export default function FeatureFlagManagerDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-8">
      <FeatureFlagManager defaultValue={FLAGS}>
        <FeatureFlagManagerToolbar />
        <FeatureFlagList />
      </FeatureFlagManager>

      <FeatureFlagManager defaultValue={[ROW]}>
        <FeatureFlagList>
          <FeatureFlagItem flag={ROW}>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">
                {ROW.name}
              </span>
              <code className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                {ROW.key}
              </code>
            </div>
            <FeatureFlagSwitch flag={ROW} className="ms-auto" />
          </FeatureFlagItem>
        </FeatureFlagList>
      </FeatureFlagManager>
    </div>
  );
}
