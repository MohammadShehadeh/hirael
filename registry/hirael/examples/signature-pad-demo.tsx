"use client";

import * as React from "react";
import { Download } from "lucide-react";

import { useT } from "@/lib/demo-locale";
import { Button } from "@/registry/hirael/ui/button";
import {
  SignaturePad,
  SignaturePadClear,
  SignaturePadUndo,
  type SignaturePadRef,
} from "@/registry/hirael/ui/signature-pad";

export default function SignaturePadDemo() {
  const t = useT();
  const padRef = React.useRef<SignaturePadRef>(null);
  const [dataUrl, setDataUrl] = React.useState<string | null>(null);
  const [exportEmpty, setExportEmpty] = React.useState(true);

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Basic", ar: "أساسي" })}
        </p>
        <SignaturePad placeholder={t({ en: "Sign here", ar: "وقّع هنا" })}>
          <div className="absolute end-2 top-2 flex gap-1.5">
            <SignaturePadUndo />
            <SignaturePadClear />
          </div>
        </SignaturePad>
      </div>

      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Export", ar: "تصدير" })}
        </p>
        <SignaturePad
          ref={padRef}
          placeholder={t({ en: "Sign, then export", ar: "وقّع ثم صدّر" })}
          onChange={(isEmpty) => {
            setExportEmpty(isEmpty);
            if (isEmpty) setDataUrl(null);
          }}
        />
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={exportEmpty}
            onClick={() => {
              const pad = padRef.current;
              if (!pad || pad.isEmpty()) return;
              setDataUrl(
                pad.toDataURL("image/png", { backgroundColor: "#ffffff" }),
              );
            }}
          >
            <Download aria-hidden />
            {t({ en: "Export PNG", ar: "تصدير PNG" })}
          </Button>
          {dataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dataUrl}
              alt={t({ en: "Exported signature", ar: "التوقيع المصدَّر" })}
              className="h-16 rounded-sm border border-border"
            />
          )}
        </div>
      </div>

      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Thin pen", ar: "قلم رفيع" })}
        </p>
        <SignaturePad
          minStrokeWidth={0.75}
          maxStrokeWidth={1.5}
          placeholder={t({ en: "Fine-tip pen", ar: "قلم بسنّ دقيق" })}
          className="h-32"
        >
          <div className="absolute end-2 top-2 flex gap-1.5">
            <SignaturePadUndo />
            <SignaturePadClear />
          </div>
        </SignaturePad>
      </div>
    </div>
  );
}
