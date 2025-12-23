'use client';

import styles from './SimpleLineChart.module.css';

function scalePoints(data, plotWidth, height, padY, yAccessor, minY, maxY, xMin, xMax, xOffset) {
  if (!Array.isArray(data) || data.length === 0) return '';

  return data
    .map(d => {
      const y = yAccessor(d);
      if (typeof d.x !== 'number' || typeof y !== 'number') return null;

      const nx =
        xOffset +
        ((d.x - xMin) / (xMax - xMin || 1)) * plotWidth;

      const ny =
        padY +
        (1 - (y - minY) / (maxY - minY || 1)) *
          (height - padY * 2);

      return `${nx.toFixed(2)},${ny.toFixed(2)}`;
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

  // 🔑 Axis gutters
  const leftAxisPad = 44;
  const rightAxisPad = 44;
  const padY = 12;

  const plotWidth = width - leftAxisPad - rightAxisPad;

  const xs = data.map(d => d.x).filter(Number.isFinite);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);

  const aValues = data.map(d => d.a).filter(Number.isFinite);
  const bValues = data.map(d => d.b).filter(Number.isFinite);

  const minA = Math.min(...aValues);
  const maxA = Math.max(...aValues);
  const minB = Math.min(...bValues);
  const maxB = Math.max(...bValues);

  const pointsA = scalePoints(
    data,
    plotWidth,
    height,
    padY,
    d => d.a,
    minA,
    maxA,
    xMin,
    xMax,
    leftAxisPad
  );

  const pointsB = scalePoints(
    data,
    plotWidth,
    height,
    padY,
    d => d.b,
    minB,
    maxB,
    xMin,
    xMax,
    leftAxisPad
  );

  const leftTicks = computeYAxisTicks(aValues, 5);
  const rightTicks = computeYAxisTicks(bValues, 5);

  const scaleY = (v, min, max) =>
    padY +
    (1 - (v - min) / (max - min || 1)) *
      (height - padY * 2);

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
        <svg viewBox={`0 0 ${width} ${height}`} role="img">
          {/* Series A */}
          {pointsA && (
            <polyline
              className={styles.lineA}
              fill="none"
              points={pointsA}
            />
          )}

          {/* Series B */}
          {pointsB && (
            <polyline
              className={styles.lineB}
              fill="none"
              points={pointsB}
            />
          )}

          {/* LEFT AXIS (A) */}
          {leftTicks.map((v, i) => (
            <text
              key={`l-${i}`}
              x={leftAxisPad - 6}
              y={scaleY(v, minA, maxA) + 4}
              textAnchor="end"
              fontSize="10"
              fill="rgba(255,255,255,0.55)"
            >
              {v.toFixed(0)}
            </text>
          ))}

          {/* RIGHT AXIS (B) */}
          {rightTicks.map((v, i) => (
            <text
              key={`r-${i}`}
              x={width - 4}
              y={scaleY(v, minB, maxB) + 4}
              textAnchor="end"
              fontSize="10"
              fill="rgba(255,255,255,0.55)"
            >
              {v.toFixed(1)}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}