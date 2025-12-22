import Link from 'next/link';

export default function Header() {
  return (
    <header className="saikuru-header">
      <div className="header-inner">
        <h1 className="header-title">SAIKURU PROTOCOL</h1>

        <nav className="header-nav">
          <Link href="/lem-research" className="header-link">
            LEM Research
          </Link>
        </nav>
      </div>
    </header>
  );
}