export default function OpenPositions({ loading, positions }) {
  if (loading) {
    return <p className="muted">Loading…</p>;
  }

  if (!positions || positions.length === 0) {
    return (
      <p className="muted">
        No open positions right now. Saikuru Cat is patiently waiting.
      </p>
    );
  }

  return (
    <table className="saikuru-table">
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Entry</th>
          <th>Frame</th>
          <th>Stop</th>
          <th>PnL %</th>
        </tr>
      </thead>
      <tbody>
        {positions.map(p => {
          const entry = Number(p.entry_price);
          const stop = Number(p.active_stop);

          const pnlPct =
            entry && stop
              ? ((stop - entry) / entry) * 100
              : null;

          return (
            <tr key={p.id}>
              <td>{p.symbol}</td>
              <td>{entry.toFixed(2)}</td>
              <td>{p.frame || '—'}</td>
              <td>{stop ? stop.toFixed(2) : '—'}</td>
              <td
                className={
                  pnlPct !== null
                    ? pnlPct >= 0
                      ? 'tag-profit'
                      : 'tag-loss'
                    : ''
                }
              >
                {pnlPct !== null ? `${pnlPct.toFixed(2)}%` : '—'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}