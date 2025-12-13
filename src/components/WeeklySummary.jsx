'use client';

import { useMemo, useState } from 'react';
import Panel from './panels/Panel';
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
    <Panel
      title="Performance Summary"
      subtitle={`${range} PnL`}
      headerRight={
        <TimeFrameSelector value={range} onChange={setRange} />
      }
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