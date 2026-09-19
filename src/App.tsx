import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SimulationProvider } from './context/SimulationContext';
import { AppSidebar } from './components/layout/AppSidebar';
import { AppTopBar } from './components/layout/AppTopBar';
import { AppFooter } from './components/layout/AppFooter';
import { OverviewView } from './components/overview/OverviewView';
import { ExplorationView } from './components/explore/ExplorationView';
import { ProductionView } from './components/production/ProductionView';
import { ActionsView } from './components/actions/ActionsView';
import { WhatIfSimulatorModal } from './components/production/WhatIfSimulatorModal';
import { DataMethodologyModal } from './components/data/DataMethodologyModal';
import { AuditLogModal } from './components/actions/AuditLogModal';
import { Toast } from './components/common/Toast';

const MainLayout: React.FC = () => {
  const { activeTab, isWhatIfOpen, setIsWhatIfOpen } = useApp();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-app text-primary">
      {/* Side Navigation Bar */}
      <AppSidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Slim Telemetry Strip */}
        <AppTopBar />

        {/* Workspace Canvas */}
        <main className="flex-1 min-h-0 overflow-y-auto p-2.5 sm:p-3 flex flex-col">
          {activeTab === 'explore' && <ExplorationView />}
          {activeTab === 'production' && <ProductionView />}
          {activeTab === 'actions' && <ActionsView />}
          {activeTab === 'overview' && <OverviewView />}
        </main>

        {/* Persistent Technical System Footer */}
        <AppFooter />
      </div>

      {/* Modals & Overlays */}
      <WhatIfSimulatorModal
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
      />
      <DataMethodologyModal />
      <AuditLogModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <SimulationProvider>
        <MainLayout />
      </SimulationProvider>
    </AppProvider>
  );
}
