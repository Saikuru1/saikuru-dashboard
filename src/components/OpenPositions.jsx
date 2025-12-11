export default function OpenPositions({ loading, positions }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div className="panel-title">Current Open Positions</div>
        <span className="badge-pill">{loading ? 'Syncing…' : 'Live from GitHub'}</span>
      </div>

      {(!positions || positions.length === 0) && !loading ? (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          No open positions right now. Saikuru Cat is patiently waiting.
        </p>
      ) : (
        <div className="table-wrapper">
          <table className="saikuru-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Entry</th>
                <th>Frame</th>
                <th>Stop</th>
                <th>Current</th>
                <th>PnL %</th>
              </tr>
            </thead>
            <tbody>
              {(positions || []).map((p, idx) => (
                <tr key={p.id ?? p.symbol ?? idx}>
                  <td>{p.symbol || '--'}</td>
                  <td>{p.entry_price ?? p.entry ?? '--'}</td>
                  <td>{p.frame || p.timeframe || '—'}</td>
                  <td>{p.stop ?? p.stop_price ?? '—'}</td>
                  <td>{p.current ?? p.last_price ?? '—'}</td>
                  <td className={Number(p.pnl_pct) >= 0 ? 'tag-profit' : 'tag-loss'}>
                    {p.pnl_pct !== undefined ? `${p.pnl_pct}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}