import styles from './Panel.module.css';

export default function Panel({ title, children }) {
  return (
    <div className={styles.panel}>
      {title && <div className={styles.header}>{title}</div>}
      <div className={styles.content}>{children}</div>
    </div>
  );
}