import React from 'react';
import { useApp } from '../../context/AppContext';
import { useSimulation } from '../../context/SimulationContext';
import { ShieldCheck, X, Download, FileText } from 'lucide-react';

export const AuditLogModal: React.FC = () => {
  const { isAuditLogOpen, setIsAuditLogOpen } = useApp();
  const { auditLog, showToast } = useSimulation();

  if (!isAuditLogOpen) return null;

  const handleExport = () => {
    showToast('Audit log exported to CSV successfully.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-surface border border-border rounded shadow-popover w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-subtle/60">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-brand" />
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
              Governance & Operational Audit Ledger
            </h2>
          </div>
          <button
            onClick={() => setIsAuditLogOpen(false)}
            className="text-text-muted hover:text-text-primary p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 text-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="text-text-secondary">
              Chronological ledger of human operational decisions, parameter adjustments, and approval timestamps.
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1 bg-surface border border-border rounded text-text-primary hover:bg-subtle text-xs transition-colors font-mono"
            >
              <Download className="w-3.5 h-3.5 text-text-muted" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-border rounded">
            <table className="w-full text-left font-mono text-[11px]">
              <thead className="bg-subtle border-b border-border text-text-secondary">
                <tr>
                  <th className="p-2.5">ID</th>
                  <th className="p-2.5">Timestamp</th>
                  <th className="p-2.5">User / Role</th>
                  <th className="p-2.5">Action Ref</th>
                  <th className="p-2.5">Decision</th>
                  <th className="p-2.5">Recorded Impact</th>
                  <th className="p-2.5">Model Version</th>
                  <th className="p-2.5">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {auditLog.map(log => (
                  <tr key={log.id} className="hover:bg-subtle/50">
                    <td className="p-2.5 text-text-muted">{log.id}</td>
                    <td className="p-2.5">{log.timestamp}</td>
                    <td className="p-2.5 font-sans">
                      <span className="font-semibold text-text-primary">{log.user}</span>
                      <span className="text-[10px] text-text-muted block font-mono">{log.role}</span>
                    </td>
                    <td className="p-2.5 font-bold text-text-primary">{log.action_id}</td>
                    <td className="p-2.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                          log.decision === 'Accepted'
                            ? 'bg-success/10 text-success border-success/30'
                            : log.decision === 'Modified'
                            ? 'bg-brand/10 text-brand border-brand/30'
                            : 'bg-danger/10 text-danger border-danger/30'
                        }`}
                      >
                        {log.decision}
                      </span>
                    </td>
                    <td className="p-2.5 font-semibold text-text-primary">{log.impact_recorded}</td>
                    <td className="p-2.5 text-[10px] text-text-muted">{log.model_version}</td>
                    <td className="p-2.5 font-sans text-text-secondary max-w-[200px] truncate">
                      {log.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-border bg-subtle/50 flex items-center justify-between">
          <span className="text-[11px] font-mono text-text-muted">
            All records cryptographically signed with MOIL Enterprise Directory
          </span>
          <button
            onClick={() => setIsAuditLogOpen(false)}
            className="px-4 py-1.5 bg-brand hover:bg-brand-dark text-white rounded text-xs font-medium transition-colors"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
};
