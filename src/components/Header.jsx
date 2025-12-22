import Link from 'next/link';

export default function Header() {
  return (
    <header className="saikuru-header">
      <div className="header-inner">
        <h1 className="header-title">SAIKURU PROTOCOL</h1>

        <nav className="header-nav">
          <Link href="/" className="nav-link">
            Dashboard
          </Link>

          <Link href="/lem-research" className="nav-link">
            LEM Lab
          </Link>

          <span className="nav-link disabled">Staking</span>
          <span className="nav-link disabled">Litepaper</span>
        </nav>
      </div>
    </header>
  );
}