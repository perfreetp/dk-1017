import { AlertTriangle, AlertCircle, X } from 'lucide-react';
import type { Warning } from '../../data/types';

interface WarningCardProps {
  warning: Warning;
  onDismiss?: (id: string) => void;
}

export default function WarningCard({ warning, onDismiss }: WarningCardProps) {
  const isAlert = warning.level === 'alert';
  
  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border-l-4 ${
      isAlert ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'
    }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isAlert ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
      }`}>
        {isAlert ? <AlertCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-1 rounded ${
            isAlert ? 'bg-red-200 text-red-700' : 'bg-yellow-200 text-yellow-700'
          }`}>
            {warning.type === 'crowd' ? '客流预警' : warning.type === 'queue' ? '排队预警' : '维护通知'}
          </span>
          <span className="text-sm font-medium text-slate-700">{warning.area}</span>
        </div>
        <p className="text-sm text-slate-600 mt-1">{warning.message}</p>
        <p className="text-xs text-slate-400 mt-1">{warning.timestamp}</p>
      </div>
      {onDismiss && (
        <button
          onClick={() => onDismiss(warning.id)}
          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-white rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}