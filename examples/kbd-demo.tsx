"use client";

import { ArrowUp, Command, Option } from "lucide-react";

import { useT } from "@/lib/demo-locale";
import { Kbd, KbdDisplay, KbdGroup } from "@/registry/hirael/components/kbd";

const KbdDemo = () => {
  const t = useT();

  return (
    <div className="grid w-full max-w-3xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Pressable", ar: "قابل للضغط" })}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Kbd>A</Kbd>
          <Kbd>Esc</Kbd>
          <Kbd>Enter</Kbd>
          <Kbd>
            <ArrowUp className="size-3.5" />
          </Kbd>
          <Kbd disabled>Caps</Kbd>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Chords", ar: "تركيبات المفاتيح" })}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <KbdGroup>
            <Kbd>
              <Command className="size-3.5" />
            </Kbd>
            <span className="text-muted-foreground">+</span>
            <Kbd>K</Kbd>
          </KbdGroup>
          <KbdGroup>
            <Kbd>
              <Option className="size-3.5" />
            </Kbd>
            <span className="text-muted-foreground">+</span>
            <Kbd>Shift</Kbd>
            <span className="text-muted-foreground">+</span>
            <Kbd>P</Kbd>
          </KbdGroup>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Inline display", ar: "عرض ضمن النص" })}
        </p>
        <p className="text-sm text-muted-foreground">
          {t({
            en: (
              <>
                Press <KbdDisplay>⌘</KbdDisplay> <KbdDisplay>K</KbdDisplay> to
                open the command palette, or <KbdDisplay>?</KbdDisplay> to view
                shortcuts.
              </>
            ),
            ar: (
              <>
                اضغط <KbdDisplay>⌘</KbdDisplay> <KbdDisplay>K</KbdDisplay> لفتح
                لوحة الأوامر، أو <KbdDisplay>?</KbdDisplay> لعرض الاختصارات.
              </>
            ),
          })}
        </p>
      </div>
    </div>
  );
};

export default KbdDemo;
