"use client";

import Image from "next/image";

import {
  ImageCompare,
  ImageCompareAfter,
  ImageCompareBefore,
  ImageCompareHandle,
  ImageCompareLabel,
} from "@/registry/hirael/ui/image-compare";

const PHOTO =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop";
const PHOTO_ALT =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop";

function MockPanel({ styled }: { styled?: boolean }) {
  return (
    <div className="size-full bg-background p-4">
      <div className="grid h-full content-start gap-3 rounded-lg border border-border bg-card p-4">
        <div
          className={
            styled
              ? "h-3 w-1/3 rounded bg-foreground"
              : "h-3 w-1/3 rounded bg-muted"
          }
        />
        <div
          className={
            styled
              ? "h-2 w-2/3 rounded bg-muted-foreground/60"
              : "h-2 w-2/3 rounded bg-muted"
          }
        />
        <div
          className={
            styled
              ? "h-2 w-1/2 rounded bg-muted-foreground/60"
              : "h-2 w-1/2 rounded bg-muted"
          }
        />
        <div className="mt-2 flex gap-2">
          <div
            className={
              styled
                ? "h-7 w-20 rounded-md bg-primary"
                : "h-7 w-20 rounded-md border border-dashed border-border"
            }
          />
          <div
            className={
              styled
                ? "h-7 w-20 rounded-md border border-border bg-secondary"
                : "h-7 w-20 rounded-md border border-dashed border-border"
            }
          />
        </div>
      </div>
    </div>
  );
}

export default function ImageCompareDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Drag to compare · labels
        </p>
        <ImageCompare className="aspect-video rounded-lg border border-border">
          <ImageCompareBefore>
            <Image
              src={PHOTO}
              alt="Forest lake, original"
              width={1200}
              height={675}
              className="size-full object-cover grayscale"
            />
          </ImageCompareBefore>
          <ImageCompareAfter>
            <Image
              src={PHOTO}
              alt="Forest lake, edited"
              width={1200}
              height={675}
              className="size-full object-cover"
            />
          </ImageCompareAfter>
          <ImageCompareLabel side="before">Before</ImageCompareLabel>
          <ImageCompareLabel side="after">After</ImageCompareLabel>
          <ImageCompareHandle />
        </ImageCompare>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Vertical orientation
        </p>
        <ImageCompare
          orientation="vertical"
          defaultPosition={40}
          className="aspect-video rounded-lg border border-border"
        >
          <ImageCompareBefore>
            <Image
              src={PHOTO}
              alt="Forest lake"
              width={1200}
              height={675}
              className="size-full object-cover"
            />
          </ImageCompareBefore>
          <ImageCompareAfter>
            <Image
              src={PHOTO_ALT}
              alt="Mountain valley"
              width={1200}
              height={675}
              className="size-full object-cover"
            />
          </ImageCompareAfter>
          <ImageCompareLabel side="before">Lake</ImageCompareLabel>
          <ImageCompareLabel side="after">Valley</ImageCompareLabel>
          <ImageCompareHandle />
        </ImageCompare>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Follow pointer · wireframe vs styled
        </p>
        <ImageCompare
          followPointer
          className="aspect-video rounded-lg border border-border"
        >
          <ImageCompareBefore>
            <MockPanel />
          </ImageCompareBefore>
          <ImageCompareAfter>
            <MockPanel styled />
          </ImageCompareAfter>
          <ImageCompareLabel side="before">Wireframe</ImageCompareLabel>
          <ImageCompareLabel side="after">Styled</ImageCompareLabel>
          <ImageCompareHandle />
        </ImageCompare>
      </div>
    </div>
  );
}
