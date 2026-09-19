import React from 'react';
import { PRODUCTION_OPERATIONS_DATA } from '../../data/productionOperationsData';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';

export const OverviewChart: React.FC = () => {
  const chartData = PRODUCTION_OPERATIONS_DATA.map(d => ({
    date: d.date.slice(5),
    fullDate: d.date,
    actual: d.actual_tonnes,
    planned: d.planned_tonnes,
    isShortfall: d.shortfall_flag === 1,
    rainfall: d.rainfall_mm,
    downtime: d.downtime_hours
  }));

  return (
    <div className="bg-surface border border-border rounded shadow-subtle p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-2 border-b border-border/70">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Daily Production vs Planned Target</h2>
          <p className="text-xs text-text-muted">Observed operational output over the last 30 days (tonnes/day)</p>
        </div>
        <div className="flex items-center gap-4 text-xs mt-2 sm:mt-0 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-brand" />
            <span className="text-text-secondary">Planned (3,200–3,300 t)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-brand/20 border border-brand rounded-sm" />
            <span className="text-text-secondary">Actual Production</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-danger" />
            <span className="text-text-secondary">Shortfall Deficit</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="actualGradientOverview" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--brand)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
            />
            <YAxis 
              domain={[2200, 3600]}
              tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
              tickFormatter={(val) => `${val}t`}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-surface border border-border p-2.5 rounded shadow-popover text-xs font-mono">
                      <div className="font-semibold text-text-primary pb-1 border-b border-border/60">
                        {data.fullDate}
                      </div>
                      <div className="mt-1 space-y-0.5">
                        <div className="flex justify-between gap-4">
                          <span className="text-text-secondary">Actual:</span>
                          <span className="font-semibold text-text-primary">{data.actual} t</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-text-secondary">Planned:</span>
                          <span className="text-text-muted">{data.planned} t</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-text-secondary">Variance:</span>
                          <span className={data.actual < data.planned ? 'text-danger font-semibold' : 'text-success'}>
                            {data.actual - data.planned > 0 ? `+${data.actual - data.planned}` : `${data.actual - data.planned}`} t
                          </span>
                        </div>
                        <div className="flex justify-between gap-4 text-[10px] text-text-muted pt-1 border-t border-border/40">
                          <span>Rainfall: {data.rainfall} mm</span>
                          <span>Downtime: {data.downtime} h</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine y={3200} stroke="var(--brand)" strokeDasharray="3 3" opacity={0.6} />
            <Area 
              type="monotone" 
              dataKey="actual" 
              stroke="var(--brand)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#actualGradientOverview)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
