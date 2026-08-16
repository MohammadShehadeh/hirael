"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { ScrollProgress } from "@/registry/hirael/components/scroll-progress";

export default function ScrollProgressDemo() {
  const t = useT();
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="grid w-full max-w-3xl gap-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        {t({
          en: "Scoped to container · pinned to the top of this preview",
          ar: "محصور في الحاوية · مثبّت أعلى هذه المعاينة",
        })}
      </p>

      <div className="relative h-72 overflow-hidden rounded-md border border-border">
        <ScrollProgress
          target={containerRef}
          className="absolute inset-x-0 top-0 h-[3px] bg-linear-to-r from-foreground/40 via-foreground to-foreground/40"
        />
        <div
          ref={containerRef}
          className="h-full overflow-y-auto px-5 py-4 text-sm leading-relaxed text-muted-foreground"
        >
          {Array.from({ length: 18 }).map((_, i) => (
            <p key={i} className="mb-4">
              {i + 1}.{" "}
              {t({
                en: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor.",
                ar: "هذا نص افتراضي يُستخدم لملء المساحة وعرض تدفق القراءة. تتوالى الجمل لتظهر كيف ينساب المحتوى داخل الحاوية. مرّر للأسفل لتتبّع شريط التقدم وهو يمتلئ مع حركة القراءة.",
              })}
            </p>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {t({
          en: (
            <>
              Tip: omit <code className="font-mono">target</code> to track the
              whole document scroll, useful on long blog posts.
            </>
          ),
          ar: (
            <>
              نصيحة: احذف <code className="font-mono">target</code> لتتبّع تمرير
              المستند بالكامل، وهو مفيد في المقالات الطويلة.
            </>
          ),
        })}
      </p>
    </div>
  );
}
