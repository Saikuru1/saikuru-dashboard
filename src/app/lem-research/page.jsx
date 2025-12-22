'use client';

import AppShell from '@components/layout/AppShell';
import Header from '@components/Header';
import Panel from '@components/panels/Panel';
import LemLab from '@components/lem/LemLab';

export default function LemResearchPage() {
  return (
    <AppShell header={<Header />}>
      <Panel title="LEM Research Lab 🧪">
        <p style={{ 
          margin: '6px 0 14px',
          color: 'var(--text-muted)',
          fontSize: '0.92rem',
          lineHeight: 1.5
        }}>
          Where Liquidity Reveals Risk
        </p>

        <LemLab />
      </Panel>
    </AppShell>
  );
}