import styles from './LemPreview.module.css';
import SimpleLineChart from './SimpleLineChart';

export default function LemPreview() {
  return (
    <div className={styles.preview}>
      {/* TOP — Description + CTA */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>LEM Research Lab 🧪</h3>
          <p className={styles.subtitle}>
            Liquidity structure observatory.
            Price • LPₙ • Market Cap • LEM
          </p>
        </div>

        <a href="/lem-research" className={styles.cta}>
          Enter the LEM Lab 🧪
        </a>
      </div>

      {/* BOTTOM — Chart preview */}
      <div className={styles.chart}>
        <SimpleLineChart />
      </div>
    </div>
  );
}