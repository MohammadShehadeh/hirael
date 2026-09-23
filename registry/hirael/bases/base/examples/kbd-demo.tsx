'use client';

import { ArrowUp, Command, Option } from 'lucide-react';

import { useT } from '@/lib/demo-locale';
import { Kbd, KbdButton, KbdGroup } from '@/registry/hirael/bases/base/components/kbd';

const KbdDemo = () => {
  const t = useT();

  return (
    <div className="grid w-full max-w-3xl gap-8">
      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">{t({ en: 'Pressable', ar: 'قابل للضغط' })}</p>
        <div className="flex flex-wrap items-center gap-2">
          <KbdButton>A</KbdButton>
          <KbdButton>Esc</KbdButton>
          <KbdButton>Enter</KbdButton>
          <KbdButton>
            <ArrowUp className="size-3.5" />
          </KbdButton>
          <KbdButton disabled>Caps</KbdButton>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">{t({ en: 'Chords', ar: 'تركيبات المفاتيح' })}</p>
        <div className="flex flex-wrap items-center gap-4">
          <KbdGroup>
            <KbdButton>
              <Command className="size-3.5" />
            </KbdButton>
            <span className="text-muted-foreground">+</span>
            <KbdButton>K</KbdButton>
          </KbdGroup>
          <KbdGroup>
            <KbdButton>
              <Option className="size-3.5" />
            </KbdButton>
            <span className="text-muted-foreground">+</span>
            <KbdButton>Shift</KbdButton>
            <span className="text-muted-foreground">+</span>
            <KbdButton>P</KbdButton>
          </KbdGroup>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">{t({ en: 'Inline display', ar: 'عرض ضمن النص' })}</p>
        <p className="text-sm text-muted-foreground">
          {t({
            en: (
              <>
                Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open the command palette, or <Kbd>?</Kbd> to view shortcuts.
              </>
            ),
            ar: (
              <>
                اضغط <Kbd>⌘</Kbd> <Kbd>K</Kbd> لفتح لوحة الأوامر، أو <Kbd>?</Kbd> لعرض الاختصارات.
              </>
            ),
          })}
        </p>
      </div>
    </div>
  );
};

export default KbdDemo;
