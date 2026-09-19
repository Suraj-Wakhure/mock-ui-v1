import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, hideToast } = useSimulation();

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />,
    warning: <AlertCircle className="w-4 h-4 text-warning flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-brand flex-shrink-0" />
  };

  const borderColors = {
    success: 'border-success/30',
    warning: 'border-warning/30',
    info: 'border-brand/30'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-3 bg-surface border ${borderColors[toastMessage.type]} rounded shadow-popover text-sm text-primary max-w-md`}
      >
        {icons[toastMessage.type]}
        <span className="flex-1 font-medium">{toastMessage.text}</span>
        <button
          onClick={hideToast}
          className="text-text-muted hover:text-text-primary p-1 rounded transition-colors"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
