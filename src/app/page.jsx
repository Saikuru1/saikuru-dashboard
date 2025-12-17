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
import HeroStatus from '@components/hero/HeroStatus';

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
      <HeroStatus status="idle"
      message="Saikuru Protocol monitors markets and reports validated long-side opportunites." />

      <section className="grid-two">
        <Panel title="Open Positions">
          <OpenPositions loading={loading} positions={openPositions} />
        </Panel>

        <Panel title="Daily Signals">
          <DailySignals loading={loading} positions={openPositions} />
        </Panel>
      </section>

      {/* WEEKLY SUMMARY */}
      <WeeklySummary trades={trades} />

      <Panel title="Trade Ledger">
        <LedgerHistory trades={trades} loading={loading} />
      </Panel>
    </AppShell>
  );
}