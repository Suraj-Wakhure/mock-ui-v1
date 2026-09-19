import React, { useState, useRef, useEffect } from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import { useSimulation } from '../../context/SimulationContext';
import { MINES_DATA } from '../../data/minesData';
import { 
  Compass, 
  TrendingUp, 
  CheckSquare, 
  Activity, 
  Sliders, 
  Database, 
  FileText, 
  Sun, 
  Moon, 
  ChevronDown,
  Layers,
  ShieldCheck,
  Building2,
  Cpu
} from 'lucide-react';

export const AppSidebar: React.FC = () => {
  const { 
    selectedMine, 
    setSelectedMine, 
    activeTab, 
    setActiveTab, 
    theme, 
    toggleTheme,
    setIsMethodologyOpen,
    setIsWhatIfOpen,
    setIsAuditLogOpen
  } = useApp();

  const { actions, auditLog, simulationDeltaKt } = useSimulation();
  const [mineDropdownOpen, setMineDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMineDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pendingActionsCount = actions.filter(a => a.status === 'Pending').length;
  const isSimulating = Math.abs(simulationDeltaKt) > 0.1;

  const workspaces: { id: NavTab; label: string; icon: React.ReactNode; badge?: string; badgeColor?: string }[] = [
    { 
      id: 'explore', 
      label: 'Exploration GIS', 
      icon: <Compass className="w-4 h-4" />,
      badge: '8 Zones',
      badgeColor: 'bg-[#9333EA]/15 text-[#9333EA] border-[#9333EA]/30'
    },
    { 
      id: 'production', 
      label: 'Production Forecast', 
      icon: <TrendingUp className="w-4 h-4" /> 
    },
    { 
      id: 'actions', 
      label: 'Corrective Actions', 
      icon: <CheckSquare className="w-4 h-4" />,
      badge: pendingActionsCount > 0 ? `${pendingActionsCount} Review` : undefined,
      badgeColor: 'bg-danger/15 text-danger border-danger/30'
    },
    { 
      id: 'overview', 
      label: 'Executive Cockpit', 
      icon: <Activity className="w-4 h-4" /> 
    },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col justify-between flex-shrink-0 select-none z-30 shadow-subtle">
      {/* Brand Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-brand text-white flex items-center justify-center font-bold text-sm shadow-xs">
              ▲
            </div>
            <div>
              <div className="font-bold text-sm leading-none tracking-tight text-text-primary">
                MOIL DSS
              </div>
              <div className="text-[10px] text-brand font-medium tracking-wide mt-0.5">
                MineIntel Platform
              </div>
            </div>
          </div>
          <span className="flex h-2 w-2 relative" title="Inference Service Online">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
          </span>
        </div>

        {/* Deposit Selector Card */}
        <div className="mt-3.5 relative" ref={dropdownRef}>
          <button
            onClick={() => setMineDropdownOpen(!mineDropdownOpen)}
            className="w-full text-left p-2.5 bg-subtle hover:bg-border/60 border border-border rounded transition-colors flex items-center justify-between group"
          >
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase font-semibold text-text-muted flex items-center gap-1">
                <Building2 className="w-3 h-3 text-text-muted" />
                <span>Active Property</span>
              </div>
              <div className="font-bold text-xs text-text-primary truncate mt-0.5">
                {selectedMine.name}
              </div>
              <div className="text-[11px] text-text-secondary truncate font-normal">
                {selectedMine.state} · {selectedMine.type}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-text-muted group-hover:text-text-primary transition-colors ml-1.5 flex-shrink-0" />
          </button>

          {/* Mine Selector Dropdown */}
          {mineDropdownOpen && (
            <div className="absolute left-0 top-full mt-1 w-full bg-surface border border-border rounded shadow-popover py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1 text-[10px] font-semibold text-text-muted uppercase tracking-wider border-b border-border/60">
                Switch Property
              </div>
              {MINES_DATA.map(mine => (
                <button
                  key={mine.id}
                  onClick={() => {
                    setSelectedMine(mine);
                    setMineDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex flex-col transition-colors ${
                    selectedMine.id === mine.id 
                      ? 'bg-brand/10 text-brand font-semibold' 
                      : 'text-text-primary hover:bg-subtle'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{mine.name}</span>
                    <span className="text-[10px] text-text-muted font-mono">{mine.type}</span>
                  </div>
                  <span className="text-[10px] text-text-muted">{mine.state} · Target: {mine.productionTargetMonthlyKt} kt</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="p-3 space-y-5 overflow-y-auto flex-1">
        {/* Section 1: Workspaces */}
        <div>
          <div className="px-2.5 pb-2 text-[10px] font-semibold text-text-muted uppercase tracking-wider">
            Decision Workspaces
          </div>
          <div className="space-y-1">
            {workspaces.map(ws => {
              const isActive = activeTab === ws.id;
              return (
                <button
                  key={ws.id}
                  onClick={() => setActiveTab(ws.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded transition-all ${
                    isActive
                      ? 'bg-brand text-white font-semibold shadow-xs'
                      : 'text-text-secondary hover:text-text-primary hover:bg-subtle'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-white' : 'text-text-muted'}>
                      {ws.icon}
                    </span>
                    <span>{ws.label}</span>
                  </div>
                  {ws.badge && (
                    <span
                      className={`px-1.5 py-0.2 text-[10px] font-mono font-bold rounded border ${
                        isActive
                          ? 'bg-white/20 text-white border-white/30'
                          : ws.badgeColor
                      }`}
                    >
                      {ws.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Prescriptive & Simulation Tools */}
        <div>
          <div className="px-2.5 pb-2 text-[10px] font-semibold text-text-muted uppercase tracking-wider">
            Analytics & Simulation
          </div>
          <div className="space-y-1">
            {/* What-If Simulator */}
            <button
              onClick={() => setIsWhatIfOpen(true)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded border transition-colors ${
                isSimulating
                  ? 'bg-warning/10 border-warning text-warning font-semibold'
                  : 'bg-surface border-transparent text-text-secondary hover:text-text-primary hover:bg-subtle'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-copper" />
                <span>What-If Simulator</span>
              </div>
              {isSimulating && (
                <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
              )}
            </button>

            {/* Audit Log */}
            <button
              onClick={() => setIsAuditLogOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded text-text-secondary hover:text-text-primary hover:bg-subtle transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-text-muted" />
                <span>Audit & Decision Trail</span>
              </div>
              <span className="text-[11px] font-semibold text-text-muted bg-subtle px-1.5 py-0.5 rounded border border-border">
                {auditLog.length}
              </span>
            </button>

            {/* Data & Methodology */}
            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded text-text-secondary hover:text-text-primary hover:bg-subtle transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-text-muted" />
                <span>Data Architecture</span>
              </div>
              <span className="text-[11px] font-medium text-brand">5 CSVs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Footer: User profile & Theme Toggle */}
      <div className="p-3 border-t border-border bg-subtle/40 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center text-brand font-bold text-xs flex-shrink-0">
              SK
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-text-primary truncate">
                S. K. Mukherjee
              </div>
              <div className="text-[11px] text-text-muted truncate">
                Mine Manager · Level 1
              </div>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="p-1.5 text-text-secondary hover:text-text-primary bg-surface border border-border rounded transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-warning" />}
          </button>
        </div>

        <div className="text-[10px] text-text-muted flex justify-between pt-1 border-t border-border/60">
          <span>SIH 2026 · PS 26009</span>
          <span className="text-success font-medium">v1.2.4</span>
        </div>
      </div>
    </aside>
  );
};
