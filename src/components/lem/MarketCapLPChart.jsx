'use client';

import styles from './SimpleLineChart.module.css';

/**
 * Scale values into SVG Y coordinates (shared axis)
 */
function scaleY(value, min, max, height, pad) {
  if (max === min) return height / 2;
  return (
    pad +
    (1 - (value - min) / (max - min)) * (height - pad * 2)
  );
}

/**
 * Build SVG polyline points
 */
function buildLine(data, accessor, minY, maxY, width, height, pad) {
  if (!data.length) return '';

  const xs = data.map(d => d.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);

  return data
    .map(d => {
      if (typeof d.x !== 'number') return null;
      const yVal = accessor(d);
      if (typeof yVal !== 'number') return null;

      const x =
        pad +
        ((d.x - minX) / (maxX - minX || 1)) * (width - pad * 2);

      const y = scaleY(yVal, minY, maxY, height, pad);

      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .filter(Boolean)
    .join(' ');
}

/**
 * Determine LEM band levels dynamically
 */
function computeLemBands(maxLEM) {
  const levels = [3, 5, 10, 25, 50, 75, 100];
  return levels.filter(l => l <= maxLEM);
}

export default function MarketCapLPChart({
  title = 'Market Cap vs LPₙ',
  subtitle = 'Illusion vs load-bearing capacity',
  data = [],
  height = 260,
}) {
  const width = 680;
  const pad = 14;

  // Extract values
  const mcValues = data.map(d => d.a).filter(v => typeof v === 'number');
  const lpValues = data.map(d => d.b).filter(v => typeof v === 'number');
  const lemValues = data.map(d => d.lem).filter(v => typeof v === 'number');

  if (!mcValues.length || !lpValues.length) return null;

  // Shared Y-axis domain (absolute USD)
  const minY = Math.min(...lpValues);
  const maxY = Math.max(...mcValues);

  // Build lines
  const mcLine = buildLine(
    data,
    d => d.a,
    minY,
    maxY,
    width,
    height,
    pad
  );

  const lpLine = buildLine(
    data,
    d => d.b,
    minY,
    maxY,
    width,
    height,
    pad
  );

  // LEM bands (contextual only)
  const maxLEM = Math.max(...lemValues);
  const lemBands = computeLemBands(maxLEM);

  return (
    <div className={styles.chart}>
      <div className={styles.head}>
        <div>
          <div className={styles.title}>{title}</div>
          <div className={styles.sub}>{subtitle}</div>
        </div>

        <div className={styles.legend}>
          <span className={styles.keyA}>Market Cap</span>
          <span className={styles.keyB}>LPₙ</span>
        </div>
      </div>

      <div className={styles.frame}>
        <svg viewBox={`0 0 ${width} ${height}`} role="img">
          {/* LEM stress bands (visual context only) */}
          {lemBands.map((l, i) => {
            const ratio = l / maxLEM;
            const y =
              pad + (1 - ratio) * (height - pad * 2);

            return (
              <g key={i}>
                <line
                  x1={pad}
                  x2={width - pad}
                  y1={y}
                  y2={y}
                  stroke="rgba(255,180,80,0.15)"
                  strokeDasharray="4 4"
                />
                <text
                  x={width - 6}
                  y={y - 2}
                  textAnchor="end"
                  fontSize="10"
                  fill="rgba(255,180,80,0.45)"
                >
                  {l}× LEM
                </text>
              </g>
            );
          })}

          {/* LPₙ (structural floor) */}
          <polyline
            points={lpLine}
            fill="none"
            stroke="rgba(160,140,255,0.55)"
            strokeWidth="1.6"
          />

          {/* Market Cap (dominant narrative) */}
          <polyline
            points={mcLine}
            fill="none"
            stroke="rgba(255,210,90,0.95)"
            strokeWidth="2.4"
          />
        </svg>
      </div>
    </div>
  );
}