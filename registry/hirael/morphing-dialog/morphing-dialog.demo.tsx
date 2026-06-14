"use client";

import { Plus } from "lucide-react";

import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from "@/registry/hirael/ui/morphing-dialog";

export default function MorphingDialogDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-3">
      <MorphingDialog>
        <MorphingDialogTrigger className="w-72">
          <div className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-md bg-foreground/10 font-mono text-sm font-medium text-foreground">
              HL
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                Halo Layouts
              </span>
              <span className="text-xs text-muted-foreground">
                Design system
              </span>
            </div>
            <Plus className="ms-auto size-4 text-muted-foreground" />
          </div>
        </MorphingDialogTrigger>
        <MorphingDialogContent className="w-[22rem]">
          <div className="flex flex-col gap-3 p-6">
            <div className="flex size-12 items-center justify-center rounded-md bg-foreground/10 font-mono text-base font-medium text-foreground">
              HL
            </div>
            <MorphingDialogTitle>Halo Layouts</MorphingDialogTitle>
            <MorphingDialogDescription>
              A token-driven design system for dense product UIs: 200+
              variables, dark-first, and a CLI that copies source straight into
              your repo.
            </MorphingDialogDescription>
            <div className="mt-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
              <span>v3.2</span>
              <span aria-hidden>·</span>
              <span>MIT</span>
            </div>
          </div>
          <MorphingDialogClose />
        </MorphingDialogContent>
      </MorphingDialog>
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        Click the card to expand
      </p>
    </div>
  );
}
