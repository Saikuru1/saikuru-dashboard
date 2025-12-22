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
      return '${normX(d.x).toFixed(2)},${normY(y).toFixed(2)}';
    })
    .filter(Boolean)
    .join(' ');
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

  const pointsA = scalePoints(data, width, height, pad, d => d.a);
  const pointsB = scalePoints(data, width, height, pad, d => d.b);

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
          {pointsA && (
            <polyline
              className={styles.lineA}
              fill="none"
              points={pointsA}
            />
          )}
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