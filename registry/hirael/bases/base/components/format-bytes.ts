const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

/** Human file size in binary steps: `1536` → `1.5 KB`. */
export const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < UNITS.length - 1) {
    n /= 1024;
    i++;
  }

  return `${i === 0 ? n.toFixed(0) : n.toFixed(1)} ${UNITS[i]}`;
};
