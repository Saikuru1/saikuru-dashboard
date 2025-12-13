'use client';

import { useEffect, useState } from 'react';

import AppShell from '@components/layout/AppShell';
import Panel from '@components/panels/Panel';

import Header from '@components/Header';
import OpenPositions from '@components/OpenPositions';
import DailySignals from '@components/DailySignals';
import WeeklySummary from '@components/WeeklySummary';
import LedgerHistory from '@components/LedgerHistory';
import MetricCard from '@components/metrics/MetricCard';

import { fetchOpenPositions, fetchTrades } from '@lib/fetchGithub';

export default function HomePage() {
  const [openPositions, setOpenPositions] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [positions, t] = await Promise.all([fetchOpenPositions(), fetchTrades()]);
        if (!cancelled) {
          setOpenPositions(Array.isArray(positions) ? positions : []);
          setTrades(Array.isArray(t) ? t : []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppShell header={<Header />}>
      <section className="metrics-grid">
        <MetricCard label="Open Positions" value={openPositions.length} />
        <MetricCard label="Ledger Entries" value={trades.length} />
        <MetricCard label="Last Sync" value={new Date().toLocaleTimeString()} />
      </section>

      <section className="grid-two">
        <Panel title="Open Positions">
          <OpenPositions loading={loading} positions={openPositions} />
        </Panel>

        <Panel title="Daily Signals">
          <DailySignals loading={loading} positions={openPositions} />
        </Panel>
      </section>

      <Panel title="Performance Summary" subtitle="Selectable PnL window">
        <WeeklySummary trades={trades} />
      </Panel>

      <Panel title="Trade Ledger">
        <LedgerHistory trades={trades} loading={loading} />
      </Panel>
    </AppShell>
  );
}