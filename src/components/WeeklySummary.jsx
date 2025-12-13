import { useState } from 'react';
import Panel from './panels/Panel';
import TimeframeSelector from './controls/TimeframeSelector';

export default function WeeklySummary({ trades }) {
  const [timeframe, setTimeframe] = useState('1W');

  // Placeholder logic — we’ll improve this later
  const filteredTrades = trades;

  return (
    <Panel
      title="Performance Summary"
      headerRight={
        <TimeframeSelector
          value={timeframe}
          onChange={setTimeframe}
        />
      }
    >
      <div>
        <p><strong>Timeframe:</strong> {timeframe}</p>
        <p>Trades analyzed: {filteredTrades.length}</p>
        <p>Net PnL: —</p>
        <p>Win Rate: —</p>
      </div>
    </Panel>
  );
}