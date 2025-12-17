'use client';

import SaikuruCat from './SaikuruCat';

export default function HeroStatus({ lastUpdated }) {
  return (
    <section className="hero-status">
      <div className="hero-card">
        <SaikuruCat lastUpdated={lastUpdated} />

        <div className="hero-copy">
          <p className="hero-message">
            Saikuru Protocol monitors markets and reports validated long-side opportunities.
          </p>

          <p className="hero-sub">
            Saikuru Cat is watching the charts 👀
          </p>
        </div>
      </div>
    </section>
  );
}