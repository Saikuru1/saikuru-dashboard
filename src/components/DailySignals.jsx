export default function DailySignals({ loading, positions }) {
  const hasSignals = positions && positions.length > 0;

  if (loading) {
    return (
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Checking signals…
      </p>
    );
  }

  if (!hasSignals) {
    return (
      <>
        <p style={{ fontSize: '1.6rem', fontWeight: 600 }}>
          None
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          No fresh daily triggers. System is on standby.
        </p>
      </>
    );
  }

  return (
    <>
      {positions.slice(0, 3).map((p, idx) => (
        <div
          key={p.symbol ?? idx}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              {p.symbol}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Entry @ {p.entry_price ?? p.entry ?? '--'} ({p.frame || 'Daily'})
            </div>
          </div>
          <span className="tag-buy">Buy Stop Armed</span>
        </div>
      ))}
    </>
  );
}