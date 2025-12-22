'use client';

import styles from './SystemHero.module.css';

const ASSETS = ['BTC', 'ETH', 'BNB', 'BCH', 'DOGE', 'ADA'];

export default function SystemHero({ openPositions = [] }) {
  // Normalize active symbols like BTCUSDT → BTC
  const activeTickers = new Set(
    openPositions
      .map(p => p.symbol)
      .filter(Boolean)
      .map(sym => sym.replace('USDT', ''))
  );

  const activeCount = activeTickers.size;

  let catState = styles.idle;
  if (activeCount >= 3) catState = styles.high;
  else if (activeCount >= 1) catState = styles.active;

  return (
    <section className={styles.hero}>
      <div className={styles.card}>
        {/* LEFT — Saikuru Cat */}
        <div className={styles.left}>
          <div className={`${styles.cat} ${catState}`} />
        </div>

        {/* RIGHT — Asset Grid */}
        <div className={styles.right}>
          <div className={styles.grid}>
            {ASSETS.map(symbol => {
              const isActive = activeTickers.has(symbol);
              return (
                <div key={symbol} className={styles.asset}>
                  <span className={styles.symbol}>{symbol}</span>
                  <span
                    className={`${styles.dot} ${
                      isActive ? styles.on : styles.off
                    }`}
                  />
                </div>
              );
            })}
          </div>

          <div className={styles.caption}>
            {activeCount === 0
              ? 'All systems standing by'
              : `${activeCount} active position${activeCount > 1 ? 's' : ''}`}
          </div>
        </div>
      </div>
    </section>
  );
}