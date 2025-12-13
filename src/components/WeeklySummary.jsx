'use client';

import { useMemo, useState } from 'react';
import TimeFrameSelector from './controls/TimeFrameSelector';

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

  return (
    <>
      <TimeFrameSelector value={range} onChange={setRange} />

      <div style={{ marginTop: 12, fontSize: '1.4rem', fontWeight: 600 }}>
        {pnl >= 0 ? '+' : ''}
        {pnl.toFixed(2)}%
      </div>

      <div style={{ marginTop: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        Trades counted: {filteredTrades.length}
      </div>
    </>
  );
}