import React, { createContext, useContext, useState, useEffect } from 'react';
import { Mine } from '../types';
import { MINES_DATA } from '../data/minesData';

export type NavTab = 'overview' | 'explore' | 'production' | 'actions';

interface AppContextType {
  selectedMine: Mine;
  setSelectedMine: (mine: Mine) => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  selectedTargetId: string | null;
  setSelectedTargetId: (id: string | null) => void;
  isMethodologyOpen: boolean;
  setIsMethodologyOpen: (open: boolean) => void;
  isWhatIfOpen: boolean;
  setIsWhatIfOpen: (open: boolean) => void;
  isAuditLogOpen: boolean;
  setIsAuditLogOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedMine, setSelectedMine] = useState<Mine>(MINES_DATA[0]);
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>('T-003');
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);
  const [isWhatIfOpen, setIsWhatIfOpen] = useState<boolean>(false);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <AppContext.Provider
      value={{
        selectedMine,
        setSelectedMine,
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        selectedTargetId,
        setSelectedTargetId,
        isMethodologyOpen,
        setIsMethodologyOpen,
        isWhatIfOpen,
        setIsWhatIfOpen,
        isAuditLogOpen,
        setIsAuditLogOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
