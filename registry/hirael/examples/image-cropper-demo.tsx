"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { Button } from "@/registry/hirael/ui/button";
import {
  ImageCropper,
  ImageCropperZoom,
  type ImageCropperRef,
} from "@/registry/hirael/ui/image-cropper";

const IMAGE_URL =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop";

export default function ImageCropperDemo() {
  const t = useT();
  const avatarRef = React.useRef<ImageCropperRef>(null);
  const [avatar, setAvatar] = React.useState<string | null>(null);

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: "Round avatar · zoom + export",
            ar: "صورة دائرية · تكبير + تصدير",
          })}
        </p>
        <ImageCropper
          ref={avatarRef}
          src={IMAGE_URL}
          alt={t({ en: "Mountain lake", ar: "بحيرة جبلية" })}
          shape="round"
          defaultZoom={1.2}
          className="max-w-xs"
        >
          <ImageCropperZoom />
        </ImageCropper>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setAvatar(
                avatarRef.current?.getCroppedDataUrl({ size: 256 }) ?? null,
              )
            }
          >
            {t({ en: "Export", ar: "تصدير" })}
          </Button>
          {avatar && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt={t({
                en: "Cropped avatar preview",
                ar: "معاينة الصورة المقتصّة",
              })}
              className="size-14 rounded-full border border-border object-cover"
            />
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: "16/9 banner · rule-of-thirds grid",
            ar: "لافتة 16/9 · شبكة أثلاث",
          })}
        </p>
        <ImageCropper
          src={IMAGE_URL}
          alt={t({ en: "Mountain lake banner", ar: "لافتة بحيرة جبلية" })}
          aspect={16 / 9}
          grid
        >
          <ImageCropperZoom />
        </ImageCropper>
      </div>
    </div>
  );
}
