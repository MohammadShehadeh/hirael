"use client";

import { useT } from "@/lib/demo-locale";
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

export default function LightboxDemo() {
  const t = useT();

  const photos = [
    {
      src: full("photo-1506744038136-46273834b3fb"),
      thumbnail: thumb("photo-1506744038136-46273834b3fb"),
      alt: t({
        en: "River winding through a forested valley",
        ar: "نهر يتعرّج عبر وادٍ مكسوّ بالأشجار",
      }),
      caption: t({
        en: "Yosemite valley, early morning light",
        ar: "وادي يوسيميتي في ضوء الصباح الباكر",
      }),
    },
    {
      src: full("photo-1469474968028-56623f02e42e"),
      thumbnail: thumb("photo-1469474968028-56623f02e42e"),
      alt: t({
        en: "Sunlit mountain ridge under clouds",
        ar: "قمة جبلية مشمسة تحت الغيوم",
      }),
      caption: t({
        en: "Highland ridge after the storm",
        ar: "قمة المرتفعات بعد العاصفة",
      }),
    },
    {
      src: full("photo-1501785888041-af3ef285b470"),
      thumbnail: thumb("photo-1501785888041-af3ef285b470"),
      alt: t({
        en: "Lake reflecting mountains at sunset",
        ar: "بحيرة تعكس الجبال عند الغروب",
      }),
      caption: t({
        en: "Alpine lake at golden hour",
        ar: "بحيرة جبلية في الساعة الذهبية",
      }),
    },
    {
      src: full("photo-1441974231531-c6227db76b6e"),
      thumbnail: thumb("photo-1441974231531-c6227db76b6e"),
      alt: t({
        en: "Sunbeams falling through a green forest",
        ar: "أشعة الشمس تتسلّل عبر غابة خضراء",
      }),
      caption: t({
        en: "Old-growth forest, midsummer",
        ar: "غابة عتيقة في منتصف الصيف",
      }),
    },
  ];

  const single = [
    {
      src: full("photo-1469474968028-56623f02e42e"),
      alt: t({
        en: "Sunlit mountain ridge under clouds",
        ar: "قمة جبلية مشمسة تحت الغيوم",
      }),
      caption: t({
        en: "Highland ridge after the storm",
        ar: "قمة المرتفعات بعد العاصفة",
      }),
    },
  ];

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: "Gallery · captions · thumbnail strip",
            ar: "معرض · تعليقات · شريط مصغّرات",
          })}
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
          {t({
            en: "Single image · asChild trigger",
            ar: "صورة واحدة · مشغّل asChild",
          })}
        </p>
        <Lightbox items={single}>
          <LightboxTrigger asChild>
            <Button variant="outline" className="w-fit">
              {t({ en: "View photo", ar: "عرض الصورة" })}
            </Button>
          </LightboxTrigger>
          <LightboxContent />
        </Lightbox>
      </div>
    </div>
  );
}
