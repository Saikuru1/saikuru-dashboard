export default function LedgerHistory({ trades, loading }) {
  const hasStructuredRows = trades.length && !trades[0].raw;

  return (
    <section className="panel">
      <div className="panel-header">
        <div className="panel-title">Historical Trades Ledger</div>
        <span className="badge-pill">state/trades.log</span>
      </div>

      {loading && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Loading history…</p>
      )}

      {!loading && !trades.length && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          No trade history parsed yet. Once trades.log has content, it will appear here.
        </p>
      )}

      {!loading && trades.length > 0 && (
        <div className="table-wrapper">
          {hasStructuredRows ? (
            <table className="saikuru-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Entry Date</th>
                  <th>Exit Date</th>
                  <th>Frame</th>
                  <th>Profit %</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((t) => {
                  const pct = Number(t.profitPct || t.profit_pct);
                  const pctLabel = isNaN(pct) ? t.profitPct || t.profit_pct || '—' : `${pct.toFixed(2)}%`;
                  const cls =
                    !isNaN(pct) && pct !== 0
                      ? pct > 0
                        ? 'tag-profit'
                        : 'tag-loss'
                      : '';

                  return (
                    <tr key={t.id}>
                      <td>{t.symbol || '—'}</td>
                      <td>{t.entryDate || t.entry_date || '—'}</td>
                      <td>{t.exitDate || t.exit_date || '—'}</td>
                      <td>{t.frame || t.timeframe || '—'}</td>
                      <td className={cls}>{pctLabel}</td>
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