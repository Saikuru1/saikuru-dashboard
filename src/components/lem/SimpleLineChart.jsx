'use client';

import styles from './SimpleLineChart.module.css';

/* ---------- Utilities ---------- */

function scaleLogY(value, min, max, height, pad) {
  const logMin = Math.log10(min);
  const logMax = Math.log10(max);
  const logVal = Math.log10(value);
  return (
    pad +
    (1 - (logVal - logMin) / (logMax - logMin || 1)) *
      (height - pad * 2)
  );
}

function scaleLinearX(x, minX, maxX, width, pad) {
  return pad + ((x - minX) / (maxX - minX || 1)) * (width - pad * 2);
}

function scaleLogPoints(data, width, height, pad, yAccessor) {
  if (!data.length) return '';

  const ys = data.map(yAccessor).filter(v => v > 0);
  const xs = data.map(d => d.x);

  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);

  return data
    .map(d => {
      const y = yAccessor(d);
      if (y <= 0) return null;
      return `${scaleLinearX(d.x, minX, maxX, width, pad).toFixed(2)},${scaleLogY(
        y,
        minY,
        maxY,
        height,
        pad
      ).toFixed(2)}`;
    })
    .filter(Boolean)
    .join(' ');
}

/* ---------- Component ---------- */

export default function SimpleLineChart({
  title = '',
  subtitle,
  data = [],
  aLabel = 'A',
  bLabel = 'B',
  height = 260,
  mode, // 👈 'mc-lpn' activates special logic
}) {
  const width = 680;
  const pad = 14;

  /* ---------- Default (Price vs LEM) ---------- */
  if (mode !== 'mc-lpn') {
    // ⛔ unchanged logic — your existing Price vs LEM behavior stays intact
    const xs = data.map(d => d.x);
    const ysA = data.map(d => d.a);
    const ysB = data.map(d => d.b);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minA = Math.min(...ysA);
    const maxA = Math.max(...ysA);
    const minB = Math.min(...ysB);
    const maxB = Math.max(...ysB);

    const scaleY = (v, min, max) =>
      pad + (1 - (v - min) / (max - min || 1)) * (height - pad * 2);

    const pointsA = data
      .map(d => `${scaleLinearX(d.x, minX, maxX, width, pad)},${scaleY(d.a, minA, maxA)}`)
      .join(' ');

    const pointsB = data
      .map(d => `${scaleLinearX(d.x, minX, maxX, width, pad)},${scaleY(d.b, minB, maxB)}`)
      .join(' ');

    return (
      <div className={styles.chart}>
        <div className={styles.head}>
          <div>
            <div className={styles.title}>{title}</div>
            <div className={styles.sub}>{subtitle}</div>
          </div>
        </div>

        <div className={styles.frame}>
          <svg viewBox={`0 0 ${width} ${height}`}>
            <polyline className={styles.lineA} points={pointsA} fill="none" />
            <polyline className={styles.lineB} points={pointsB} fill="none" />
          </svg>
        </div>
      </div>
    );
  }

  /* ---------- MC vs LPₙ (Structural Mode) ---------- */

  const mcPoints = scaleLogPoints(data, width, height, pad, d => d.a);
  const lpnPoints = scaleLogPoints(data, width, height, pad, d => d.b);

  const maxLEM = Math.max(...data.map(d => d.a / d.b).filter(v => isFinite(v)));

  const bands = [1, 0.75, 0.5, 0.25].map(r => r * maxLEM);

  return (
    <div className={styles.chart}>
      <div className={styles.head}>
        <div>
          <div className={styles.title}>{title}</div>
          <div className={styles.sub}>{subtitle}</div>
        </div>
      </div>

      <div className={styles.frame}>
        <svg viewBox={`0 0 ${width} ${height}`}>
          {/* LEM Bands */}
          {bands.map((lem, i) => (
            <rect
              key={i}
              x={0}
              y={(i * height) / bands.length}
              width={width}
              height={height / bands.length}
              fill="rgba(255,255,255,0.03)"
            />
          ))}

          {/* LPₙ (grounded) */}
          <polyline className={styles.lineA} points={lpnPoints} fill="none" />

          {/* Market Cap (dominant) */}
          <polyline className={styles.lineB} points={mcPoints} fill="none" />
        </svg>
      </div>
    </div>
  );
}
