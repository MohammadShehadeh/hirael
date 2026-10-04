'use client';

import { useT } from '@/lib/demo-locale';
import { Map, MapControls, MapMarker } from '@/registry/hirael/bases/base/components/map';

const MapDemo = () => {
  const t = useT();

  const regions = [
    {
      id: 'fra',
      position: [8.68, 50.11] as [number, number],
      name: t({ en: 'Frankfurt', ar: 'فرانكفورت' }),
      latency: 18,
    },
    { id: 'amm', position: [35.93, 31.95] as [number, number], name: t({ en: 'Amman', ar: 'عمّان' }), latency: 42 },
    { id: 'ruh', position: [46.68, 24.71] as [number, number], name: t({ en: 'Riyadh', ar: 'الرياض' }), latency: 37 },
    { id: 'dxb', position: [55.27, 25.2] as [number, number], name: t({ en: 'Dubai', ar: 'دبي' }), latency: 29 },
    { id: 'lhr', position: [-0.12, 51.5] as [number, number], name: t({ en: 'London', ar: 'لندن' }), latency: 22 },
  ];

  return (
    <div className="grid w-full max-w-3xl gap-3">
      <Map center={[28, 40]} zoom={2.6} className="h-[26rem]">
        {regions.map((region) => (
          <MapMarker
            key={region.id}
            position={region.position}
            label={region.name}
            popup={
              <div className="grid gap-1">
                <span className="font-medium">{region.name}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {t({ en: `${region.latency} ms from you`, ar: `${region.latency} ملّي ثانية منك` })}
                </span>
              </div>
            }
          />
        ))}
        <MapControls
          labels={{
            zoomIn: t({ en: 'Zoom in', ar: 'تكبير' }),
            zoomOut: t({ en: 'Zoom out', ar: 'تصغير' }),
            resetNorth: t({ en: 'Point north', ar: 'اتجاه الشمال' }),
          }}
        />
      </Map>
      <p className="text-xs text-muted-foreground">
        {t({
          en: 'Click a region for its latency. The map switches to the dark basemap with your theme.',
          ar: 'انقر على منطقة لرؤية زمن الاستجابة. تتبدل الخريطة إلى النمط الداكن مع سمتك.',
        })}
      </p>
    </div>
  );
};

export default MapDemo;
