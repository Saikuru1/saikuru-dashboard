'use client';

import { useMemo, useState } from 'react';
import Panel from './panels/Panel';

const TIMEFRAMES = [
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '1Y', days: 365 },
  { label: '∞', days: Infinity },
];

export default function WeeklySummary({ trades = [] }) {
  const [range, setRange] = useState('∞');

  const filteredTrades = useMemo(() => {
    const selected = TIMEFRAMES.find(t => t.label === range);
    if (!selected || selected.days === Infinity) return trades;

    const cutoff = Date.now() - selected.days * 24 * 60 * 60 * 1000;
    return trades.filter(t => new Date(t.exit_time).getTime() >= cutoff);
  }, [trades, range]);

  const pnl = useMemo(() => {
    return filteredTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  }, [filteredTrades]);

  const headerRight = (
    <div style={{ display: 'flex', gap: 6 }}>
      {TIMEFRAMES.map(t => (
        <button
          key={t.label}
          onClick={() => setRange(t.label)}
          style={{
            fontSize: '0.7rem',
            padding: '4px 8px',
            borderRadius: 6,
            border: '1px solid var(--border-card)',
            background:
              range === t.label
                ? 'var(--accent-gold)'
                : 'transparent',
            color:
              range === t.label
                ? '#000'
                : 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );

  return (
    <Panel
      title="Performance Summary"
      subtitle={`${range} PnL`}
      headerRight={headerRight}
      status={pnl >= 0 ? 'success' : 'warning'}
      footer={`Trades counted: ${filteredTrades.length}`}
    >
      <div style={{ fontSize: '1.4rem', fontWeight: 600 }}>
        {pnl >= 0 ? '+' : ''}
        {pnl.toFixed(2)}%
      </div>
    </Panel>
  );
}