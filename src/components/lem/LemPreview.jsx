'use client';

import Link from 'next/link';
import styles from './LemPreview.module.css';
import SimpleLineChart from './SimpleLineChart';

/**
 * Static demo data for preview only.
 * This is NOT canonical data.
 */
const DEMO_DATA = Array.from({ length: 32 }).map((_, i) => ({
  x: i,
  a: Math.sin(i / 5) * 20 + 50,   // LEM (demo)
  b: Math.cos(i / 6) * 15 + 40,   // Price (demo)
}));

export default function LemPreview() {
  return (
    <div className={styles.preview}>
      {/* HEADER — Description + CTA */}
      <div className={styles.header}>
        <div className={styles.text}>
          <p className={styles.desc}>
            Liquidity structure observatory.
            <br />
            Price • LPₙ • Market Cap • LEM
          </p>
        </div>

        <Link href="/lem-research" className={styles.cta}>
          Enter the LEM Lab 🧪
        </Link>
      </div>

      {/* CHART PREVIEW */}
      <div className={styles.chartWrap}>
        <SimpleLineChart
          title={null}
          aLabel="LEM"
          bLabel="Price"
          data={DEMO_DATA}   // intentionally empty preview (handled later)
        />
      </div>
    </div>
  );
}