export default function DailySignals({ loading, positions }) {
  const hasSignals = positions && positions.length > 0; // placeholder logic

  return (
    <section className="panel">
      <div className="panel-header">
        <div className="panel-title">Daily Buy Signal</div>
        <span className="badge-pill">Catapult long-side</span>
      </div>

      {loading ? (
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Checking signals…</p>
      ) : !hasSignals ? (
        <>
          <p style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            None
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            No fresh daily triggers. System is on standby.
          </p>
        </>
      ) : (
        <>
          {positions.slice(0, 3).map((p, idx) => (
            <div
              key={p.symbol ?? idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8
              }}
            >
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{p.symbol}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Entry @ {p.entry_price ?? p.entry ?? '--'} ({p.frame || p.timeframe || 'Daily'})
                </div>
              </div>
              <span className="tag-buy">Buy Stop Armed</span>
            </div>
          ))}

          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>
            This panel will evolve into a full daily signal feed (OSC / HOOK / KISS).
          </p>
        </>
      )}
    </section>
  );
}