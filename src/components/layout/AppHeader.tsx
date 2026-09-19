import React, { useState, useRef, useEffect } from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import { useSimulation } from '../../context/SimulationContext';
import { MINES_DATA } from '../../data/minesData';
import { 
  Compass, 
  TrendingUp, 
  CheckSquare, 
  Sliders, 
  Database, 
  FileText, 
  Sun, 
  Moon, 
  ChevronDown,
  Activity
} from 'lucide-react';

export const AppHeader: React.FC = () => {
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

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMineDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMineDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const pendingActionsCount = actions.filter(a => a.status === 'Pending').length;
  const isSimulating = Math.abs(simulationDeltaKt) > 0.1;

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'explore', label: 'Explore (GIS Map)', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'production', label: 'Production', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'actions', label: 'Actions', icon: <CheckSquare className="w-3.5 h-3.5" />, badge: pendingActionsCount },
  ];

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-border shadow-subtle select-none">
      <div className="flex items-center justify-between px-4 h-13 max-w-[1600px] mx-auto">
        {/* Brand & Mine Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-brand font-bold text-base tracking-tight flex items-center gap-1.5">
              <span className="text-sm">▲</span> MOIL DSS
            </span>
            <span className="text-[10px] font-mono uppercase text-text-muted bg-subtle px-1.5 py-0.5 rounded border border-border">
              MineIntel
            </span>
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* Mine Selector Dropdown with Outside Click dismissal */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMineDropdownOpen(!mineDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-text-primary bg-subtle hover:bg-border/60 rounded border border-border transition-colors font-sans"
              aria-expanded={mineDropdownOpen}
            >
              <span className="text-text-muted">Mine:</span>
              <span className="font-semibold text-text-primary">{selectedMine.name}</span>
              <ChevronDown className="w-3 h-3 text-text-muted" />
            </button>

            {mineDropdownOpen && (
              <div 
                className="absolute left-0 mt-1 w-60 bg-surface border border-border rounded shadow-popover py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-3 py-1 text-[10px] font-semibold text-text-muted uppercase tracking-wider border-b border-border/60">
                  Select MOIL Deposit
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

        {/* Global Workspaces Tabs */}
        <nav className="flex items-center gap-1 bg-subtle p-0.5 rounded border border-border">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMineDropdownOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all ${
                  isActive
                    ? 'bg-surface text-brand font-semibold shadow-subtle border border-border/80'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface/40'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold bg-danger text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Tools & User Info */}
        <div className="flex items-center gap-2">
          {/* What-If Simulator Trigger */}
          <button
            onClick={() => {
              setIsWhatIfOpen(true);
              setMineDropdownOpen(false);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border transition-colors ${
              isSimulating
                ? 'bg-warning/10 border-warning text-warning'
                : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:bg-subtle'
            }`}
            title="Open What-If Operational Simulator"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden md:inline">What-If</span>
            {isSimulating && (
              <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
            )}
          </button>

          {/* Audit Log Trigger */}
          <button
            onClick={() => {
              setIsAuditLogOpen(true);
              setMineDropdownOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-subtle rounded transition-colors"
            title="Audit Record & Decision History"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Audit ({auditLog.length})</span>
          </button>

          {/* Data & Methodology Trigger */}
          <button
            onClick={() => {
              setIsMethodologyOpen(true);
              setMineDropdownOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-subtle rounded transition-colors"
            title="Inspect Data Models & Provenance"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Data & Schema</span>
          </button>

          <div className="h-4 w-px bg-border mx-0.5" />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 text-text-secondary hover:text-text-primary bg-surface border border-border rounded transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-warning" />}
          </button>

          {/* User Badge */}
          <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-border">
            <div className="w-6 h-6 rounded bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-bold text-[11px] font-mono">
              SK
            </div>
            <div className="text-left leading-tight">
              <div className="text-xs font-medium text-text-primary">S. K. Mukherjee</div>
              <div className="text-[10px] text-text-muted font-mono">Mine Manager</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
