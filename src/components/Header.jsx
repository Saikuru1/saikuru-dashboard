export default function Header() {
  return (
    <header className="app-header">
      <div>
        <div className="app-title">Saikuru Protocol</div>
        <p className="app-subtitle">
          Zero-cost dashboard reading live state from GitHub. Powered by Saikuru AI / Catapult.
        </p>
        <div className="nav-tabs">
          <span className="nav-pill nav-pill--active">Overview</span>
          <span className="nav-pill">Daily Report</span>
          <span className="nav-pill">History</span>
          <span className="nav-pill">Performance</span>
        </div>
      </div>

      <div className="cat-logo-wrapper">
        <span className="cat-chip">Saikuru Cat watching the charts 👀</span>
        <img
          src="/saikuru_cat.png"
          alt="Saikuru Cat"
          style={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            background: 'var(--accent-soft)',
            padding: 8,
            objectFit: 'contain'
          }}
        />
      </div>
    </header>
  );
}