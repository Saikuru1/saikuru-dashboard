import styles from './AppShell.module.css';

export default function AppShell({ header, children }) {
  return (
    <div className={styles.shell}>
      {header && <div className={styles.header}>{header}</div>}
      <main className={styles.main}>{children}</main>
    </div>
  );
}