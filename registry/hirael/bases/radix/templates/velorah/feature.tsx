'use client';

import * as React from 'react';

import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/radix/ui/toggle-group';

const FEATURE_VIDEO = '/media/templates/velorah/feature.mp4';

const FEATURE_TABS = [
  {
    id: 'electric',
    label: 'Living Electric',
    heading: '100% Electric',
    description: 'No more fossil fuels, buzzing generators, and propane tanks. Velorah has power for days.',
    progress: 35,
  },
  {
    id: 'charge',
    label: 'Charge Faster',
    heading: 'Full in 40 minutes',
    description: 'Fast charging takes the battery from empty to full in the time it takes to stop for lunch.',
    progress: 60,
  },
  {
    id: 'sleep',
    label: 'Sleep Well',
    heading: 'Rest like home',
    description: 'A full-size bed, blackout shades, and quiet climate control keep the night undisturbed.',
    progress: 78,
  },
  {
    id: 'acoustic',
    label: 'Acoustic Comfort',
    heading: 'Quiet by design',
    description: 'Insulated walls and a silent drivetrain keep cabin noise down to a whisper.',
    progress: 52,
  },
  {
    id: 'seasons',
    label: '5+ Seasons',
    heading: 'Ready for any weather',
    description: 'Heated floors and thermal glass carry you from summer heat to deep winter.',
    progress: 90,
  },
];

export const Feature = ({ videoSrc = FEATURE_VIDEO, posterSrc }: { videoSrc?: string; posterSrc?: string }) => {
  const [activeId, setActiveId] = React.useState(FEATURE_TABS[0].id);
  const [videoFailed, setVideoFailed] = React.useState(false);

  const active = FEATURE_TABS.find((tab) => tab.id === activeId) ?? FEATURE_TABS[0];

  return (
    <section className="mx-auto max-w-7xl px-6 py-0 md:px-12">
      <div className="grid min-h-[520px] gap-4 overflow-hidden rounded-2xl md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-2xl bg-card p-10 md:p-14">
          <div>
            <span className="mb-8 inline-block h-8 w-8 rounded-full border border-border" />
            <h2 className="mb-6 text-3xl tracking-[-1px] text-foreground [font-family:var(--font-velorah-serif)] sm:text-5xl">
              {active.heading}
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">{active.description}</p>
          </div>

          <div>
            <ToggleGroup
              type="single"
              variant="outline"
              spacing={2}
              value={active.id}
              onValueChange={(id) => {
                if (id) setActiveId(id);
              }}
              className="mb-8 flex-wrap"
            >
              {FEATURE_TABS.map((tab) => (
                <ToggleGroupItem
                  key={tab.id}
                  value={tab.id}
                  className="h-auto rounded-full px-4 py-2 text-xs font-normal text-muted-foreground shadow-none data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  {tab.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <div className="mb-6 h-0.5 w-full rounded-full bg-border">
              <div
                className="h-full rounded-full bg-foreground transition-[width] duration-500 ease-out"
                style={{ width: `${active.progress}%` }}
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              className="liquid-glass h-auto rounded-full px-8 py-3 font-normal text-foreground transition-transform hover:scale-[1.03]"
            >
              Explore the Velorah Flow
            </Button>
          </div>
        </div>

        <div className="relative min-h-[400px] overflow-hidden rounded-2xl">
          {videoFailed ? (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-br from-muted via-card to-background bg-cover bg-center"
              style={posterSrc ? { backgroundImage: `url(${posterSrc})` } : undefined}
            />
          ) : (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={videoSrc}
              poster={posterSrc}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
              tabIndex={-1}
              onError={() => setVideoFailed(true)}
            />
          )}
        </div>
      </div>
    </section>
  );
};
