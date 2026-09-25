'use client';

import * as React from 'react';
import Cropper, { type Area, type Point } from 'react-easy-crop';

import { cn } from '@/lib/utils';
import { Slider } from '@/registry/hirael/bases/radix/ui/slider';

export type ImageCropperCrop = Point;

interface ImageCropperOutputOptions {
  /** Width of the exported image in px; height follows the aspect. Defaults to the source resolution. */
  size?: number;
  type?: string;
  quality?: number;
}

export interface ImageCropperRef {
  getCroppedDataUrl: (opts?: ImageCropperOutputOptions) => string | null;
  reset: () => void;
}

interface ImageCropperContextValue {
  zoom: number;
  setZoom: (next: number) => void;
  minZoom: number;
  maxZoom: number;
  disabled?: boolean;
}

const ImageCropperContext = React.createContext<ImageCropperContextValue | null>(null);

const useImageCropper = () => {
  const ctx = React.useContext(ImageCropperContext);
  if (!ctx) throw new Error('ImageCropper parts must be used inside <ImageCropper>');

  return ctx;
};

const MIN_ZOOM = 1;
const ORIGIN: ImageCropperCrop = { x: 0, y: 0 };

export interface ImageCropperProps extends Omit<React.ComponentProps<'div'>, 'ref'> {
  ref?: React.Ref<ImageCropperRef>;
  src: string;
  alt?: string;
  /** Width over height of the crop area. */
  aspect?: number;
  shape?: 'rect' | 'round';
  zoom?: number;
  defaultZoom?: number;
  onZoomChange?: (zoom: number) => void;
  maxZoom?: number;
  crop?: ImageCropperCrop;
  defaultCrop?: ImageCropperCrop;
  onCropChange?: (crop: ImageCropperCrop) => void;
  /** Rule-of-thirds guides over the crop area. */
  grid?: boolean;
  disabled?: boolean;
}

const ImageCropper = ({
  ref,
  src,
  alt,
  aspect = 1,
  shape = 'rect',
  zoom: zoomProp,
  defaultZoom = MIN_ZOOM,
  onZoomChange,
  maxZoom = 3,
  crop: cropProp,
  defaultCrop = ORIGIN,
  onCropChange,
  grid = false,
  disabled,
  className,
  children,
  ...props
}: ImageCropperProps) => {
  const [internalZoom, setInternalZoom] = React.useState(defaultZoom);
  const zoom = zoomProp ?? internalZoom;
  const setZoom = React.useCallback(
    (next: number) => {
      if (zoomProp === undefined) setInternalZoom(next);
      onZoomChange?.(next);
    },
    [zoomProp, onZoomChange],
  );

  const [internalCrop, setInternalCrop] = React.useState(defaultCrop);
  const crop = cropProp ?? internalCrop;
  const setCrop = React.useCallback(
    (next: ImageCropperCrop) => {
      if (cropProp === undefined) setInternalCrop(next);
      onCropChange?.(next);
    },
    [cropProp, onCropChange],
  );

  const areaRef = React.useRef<Area | null>(null);
  const imageRef = React.useRef<HTMLImageElement | null>(null);

  // A CORS-enabled copy to draw from; the cropper's own <img> would taint the export canvas for remote sources.
  React.useEffect(() => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = src;
    imageRef.current = image;
  }, [src]);

  React.useImperativeHandle(
    ref,
    () => ({
      getCroppedDataUrl: ({ size, type = 'image/png', quality } = {}) => {
        const image = imageRef.current;
        const area = areaRef.current;
        if (!image?.complete || !area) return null;
        const scale = size ? size / area.width : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(area.width * scale);
        canvas.height = Math.round(area.height * scale);
        const context = canvas.getContext('2d');
        if (!context) return null;
        context.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height);
        try {
          return canvas.toDataURL(type, quality);
        } catch {
          return null;
        }
      },
      reset: () => {
        setZoom(defaultZoom);
        setCrop(defaultCrop);
      },
    }),
    [setZoom, setCrop, defaultZoom, defaultCrop],
  );

  const ctx = React.useMemo<ImageCropperContextValue>(
    () => ({ zoom, setZoom, minZoom: MIN_ZOOM, maxZoom, disabled }),
    [zoom, setZoom, maxZoom, disabled],
  );

  return (
    <ImageCropperContext.Provider value={ctx}>
      <div data-slot="image-cropper" className={cn('grid w-full gap-3', className)} {...props}>
        <div
          data-slot="image-cropper-area"
          className={cn(
            'relative w-full overflow-hidden rounded-md bg-muted',
            disabled && 'pointer-events-none opacity-60',
          )}
          style={{ aspectRatio: aspect }}
        >
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={shape}
            showGrid={grid}
            minZoom={MIN_ZOOM}
            maxZoom={maxZoom}
            zoomWithScroll={!disabled}
            mediaProps={{ alt }}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => {
              areaRef.current = pixels;
            }}
          />
        </div>
        {children}
      </div>
    </ImageCropperContext.Provider>
  );
};

type ImageCropperZoomProps = Omit<
  React.ComponentProps<typeof Slider>,
  'value' | 'defaultValue' | 'min' | 'max' | 'onValueChange'
>;

const ImageCropperZoom = ({ className, ...props }: ImageCropperZoomProps) => {
  const ctx = useImageCropper();

  return (
    <Slider
      aria-label="Zoom"
      min={ctx.minZoom}
      max={ctx.maxZoom}
      step={0.01}
      value={[ctx.zoom]}
      onValueChange={([v]) => {
        if (v !== undefined) ctx.setZoom(v);
      }}
      disabled={ctx.disabled}
      data-slot="image-cropper-zoom"
      className={cn('w-full', className)}
      {...props}
    />
  );
};

export { ImageCropper, ImageCropperZoom };
