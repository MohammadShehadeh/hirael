"use client";

import {
  ChangelogEntry,
  ChangelogItem,
  ChangelogList,
  ChangelogSection,
  ChangelogViewer,
} from "@/registry/hirael/ui/changelog-viewer";

export default function ChangelogViewerDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-8">
      <ChangelogViewer>
        <ChangelogEntry
          version="v1.4.0"
          date="Jun 12, 2026"
          title="Saved views and faster search"
          latest
        >
          <ChangelogSection type="added">
            <ChangelogList>
              <ChangelogItem>Save any filter set as a named view.</ChangelogItem>
              <ChangelogItem>Keyboard shortcut to jump to search.</ChangelogItem>
            </ChangelogList>
          </ChangelogSection>
          <ChangelogSection type="changed">
            <ChangelogList>
              <ChangelogItem>Search now ranks recent results first.</ChangelogItem>
            </ChangelogList>
          </ChangelogSection>
        </ChangelogEntry>

        <ChangelogEntry version="v1.3.2" date="May 28, 2026">
          <ChangelogSection type="fixed">
            <ChangelogList>
              <ChangelogItem>Date picker no longer skips a day in some time zones.</ChangelogItem>
              <ChangelogItem>Export keeps the column order you set.</ChangelogItem>
            </ChangelogList>
          </ChangelogSection>
        </ChangelogEntry>

        <ChangelogEntry
          version="v1.3.0"
          date="May 9, 2026"
          title="Team roles"
        >
          <ChangelogSection type="added">
            <ChangelogList>
              <ChangelogItem>Invite teammates and set per-project roles.</ChangelogItem>
            </ChangelogList>
          </ChangelogSection>
          <ChangelogSection type="fixed">
            <ChangelogList>
              <ChangelogItem>Avatars load on slow connections.</ChangelogItem>
            </ChangelogList>
          </ChangelogSection>
        </ChangelogEntry>
      </ChangelogViewer>

      <ChangelogViewer>
        <ChangelogEntry
          version="v2.0.0"
          date="Jun 18, 2026"
          title="A new editor"
          latest
        >
          <ChangelogSection type="added">
            <ChangelogList>
              <ChangelogItem>Block-based editor with drag to reorder.</ChangelogItem>
              <ChangelogItem>Slash menu for quick formatting.</ChangelogItem>
              <ChangelogItem>Inline comments on any block.</ChangelogItem>
            </ChangelogList>
          </ChangelogSection>
          <ChangelogSection type="changed">
            <ChangelogList>
              <ChangelogItem>Autosave runs every few seconds instead of on blur.</ChangelogItem>
              <ChangelogItem>Toolbar moves with your selection.</ChangelogItem>
            </ChangelogList>
          </ChangelogSection>
          <ChangelogSection type="fixed">
            <ChangelogList>
              <ChangelogItem>Pasting from Word keeps lists intact.</ChangelogItem>
            </ChangelogList>
          </ChangelogSection>
          <ChangelogSection type="removed">
            <ChangelogList>
              <ChangelogItem>The old rich text field is gone. Existing drafts migrate on open.</ChangelogItem>
            </ChangelogList>
          </ChangelogSection>
        </ChangelogEntry>
      </ChangelogViewer>
    </div>
  );
}
