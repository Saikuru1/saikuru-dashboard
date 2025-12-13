import styles from './TimeframeSelector.module.css';

const OPTIONS = ['1W', '1M', '3M', '1Y', '∞'];

export default function TimeframeSelector({ value, onChange }) {
  return (
    <div className={styles.selector}>
      {OPTIONS.map(option => (
        <button
          key={option}
          className={`${styles.button} ${value === option ? styles.active : ''}`}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}