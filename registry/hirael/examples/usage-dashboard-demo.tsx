"use client";

import {
  UsageDashboard,
  UsageDashboardHeader,
  UsageDashboardTitle,
  UsageItem,
  UsageList,
} from "@/registry/hirael/ui/usage-dashboard";

export default function UsageDashboardDemo() {
  return (
    <UsageDashboard className="w-full max-w-md">
      <UsageDashboardHeader>
        <UsageDashboardTitle>Usage this month</UsageDashboardTitle>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Resets Jul 1
        </span>
      </UsageDashboardHeader>
      <UsageList>
        <UsageItem
          label="API requests"
          value={82000}
          max={100000}
          caption="82k / 100k"
        />
        <UsageItem label="Storage" value={46} max={50} caption="46 / 50 GB" />
        <UsageItem label="Seats" value={18} max={25} caption="18 / 25" />
        <UsageItem
          label="Email sends"
          value={5200}
          max={5000}
          caption="5.2k / 5k"
        />
      </UsageList>
    </UsageDashboard>
  );
}
