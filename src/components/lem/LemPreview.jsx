'use client';

import Link from 'next/link';
import styles from './LemPreview.module.css';
import SimpleLineChart from './SimpleLineChart';

export default function LemPreview({ sample = [] }) {
  // sample is optional; we’ll show placeholder “glass” even if empty.
  return (
    <section className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.head}>
          <div>
            <div className={styles.kicker}>LEM RESEARCH LAB 🧪</div>
            <div className={styles.desc}>
              Liquidity structure observatory (read-only). Price • LPₙ • Market Cap • LEM
            </div>
          </div>

          <Link className={styles.cta} href="/lem-research">
            Enter the LEM Lab 🧪
          </Link>
        </div>

        <div className={styles.glass}>
          <div className={styles.blur} />
          <div className={styles.content}>
            <SimpleLineChart
              title="Preview: Price vs LEM"
              subtitle="Sample view (full controls inside lab)"
              data={sample.length ? sample : demoData()}
              aLabel="Price"
              bLabel="LEM"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function demoData() {
  // tiny placeholder so the preview always “looks alive”
  const now = Date.now();
  return Array.from({ length: 40 }).map((_, i) => {
    const x = now - (40 - i) * 60_000;
    return { x, a: 1 + Math.sin(i / 4) * 0.2, b: 10 + Math.cos(i / 5) * 1.2 };
  });
}