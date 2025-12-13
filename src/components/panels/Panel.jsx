import styles from './Panel.module.css';
import clsx from 'clsx';

export default function Panel({
  title,
  subtitle,
  status,
  actions,
  headerRight,
  footer,
  children,
}) {
  return (
    <section
      className={clsx(
        styles.panel,
        status && styles[`status-${status}`]
      )}
    >
      {(title || actions || headerRight) && (
        <header className={styles.header}>
          <div className={styles.headerText}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {subtitle && (
              <span className={styles.subtitle}>{subtitle}</span>
            )}
          </div>

          {(actions || headerRight) && (
            <div className={styles.actions}>
              {actions || headerRight}
            </div>
          )}
        </header>
      )}

      <div className={styles.content}>
        {children}
      </div>

      {footer && (
        <footer className={styles.footer}>
          {footer}
        </footer>
      )}
    </section>
  );
}