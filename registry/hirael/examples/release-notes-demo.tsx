"use client";

import { ArrowRight, Check, Sparkles, Zap } from "lucide-react";

import { Button } from "@/registry/hirael/ui/button";
import {
  ReleaseNotes,
  ReleaseNotesFooter,
  ReleaseNotesHeader,
  ReleaseNotesHighlight,
  ReleaseNotesHighlights,
  ReleaseNotesSection,
  ReleaseNotesSummary,
} from "@/registry/hirael/ui/release-notes";

export default function ReleaseNotesDemo() {
  return (
    <div className="grid w-full max-w-xl gap-8">
      <ReleaseNotes version="v2.0" date="June 18, 2026" title="What's new">
        <ReleaseNotesSummary>
          A faster editor, real-time collaboration, and a fresh look across the
          app.
        </ReleaseNotesSummary>

        <ReleaseNotesHighlights>
          <ReleaseNotesHighlight icon={Zap} title="Twice as fast">
            Pages load in under a second, even on large projects.
          </ReleaseNotesHighlight>
          <ReleaseNotesHighlight icon={Sparkles} title="Live collaboration">
            See cursors and edits from teammates as they happen.
          </ReleaseNotesHighlight>
          <ReleaseNotesHighlight icon={Check} title="Redesigned settings">
            Everything is now one click away from the sidebar.
          </ReleaseNotesHighlight>
        </ReleaseNotesHighlights>

        <ReleaseNotesFooter>
          <Button variant="link" size="sm" className="px-0" asChild>
            <a href="#">
              Read the full changelog
              <ArrowRight className="rtl:rotate-180" />
            </a>
          </Button>
        </ReleaseNotesFooter>
      </ReleaseNotes>

      <ReleaseNotes className="gap-4 p-5">
        <ReleaseNotesHeader version="v1.4.2" date="June 11, 2026" />
        <ReleaseNotesSection label="Fixes">
          <ReleaseNotesHighlights className="gap-2">
            <ReleaseNotesHighlight icon={false} title="Export no longer stalls on empty rows." />
            <ReleaseNotesHighlight icon={false} title="Dark mode now applies to printed pages." />
          </ReleaseNotesHighlights>
        </ReleaseNotesSection>
      </ReleaseNotes>
    </div>
  );
}
