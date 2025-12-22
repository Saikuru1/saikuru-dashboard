'use client';

import { useEffect, useState } from 'react';

import AppShell from '@components/layout/AppShell';
import Panel from '@components/panels/Panel';

import Header from '@components/Header';
import OpenPositions from '@components/OpenPositions';
import DailySignals from '@components/DailySignals';
import WeeklySummary from '@components/WeeklySummary';
import LedgerHistory from '@components/LedgerHistory';
import SystemHero from '@components/hero/SystemHero';
import LemPreview from '@components/lem/LemPreview';

import { fetchOpenPositions, fetchTrades } from '@lib/fetchGithub';

export default function HomePage() {
  const [openPositions, setOpenPositions] = useState([]);
  const [trades, setTrades] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [positions, tradesData] = await Promise.all([
          fetchOpenPositions(),
          fetchTrades()
        ]);

        if (!cancelled) {
          setOpenPositions(Array.isArray(positions) ? positions : []);
          setTrades(Array.isArray(tradesData) ? tradesData : []);
          setLastUpdated(tradesData?.metadata?.last_updated ?? null);
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
      {/* SYSTEM STATUS / SENTINEL */}
      <SystemHero openPositions={openPositions} />

      {/* LEM RESEARCH LAB PREVIEW */}
      <Panel title="LEM RESEARCH LAB 🧪">
        <LemPreview />
      </Panel>

      {/* CORE OPERATIONS */}
      <section className="grid-two">
        <Panel title="Open Positions">
          <OpenPositions loading={loading} positions={openPositions} />
        </Panel>

        <Panel title="Daily Signals">
          <DailySignals loading={loading} positions={openPositions} />
        </Panel>
      </section>

      {/* PERFORMANCE */}
      <WeeklySummary trades={trades} />

      {/* LEDGER */}
      <Panel title="Trade Ledger">
        <LedgerHistory trades={trades} loading={loading} />
      </Panel>
    </AppShell>
  );
}