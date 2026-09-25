import React from 'react';
import type { ActiveView } from '../../types';
import { 
  LayoutDashboard, 
  Calculator, 
  Network, 
  GitMerge, 
  History, 
  Info,
  X,
  Cpu,
  Boxes
} from 'lucide-react';

interface SidebarProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  historyCount?: number;
}

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  description: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  isOpenMobile,
  onCloseMobile,
  historyCount = 0
}) => {
  const NAV_ITEMS: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & Educational Concepts'
    },
    {
      id: 'ipv4',
      label: 'IPv4 Calculator',
      icon: Calculator,
      description: 'Host ranges & binary breakdown'
    },
    {
      id: 'subnet',
      label: 'Subnet Calculator',
      icon: Network,
      description: 'Equal size subnet generator'
    },
    {
      id: 'vlsm',
      label: 'VLSM Calculator',
      icon: GitMerge,
      description: 'Variable length subnetting'
    },
    {
      id: 'history',
      label: 'History',
      icon: History,
      badge: historyCount > 0 ? historyCount : undefined,
      description: 'Saved calculation logs'
    },
    {
      id: 'about',
      label: 'About & Guide',
      icon: Info,
      description: 'Networking reference manual'
    }
  ];

  const handleNavClick = (view: ActiveView) => {
    onSelectView(view);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-950/95 border-r border-slate-800/80 p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:z-auto`}
      >
        <div>
          {/* Brand Logo & Title */}
          <div className="flex items-center justify-between px-3 py-3 mb-6 border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold tracking-tight text-slate-100 flex items-center gap-1">
                  NetCIDR <span className="text-cyan-400 font-mono text-xs">v1.0</span>
                </h2>
                <p className="text-[11px] text-slate-400 font-medium">Subnet Utility Dashboard</p>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-200 rounded-lg"
              aria-label="Close Mobile Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Core Navigation
            </div>
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 group text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/15 to-blue-600/15 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`} />
                    <div>
                      <div className="text-sm">{item.label}</div>
                      <div className="text-[11px] text-slate-500 font-normal group-hover:text-slate-400">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Info Card */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 text-cyan-400 font-medium mb-1">
            <Boxes className="w-4 h-4" />
            <span>Educational Tool</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            IPv4 & CIDR Calculator designed for Computer Networks students & engineers.
          </p>
        </div>
      </aside>
    </>
  );
};
