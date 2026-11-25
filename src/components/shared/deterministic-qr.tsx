import React from 'react';

interface DeterministicQrCodeProps {
  value: string;
  size?: number;
  label?: string;
  className?: string;
}

const GRID_SIZE = 21;

function isFinderModule(r: number, c: number): boolean | null {
  const boxes = [
    { top: 0, left: 0 },
    { top: 0, left: GRID_SIZE - 7 },
    { top: GRID_SIZE - 7, left: 0 },
  ];

  for (const box of boxes) {
    const dr = r - box.top;
    const dc = c - box.left;
    if (dr >= 0 && dr < 7 && dc >= 0 && dc < 7) {
      if (dr === 0 || dr === 6 || dc === 0 || dc === 6) return true;
      if (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4) return true;
      return false;
    }
  }

  // Vùng phân cách quanh 3 ô định vị
  if ((r === 7 && c <= 7) || (c === 7 && r <= 7)) return false;
  if ((r === 7 && c >= GRID_SIZE - 8) || (c === GRID_SIZE - 8 && r <= 7)) {
    return false;
  }
  if ((r === GRID_SIZE - 8 && c <= 7) || (c === 7 && r >= GRID_SIZE - 8)) {
    return false;
  }

  // Hàng và cột định chuẩn timing pattern
  if (r === 6 && c >= 8 && c <= GRID_SIZE - 9) return c % 2 === 0;
  if (c === 6 && r >= 8 && r <= GRID_SIZE - 9) return r % 2 === 0;

  return null;
}

function hashValue(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function DeterministicQrCode({
  value,
  size = 96,
  label,
  className = '',
}: DeterministicQrCodeProps) {
  const seed = hashValue(value || 'HSV-EIU');
  const modules: { x: number; y: number }[] = [];

  for (let r = 0; r < GRID_SIZE; r += 1) {
    for (let c = 0; c < GRID_SIZE; c += 1) {
      const fixed = isFinderModule(r, c);
      if (fixed === true) {
        modules.push({ x: c, y: r });
      } else if (fixed === null) {
        const bitHash =
          hashValue(`${value}:${r}:${c}:${seed}`) ^ ((r * 31 + c * 17) >>> 0);
        if ((bitHash & 1) === 1 || (bitHash % 5 === 0)) {
          modules.push({ x: c, y: r });
        }
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`-1 -1 ${GRID_SIZE + 2} ${GRID_SIZE + 2}`}
      role="img"
      aria-label={label || `Mã QR xác thực ${value}`}
      className={className}
      shapeRendering="crispEdges"
    >
      <rect
        x={-1}
        y={-1}
        width={GRID_SIZE + 2}
        height={GRID_SIZE + 2}
        fill="#FFFFFF"
      />
      {modules.map((m) => (
        <rect
          key={`${m.y}-${m.x}`}
          x={m.x}
          y={m.y}
          width={1}
          height={1}
          fill="#02294E"
        />
      ))}
    </svg>
  );
}
