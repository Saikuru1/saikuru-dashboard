'use client';

import styles from './SimpleLineChart.module.css';

/* ---------- helpers ---------- */

function scalePoints(data, width, height, pad, yAccessor, minY, maxY) {
  if (!Array.isArray(data) || data.length === 0) return '';

  const xs = data.map(d => d.x).filter(v => typeof v === 'number' && isFinite(v));
  if (!xs.length) return '';

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);

  const w = Math.max(1, width - pad * 2);
  const h = Math.max(1, height - pad * 2);

  const normX = (x) =>
    pad + ((x - minX) / (maxX - minX || 1)) * w;

  const normY = (y) =>
    pad + (1 - (y - minY) / (maxY - minY || 1)) * h;

  return data
    .map(d => {
      const y = yAccessor(d);
      if (typeof d.x !== 'number' || typeof y !== 'number') return null;
      return `${normX(d.x).toFixed(2)},${normY(y).toFixed(2)}`;
    })
    .filter(Boolean)
    .join(' ');
}

function computeYAxisTicks(values, count = 5) {
  if (!values.length) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return [min];
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, i) => min + step * i);
}

/* ---------- component ---------- */

export default function SimpleLineChart({
  title = '',
  subtitle,
  data = [],
  aLabel = 'A',
  bLabel = 'B',
  height = 180,
}) {
  const width = 720;
  const pad = 12;
  const axisPad = 40;

  const aValues = data.map(d => d.a).filter(v => typeof v === 'number');
  const bValues = data.map(d => d.b).filter(v => typeof v === 'number');

  const minA = Math.min(...aValues);
  const maxA = Math.max(...aValues);
  const minB = Math.min(...bValues);
  const maxB = Math.max(...bValues);

  const pointsA = scalePoints(
    data,
    width - axisPad,
    height,
    pad,
    d => d.a,
    minA,
    maxA
  );

  const pointsB = scalePoints(
    data,
    width - axisPad,
    height,
    pad,
    d => d.b,
    minB,
    maxB
  );

  const ticksA = computeYAxisTicks(aValues, 4);
  const ticksB = computeYAxisTicks(bValues, 5);

  const scaleY = (v, min, max) =>
    pad + (1 - (v - min) / (max - min || 1)) * (height - pad * 2);

  return (
    <div className={styles.chart}>
      <div className={styles.head}>
        <div>
          {title && <div className={styles.title}>{title}</div>}
          {subtitle && <div className={styles.sub}>{subtitle}</div>}
        </div>

        <div className={styles.legend}>
          <span className={styles.keyA}>{aLabel}</span>
          <span className={styles.keyB}>{bLabel}</span>
        </div>
      </div>

      <div className={styles.frame}>
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>

          {/* Series A — contextual (left axis) */}
          {pointsA && (
            <polyline
              className={styles.lineA}
              fill="none"
              points={pointsA}
            />
          )}

          {/* Series B — structural (right axis) */}
          {pointsB && (
            <polyline
              className={styles.lineB}
              fill="none"
              points={pointsB}
            />
          )}

          {/* LEFT Y-axis (Series A) */}
          {ticksA.map((v, i) => (
            <g key={`a-${i}`}>
              <line
                x1={pad - 6}
                x2={pad}
                y1={scaleY(v, minA, maxA)}
                y2={scaleY(v, minA, maxA)}
                stroke="rgba(255,255,255,0.18)"
              />
              <text
                x={pad - 8}
                y={scaleY(v, minA, maxA) + 4}
                textAnchor="end"
                fontSize="10"
                fill="rgba(255,255,255,0.45)"
              >
                {v.toFixed(0)}
              </text>
            </g>
          ))}

          {/* RIGHT Y-axis (Series B / LEM / LPₙ) */}
          {ticksB.map((v, i) => (
            <g key={`b-${i}`}>
              <line
                x1={width - axisPad}
                x2={width - axisPad + 6}
                y1={scaleY(v, minB, maxB)}
                y2={scaleY(v, minB, maxB)}
                stroke="rgba(255,255,255,0.28)"
              />
              <text
                x={width - 4}
                y={scaleY(v, minB, maxB) + 4}
                textAnchor="end"
                fontSize="10"
                fill="rgba(255,255,255,0.65)"
              >
                {v.toFixed(1)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}