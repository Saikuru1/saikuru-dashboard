'use client';

import Link from 'next/link';
import styles from './LemPreview.module.css';
import SimpleLineChart from './SimpleLineChart';

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
      <div className={styles.chart}>
        <SimpleLineChart
          title={null}
          aLabel="LEM"
          bLabel="Price"
          data={[]}   // intentionally empty preview (handled later)
        />
      </div>
    </div>
  );
}