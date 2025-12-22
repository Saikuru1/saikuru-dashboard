'use client';

import styles from './SimpleLineChart.module.css';

function scalePoints(data, width, height, pad, yAccessor) {
  if (!Array.isArray(data) || data.length === 0) return '';

  const ys = data.map(yAccessor).filter(v => typeof v === 'number' && isFinite(v));
  const xs = data.map(d => d.x).filter(v => typeof v === 'number' && isFinite(v));
  if (!ys.length || !xs.length) return '';

  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
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
  const axisPad = 36; // space for right-side axis

  const pointsA = scalePoints(data, width - axisPad, height, pad, d => d.a);
  const pointsB = scalePoints(data, width - axisPad, height, pad, d => d.b);

  const bValues = data.map(d => d.b).filter(v => typeof v === 'number');
  const ticks = computeYAxisTicks(bValues, 5);

  const minB = Math.min(...bValues);
  const maxB = Math.max(...bValues);

  const scaleY = (v) =>
    pad + (1 - (v - minB) / (maxB - minB || 1)) * (height - pad * 2);

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
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={title}
        >
          {/* Series A (contextual) */}
          {pointsA && (
            <polyline
              className={styles.lineA}
              fill="none"
              points={pointsA}
            />
          )}

          {/* Series B (structural / LEM) */}
          {pointsB && (
            <polyline
              className={styles.lineB}
              fill="none"
              points={pointsB}
            />
          )}

          {/* Right-side Y-axis ticks for B (LEM) */}
          {ticks.map((v, i) => (
            <g key={i}>
              <line
                x1={width - axisPad}
                x2={width - axisPad + 6}
                y1={scaleY(v)}
                y2={scaleY(v)}
                stroke="rgba(255,255,255,0.25)"
              />
              <text
                x={width - 2}
                y={scaleY(v) + 4}
                textAnchor="end"
                fontSize="10"
                fill="rgba(255,255,255,0.55)"
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