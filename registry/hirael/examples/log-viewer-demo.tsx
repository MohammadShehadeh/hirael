"use client";

import { useT } from "@/lib/demo-locale";
import { LogLine, LogViewer } from "@/registry/hirael/components/log-viewer";

export default function LogViewerDemo() {
  const t = useT();

  return (
    <div className="w-full max-w-2xl" dir="ltr">
      <LogViewer>
        <LogLine time="12:04:01" level="info" source="[api]">
          {t({ en: "listening on :8080", ar: "listening on :8080" })}
        </LogLine>
        <LogLine time="12:04:01" level="debug" source="[db]">
          pool acquired (8 idle, 2 active)
        </LogLine>
        <LogLine time="12:04:02" level="success" source="[api]">
          GET /health 200 3ms
        </LogLine>
        <LogLine time="12:04:03" level="info" source="[worker]">
          job 4821 started (resize-image)
        </LogLine>
        <LogLine time="12:04:03" level="warn" source="[cache]">
          key eviction: memory at 82%
        </LogLine>
        <LogLine time="12:04:04" level="info" source="[api]">
          POST /v1/deploy 202 41ms
        </LogLine>
        <LogLine time="12:04:05" level="error" source="[worker]">
          job 4821 failed: upstream timeout after 30s
        </LogLine>
        <LogLine time="12:04:05" level="warn" source="[worker]">
          retry 1/3 scheduled in 2s
        </LogLine>
        <LogLine time="12:04:07" level="success" source="[worker]">
          job 4821 recovered on retry
        </LogLine>
        <LogLine time="12:04:08" level="debug" source="[db]">
          slow query 214ms: SELECT * FROM events
        </LogLine>
      </LogViewer>
      <p className="mt-2 text-xs text-muted-foreground">
        {t({
          en: "Follows the newest line unless you scroll up.",
          ar: "يتابع أحدث سطر ما لم تمرّر للأعلى.",
        })}
      </p>
    </div>
  );
}
