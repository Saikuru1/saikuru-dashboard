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
    const selected = TIMEFRAMES.find((t) => t.label === range);
    if (!selected || selected.days === Infinity) return trades;

    const cutoff = Date.now() - selected.days * 24 * 60 * 60 * 1000;

    return trades.filter((t) => {
      const ts = t?.exit_time ? new Date(t.exit_time).getTime() : NaN;
      return Number.isFinite(ts) && ts >= cutoff;
    });
  }, [trades, range]);

  const pnl = useMemo(() => {
    // If pnl is already a percent number per trade, summing is fine.
    // If pnl is dollars, this becomes dollars. Either way: it’s “PnL”.
    return filteredTrades.reduce((sum, t) => sum + (Number(t?.pnl) || 0), 0);
  }, [filteredTrades]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {range} PnL
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>
            {pnl >= 0 ? '+' : ''}
            {pnl.toFixed(2)}%
          </div>
          <div style={{ marginTop: 2, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Trades counted: {filteredTrades.length}
          </div>
        </div>

        <TimeFrameSelector value={range} onChange={setRange} />
      </div>
    </div>
  );
}