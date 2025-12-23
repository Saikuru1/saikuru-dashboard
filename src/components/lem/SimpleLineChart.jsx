'use client';

import styles from './SimpleLineChart.module.css';

/* ---------- Utilities ---------- */

function scalePoints(data, width, height, pad, domainMin, domainMax, yAccessor) {
  if (!data.length) return '';

  const minX = Math.min(...data.map(d => d.x));
  const maxX = Math.max(...data.map(d => d.x));

  const w = width - pad * 2;
  const h = height - pad * 2;

  const nx = x =>
    pad + ((x - minX) / (maxX - minX || 1)) * w;

  const ny = y =>
    pad + (1 - (y - domainMin) / (domainMax - domainMin || 1)) * h;

  return data
    .map(d => {
      const y = yAccessor(d);
      if (!Number.isFinite(d.x) || !Number.isFinite(y)) return null;
      return `${nx(d.x)},${ny(y)}`;
    })
    .filter(Boolean)
    .join(' ');
}

function axisTicks(min, max, count = 5) {
  if (min === max) return [min];
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, i) => min + step * i);
}

/* ---------- Component ---------- */

export default function SimpleLineChart({
  title,
  subtitle,
  data = [],
  aLabel,
  bLabel,
  height = 240, // 🔑 Taller charts (non-negotiable)
}) {
  const width = 720;
  const pad = 14;
  const axisPad = 42;

  const aVals = data.map(d => d.a).filter(Number.isFinite);
  const bVals = data.map(d => d.b).filter(Number.isFinite);

  if (!aVals.length || !bVals.length) return null;

  /* ---------- Vertical Anchoring ---------- */

  // Upper band (Series A)
  const aMin = Math.min(...aVals);
  const aMax = Math.max(...aVals);
  const aDomainMin = aMin + (aMax - aMin) * 0.35;
  const aDomainMax = aMax + (aMax - aMin) * 0.10;

  // Lower band (Series B)
  const bMin = Math.min(...bVals);
  const bMax = Math.max(...bVals);
  const bDomainMin = bMin - (bMax - bMin) * 0.10;
  const bDomainMax = bMin + (bMax - bMin) * 0.65;

  const pointsA = scalePoints(
    data,
    width - axisPad,
    height,
    pad,
    aDomainMin,
    aDomainMax,
    d => d.a
  );

  const pointsB = scalePoints(
    data,
    width - axisPad,
    height,
    pad,
    bDomainMin,
    bDomainMax,
    d => d.b
  );

  const aTicks = axisTicks(aDomainMin, aDomainMax);
  const bTicks = axisTicks(bDomainMin, bDomainMax);

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
        <svg viewBox={`0 0 ${width} ${height}`}>

          {/* -------- LEFT AXIS (Series A) -------- */}
          {aTicks.map((v, i) => {
            const y =
              pad + (1 - (v - aDomainMin) / (aDomainMax - aDomainMin)) *
              (height - pad * 2);
            return (
              <g key={`a-${i}`}>
                <line
                  x1={pad - 4}
                  x2={pad}
                  y1={y}
                  y2={y}
                  stroke="rgba(255,255,255,0.25)"
                />
                <text
                  x={pad - 6}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="rgba(255,255,255,0.55)"
                >
                  {v.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* -------- RIGHT AXIS (Series B) -------- */}
          {bTicks.map((v, i) => {
            const y =
              pad + (1 - (v - bDomainMin) / (bDomainMax - bDomainMin)) *
              (height - pad * 2);
            return (
              <g key={`b-${i}`}>
                <line
                  x1={width - axisPad}
                  x2={width - axisPad + 6}
                  y1={y}
                  y2={y}
                  stroke="rgba(255,255,255,0.25)"
                />
                <text
                  x={width - 2}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="rgba(255,255,255,0.55)"
                >
                  {v.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* -------- SERIES -------- */}

          {/* Series A = Contextual (Purple, Upper) */}
          <polyline
            className={styles.lineA}
            fill="none"
            points={pointsA}
          />

          {/* Series B = Structural (Gold, Lower) */}
          <polyline
            className={styles.lineB}
            fill="none"
            points={pointsB}
          />

        </svg>
      </div>
    </div>
  );
}