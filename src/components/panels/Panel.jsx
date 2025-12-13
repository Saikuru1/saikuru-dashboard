import styles from './Panel.module.css';

export default function Panel({
  title,
  subtitle,
  status,       // "success" | "warning" | "active" | undefined
  headerRight,  // React node
  footer,       // React node or string
  children,
}) {
  const statusClass = status ? styles[`status-${status}`] : '';
  const className = `${styles.panel} ${statusClass}`.trim();

  return (
    <section className={className}>
      {(title || headerRight) && (
        <header className={styles.header}>
          <div>
            {title && <h2 className={styles.title}>{title}</h2>}
            {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          </div>

          {headerRight && (
            <div className={styles.headerRight}>{headerRight}</div>
          )}
        </header>
      )}

      <div className={styles.content}>{children}</div>

      {footer && <footer className={styles.footer}>{footer}</footer>}
    </section>
  );
}