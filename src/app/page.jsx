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
    async function load() {
      setLoading(true);
      const [positions, trades] = await Promise.all([
        fetchOpenPositions(),
        fetchTrades()
      ]);
      setOpenPositions(positions || []);
      setTrades(trades || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <AppShell header={<Header />}>
      
      {/* METRICS */}
      <section className="metrics-grid">
        <MetricCard label="Open Positions" value={openPositions.length} />
        <MetricCard label="Ledger Entries" value={trades.length} />
        <MetricCard label="Last Sync" value={new Date().toLocaleTimeString()} />
      </section>

      {/* PRIMARY PANELS */}
      <section className="grid-two">
        <Panel title="Open Positions">
          <OpenPositions loading={loading} positions={openPositions} />
        </Panel>

        <Panel title="Daily Signals">
          <DailySignals loading={loading} positions={openPositions} />
        </Panel>
      </section>

      {/* WEEKLY SUMMARY */}
      <Panel title="Performance Summary">
        <WeeklySummary trades={trades} />
      </Panel>

      {/* LEDGER */}
      <Panel title="Trade Ledger">
        <LedgerHistory trades={trades} loading={loading} />
      </Panel>

    </AppShell>
  );
}