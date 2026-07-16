"use client";

import { useT } from "@/lib/demo-locale";
import {
  ServerCard,
  ServerCardHeader,
  ServerCardMeter,
  ServerCardSpec,
  ServerCardSpecs,
  ServerCardStatus,
  ServerCardTitle,
} from "@/registry/hirael/components/server-card";

export default function ServerCardDemo() {
  const t = useT();

  return (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
      <ServerCard>
        <ServerCardHeader>
          <ServerCardTitle
            region={t({ en: "us-east-1 · AWS", ar: "‏us-east-1 · AWS" })}
          >
            web-prod-01
          </ServerCardTitle>
          <ServerCardStatus status="online">
            {t({ en: "Online", ar: "متصل" })}
          </ServerCardStatus>
        </ServerCardHeader>
        <ServerCardSpecs>
          <ServerCardSpec icon="cpu" label={t({ en: "vCPU", ar: "المعالج" })}>
            8
          </ServerCardSpec>
          <ServerCardSpec
            icon="memory"
            label={t({ en: "Memory", ar: "الذاكرة" })}
          >
            32 GB
          </ServerCardSpec>
          <ServerCardSpec icon="disk" label={t({ en: "Disk", ar: "القرص" })}>
            512 GB
          </ServerCardSpec>
        </ServerCardSpecs>
        <div className="grid gap-3">
          <ServerCardMeter label={t({ en: "CPU", ar: "المعالج" })} value={62} />
          <ServerCardMeter
            label={t({ en: "Memory", ar: "الذاكرة" })}
            value={81}
          />
        </div>
      </ServerCard>

      <ServerCard>
        <ServerCardHeader>
          <ServerCardTitle
            region={t({ en: "eu-west-2 · AWS", ar: "‏eu-west-2 · AWS" })}
          >
            db-replica-03
          </ServerCardTitle>
          <ServerCardStatus status="degraded">
            {t({ en: "Degraded", ar: "متدهور" })}
          </ServerCardStatus>
        </ServerCardHeader>
        <ServerCardSpecs>
          <ServerCardSpec icon="cpu" label={t({ en: "vCPU", ar: "المعالج" })}>
            16
          </ServerCardSpec>
          <ServerCardSpec
            icon="memory"
            label={t({ en: "Memory", ar: "الذاكرة" })}
          >
            64 GB
          </ServerCardSpec>
          <ServerCardSpec icon="disk" label={t({ en: "Disk", ar: "القرص" })}>
            2 TB
          </ServerCardSpec>
        </ServerCardSpecs>
        <div className="grid gap-3">
          <ServerCardMeter label={t({ en: "CPU", ar: "المعالج" })} value={94} />
          <ServerCardMeter label={t({ en: "Disk", ar: "القرص" })} value={88} />
        </div>
      </ServerCard>
    </div>
  );
}
