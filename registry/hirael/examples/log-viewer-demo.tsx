"use client";

import {
  LogLine,
  LogViewer,
  LogViewerBody,
  LogViewerCount,
  LogViewerLevelFilter,
  LogViewerLive,
  LogViewerSearch,
  LogViewerToolbar,
} from "@/registry/hirael/ui/log-viewer";

export default function LogViewerDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-8">
      <LogViewer>
        <LogViewerToolbar>
          <LogViewerSearch />
          <LogViewerLevelFilter />
          <LogViewerCount />
        </LogViewerToolbar>
        <LogViewerBody>
          <LogLine level="info" time="12:04:28">
            Starting deploy of web@4f9a1c2 to production
          </LogLine>
          <LogLine level="debug" time="12:04:28">
            Resolved 312 packages from lockfile
          </LogLine>
          <LogLine level="info" time="12:04:31">
            Building Next.js app, 14 routes
          </LogLine>
          <LogLine level="debug" time="12:04:46">
            Compiled successfully in 14.2s
          </LogLine>
          <LogLine level="warn" time="12:04:47">
            Large bundle on /dashboard, 248 kB over budget
          </LogLine>
          <LogLine level="info" time="12:04:52">
            Uploading static assets to edge cache
          </LogLine>
          <LogLine level="debug" time="12:04:55">
            Cache hit for 188 of 204 assets
          </LogLine>
          <LogLine level="info" time="12:05:01">
            Running database migrations
          </LogLine>
          <LogLine level="warn" time="12:05:02">
            Migration 0042 took 3.1s, consider a backfill job
          </LogLine>
          <LogLine level="error" time="12:05:09">
            Health check failed on app-2, connection refused
          </LogLine>
          <LogLine level="info" time="12:05:14">
            Retrying health check on app-2
          </LogLine>
          <LogLine level="info" time="12:05:18">
            Deploy complete, all 3 instances healthy
          </LogLine>
        </LogViewerBody>
      </LogViewer>

      <LogViewer live>
        <LogViewerToolbar>
          <LogViewerLive />
          <LogViewerSearch />
          <LogViewerCount />
        </LogViewerToolbar>
        <LogViewerBody wrap>
          <LogLine level="info" time="12:06:00">
            Tailing api logs from 3 instances
          </LogLine>
          <LogLine level="debug" time="12:06:01">
            GET /v1/orders 200 in 41ms
          </LogLine>
          <LogLine level="debug" time="12:06:01">
            GET /v1/orders/8821 200 in 12ms
          </LogLine>
          <LogLine level="warn" time="12:06:03">
            Slow query on orders, 820ms, missing index on customer_id
          </LogLine>
          <LogLine level="error" time="12:06:04">
            POST /v1/checkout 500, payment provider timeout after 5s
          </LogLine>
          <LogLine level="info" time="12:06:05">
            Falling back to secondary payment provider
          </LogLine>
        </LogViewerBody>
      </LogViewer>
    </div>
  );
}
