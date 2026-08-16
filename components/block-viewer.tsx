"use client";

import * as React from "react";
import {
  ExternalLink,
  Monitor,
  RefreshCw,
  Smartphone,
  Tablet,
} from "lucide-react";

import { Button } from "@/registry/hirael/ui/button";
import { DirectionToggle } from "@/components/direction-toggle";
import { SegmentedControl } from "@/components/segmented-control";

type Viewport = "mobile" | "tablet" | "desktop";

const SIZES: Record<Viewport, { width: number; label: string }> = {
  mobile: { width: 380, label: "Mobile" },
  tablet: { width: 768, label: "Tablet" },
  desktop: { width: 0, label: "Desktop" },
};

const ICONS: Record<Viewport, React.ComponentType<{ className?: string }>> = {
  mobile: Smartphone,
  tablet: Tablet,
  desktop: Monitor,
};

const ORDER: Viewport[] = ["mobile", "tablet", "desktop"];

export function BlockViewer({
  title,
  minHeight = 800,
  embedHref,
}: {
  title: string;
  minHeight?: number;
  /** Path of the framed preview, e.g. `/embed/blocks/hero/hero-01`. */
  embedHref: string;
}) {
  const [viewport, setViewport] = React.useState<Viewport>("desktop");
  const [key, setKey] = React.useState(0);
  const [rtl, setRtl] = React.useState(false);

  const src = `${embedHref}${rtl ? "?dir=rtl" : ""}`;

  const sizing =
    viewport === "desktop"
      ? { width: "100%", maxWidth: "100%" }
      : { width: `${SIZES[viewport].width}px`, maxWidth: "100%" };

  return (
    <div
      data-slot="block-viewer"
      className="overflow-hidden rounded-sm border border-border bg-background"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card/50 px-3 py-2">
        <SegmentedControl
          role="tab"
          ariaLabel="Preview viewport"
          value={viewport}
          onValueChange={(v) => setViewport(v as Viewport)}
          className="rounded-sm border border-border bg-background p-0.5"
          itemClassName="h-6 rounded-[2px] px-2 text-[10px] uppercase tracking-widest"
          items={ORDER.map((v) => {
            const Icon = ICONS[v];
            return {
              value: v,
              ariaLabel: `${SIZES[v].label} viewport${
                v === "desktop" ? "" : ` (${SIZES[v].width}px)`
              }`,
              label: (active: boolean) => (
                <>
                  <Icon className="size-3" />
                  <span className="hidden sm:inline">{SIZES[v].label}</span>
                  {v !== "desktop" && active && (
                    <span className="tabular-nums text-muted-foreground">
                      {SIZES[v].width}
                    </span>
                  )}
                </>
              ),
            };
          })}
        />

        <div className="flex items-center gap-1">
          <DirectionToggle rtl={rtl} onToggle={setRtl} className="me-1" />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setKey((k) => k + 1)}
            aria-label="Refresh preview"
            className="size-7 rounded-sm text-muted-foreground"
          >
            <RefreshCw className="size-3.5" />
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon-sm"
            className="size-7 rounded-sm text-muted-foreground"
          >
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open preview in new tab"
            >
              <ExternalLink className="size-3.5" />
            </a>
          </Button>
        </div>
      </div>

      <div className="bg-dot-grid flex justify-center overflow-x-auto bg-card/20 p-3 sm:p-4">
        <iframe
          key={key}
          src={src}
          title={`${title} preview`}
          loading="lazy"
          className="block border-0 bg-background transition-[width,max-width] duration-300 ease-out"
          style={{ ...sizing, height: minHeight }}
        />
      </div>
    </div>
  );
}
