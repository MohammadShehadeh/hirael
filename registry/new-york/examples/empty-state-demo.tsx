"use client"

import { Inbox, Plus, Search, Upload } from "lucide-react"

import { Button } from "@/registry/new-york/ui/button"
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateMedia,
  EmptyStateTitle,
} from "@/registry/new-york/ui/empty-state"

export default function EmptyStateDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          No results
        </p>
        <EmptyState>
          <EmptyStateMedia>
            <Search />
          </EmptyStateMedia>
          <EmptyStateTitle>No invoices found</EmptyStateTitle>
          <EmptyStateDescription>
            Try changing the date range or clearing your search to see more
            results.
          </EmptyStateDescription>
          <EmptyStateActions>
            <Button variant="outline" size="sm">
              Clear filters
            </Button>
          </EmptyStateActions>
        </EmptyState>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          First-run
        </p>
        <EmptyState>
          <EmptyStateMedia>
            <Inbox />
          </EmptyStateMedia>
          <EmptyStateTitle>Your inbox is quiet</EmptyStateTitle>
          <EmptyStateDescription>
            Wire up an integration to start collecting events. Posted messages
            will land here as they come in.
          </EmptyStateDescription>
          <EmptyStateActions>
            <Button size="sm">
              <Plus className="size-3.5" />
              Add integration
            </Button>
            <Button variant="ghost" size="sm">
              View docs
            </Button>
          </EmptyStateActions>
        </EmptyState>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Upload prompt
        </p>
        <EmptyState>
          <EmptyStateMedia>
            <Upload />
          </EmptyStateMedia>
          <EmptyStateTitle>Drop files here</EmptyStateTitle>
          <EmptyStateDescription>
            Drag-and-drop a CSV or paste a URL — we&apos;ll parse the columns
            and let you map them.
          </EmptyStateDescription>
        </EmptyState>
      </div>
    </div>
  )
}
