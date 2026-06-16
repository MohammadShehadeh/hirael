"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/registry/hirael/ui/button";

type Suggestion = {
  route: string;
  description: string;
};

const SUGGESTIONS: readonly Suggestion[] = [
  { route: "/registry", description: "Browse every shipped component" },
  { route: "/themes", description: "Tune the accent and re-skin live" },
  { route: "/docs/install", description: "Get up and running in a minute" },
];

export default function NotFound01() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-background py-20">
      <div className="mx-auto w-full max-w-2xl px-6 md:px-10">
        <div className="flex flex-col items-start gap-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            404
          </span>
          <h1 className="text-balance font-serif text-6xl font-medium leading-none tracking-tight sm:text-7xl">
            Page not found.
          </h1>
          <p className="max-w-md text-base text-muted-foreground sm:text-lg">
            The route you tried doesn&apos;t resolve to anything we ship. It may
            have moved, or it may have never existed.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="default" size="lg">
              <a href="#">Go home</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#">Browse docs</a>
            </Button>
          </div>

          <div className="mt-6 w-full border-t border-border pt-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Try one of these
            </span>
            <ul className="mt-3 flex flex-col">
              {SUGGESTIONS.map((s) => (
                <li key={s.route}>
                  <a
                    href={s.route}
                    className="group flex items-center justify-between gap-4 border-b border-border p-3 transition-colors last:border-b-0 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-sm text-foreground">
                        {s.route}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {s.description}
                      </span>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-all duration-150 ease-out group-hover:translate-x-0.5 group-hover:opacity-100 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
