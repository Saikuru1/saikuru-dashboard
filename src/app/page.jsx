'use client';

import { useEffect, useState } from 'react';
import Header from '@components/Header';
import OpenPositions from '@components/OpenPositions';
import DailySignals from '@components/DailySignals';
import WeeklySummary from '@components/WeeklySummary';
import LedgerHistory from '@components/LedgerHistory';
import MetricCard from '@components/MetricCard';
import { fetchOpenPositions, fetchTrades } from '@lib/fetchGithub';

export default function HomePage() {
  const [openPositions, setOpenPositions] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simple derived stats
  const totalOpen = openPositions.length;
  const realizedTrades = trades.length;
  const lastUpdated = new Date().toLocaleTimeString();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [positionsData, tradesData] = await Promise.all([
          fetchOpenPositions(),
          fetchTrades()
        ]);

        if (!cancelled) {
          setOpenPositions(Array.isArray(positionsData) ? positionsData : []);
          setTrades(Array.isArray(tradesData) ? tradesData : []);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError(err.message || 'Failed to load dashboard data.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    // optional: refresh every 5 minutes
    const id = setInterval(load, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="app-shell">
      <Header />

      <section className="app-grid" style={{ marginBottom: 18 }}>
        <div className="metric-grid">
          <MetricCard
            label="Open Positions"
            value={loading ? '...' : totalOpen}
            subtitle="Tracked by Saikuru AI"
          />
          <MetricCard
            label="Ledger Entries"
            value={loading ? '...' : realizedTrades}
            subtitle="Historical trades.log"
          />
          <MetricCard label="Last Sync" value={lastUpdated} subtitle="Local time" />
        </div>
      </section>

      {error && (
        <div className="panel" style={{ marginBottom: 16, borderColor: '#ff4d6a' }}>
          <div className="panel-header">
            <div className="panel-title">Data Error</div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#ffb3c2' }}>
            {error} – check that your GitHub raw URLs are reachable and CORS is allowed.
          </p>
        </div>
      )}

      <section className="app-grid grid-two" style={{ marginBottom: 18 }}>
        <OpenPositions loading={loading} positions={openPositions} />
        <DailySignals loading={loading} positions={openPositions} />
      </section>

      <section className="app-grid" style={{ marginBottom: 18 }}>
        <WeeklySummary trades={trades} />
      </section>

      <section className="app-grid">
        <LedgerHistory trades={trades} loading={loading} />
      </section>
    </div>
  );
}