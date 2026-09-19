import React from 'react';
import { Wrench, CloudRain, Clock, Layers } from 'lucide-react';

export const RiskDriversCard: React.FC = () => {
  const drivers = [
    {
      name: 'Equipment Availability & Downtime',
      severity: 'High',
      color: 'text-danger',
      barColor: 'bg-danger',
      icon: <Wrench className="w-3.5 h-3.5 text-copper" />,
      score: 84,
      detail: 'EXC-01 hydraulic cylinder seal leak (8.5h) & TRK-07 retarder brake limit (10h).'
    },
    {
      name: 'IMD Satellite Rainfall Disruption',
      severity: 'Medium',
      color: 'text-warning',
      barColor: 'bg-warning',
      icon: <CloudRain className="w-3.5 h-3.5 text-info" />,
      score: 62,
      detail: '16.5 mm precipitation recorded. IMD radar predicts 35mm depression within 48 hours.'
    },
    {
      name: 'Blasting Cycle & Misfire Protocol',
      severity: 'Medium',
      color: 'text-warning',
      barColor: 'bg-warning',
      icon: <Clock className="w-3.5 h-3.5 text-text-secondary" />,
      score: 55,
      detail: 'Panel 4B stope loading suspended 4.5h due to DGMS safety inspection protocol.'
    },
    {
      name: 'Accessible Ore & Head Grade Dilution',
      severity: 'Low',
      color: 'text-success',
      barColor: 'bg-success',
      icon: <Layers className="w-3.5 h-3.5 text-brand" />,
      score: 30,
      detail: 'Active extraction stope encountering 42.6% Mn due to footwall quartzite contact.'
    }
  ];

  return (
    <div className="bg-surface border border-border rounded shadow-subtle p-3.5 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
            Shortfall Risk Drivers
          </h3>
          <p className="text-[11px] text-text-muted">Factor attribution modeled by XGBoost Classifier</p>
        </div>
        <span className="text-[10px] font-mono text-text-muted">Model: GeoProd-v1.2</span>
      </div>

      <div className="space-y-3">
        {drivers.map((d, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-medium text-text-primary">
                {d.icon}
                <span>{d.name}</span>
              </div>
              <span className={`text-[10px] font-mono font-bold ${d.color}`}>
                {d.severity.toUpperCase()} ({d.score}%)
              </span>
            </div>
            <div className="h-1.5 w-full bg-subtle rounded-full overflow-hidden border border-border/40">
              <div
                className={`h-full rounded-full transition-all duration-300 ${d.barColor}`}
                style={{ width: `${d.score}%` }}
              />
            </div>
            <div className="text-[11px] text-text-secondary leading-tight">
              {d.detail}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
