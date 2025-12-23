'use client';

import styles from './SimpleLineChart.module.css';

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function scaleSeries({
  data,
  width,
  height,
  padTop,
  padBottom,
  padX,
  accessor,
  band = 'full', // 'top' | 'bottom' | 'full'
}) {
  if (!data.length) return '';

  const values = data.map(accessor).filter(v => Number.isFinite(v));
  const xs = data.map(d => d.x).filter(v => Number.isFinite(v));
  if (!values.length || !xs.length) return '';

  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);

  const innerTop = padTop;
  const innerBottom = height - padBottom;
  const innerHeight = innerBottom - innerTop;

  // Vertical band allocation
  let bandTop = innerTop;
  let bandBottom = innerBottom;

  if (band === 'top') {
    bandBottom = innerTop + innerHeight * 0.4;
  } else if (band === 'bottom') {
    bandTop = innerTop + innerHeight * 0.6;
  }

  const normX = x =>
    padX + ((x - minX) / (maxX - minX || 1)) * (width - padX * 2);

  const normY = v => {
    const t = (v - minV) / (maxV - minV || 1);
    const y = bandBottom - t * (bandBottom - bandTop);
    return clamp(y, bandTop, bandBottom);
  };

  return data
    .map(d => {
      const v = accessor(d);
      if (!Number.isFinite(d.x) || !Number.isFinite(v)) return null;
      return `${normX(d.x).toFixed(2)},${normY(v).toFixed(2)}`;
    })
    .filter(Boolean)
    .join(' ');
}

function axisTicks(values, count = 5) {
  if (!values.length) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return [min];
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, i) => min + step * i);
}

export default function SimpleLineChart({
  title,
  subtitle,
  data = [],
  aLabel,
  bLabel,
  height = 240, // taller by design (lab rule)
}) {
  const width = 100; // logical units, responsive via viewBox

  const padX = 10;
  const padTop = 12;
  const padBottom = 18;
  const axisPad = 14;

  const aValues = data.map(d => d.a).filter(Number.isFinite);
  const bValues = data.map(d => d.b).filter(Number.isFinite);

  const aTicks = axisTicks(aValues);
  const bTicks = axisTicks(bValues);

  const minA = Math.min(...aValues);
  const maxA = Math.max(...aValues);
  const minB = Math.min(...bValues);
  const maxB = Math.max(...bValues);

  const scaleLeftY = v => {
    const t = (v - minA) / (maxA - minA || 1);
    return padTop + (1 - t) * (height - padTop - padBottom);
  };

  const scaleRightY = v => {
    const t = (v - minB) / (maxB - minB || 1);
    return padTop + (1 - t) * (height - padTop - padBottom);
  };

  const pointsA = scaleSeries({
    data,
    width,
    height,
    padTop,
    padBottom,
    padX,
    accessor: d => d.a,
    band: 'bottom', // Price / LPₙ
  });

  const pointsB = scaleSeries({
    data,
    width,
    height,
    padTop,
    padBottom,
    padX,
    accessor: d => d.b,
    band: 'top', // LEM / Market Cap
  });

  return (
    <div className={styles.chart}>
      <div className={styles.head}>
        <div>
          <div className={styles.title}>{title}</div>
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
          preserveAspectRatio="none"
          width="100%"
          height={height}
        >
          {/* Left Y-axis */}
          {aTicks.map((v, i) => (
            <text
              key={i}
              x={2}
              y={scaleLeftY(v) + 3}
              fontSize="3"
              fill="rgba(255,255,255,0.45)"
            >
              {v.toFixed(1)}
            </text>
          ))}

          {/* Right Y-axis */}
          {bTicks.map((v, i) => (
            <text
              key={i}
              x={width - 2}
              y={scaleRightY(v) + 3}
              textAnchor="end"
              fontSize="3"
              fill="rgba(255,255,255,0.55)"
            >
              {v.toFixed(1)}
            </text>
          ))}

          {/* Lower series */}
          {pointsA && (
            <polyline
              className={styles.lineA}
              fill="none"
              points={pointsA}
            />
          )}

          {/* Upper series */}
          {pointsB && (
            <polyline
              className={styles.lineB}
              fill="none"
              points={pointsB}
            />
          )}
        </svg>
      </div>
    </div>
  );
}