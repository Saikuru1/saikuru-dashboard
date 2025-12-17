'use client';

import styles from './HeroStatus.module.css';

export default function HeroStatus() {
  return (
    <section className={styles.hero}>
      <div className={styles.card}>
        <div className={styles.left}>
          <div className={styles.cat}>
            🐱
          </div>
        </div>

        <div className={styles.right}>
          <p className={styles.message}>
            Saikuru Protocol monitors markets and reports validated
            long-side opportunities.
          </p>

        </div>
      </div>
    </section>
  );
}