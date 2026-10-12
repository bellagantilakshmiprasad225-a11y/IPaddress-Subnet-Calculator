import React from 'react';
import type { ActiveView } from '../../types';
import { 
  Network, 
  Menu, 
  Moon, 
  Sun, 
  ShieldCheck, 
  Terminal,
  Activity,
  LogOut,
  UserRound
} from 'lucide-react';
import { Badge } from '../ui/Badge';

interface HeaderProps {
  activeView: ActiveView;
  onMobileMenuToggle: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  userEmail?: string;
  onLogout?: () => void;
}

const VIEW_TITLES: Record<ActiveView, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Network Operations Dashboard',
    subtitle: 'Computer Networks Utility & Educational Suite'
  },
  ipv4: {
    title: 'IPv4 Address Calculator',
    subtitle: 'Real-time bitwise IPv4 & Subnet Mask Analysis'
  },
  subnet: {
    title: 'Subnet Table Generator',
    subtitle: 'Divide Networks into Equal Power-of-2 Subnets'
  },
  vlsm: {
    title: 'VLSM Calculator',
    subtitle: 'Variable Length Subnet Mask Allocation Engine'
  },
  history: {
    title: 'Calculation History',
    subtitle: 'Saved LocalStorage Session Records'
  },
  about: {
    title: 'Networking Concepts & Reference',
    subtitle: 'CIDR Mathematics, RFC Standards & Educational Guide'
  }
};

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onMobileMenuToggle,
  isDarkMode,
  onToggleTheme,
  userEmail,
  onLogout
}) => {
  const currentInfo = VIEW_TITLES[activeView] || VIEW_TITLES.dashboard;

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3.5 flex items-center justify-between transition-all">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400">
            <Network className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base lg:text-lg font-bold text-slate-100 flex items-center gap-2">
              {currentInfo.title}
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        {/* Network Status Badge */}
        <Badge variant="cyan" className="hidden md:inline-flex">
          <Activity className="w-3 h-3 text-cyan-400 animate-spin" />
          Client-Side Engine
        </Badge>

        <Badge variant="emerald" className="hidden xl:inline-flex">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          RFC Compliant
        </Badge>

        {/* Quick Console Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>IPv4 / CIDR</span>
        </div>

        {userEmail ? (
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-300">
            <UserRound className="h-3.5 w-3.5 text-cyan-400" />
            <span className="max-w-[160px] truncate">{userEmail}</span>
          </div>
        ) : null}

        {onLogout ? (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-2.5 py-2 text-xs font-medium text-slate-200 transition hover:border-red-500/40 hover:text-red-200"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        ) : null}

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all duration-200"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {isDarkMode ? (
            <Moon className="w-4 h-4 text-cyan-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>
      </div>
    </header>
  );
};
