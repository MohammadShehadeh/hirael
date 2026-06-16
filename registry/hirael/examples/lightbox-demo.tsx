"use client";

import { Button } from "@/registry/hirael/ui/button";
import {
  Lightbox,
  LightboxContent,
  LightboxThumbnails,
  LightboxTrigger,
} from "@/registry/hirael/ui/lightbox";

const full = (id: string) =>
  `https://images.unsplash.com/${id}?q=80&w=1600&auto=format&fit=crop`;
const thumb = (id: string) =>
  `https://images.unsplash.com/${id}?q=80&w=400&auto=format&fit=crop`;

const photos = [
  {
    src: full("photo-1506744038136-46273834b3fb"),
    thumbnail: thumb("photo-1506744038136-46273834b3fb"),
    alt: "River winding through a forested valley",
    caption: "Yosemite valley, early morning light",
  },
  {
    src: full("photo-1469474968028-56623f02e42e"),
    thumbnail: thumb("photo-1469474968028-56623f02e42e"),
    alt: "Sunlit mountain ridge under clouds",
    caption: "Highland ridge after the storm",
  },
  {
    src: full("photo-1501785888041-af3ef285b470"),
    thumbnail: thumb("photo-1501785888041-af3ef285b470"),
    alt: "Lake reflecting mountains at sunset",
    caption: "Alpine lake at golden hour",
  },
  {
    src: full("photo-1441974231531-c6227db76b6e"),
    thumbnail: thumb("photo-1441974231531-c6227db76b6e"),
    alt: "Sunbeams falling through a green forest",
    caption: "Old-growth forest, midsummer",
  },
];

const single = [
  {
    src: full("photo-1469474968028-56623f02e42e"),
    alt: "Sunlit mountain ridge under clouds",
    caption: "Highland ridge after the storm",
  },
];

export default function LightboxDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Gallery · captions · thumbnail strip
        </p>
        <Lightbox items={photos}>
          <div className="grid grid-cols-4 gap-2">
            {photos.map((photo, i) => (
              <LightboxTrigger
                key={photo.src}
                index={i}
                className="group overflow-hidden rounded-md border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.thumbnail}
                  alt={photo.alt}
                  className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
                />
              </LightboxTrigger>
            ))}
          </div>
          <LightboxContent>
            <LightboxThumbnails />
          </LightboxContent>
        </Lightbox>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Single image · asChild trigger
        </p>
        <Lightbox items={single}>
          <LightboxTrigger asChild>
            <Button variant="outline" className="w-fit">
              View photo
            </Button>
          </LightboxTrigger>
          <LightboxContent />
        </Lightbox>
      </div>
    </div>
  );
}
