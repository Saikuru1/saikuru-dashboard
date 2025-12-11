export default function WeeklySummary({ trades }) {
  const total = trades.length;

  // very rough placeholder stats
  const wins = trades.filter((t) => Number(t.profitPct || t.profit_pct) > 0).length;
  const winRate = total ? Math.round((wins / total) * 100) : 0;

  return (
    <section className="panel">
      <div className="panel-header">
        <div className="panel-title">Weekly Summary</div>
        <span className="badge-pill">High-level overview</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 12,
          fontSize: '0.8rem'
        }}
      >
        <div className="metric-card">
          <div className="metric-label">Trades This Log</div>
          <div className="metric-value">{total}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Win Rate</div>
          <div className="metric-value">{winRate}%</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Best Trade</div>
          <div className="metric-value">
            {bestTrade(trades)?.label ?? '—'}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Worst Trade</div>
          <div className="metric-value">
            {worstTrade(trades)?.label ?? '—'}
          </div>
        </div>
      </div>

      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 10 }}>
        Future: charts, equity curve, MACD detrend overlay, growth analytics panels.
      </p>
    </section>
  );
}

function bestTrade(trades) {
  if (!trades.length) return null;
  let best = null;
  for (const t of trades) {
    const p = Number(t.profitPct || t.profit_pct);
    if (isNaN(p)) continue;
    if (!best || p > best.p) best = { label: `${t.symbol ?? ''} ${p.toFixed(2)}%`, p };
  }
  return best;
}

function worstTrade(trades) {
  if (!trades.length) return null;
  let worst = null;
  for (const t of trades) {
    const p = Number(t.profitPct || t.profit_pct);
    if (isNaN(p)) continue;
    if (!worst || p < worst.p) worst = { label: `${t.symbol ?? ''} ${p.toFixed(2)}%`, p };
  }
  return worst;
}