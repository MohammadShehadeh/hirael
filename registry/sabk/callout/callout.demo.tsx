"use client"

import { Callout } from "@/registry/sabk/callout/callout"

export default function CalloutDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-4">
      <Callout variant="info" title="Heads up">
        Cache invalidation runs every 60 seconds. Edits may take a moment to
        appear.
      </Callout>

      <Callout variant="success" title="Deploy succeeded">
        Build <code className="font-mono">b-29f1</code> is now live on production.
      </Callout>

      <Callout variant="warning" title="Rate limit approaching">
        You&apos;ve used 87% of your monthly quota. Consider upgrading before the
        reset.
      </Callout>

      <Callout variant="error" title="Migration failed">
        Column <code className="font-mono">users.email</code> already exists.
        Roll back before retrying.
      </Callout>

      <Callout variant="neutral" title="Note">
        This component is server-renderable. No hooks, no client boundary.
      </Callout>

      <Callout variant="info" icon={false}>
        Title-less callouts also work — pass <code className="font-mono">icon={`{false}`}</code>{" "}
        to drop the leading icon.
      </Callout>
    </div>
  )
}
