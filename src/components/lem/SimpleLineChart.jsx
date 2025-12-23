
'use client';

import styles from './SimpleLineChart.module.css';

/**
 * Scale points into a constrained vertical band
 */
function scalePointsBand(data, width, height, pad, yAccessor, bandTop, bandBottom) {
  if (!Array.isArray(data) || data.length === 0) return '';

  const ys = data.map(yAccessor).filter(v => typeof v === 'number' && isFinite(v));
  const xs = data.map(d => d.x).filter(v => typeof v === 'number' && isFinite(v));
  if (!ys.length || !xs.length) return '';

  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);

  const drawableHeight = height * (bandBottom - bandTop);
  const offsetY = height * bandTop;

  const normX = (x) =>
    pad + ((x - minX) / (maxX - minX || 1)) * (width - pad * 2);

  const normY = (y) =>
    offsetY +
    (1 - (y - minY) / (maxY - minY || 1)) * drawableHeight;

  return data
    .map(d => {
      const y = yAccessor(d);
      if (typeof d.x !== 'number' || typeof y !== 'number') return null;
      return `${normX(d.x).toFixed(2)},${normY(y).toFixed(2)}`;
    })
    .filter(Boolean)
    .join(' ');
}

/**
 * Compute numeric ticks
 */
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
  aLabel = 'A', // contextual (Price / LPₙ)
  bLabel = 'B', // structural (LEM / MC)
  height = 240, // 🔑 taller by design
}) {
  const width = 680;           // 🔑 narrower for mobile
  const pad = 12;
  const axisPad = 44;

  // Vertical bands
  const LOW_BAND = [0.55, 0.90];   // contextual lives low
  const HIGH_BAND = [0.10, 0.45];  // structural lives high

  const pointsA = scalePointsBand(
    data,
    width - axisPad,
    height,
    pad,
    d => d.a,
    LOW_BAND[0],
    LOW_BAND[1]
  );

  const pointsB = scalePointsBand(
    data,
    width - axisPad,
    height,
    pad,
    d => d.b,
    HIGH_BAND[0],
    HIGH_BAND[1]
  );

  // Numeric axis (right side = structural)
  const bValues = data.map(d => d.b).filter(v => typeof v === 'number');
  const ticks = computeYAxisTicks(bValues, 5);
  const minB = Math.min(...bValues);
  const maxB = Math.max(...bValues);

  const scaleYStructural = (v) =>
    height * HIGH_BAND[0] +
    (1 - (v - minB) / (maxB - minB || 1)) *
      height * (HIGH_BAND[1] - HIGH_BAND[0]);

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
          {/* Contextual (Price / LPₙ) — LOW */}
          {pointsA && (
            <polyline
              className={styles.lineA}
              fill="none"
              points={pointsA}
            />
          )}

          {/* Structural (LEM / Market Cap) — HIGH */}
          {pointsB && (
            <polyline
              className={styles.lineB}
              fill="none"
              points={pointsB}
            />
          )}

          {/* Right-side structural axis */}
          {ticks.map((v, i) => (
            <g key={i}>
              <line
                x1={width - axisPad}
                x2={width - axisPad + 6}
                y1={scaleYStructural(v)}
                y2={scaleYStructural(v)}
                stroke="rgba(255,255,255,0.25)"
              />
              <text
                x={width - 2}
                y={scaleYStructural(v) + 4}
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