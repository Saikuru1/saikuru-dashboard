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

    const cutoff = Date.now() - selected.days * 86400000;
    return trades.filter(t =>
      new Date(t.exit_time).getTime() >= cutoff
    );
  }, [trades, range]);

  const stats = useMemo(() => {
    if (!filteredTrades.length) {
      return {
        pnl: 0,
        winRate: 0,
        best: 0,
        worst: 0,
      };
    }

    const pnls = filteredTrades.map(t => t.pnl || 0);
    const wins = pnls.filter(p => p > 0).length;

    return {
      pnl: pnls.reduce((a, b) => a + b, 0),
      winRate: (wins / pnls.length) * 100,
      best: Math.max(...pnls),
      worst: Math.min(...pnls),
    };
  }, [filteredTrades]);

  return (
    <Panel
      title="Performance Summary"
      subtitle={`${range} window`}
      status={stats.pnl >= 0 ? 'success' : 'warning'}
      headerRight={
        <TimeFrameSelector value={range} onChange={setRange} />
      }
      footer={`Trades counted: ${filteredTrades.length}`}
    >
      <div className="performance-metrics">
        <div className="performance-metric">
          <div className="performance-label">PnL</div>
          <div className="performance-value">
            {stats.pnl >= 0 ? '+' : ''}
            {stats.pnl.toFixed(2)}%
          </div>
        </div>

        <div className="performance-metric">
          <div className="performance-label">Win %</div>
          <div className="performance-value">
            {stats.winRate.toFixed(1)}%
          </div>
        </div>

        <div className="performance-metric">
          <div className="performance-label">Best Trade</div>
          <div className="performance-value">
            +{stats.best.toFixed(2)}%
          </div>
        </div>

        <div className="performance-metric">
          <div className="performance-label">Worst Trade</div>
          <div className="performance-value">
            {stats.worst.toFixed(2)}%
          </div>
        </div>
      </div>
    </Panel>
  );
}