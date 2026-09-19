import React, { createContext, useContext, useState, useMemo } from 'react';
import { CorrectiveAction, SimulationParameters, AuditRecord } from '../types';
import { INITIAL_ACTIONS } from '../data/correctiveActionsData';

interface SimulationContextType {
  params: SimulationParameters;
  updateParams: (newParams: Partial<SimulationParameters>) => void;
  resetParams: () => void;
  actions: CorrectiveAction[];
  auditLog: AuditRecord[];
  acceptAction: (id: string, notes?: string) => void;
  modifyAction: (id: string, notes: string, adjustedImpactKt: number) => void;
  rejectAction: (id: string, reason: string) => void;
  toastMessage: { text: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  hideToast: () => void;
  // Computed dynamic values
  targetKt: number;
  baseForecastKt: number;
  mitigatedGainKt: number;
  simulationDeltaKt: number;
  effectiveForecastKt: number;
  netGapKt: number;
  shortfallRiskPct: number;
  riskStatus: 'On Track' | 'Watch' | 'At Risk' | 'Shortfall';
}

const DEFAULT_PARAMS: SimulationParameters = {
  rainfall_mm: 16.5,
  downtime_hours_delta: 0,
  blasting_delay_hours: 4.5,
  fleet_availability_pct: 82.0,
};

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [params, setParams] = useState<SimulationParameters>(DEFAULT_PARAMS);
  const [actions, setActions] = useState<CorrectiveAction[]>(INITIAL_ACTIONS);
  const [auditLog, setAuditLog] = useState<AuditRecord[]>([
    {
      id: 'AUD-001',
      timestamp: '18 Sep 2026, 17:45 IST',
      user: 'P. Verma (Sr. Mining Engr)',
      role: 'Operations Planner',
      action_id: 'ACT-2026-088',
      action_title: 'Dewatering pump auxiliary line activation at Stope 4 sump',
      decision: 'Accepted',
      notes: 'Executed ahead of overnight rain forecast',
      model_version: 'GeoProd-Prescriptive v1.1',
      impact_recorded: '+3.5 kt protected'
    }
  ]);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const hideToast = () => setToastMessage(null);

  const updateParams = (newParams: Partial<SimulationParameters>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  const resetParams = () => {
    setParams(DEFAULT_PARAMS);
    showToast('Simulation parameters reset to current live mine state.', 'info');
  };

  const acceptAction = (id: string, notes?: string) => {
    const action = actions.find(a => a.id === id);
    if (!action) return;

    setActions(prev =>
      prev.map(a =>
        a.id === id
          ? {
              ...a,
              status: 'Accepted',
              decision_by: 'S. K. Mukherjee (Mine Manager)',
              decision_time: 'Just now',
              modification_notes: notes
            }
          : a
      )
    );

    const newRecord: AuditRecord = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      user: 'S. K. Mukherjee',
      role: 'Mine Manager',
      action_id: action.id,
      action_title: action.title,
      decision: 'Accepted',
      notes: notes || 'Standard advisory execution approved',
      model_version: action.model_version,
      impact_recorded: action.estimated_impact_tonnes
    };

    setAuditLog(prev => [newRecord, ...prev]);
    showToast(`Action ${action.id} accepted. Projected recovery: ${action.estimated_impact_tonnes}.`, 'success');
  };

  const modifyAction = (id: string, notes: string, adjustedImpactKt: number) => {
    const action = actions.find(a => a.id === id);
    if (!action) return;

    setActions(prev =>
      prev.map(a =>
        a.id === id
          ? {
              ...a,
              status: 'Modified',
              decision_by: 'S. K. Mukherjee (Mine Manager)',
              decision_time: 'Just now',
              impact_val_kt: adjustedImpactKt,
              estimated_impact_tonnes: `+${adjustedImpactKt.toFixed(1)} kt (Adjusted)`,
              modification_notes: notes
            }
          : a
      )
    );

    const newRecord: AuditRecord = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      user: 'S. K. Mukherjee',
      role: 'Mine Manager',
      action_id: action.id,
      action_title: action.title,
      decision: 'Modified',
      notes: `Adjusted plan: ${notes}`,
      model_version: action.model_version,
      impact_recorded: `+${adjustedImpactKt.toFixed(1)} kt (Modified)`
    };

    setAuditLog(prev => [newRecord, ...prev]);
    showToast(`Action ${action.id} modified. Parameters updated in dispatch.`, 'info');
  };

  const rejectAction = (id: string, reason: string) => {
    const action = actions.find(a => a.id === id);
    if (!action) return;

    setActions(prev =>
      prev.map(a =>
        a.id === id
          ? {
              ...a,
              status: 'Rejected',
              decision_by: 'S. K. Mukherjee (Mine Manager)',
              decision_time: 'Just now',
              modification_notes: reason
            }
          : a
      )
    );

    const newRecord: AuditRecord = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      user: 'S. K. Mukherjee',
      role: 'Mine Manager',
      action_id: action.id,
      action_title: action.title,
      decision: 'Rejected',
      notes: reason || 'Operationally impractical under current shift constraints',
      model_version: action.model_version,
      impact_recorded: '0 kt'
    };

    setAuditLog(prev => [newRecord, ...prev]);
    showToast(`Action ${action.id} rejected. Reason logged in audit history.`, 'warning');
  };

  // Calculations
  const targetKt = 300.0;
  const baseForecastKt = 276.0;

  // Sum of approved action gains
  const mitigatedGainKt = useMemo(() => {
    return actions
      .filter(a => a.status === 'Accepted' || a.status === 'Modified')
      .reduce((sum, a) => sum + a.impact_val_kt, 0);
  }, [actions]);

  // Delta based on what-if slider variations from baseline
  const simulationDeltaKt = useMemo(() => {
    // Rain penalty: -0.35 kt per mm above baseline 16.5mm
    const rainDelta = (params.rainfall_mm - 16.5) * -0.32;
    // Equipment downtime delta: -0.45 kt per hour
    const downtimeDelta = params.downtime_hours_delta * -0.42;
    // Blast delay delta: -0.6 kt per hour from baseline 4.5h
    const blastDelta = (params.blasting_delay_hours - 4.5) * -0.55;
    // Fleet availability: +0.7 kt per % above 82%
    const fleetDelta = (params.fleet_availability_pct - 82.0) * 0.65;

    return rainDelta + downtimeDelta + blastDelta + fleetDelta;
  }, [params]);

  const effectiveForecastKt = useMemo(() => {
    const val = baseForecastKt + simulationDeltaKt + mitigatedGainKt;
    return Math.max(180, Math.min(360, Math.round(val * 10) / 10));
  }, [baseForecastKt, simulationDeltaKt, mitigatedGainKt]);

  const netGapKt = useMemo(() => {
    return Math.round((effectiveForecastKt - targetKt) * 10) / 10;
  }, [effectiveForecastKt, targetKt]);

  const shortfallRiskPct = useMemo(() => {
    // Risk formula calibrated between 5% and 98% based on gap
    if (netGapKt >= 5) return 8;
    if (netGapKt >= 0) return 18;
    // Negative gap: shortfall risk scales with deficit
    const deficit = Math.abs(netGapKt);
    const risk = Math.min(96, Math.max(15, Math.round(25 + deficit * 1.95)));
    return risk;
  }, [netGapKt]);

  const riskStatus = useMemo<'On Track' | 'Watch' | 'At Risk' | 'Shortfall'>(() => {
    if (shortfallRiskPct < 25) return 'On Track';
    if (shortfallRiskPct < 50) return 'Watch';
    if (shortfallRiskPct < 75) return 'At Risk';
    return 'Shortfall';
  }, [shortfallRiskPct]);

  return (
    <SimulationContext.Provider
      value={{
        params,
        updateParams,
        resetParams,
        actions,
        auditLog,
        acceptAction,
        modifyAction,
        rejectAction,
        toastMessage,
        showToast,
        hideToast,
        targetKt,
        baseForecastKt,
        mitigatedGainKt,
        simulationDeltaKt,
        effectiveForecastKt,
        netGapKt,
        shortfallRiskPct,
        riskStatus
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
