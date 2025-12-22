'use client';

import AppShell from '@components/layout/AppShell';
import Header from '@components/Header';
import Panel from '@components/panels/Panel';
import LemLab from '@components/lem/LemLab';

export default function LemResearchPage() {
  return (
    <AppShell header={<Header />}>
      <Panel title="LEM Research Lab 🧪">
        <LemLab />
      </Panel>
    </AppShell>
  );
}