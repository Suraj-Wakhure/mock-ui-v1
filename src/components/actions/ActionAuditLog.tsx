import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { ShieldCheck, ArrowUpDown, FileSpreadsheet } from 'lucide-react';

export const ActionAuditLog: React.FC = () => {
  const { auditLog } = useSimulation();

  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden font-sans">
      <div className="flex items-center justify-between px-4 py-2.5 bg-subtle/50 border-b border-border text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand" />
          <span className="font-semibold text-text-primary text-xs">
            Human Approval Audit Trail & Decision History
          </span>
          <span className="text-[11px] text-text-muted">
            ({auditLog.length} permanent records)
          </span>
        </div>
        <span className="text-[11px] text-text-secondary">
          ISO 14001 / DGMS Compliance Log
        </span>
      </div>

      <div className="overflow-x-auto max-h-60 overflow-y-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-subtle/40 text-[11px] font-semibold text-text-secondary border-b border-border/70 sticky top-0">
            <tr>
              <th className="py-2 px-3">Timestamp</th>
              <th className="py-2 px-3">Decision Maker</th>
              <th className="py-2 px-3">Action Ref</th>
              <th className="py-2 px-3">Recommendation</th>
              <th className="py-2 px-3">Decision</th>
              <th className="py-2 px-3 text-right">Recorded Impact</th>
              <th className="py-2 px-3">Model Ref</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {auditLog.map(record => (
              <tr key={record.id} className="hover:bg-subtle/40 transition-colors">
                <td className="py-2 px-3 text-text-muted text-[11px]">
                  {record.timestamp}
                </td>
                <td className="py-2 px-3 text-text-primary">
                  <div className="font-medium leading-none">{record.user}</div>
                  <div className="text-[10px] text-text-muted mt-0.5">{record.role}</div>
                </td>
                <td className="py-2 px-3 font-semibold text-text-primary">
                  {record.action_id}
                </td>
                <td className="py-2 px-3 text-text-secondary max-w-[280px] truncate">
                  {record.action_title}
                  {record.notes && (
                    <div className="text-[10px] text-brand italic mt-0.5">{record.notes}</div>
                  )}
                </td>
                <td className="py-2 px-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      record.decision === 'Accepted'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : record.decision === 'Modified'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {record.decision}
                  </span>
                </td>
                <td className="py-2 px-3 font-semibold text-emerald-600 text-right">
                  {record.impact_recorded}
                </td>
                <td className="py-2 px-3 text-[11px] text-text-muted">
                  {record.model_version}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
