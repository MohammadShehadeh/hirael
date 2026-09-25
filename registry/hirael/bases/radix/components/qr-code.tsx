'use client';

import * as React from 'react';
import { encode } from 'uqr';

import { cn } from '@/lib/utils';

export type QRCodeLevel = 'L' | 'M' | 'Q' | 'H';

export interface QRCodeProps extends Omit<React.ComponentProps<'svg'>, 'children' | 'onError'> {
  /** Text encoded into the QR symbol. */
  value: string;
  /** Error correction level. */
  level?: QRCodeLevel;
  /** Rendered size in pixels. */
  size?: number;
  /** Quiet zone width, in modules. */
  margin?: number;
  /** Accessible title announced by screen readers. Defaults to "QR code for {value}". */
  title?: string;
  /** Module color. Scanners expect dark modules on a light background. */
  foreground?: string;
  /** Fill behind the symbol and its quiet zone. Keep it lighter than `foreground`. */
  background?: string;
  /** Called when the value fails to encode; an empty svg is still rendered. */
  onError?: (error: unknown) => void;
}

const QRCode = ({
  value,
  level = 'M',
  size = 128,
  margin = 2,
  title,
  foreground = '#000',
  background = '#fff',
  onError,
  className,
  ...props
}: QRCodeProps) => {
  const { d, dim, error } = React.useMemo(() => {
    try {
      const { data, size: dim } = encode(value, { ecc: level, border: margin });
      let path = '';
      data.forEach((row, y) =>
        row.forEach((dark, x) => {
          if (dark) path += `M${x} ${y}h1v1h-1z`;
        }),
      );

      return { d: path, dim, error: null };
    } catch (err) {
      return { d: '', dim: margin * 2, error: err };
    }
  }, [value, level, margin]);

  // Latest-ref: an inline `onError` changes identity every parent render and
  // must not re-report the same failure each time.
  const onErrorRef = React.useRef(onError);
  React.useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);
  React.useEffect(() => {
    if (error !== null) onErrorRef.current?.(error);
  }, [error]);

  return (
    <svg
      data-slot="qr-code"
      role="img"
      data-error={error !== null || undefined}
      viewBox={`0 0 ${dim} ${dim}`}
      width={size}
      height={size}
      className={cn('shrink-0', className)}
      {...props}
    >
      <title>{title ?? `QR code for ${value}`}</title>
      <rect data-slot="qr-code-background" width={dim} height={dim} fill={background} />
      <path data-slot="qr-code-path" d={d} fill={foreground} shapeRendering="crispEdges" />
    </svg>
  );
};

export { QRCode };
