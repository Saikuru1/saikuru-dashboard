export default function LedgerHistory({ trades, loading }) {
  const hasStructuredRows = trades.length && !trades[0].raw;

  const renderProof = (proof) => {
    if (!proof) return '—';

    if (typeof proof === 'string') {
      if (proof.startsWith('https://')) {
        return (
          <a
            href={proof}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--accent-purple)',
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            View
          </a>
        );
      }

      if (proof.toLowerCase().includes('pending')) {
        return (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ⏳ Pending
          </span>
        );
      }
    }

    return '—';
  };

  return (
    <section className="panel">
      {loading && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Loading history…
        </p>
      )}

      {!loading && !trades.length && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          No trade history parsed yet.
        </p>
      )}

      {!loading && trades.length > 0 && (
        <div className="table-wrapper">
          {hasStructuredRows ? (
            <table className="saikuru-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Entry</th>
                  <th>Exit</th>
                  <th>Frame</th>
                  <th>PnL %</th>
                  <th>Entry Date</th>
                  <th>Exit Date</th>
                  <th>Proof</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((t) => {
                  const pct = Number(t.pnl_pct);
                  const cls =
                    !isNaN(pct) && pct !== 0
                      ? pct > 0
                        ? 'tag-profit'
                        : 'tag-loss'
                      : '';

                  return (
                    <tr key={t.id}>
                      <td>{t.symbol || '—'}</td>
                      <td>{t.entry_price ?? '—'}</td>
                      <td>{t.exit_price ?? '—'}</td>
                      <td>{t.frame || '—'}</td>
                      <td className={cls}>
                        {!isNaN(pct) ? `${pct.toFixed(2)}%` : '—'}
                      </td>
                      <td>{t.entry_time || '—'}</td>
                      <td>{t.exit_time || '—'}</td>
                      <td>{renderProof(t.onchain_proof)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="saikuru-table">
              <thead>
                <tr>
                  <th>Raw Log Line</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((t) => (
                  <tr key={t.id}>
                    <td style={{ whiteSpace: 'pre-wrap' }}>{t.raw}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </section>
  );
}