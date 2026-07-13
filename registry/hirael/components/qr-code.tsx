"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type QRCodeLevel = "L" | "M" | "Q" | "H";

const EC_FORMAT_BITS: Record<QRCodeLevel, number> = { L: 1, M: 0, Q: 3, H: 2 };
const LEVEL_INDEX: Record<QRCodeLevel, number> = { L: 0, M: 1, Q: 2, H: 3 };

// [count, totalCodewords, dataCodewords, ...] per version, levels L M Q H.
const RS_BLOCKS: number[][] = [
  [1, 26, 19],
  [1, 26, 16],
  [1, 26, 13],
  [1, 26, 9],
  [1, 44, 34],
  [1, 44, 28],
  [1, 44, 22],
  [1, 44, 16],
  [1, 70, 55],
  [1, 70, 44],
  [2, 35, 17],
  [2, 35, 13],
  [1, 100, 80],
  [2, 50, 32],
  [2, 50, 24],
  [4, 25, 9],
  [1, 134, 108],
  [2, 67, 43],
  [2, 33, 15, 2, 34, 16],
  [2, 33, 11, 2, 34, 12],
  [2, 86, 68],
  [4, 43, 27],
  [4, 43, 19],
  [4, 43, 15],
  [2, 98, 78],
  [4, 49, 31],
  [2, 32, 14, 4, 33, 15],
  [4, 39, 13, 1, 40, 14],
  [2, 121, 97],
  [2, 60, 38, 2, 61, 39],
  [4, 40, 18, 2, 41, 19],
  [4, 40, 14, 2, 41, 15],
  [2, 146, 116],
  [3, 58, 36, 2, 59, 37],
  [4, 36, 16, 4, 37, 17],
  [4, 36, 12, 4, 37, 13],
  [2, 86, 68, 2, 87, 69],
  [4, 69, 43, 1, 70, 44],
  [6, 43, 19, 2, 44, 20],
  [6, 43, 15, 2, 44, 16],
  [4, 101, 81],
  [1, 80, 50, 4, 81, 51],
  [4, 50, 22, 4, 51, 23],
  [3, 36, 12, 8, 37, 13],
  [2, 116, 92, 2, 117, 93],
  [6, 58, 36, 2, 59, 37],
  [4, 46, 20, 6, 47, 21],
  [7, 42, 14, 4, 43, 15],
  [4, 133, 107],
  [8, 59, 37, 1, 60, 38],
  [8, 44, 20, 4, 45, 21],
  [12, 33, 11, 4, 34, 12],
  [3, 145, 115, 1, 146, 116],
  [4, 64, 40, 5, 65, 41],
  [11, 36, 16, 5, 37, 17],
  [11, 36, 12, 5, 37, 13],
  [5, 109, 87, 1, 110, 88],
  [5, 65, 41, 5, 66, 42],
  [5, 54, 24, 7, 55, 25],
  [11, 36, 12, 7, 37, 13],
  [5, 122, 98, 1, 123, 99],
  [7, 73, 45, 3, 74, 46],
  [15, 43, 19, 2, 44, 20],
  [3, 45, 15, 13, 46, 16],
  [1, 135, 107, 5, 136, 108],
  [10, 74, 46, 1, 75, 47],
  [1, 50, 22, 15, 51, 23],
  [2, 42, 14, 17, 43, 15],
  [5, 150, 120, 1, 151, 121],
  [9, 69, 43, 4, 70, 44],
  [17, 50, 22, 1, 51, 23],
  [2, 42, 14, 19, 43, 15],
  [3, 141, 113, 4, 142, 114],
  [3, 70, 44, 11, 71, 45],
  [17, 47, 21, 4, 48, 22],
  [9, 39, 13, 16, 40, 14],
  [3, 135, 107, 5, 136, 108],
  [3, 67, 41, 13, 68, 42],
  [15, 54, 24, 5, 55, 25],
  [15, 43, 15, 10, 44, 16],
  [4, 144, 116, 4, 145, 117],
  [17, 68, 42],
  [17, 50, 22, 6, 51, 23],
  [19, 46, 16, 6, 47, 17],
  [2, 139, 111, 7, 140, 112],
  [17, 74, 46],
  [7, 54, 24, 16, 55, 25],
  [34, 37, 13],
  [4, 151, 121, 5, 152, 122],
  [4, 75, 47, 14, 76, 48],
  [11, 54, 24, 14, 55, 25],
  [16, 45, 15, 14, 46, 16],
  [6, 147, 117, 4, 148, 118],
  [6, 73, 45, 14, 74, 46],
  [11, 54, 24, 16, 55, 25],
  [30, 46, 16, 2, 47, 17],
  [8, 132, 106, 4, 133, 107],
  [8, 75, 47, 13, 76, 48],
  [7, 54, 24, 22, 55, 25],
  [22, 45, 15, 13, 46, 16],
  [10, 142, 114, 2, 143, 115],
  [19, 74, 46, 4, 75, 47],
  [28, 50, 22, 6, 51, 23],
  [33, 46, 16, 4, 47, 17],
  [8, 152, 122, 4, 153, 123],
  [22, 73, 45, 3, 74, 46],
  [8, 53, 23, 26, 54, 24],
  [12, 45, 15, 28, 46, 16],
  [3, 147, 117, 10, 148, 118],
  [3, 73, 45, 23, 74, 46],
  [4, 54, 24, 31, 55, 25],
  [11, 45, 15, 31, 46, 16],
  [7, 146, 116, 7, 147, 117],
  [21, 73, 45, 7, 74, 46],
  [1, 53, 23, 37, 54, 24],
  [19, 45, 15, 26, 46, 16],
  [5, 145, 115, 10, 146, 116],
  [19, 75, 47, 10, 76, 48],
  [15, 54, 24, 25, 55, 25],
  [23, 45, 15, 25, 46, 16],
  [13, 145, 115, 3, 146, 116],
  [2, 74, 46, 29, 75, 47],
  [42, 54, 24, 1, 55, 25],
  [23, 45, 15, 28, 46, 16],
  [17, 145, 115],
  [10, 74, 46, 23, 75, 47],
  [10, 54, 24, 35, 55, 25],
  [19, 45, 15, 35, 46, 16],
  [17, 145, 115, 1, 146, 116],
  [14, 74, 46, 21, 75, 47],
  [29, 54, 24, 19, 55, 25],
  [11, 45, 15, 46, 46, 16],
  [13, 145, 115, 6, 146, 116],
  [14, 74, 46, 23, 75, 47],
  [44, 54, 24, 7, 55, 25],
  [59, 46, 16, 1, 47, 17],
  [12, 151, 121, 7, 152, 122],
  [12, 75, 47, 26, 76, 48],
  [39, 54, 24, 14, 55, 25],
  [22, 45, 15, 41, 46, 16],
  [6, 151, 121, 14, 152, 122],
  [6, 75, 47, 34, 76, 48],
  [46, 54, 24, 10, 55, 25],
  [2, 45, 15, 64, 46, 16],
  [17, 152, 122, 4, 153, 123],
  [29, 74, 46, 14, 75, 47],
  [49, 54, 24, 10, 55, 25],
  [24, 45, 15, 46, 46, 16],
  [4, 152, 122, 18, 153, 123],
  [13, 74, 46, 32, 75, 47],
  [48, 54, 24, 14, 55, 25],
  [42, 45, 15, 32, 46, 16],
  [20, 147, 117, 4, 148, 118],
  [40, 75, 47, 7, 76, 48],
  [43, 54, 24, 22, 55, 25],
  [10, 45, 15, 67, 46, 16],
  [19, 148, 118, 6, 149, 119],
  [18, 75, 47, 31, 76, 48],
  [34, 54, 24, 34, 55, 25],
  [20, 45, 15, 61, 46, 16],
];

type RSBlock = { total: number; data: number };

function getRSBlocks(version: number, level: QRCodeLevel): RSBlock[] {
  const row = RS_BLOCKS[(version - 1) * 4 + LEVEL_INDEX[level]];
  const blocks: RSBlock[] = [];
  for (let i = 0; i < row.length; i += 3) {
    for (let j = 0; j < row[i]; j++) {
      blocks.push({ total: row[i + 1], data: row[i + 2] });
    }
  }
  return blocks;
}

const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
for (let i = 0, x = 1; i < 255; i++) {
  GF_EXP[i] = x;
  GF_EXP[i + 255] = x;
  GF_LOG[x] = i;
  x <<= 1;
  if (x & 0x100) x ^= 0x11d;
}

function gfMul(a: number, b: number): number {
  return a === 0 || b === 0 ? 0 : GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function rsGeneratorPoly(degree: number): number[] {
  let poly = [1];
  for (let i = 0; i < degree; i++) {
    const next = new Array<number>(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], GF_EXP[i]);
    }
    poly = next;
  }
  return poly;
}

function rsRemainder(data: number[], degree: number): Uint8Array {
  const gen = rsGeneratorPoly(degree);
  const rem = new Uint8Array(degree);
  for (const b of data) {
    const factor = b ^ rem[0];
    rem.copyWithin(0, 1);
    rem[degree - 1] = 0;
    if (factor !== 0) {
      for (let i = 0; i < degree; i++) rem[i] ^= gfMul(gen[i + 1], factor);
    }
  }
  return rem;
}

function dataCapacityBytes(version: number, level: QRCodeLevel): number {
  let total = 0;
  for (const block of getRSBlocks(version, level)) total += block.data;
  return total;
}

function pickVersion(byteLength: number, level: QRCodeLevel): number {
  for (let version = 1; version <= 40; version++) {
    const countBits = version < 10 ? 8 : 16;
    if (
      4 + countBits + byteLength * 8 <=
      dataCapacityBytes(version, level) * 8
    ) {
      return version;
    }
  }
  throw new Error(
    "QRCode: value too long for the chosen error correction level",
  );
}

function buildCodewords(
  bytes: Uint8Array,
  version: number,
  level: QRCodeLevel,
): number[] {
  const capacity = dataCapacityBytes(version, level);
  const bits: number[] = [];
  const push = (value: number, length: number) => {
    for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1);
  };
  push(0b0100, 4);
  push(bytes.length, version < 10 ? 8 : 16);
  for (const b of bytes) push(b, 8);
  push(0, Math.min(4, capacity * 8 - bits.length));
  while (bits.length % 8 !== 0) bits.push(0);
  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
    data.push(b);
  }
  for (let pad = 0xec; data.length < capacity; pad ^= 0xec ^ 0x11)
    data.push(pad);

  const blocks: { dat: number[]; ec: Uint8Array }[] = [];
  let maxData = 0;
  let maxEc = 0;
  let offset = 0;
  for (const { total, data: dataLen } of getRSBlocks(version, level)) {
    const dat = data.slice(offset, offset + dataLen);
    offset += dataLen;
    const ec = rsRemainder(dat, total - dataLen);
    blocks.push({ dat, ec });
    maxData = Math.max(maxData, dat.length);
    maxEc = Math.max(maxEc, ec.length);
  }
  const out: number[] = [];
  for (let i = 0; i < maxData; i++) {
    for (const block of blocks)
      if (i < block.dat.length) out.push(block.dat[i]);
  }
  for (let i = 0; i < maxEc; i++) {
    for (const block of blocks) if (i < block.ec.length) out.push(block.ec[i]);
  }
  return out;
}

function alignmentPositions(version: number): number[] {
  if (version === 1) return [];
  const count = Math.floor(version / 7) + 2;
  const step =
    version === 32 ? 26 : Math.ceil((version * 4 + 4) / (count * 2 - 2)) * 2;
  const positions = [6];
  for (let i = 0, pos = version * 4 + 10; i < count - 1; i++, pos -= step) {
    positions.splice(1, 0, pos);
  }
  return positions;
}

function getBit(value: number, index: number): boolean {
  return ((value >>> index) & 1) === 1;
}

function maskBit(mask: number, x: number, y: number): boolean {
  switch (mask) {
    case 0:
      return (x + y) % 2 === 0;
    case 1:
      return y % 2 === 0;
    case 2:
      return x % 3 === 0;
    case 3:
      return (x + y) % 3 === 0;
    case 4:
      return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
    case 5:
      return ((x * y) % 2) + ((x * y) % 3) === 0;
    case 6:
      return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
    default:
      return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
  }
}

const FINDER_RUN = [true, false, true, true, true, false, true];

function linePenalty(line: boolean[]): number {
  let score = 0;
  let runColor = line[0];
  let runLength = 1;
  for (let i = 1; i <= line.length; i++) {
    if (i < line.length && line[i] === runColor) {
      runLength++;
      continue;
    }
    if (runLength >= 5) score += 3 + (runLength - 5);
    runColor = line[i];
    runLength = 1;
  }
  for (let i = 0; i + 7 <= line.length; i++) {
    let match = true;
    for (let j = 0; j < 7; j++) {
      if (line[i + j] !== FINDER_RUN[j]) {
        match = false;
        break;
      }
    }
    if (!match) continue;
    if (i >= 4 && line.slice(i - 4, i).every((m) => !m)) score += 40;
    if (i + 11 <= line.length && line.slice(i + 7, i + 11).every((m) => !m)) {
      score += 40;
    }
  }
  return score;
}

function penaltyScore(modules: boolean[][]): number {
  const size = modules.length;
  let score = 0;
  for (let y = 0; y < size; y++) score += linePenalty(modules[y]);
  for (let x = 0; x < size; x++) {
    score += linePenalty(modules.map((row) => row[x]));
  }
  for (let y = 0; y < size - 1; y++) {
    for (let x = 0; x < size - 1; x++) {
      const m = modules[y][x];
      if (
        m === modules[y][x + 1] &&
        m === modules[y + 1][x] &&
        m === modules[y + 1][x + 1]
      ) {
        score += 3;
      }
    }
  }
  let dark = 0;
  for (const row of modules) for (const m of row) if (m) dark++;
  score += Math.floor(Math.abs((dark * 100) / (size * size) - 50) / 5) * 10;
  return score;
}

function encodeQR(value: string, level: QRCodeLevel = "M"): boolean[][] {
  const bytes = new TextEncoder().encode(value);
  const version = pickVersion(bytes.length, level);
  const size = version * 4 + 17;
  const modules = Array.from({ length: size }, () =>
    new Array<boolean>(size).fill(false),
  );
  const isFunction = Array.from({ length: size }, () =>
    new Array<boolean>(size).fill(false),
  );

  const set = (x: number, y: number, dark: boolean) => {
    modules[y][x] = dark;
    isFunction[y][x] = true;
  };

  for (let i = 0; i < size; i++) {
    set(6, i, i % 2 === 0);
    set(i, 6, i % 2 === 0);
  }

  const drawFinder = (cx: number, cy: number) => {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x < 0 || x >= size || y < 0 || y >= size) continue;
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        set(x, y, dist !== 2 && dist !== 4);
      }
    }
  };
  drawFinder(3, 3);
  drawFinder(size - 4, 3);
  drawFinder(3, size - 4);

  const positions = alignmentPositions(version);
  const last = positions.length - 1;
  for (let i = 0; i < positions.length; i++) {
    for (let j = 0; j < positions.length; j++) {
      if (
        (i === 0 && j === 0) ||
        (i === 0 && j === last) ||
        (i === last && j === 0)
      ) {
        continue;
      }
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          set(
            positions[i] + dx,
            positions[j] + dy,
            Math.max(Math.abs(dx), Math.abs(dy)) !== 1,
          );
        }
      }
    }
  }

  // format info — BCH(15,5), generator 0x537, masked with 0x5412
  const drawFormat = (mask: number) => {
    const data = (EC_FORMAT_BITS[level] << 3) | mask;
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = ((data << 10) | rem) ^ 0x5412;
    for (let i = 0; i <= 5; i++) set(8, i, getBit(bits, i));
    set(8, 7, getBit(bits, 6));
    set(8, 8, getBit(bits, 7));
    set(7, 8, getBit(bits, 8));
    for (let i = 9; i < 15; i++) set(14 - i, 8, getBit(bits, i));
    for (let i = 0; i < 8; i++) set(size - 1 - i, 8, getBit(bits, i));
    for (let i = 8; i < 15; i++) set(8, size - 15 + i, getBit(bits, i));
    set(8, size - 8, true);
  };
  drawFormat(0);

  // version info — BCH(18,6), generator 0x1f25, version 7+
  if (version >= 7) {
    let rem = version;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (version << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const bit = getBit(bits, i);
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      set(a, b, bit);
      set(b, a, bit);
    }
  }

  const codewords = buildCodewords(bytes, version, level);
  let bitIndex = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        if (!isFunction[y][x] && bitIndex < codewords.length * 8) {
          modules[y][x] = getBit(codewords[bitIndex >>> 3], 7 - (bitIndex & 7));
          bitIndex++;
        }
      }
    }
  }

  const applyMask = (mask: number) => {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (!isFunction[y][x] && maskBit(mask, x, y)) {
          modules[y][x] = !modules[y][x];
        }
      }
    }
  };
  let bestMask = 0;
  let bestScore = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    applyMask(mask);
    drawFormat(mask);
    const score = penaltyScore(modules);
    if (score < bestScore) {
      bestScore = score;
      bestMask = mask;
    }
    applyMask(mask);
  }
  applyMask(bestMask);
  drawFormat(bestMask);

  return modules;
}

export type QRCodeProps = Omit<React.ComponentProps<"svg">, "children"> & {
  /** Text encoded into the QR symbol. */
  value: string;
  /** Error correction level. */
  level?: QRCodeLevel;
  /** Rendered size in pixels. */
  size?: number;
  /** Quiet zone width, in modules. */
  margin?: number;
  /** Accessible title announced by screen readers. */
  title?: string;
};

function QRCode({
  value,
  level = "M",
  size = 128,
  margin = 2,
  title,
  className,
  ...props
}: QRCodeProps) {
  const { d, dim } = React.useMemo(() => {
    try {
      const matrix = encodeQR(value, level);
      let path = "";
      for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix.length; x++) {
          if (matrix[y][x]) path += `M${x + margin} ${y + margin}h1v1h-1z`;
        }
      }
      return { d: path, dim: matrix.length + margin * 2 };
    } catch {
      return { d: "", dim: margin * 2 };
    }
  }, [value, level, margin]);

  return (
    <svg
      data-slot="qr-code"
      role="img"
      aria-label={title ?? value}
      viewBox={`0 0 ${dim} ${dim}`}
      width={size}
      height={size}
      className={cn("shrink-0 text-foreground", className)}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path
        data-slot="qr-code-path"
        d={d}
        fill="currentColor"
        shapeRendering="crispEdges"
      />
    </svg>
  );
}

export { QRCode, encodeQR };
