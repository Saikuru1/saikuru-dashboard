'use client';

import styles from './HeroStatus.module.css';

export default function HeroStatus({
  status = 'idle', // idle | syncing | active | error
  message = 'System standing by. Monitoring markets.'
}) {
  return (
    <section className={styles.hero}>
      {/* LEFT — Saikuru Cat presence */}
      <div className={styles.catArea}>
        <div className={styles.catPlaceholder}>
          {/* Placeholder for future animation */}
          🐱
        </div>
      </div>

      {/* RIGHT — System messaging */}
      <div className={styles.info}>
        <h1 className={styles.title}>SAIKURU PROTOCOL</h1>

        <p className={styles.message}>
          {message}
        </p>

        <div className={styles.statusRow}>
          <span className={`${styles.dot} ${styles[status]}`} />
          <span className={styles.statusLabel}>
            {status === 'idle' && 'Idle'}
            {status === 'syncing' && 'Syncing'}
            {status === 'active' && 'Active'}
            {status === 'error' && 'Error'}
          </span>
        </div>
      </div>
    </section>
  );
}