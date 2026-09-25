import React, { useState } from 'react';
import type { ActiveView } from '../../types';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  historyCount?: number;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  activeView,
  onSelectView,
  historyCount = 0
}) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col lg:flex-row antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onSelectView={onSelectView}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
        historyCount={historyCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeView={activeView}
          onMobileMenuToggle={() => setIsOpenMobile(!isOpenMobile)}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-800/60 py-4 px-6 text-center text-xs text-slate-500 font-mono">
          <span>NetCIDR Subnet Suite • Client-Side Operations • Educational Computer Networks Project</span>
        </footer>
      </div>
    </div>
  );
};
