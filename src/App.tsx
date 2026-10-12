import { useState, useEffect } from 'react';
import type { ActiveView } from './types';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Ipv4Calculator } from './pages/Ipv4Calculator';
import { SubnetCalculator } from './pages/SubnetCalculator';
import { VlsmCalculator } from './pages/VlsmCalculator';
import { HistoryPage } from './pages/HistoryPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { getCalculationHistory } from './utils/ipUtils';

const AUTH_STORAGE_KEY = 'netcidr-auth';
const USERS_STORAGE_KEY = 'netcidr-users';

const getStoredUsers = (): Array<{ email: string; password: string }> => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawUsers = window.localStorage.getItem(USERS_STORAGE_KEY);
    if (!rawUsers) {
      return [];
    }

    const parsedUsers = JSON.parse(rawUsers) as Array<Record<string, unknown>>;
    return Array.isArray(parsedUsers)
      ? parsedUsers.filter(
          (user): user is { email: string; password: string } =>
            typeof user.email === 'string' && typeof user.password === 'string'
        )
      : [];
  } catch {
    return [];
  }
};

export function App() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [historyCount, setHistoryCount] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      const rawAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (!rawAuth) {
        return false;
      }

      const parsedAuth = JSON.parse(rawAuth) as { email?: string };
      const email = typeof parsedAuth.email === 'string' ? parsedAuth.email : '';
      const validStoredUser = getStoredUsers().some((user) => user.email === email);

      if (!validStoredUser) {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        return false;
      }

      return true;
    } catch {
      return false;
    }
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    if (typeof window === 'undefined') {
      return '';
    }

    try {
      const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) {
        return '';
      }

      const parsed = JSON.parse(raw) as { email?: string };
      const email = typeof parsed.email === 'string' ? parsed.email : '';
      const validStoredUser = getStoredUsers().some((user) => user.email === email);

      if (!validStoredUser) {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        return '';
      }

      return email;
    } catch {
      return '';
    }
  });

  const refreshHistoryCount = () => {
    setHistoryCount(getCalculationHistory().length);
  };

  useEffect(() => {
    refreshHistoryCount();
  }, [activeView]);

  const handleLogin = (email: string) => {
    const normalizedEmail = email.trim();
    setUserEmail(normalizedEmail);
    setIsAuthenticated(true);

    try {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ email: normalizedEmail, loggedInAt: Date.now() }));
    } catch {
      // Ignore storage failures in private browsing or restricted environments.
    }
  };

  const handleLogout = () => {
    setUserEmail('');
    setIsAuthenticated(false);

    try {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Ignore storage failures in private browsing or restricted environments.
    }
  };

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

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Layout
      activeView={activeView}
      onSelectView={setActiveView}
      historyCount={historyCount}
      userEmail={userEmail}
      onLogout={handleLogout}
    >
      {renderCurrentView()}
    </Layout>
  );
}

export default App;
