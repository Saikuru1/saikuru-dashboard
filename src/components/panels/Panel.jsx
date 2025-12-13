import styles from './Panel.module.css';
import clsx from 'clsx';

export default function Panel({
  title,
  subtitle,
  status,
  actions,
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
      {(title || actions) && (
        <header className={styles.header}>
          <div>
            {title && <h2>{title}</h2>}
            {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </header>
      )}

      <div className={styles.content}>{children}</div>

      {footer && <footer className={styles.footer}>{footer}</footer>}
    </section>
  );
}