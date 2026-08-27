"use client";

import { useT } from "@/lib/demo-locale";
import { Button } from "@/registry/hirael/ui/button";
import {
  Lightbox,
  LightboxContent,
  LightboxThumbnails,
  LightboxTrigger,
} from "@/registry/hirael/components/lightbox";

const full = (name: string) => `/media/components/lightbox/${name}.jpg`;
const thumb = (name: string) =>
  `/media/components/lightbox/${name}-thumb.jpg`;

const LightboxDemo = () => {
  const t = useT();

  const photos = [
    {
      src: full("valley"),
      thumbnail: thumb("valley"),
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
      src: full("ridge"),
      thumbnail: thumb("ridge"),
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
      src: full("lake"),
      thumbnail: thumb("lake"),
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
      src: full("forest"),
      thumbnail: thumb("forest"),
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
      src: full("ridge"),
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
};

export default LightboxDemo;
