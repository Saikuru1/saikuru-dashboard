export default function Header() {
  return (
    <header className="header">
      {/* LEFT */}
      <div className="header-left">
        <span className="logo">🐾</span>
        <h1 className="title">Saikuru Protocol</h1>
      </div>

      {/* RIGHT */}
      <div className="header-right">
        <div className="cat-status">
          Saikuru Cat watching the charts 👀
        </div>
      </div>
    </header>
  );
}