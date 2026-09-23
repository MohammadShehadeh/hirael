'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import {
  CommandPalette,
  CommandPaletteDialog,
  CommandPaletteEmpty,
  CommandPaletteGroup,
  CommandPaletteInput,
  CommandPaletteItem,
  CommandPaletteList,
  CommandPalettePage,
  CommandPaletteRecents,
  CommandPaletteTrigger,
} from '@/registry/hirael/bases/base/components/command-palette';

const CommandPaletteDemo = () => {
  const t = useT();

  const [last, setLast] = React.useState<string | null>(null);

  const projects = [
    { id: 'project-atlas', label: t({ en: 'Atlas', ar: 'أطلس' }) },
    { id: 'project-beacon', label: t({ en: 'Beacon', ar: 'منارة' }) },
    { id: 'project-corvus', label: t({ en: 'Corvus', ar: 'كورفوس' }) },
  ];

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <CommandPalette recentsKey="hirael-command-palette-demo" shortcut="j">
        <CommandPaletteTrigger>
          <span>{t({ en: 'Search or jump to…', ar: 'ابحث أو انتقل إلى…' })}</span>
        </CommandPaletteTrigger>

        <CommandPaletteDialog>
          <CommandPaletteInput placeholder={t({ en: 'Type a command…', ar: 'اكتب أمرًا…' })} />
          <CommandPaletteList>
            <CommandPaletteEmpty>{t({ en: 'Nothing matches.', ar: 'لا نتائج مطابقة.' })}</CommandPaletteEmpty>

            <CommandPaletteRecents heading={t({ en: 'Recent', ar: 'الأخيرة' })}>
              {(recent) => (
                <CommandPaletteItem recentId={recent.id} label={recent.label} onSelect={() => setLast(recent.label)} />
              )}
            </CommandPaletteRecents>

            <CommandPaletteGroup heading={t({ en: 'Actions', ar: 'إجراءات' })}>
              <CommandPaletteItem
                recentId="new-issue"
                label={t({ en: 'New issue', ar: 'مشكلة جديدة' })}
                shortcut="N"
                onSelect={() => setLast(t({ en: 'New issue', ar: 'مشكلة جديدة' }))}
              />
              <CommandPaletteItem
                recentId="invite"
                label={t({ en: 'Invite teammate', ar: 'دعوة زميل' })}
                onSelect={() => setLast(t({ en: 'Invite teammate', ar: 'دعوة زميل' }))}
              />
            </CommandPaletteGroup>

            <CommandPaletteGroup heading={t({ en: 'Go to', ar: 'انتقل إلى' })}>
              <CommandPaletteItem label={t({ en: 'Project…', ar: 'مشروع…' })} page="projects" />
            </CommandPaletteGroup>

            <CommandPalettePage name="projects">
              <CommandPaletteGroup heading={t({ en: 'Projects', ar: 'المشاريع' })}>
                {projects.map((project) => (
                  <CommandPaletteItem
                    key={project.id}
                    recentId={project.id}
                    label={project.label}
                    onSelect={() => setLast(project.label)}
                  />
                ))}
              </CommandPaletteGroup>
            </CommandPalettePage>
          </CommandPaletteList>
        </CommandPaletteDialog>
      </CommandPalette>

      <p className="text-xs text-muted-foreground">
        {last
          ? t({ en: `Ran: ${last}`, ar: `نُفِّذ: ${last}` })
          : t({
              en: 'Open it with the button, or the keyboard shortcut it shows.',
              ar: 'افتحها بالزر أو باختصار لوحة المفاتيح الظاهر عليه.',
            })}
      </p>
    </div>
  );
};

export default CommandPaletteDemo;
