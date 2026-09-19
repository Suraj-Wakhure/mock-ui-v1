import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

interface ProductionChartProps {
  simulationOffsetKt: number;
}

export const ProductionChart: React.FC<ProductionChartProps> = ({ simulationOffsetKt }) => {
  // Generate 15 historical points + 15 forward forecast points with P10/P50/P90 uncertainty fan
  const data = [
    // Historical Days (Tonnes)
    { day: '05 Sep', actual: 3310, planned: 3300, isForecast: false },
    { day: '06 Sep', actual: 2940, planned: 3300, isForecast: false },
    { day: '07 Sep', actual: 3260, planned: 3300, isForecast: false },
    { day: '08 Sep', actual: 3310, planned: 3300, isForecast: false },
    { day: '09 Sep', actual: 3290, planned: 3300, isForecast: false },
    { day: '10 Sep', actual: 3180, planned: 3300, isForecast: false },
    { day: '11 Sep', actual: 3040, planned: 3300, isForecast: false },
    { day: '12 Sep', actual: 2850, planned: 3300, isForecast: false },
    { day: '13 Sep', actual: 2720, planned: 3300, isForecast: false },
    { day: '14 Sep', actual: 2950, planned: 3300, isForecast: false },
    { day: '15 Sep', actual: 3100, planned: 3300, isForecast: false },
    { day: '16 Sep', actual: 3220, planned: 3300, isForecast: false },
    { day: '17 Sep', actual: 3050, planned: 3300, isForecast: false },
    { day: '18 Sep', actual: 2880, planned: 3300, isForecast: false },
    { day: '19 Sep (Today)', actual: 2740, planned: 3300, forecast: 2740, p10: 2740, p50: 2740, p90: 2740, isForecast: false },
    // Forward Forecast Days with dynamic simulation effect
    { day: '20 Sep', planned: 3300, forecast: Math.round(2780 + simulationOffsetKt * 30), p10: Math.round(2620 + simulationOffsetKt * 25), p50: Math.round(2780 + simulationOffsetKt * 30), p90: Math.round(2950 + simulationOffsetKt * 35), isForecast: true },
    { day: '21 Sep', planned: 3300, forecast: Math.round(2750 + simulationOffsetKt * 30), p10: Math.round(2570 + simulationOffsetKt * 25), p50: Math.round(2750 + simulationOffsetKt * 30), p90: Math.round(2940 + simulationOffsetKt * 35), isForecast: true },
    { day: '22 Sep', planned: 3300, forecast: Math.round(2820 + simulationOffsetKt * 30), p10: Math.round(2600 + simulationOffsetKt * 25), p50: Math.round(2820 + simulationOffsetKt * 30), p90: Math.round(3020 + simulationOffsetKt * 35), isForecast: true },
    { day: '23 Sep', planned: 3300, forecast: Math.round(2890 + simulationOffsetKt * 30), p10: Math.round(2650 + simulationOffsetKt * 25), p50: Math.round(2890 + simulationOffsetKt * 30), p90: Math.round(3110 + simulationOffsetKt * 35), isForecast: true },
    { day: '24 Sep', planned: 3300, forecast: Math.round(2920 + simulationOffsetKt * 30), p10: Math.round(2670 + simulationOffsetKt * 25), p50: Math.round(2920 + simulationOffsetKt * 30), p90: Math.round(3150 + simulationOffsetKt * 35), isForecast: true },
    { day: '25 Sep', planned: 3300, forecast: Math.round(2980 + simulationOffsetKt * 30), p10: Math.round(2710 + simulationOffsetKt * 25), p50: Math.round(2980 + simulationOffsetKt * 30), p90: Math.round(3230 + simulationOffsetKt * 35), isForecast: true },
    { day: '26 Sep', planned: 3300, forecast: Math.round(3020 + simulationOffsetKt * 30), p10: Math.round(2740 + simulationOffsetKt * 25), p50: Math.round(3020 + simulationOffsetKt * 30), p90: Math.round(3280 + simulationOffsetKt * 35), isForecast: true },
    { day: '27 Sep', planned: 3300, forecast: Math.round(3050 + simulationOffsetKt * 30), p10: Math.round(2760 + simulationOffsetKt * 25), p50: Math.round(3050 + simulationOffsetKt * 30), p90: Math.round(3320 + simulationOffsetKt * 35), isForecast: true },
    { day: '28 Sep', planned: 3300, forecast: Math.round(3080 + simulationOffsetKt * 30), p10: Math.round(2780 + simulationOffsetKt * 25), p50: Math.round(3080 + simulationOffsetKt * 30), p90: Math.round(3370 + simulationOffsetKt * 35), isForecast: true },
    { day: '29 Sep', planned: 3300, forecast: Math.round(3110 + simulationOffsetKt * 30), p10: Math.round(2790 + simulationOffsetKt * 25), p50: Math.round(3110 + simulationOffsetKt * 30), p90: Math.round(3410 + simulationOffsetKt * 35), isForecast: true },
    { day: '30 Sep', planned: 3300, forecast: Math.round(3140 + simulationOffsetKt * 30), p10: Math.round(2810 + simulationOffsetKt * 25), p50: Math.round(3140 + simulationOffsetKt * 30), p90: Math.round(3460 + simulationOffsetKt * 35), isForecast: true },
  ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
          <XAxis 
            dataKey="day" 
            tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
          />
          <YAxis 
            domain={[2400, 3600]}
            tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
            tickFormatter={(val) => `${val}t`}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-surface border border-border p-2.5 rounded shadow-popover text-xs font-mono">
                    <div className="font-semibold text-text-primary pb-1 border-b border-border/60">
                      {item.day}
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {item.actual !== undefined && (
                        <div className="flex justify-between gap-4">
                          <span className="text-text-secondary">Observed Actual:</span>
                          <span className="font-bold text-text-primary">{item.actual} t</span>
                        </div>
                      )}
                      <div className="flex justify-between gap-4">
                        <span className="text-text-secondary">Planned Plan:</span>
                        <span className="text-text-muted">{item.planned} t</span>
                      </div>
                      {item.forecast !== undefined && (
                        <>
                          <div className="flex justify-between gap-4 text-brand">
                            <span>Forecast (P50):</span>
                            <span className="font-bold">{item.forecast} t</span>
                          </div>
                          <div className="flex justify-between gap-4 text-[10px] text-text-muted pt-1 border-t border-border/40">
                            <span>Uncertainty Range:</span>
                            <span>P10: {item.p10}t · P90: {item.p90}t</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />

          <ReferenceLine x="19 Sep (Today)" stroke="var(--accent-copper)" strokeDasharray="3 3" label={{ value: 'TODAY', position: 'top', fill: 'var(--accent-copper)', fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
          <ReferenceLine y={3300} stroke="var(--text-muted)" strokeDasharray="4 4" opacity={0.7} />

          {/* Uncertainty Fan Band: P90 - P10 area */}
          <Area
            type="monotone"
            dataKey="p90"
            stroke="none"
            fill="var(--brand)"
            fillOpacity={0.12}
          />
          <Area
            type="monotone"
            dataKey="p10"
            stroke="none"
            fill="var(--bg-surface)"
            fillOpacity={1}
          />

          {/* Actual production line (Historical) */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="var(--text-primary)"
            strokeWidth={2}
            dot={{ r: 2.5, fill: 'var(--text-primary)' }}
            activeDot={{ r: 4 }}
          />

          {/* P50 Forecast line */}
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="var(--brand)"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 2.5, fill: 'var(--brand)' }}
            activeDot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
