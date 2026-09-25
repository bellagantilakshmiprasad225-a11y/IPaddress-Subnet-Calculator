import { useState, useEffect } from 'react';
import type { ActiveView } from './types';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Ipv4Calculator } from './pages/Ipv4Calculator';
import { SubnetCalculator } from './pages/SubnetCalculator';
import { VlsmCalculator } from './pages/VlsmCalculator';
import { HistoryPage } from './pages/HistoryPage';
import { AboutPage } from './pages/AboutPage';
import { getCalculationHistory } from './utils/ipUtils';

export function App() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [historyCount, setHistoryCount] = useState<number>(0);

  const refreshHistoryCount = () => {
    setHistoryCount(getCalculationHistory().length);
  };

  useEffect(() => {
    refreshHistoryCount();
  }, [activeView]);

  const renderCurrentView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveView} historyCount={historyCount} />;
      case 'ipv4':
        return <Ipv4Calculator onNavigate={setActiveView} onHistoryUpdate={refreshHistoryCount} />;
      case 'subnet':
        return <SubnetCalculator />;
      case 'vlsm':
        return <VlsmCalculator />;
      case 'history':
        return <HistoryPage historyCount={historyCount} />;
      case 'about':
        return <AboutPage />;
      default:
        return <Dashboard onNavigate={setActiveView} historyCount={historyCount} />;
    }
  };


  return (
    <Layout
      activeView={activeView}
      onSelectView={setActiveView}
      historyCount={historyCount}
    >
      {renderCurrentView()}
    </Layout>
  );
}

export default App;
