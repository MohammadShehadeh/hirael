'use client';

import 'maplibre-gl/dist/maplibre-gl.css';

import * as React from 'react';
import { createPortal } from 'react-dom';
import type { LngLatLike, Map as MapLibreMap, Marker as MapLibreMarker, Popup as MapLibrePopup } from 'maplibre-gl';
import { Compass, LocateFixed, Minus, Plus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

type MapLibre = typeof import('maplibre-gl');

/** Free, keyless vector basemaps from CARTO. Swap in your own style URLs for production traffic. */
export const MAP_STYLES = {
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
};

interface MapContextValue {
  map: MapLibreMap | null;
  lib: MapLibre | null;
}

const MapContext = React.createContext<MapContextValue | null>(null);

/** The MapLibre map instance and library, once loaded, for anything the parts don't cover. */
const useMap = () => {
  const ctx = React.useContext(MapContext);
  if (!ctx) {
    throw new Error('Map compound parts must be used inside <Map>');
  }

  return ctx;
};

const subscribeToTheme = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  return () => observer.disconnect();
};

// Follows the `.dark` class shadcn themes put on <html>.
const useDarkClass = () =>
  React.useSyncExternalStore(
    subscribeToTheme,
    () => document.documentElement.classList.contains('dark'),
    () => false,
  );

export interface MapProps extends Omit<React.ComponentProps<'div'>, 'onLoad'> {
  /** Starting center as `[longitude, latitude]`. */
  center: [number, number];
  zoom?: number;
  /** Style URLs for light and dark mode. Defaults to CARTO Positron and Dark Matter. */
  styles?: { light: string; dark: string };
  /** Force a style instead of following the page's theme. */
  theme?: 'light' | 'dark';
  /** Allow scroll-wheel zoom. Off by default so the page scrolls past the map. */
  scrollZoom?: boolean;
  /** Called once the map has loaded, with the MapLibre instance. */
  onLoad?: (map: MapLibreMap) => void;
  /**
   * Where MapLibre's web worker is loaded from. Defaults to the matching version on unpkg;
   * copy `maplibre-gl/dist/maplibre-gl-worker.mjs` to your public folder to self-host it.
   */
  workerUrl?: string;
}

/** A MapLibre map that follows your light and dark theme. Markers, popups and controls go inside. */
const Map = ({
  center,
  zoom = 3,
  styles = MAP_STYLES,
  theme,
  scrollZoom = false,
  onLoad,
  workerUrl,
  className,
  children,
  ...props
}: MapProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [state, setState] = React.useState<MapContextValue>({ map: null, lib: null });
  const darkClass = useDarkClass();
  const style = (theme ?? (darkClass ? 'dark' : 'light')) === 'dark' ? styles.dark : styles.light;
  const initial = React.useRef({ center, zoom, style, scrollZoom, onLoad, workerUrl });

  // MapLibre touches `window` on import, so it loads in the browser only.
  React.useEffect(() => {
    let map: MapLibreMap | null = null;
    let cancelled = false;
    void import('maplibre-gl').then((lib) => {
      if (cancelled || !containerRef.current) return;
      const options = initial.current;
      // Bundlers inline MapLibre, so it can't find its worker next to itself.
      lib.setWorkerUrl(
        options.workerUrl ?? `https://unpkg.com/maplibre-gl@${lib.getVersion()}/dist/maplibre-gl-worker.mjs`,
      );
      map = new lib.Map({
        container: containerRef.current,
        style: options.style,
        center: options.center,
        zoom: options.zoom,
        scrollZoom: options.scrollZoom,
        attributionControl: { compact: true },
      });
      map.on('load', () => {
        if (cancelled || !map) return;
        setState({ map, lib });
        options.onLoad?.(map);
      });
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, []);

  React.useEffect(() => {
    state.map?.setStyle(style);
  }, [state.map, style]);

  return (
    <MapContext.Provider value={state}>
      <div
        data-slot="map"
        data-loaded={state.map ? true : undefined}
        className={cn(
          'relative h-96 w-full overflow-hidden rounded-lg border border-border bg-muted',
          // The attribution chip follows the theme; MapLibre's stylesheet isn't layered, hence !important.
          '[&_.maplibregl-ctrl-attrib]:bg-background/80! [&_.maplibregl-ctrl-attrib]:text-muted-foreground! [&_.maplibregl-ctrl-attrib_a]:text-muted-foreground! [&_.maplibregl-ctrl-attrib-button]:invert-0 dark:[&_.maplibregl-ctrl-attrib-button]:invert',
          className,
        )}
        {...props}
      >
        {/* MapLibre makes this element position: relative, so it is sized directly rather than inset. */}
        <div ref={containerRef} className="size-full" />
        {children}
      </div>
    </MapContext.Provider>
  );
};

export interface MapMarkerProps {
  /** `[longitude, latitude]`. */
  position: [number, number];
  /** What the marker looks like. Defaults to a dot in your primary colour. */
  children?: React.ReactNode;
  /** Accessible name; the marker becomes a button when `onClick` is set. */
  label?: string;
  onClick?: () => void;
  /** Popup content opened by clicking the marker. */
  popup?: React.ReactNode;
}

const MapMarker = ({ position, children, label, onClick, popup }: MapMarkerProps) => {
  const { map, lib } = useMap();
  const [element] = React.useState(() => (typeof document === 'undefined' ? null : document.createElement('div')));
  const [popupElement] = React.useState(() => (typeof document === 'undefined' ? null : document.createElement('div')));
  const markerRef = React.useRef<MapLibreMarker | null>(null);
  const [lng, lat] = position;
  const hasPopup = popup !== undefined;
  // The marker is created once; later moves go through setLngLat below instead of rebuilding it.
  const positionRef = React.useRef<[number, number]>([lng, lat]);
  React.useLayoutEffect(() => {
    positionRef.current = [lng, lat];
  });

  React.useEffect(() => {
    if (!map || !lib || !element) return;
    const marker = new lib.Marker({ element }).setLngLat(positionRef.current).addTo(map);
    markerRef.current = marker;
    let popupInstance: MapLibrePopup | null = null;
    if (hasPopup && popupElement) {
      // MapLibre's stylesheet isn't layered, so its white box is cleared with !important.
      popupInstance = new lib.Popup({
        offset: 14,
        closeButton: false,
        className:
          '[&_.maplibregl-popup-content]:bg-transparent! [&_.maplibregl-popup-content]:p-0! [&_.maplibregl-popup-content]:shadow-none! [&_.maplibregl-popup-tip]:hidden!',
      }).setDOMContent(popupElement);
      marker.setPopup(popupInstance);
    }

    return () => {
      popupInstance?.remove();
      marker.remove();
      markerRef.current = null;
    };
  }, [map, lib, element, popupElement, hasPopup]);

  React.useEffect(() => {
    markerRef.current?.setLngLat([lng, lat]);
  }, [lng, lat]);

  if (!element) return null;

  return (
    <>
      {createPortal(
        <button
          type="button"
          aria-label={label}
          onClick={onClick}
          data-slot="map-marker"
          className="group/marker flex cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {children ?? (
            <span className="relative flex size-4">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/40 motion-reduce:animate-none" />
              <span className="relative size-4 rounded-full border-2 border-background bg-primary shadow-md" />
            </span>
          )}
        </button>,
        element,
      )}
      {hasPopup &&
        popupElement &&
        createPortal(
          <div
            data-slot="map-popup"
            className="min-w-40 rounded-md border border-border bg-popover p-3 text-sm text-popover-foreground shadow-md"
          >
            {popup}
          </div>,
          popupElement,
        )}
    </>
  );
};

export interface MapControlsProps extends React.ComponentProps<'div'> {
  /** Show a button that flies to the reader's location. */
  locate?: boolean;
  labels?: Partial<Record<'zoomIn' | 'zoomOut' | 'resetNorth' | 'locate', string>>;
}

const DEFAULT_CONTROL_LABELS = {
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  resetNorth: 'Point north',
  locate: 'Show my location',
};

/** Zoom, north and location buttons in your Button style, over the map's end corner. */
const MapControls = ({ locate = false, labels, className, ...props }: MapControlsProps) => {
  const { map } = useMap();
  const text = { ...DEFAULT_CONTROL_LABELS, ...labels };

  const buttons: { key: keyof typeof DEFAULT_CONTROL_LABELS; icon: typeof Plus; run: () => void }[] = [
    { key: 'zoomIn', icon: Plus, run: () => map?.zoomIn() },
    { key: 'zoomOut', icon: Minus, run: () => map?.zoomOut() },
    { key: 'resetNorth', icon: Compass, run: () => map?.resetNorthPitch() },
    ...(locate
      ? [
          {
            key: 'locate' as const,
            icon: LocateFixed,
            run: () =>
              navigator.geolocation?.getCurrentPosition((pos) =>
                map?.flyTo({ center: [pos.coords.longitude, pos.coords.latitude] as LngLatLike, zoom: 12 }),
              ),
          },
        ]
      : []),
  ];

  return (
    <div data-slot="map-controls" className={cn('absolute end-3 top-3 z-10 flex flex-col gap-1', className)} {...props}>
      {buttons.map(({ key, icon: Icon, run }) => (
        <Button
          key={key}
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={!map}
          aria-label={text[key]}
          title={text[key]}
          onClick={run}
        >
          <Icon />
        </Button>
      ))}
    </div>
  );
};

export { Map, MapMarker, MapControls, useMap };
