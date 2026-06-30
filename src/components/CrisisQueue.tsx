import { useState } from 'react';
import {
  AlertTriangle,
  Zap,
  FileText,
  ShieldAlert,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import type { Crisis } from '../types';

interface CrisisQueueProps {
  crises: Crisis[];
  onTriggerRescue: (crisis: Crisis) => void;
}

function UrgencyBadge({ urgency }: { urgency: Crisis['urgency'] }) {
  const styles = {
    critical: 'bg-crimson-500/10 text-crimson-400 border-crimson-500/30',
    high: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    medium: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  };
  const labels = { critical: 'CRITICAL', high: 'HIGH', medium: 'MEDIUM' };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${styles[urgency]}`}>
      {labels[urgency]}
    </span>
  );
}

export default function CrisisQueue({ crises, onTriggerRescue }: CrisisQueueProps) {
  const [autopilotStates, setAutopilotStates] = useState<Record<string, boolean>>({});

  const toggleAutopilot = (id: string) => {
    setAutopilotStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="glass-panel p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="w-5 h-5 text-crimson-400" />
        <h2 className="text-sm font-semibold text-slate-200 tracking-wide">
          Active Crisis Queue
        </h2>
        <span className="ml-auto text-xs text-slate-500">{crises.length} items</span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {crises.map((crisis) => (
          <div
            key={crisis.id}
            className="group bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <UrgencyBadge urgency={crisis.urgency} />
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                  {crisis.category}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                <span>{crisis.dueInMinutes}m</span>
              </div>
            </div>

            <h3 className="text-sm font-medium text-slate-100 mb-1">{crisis.title}</h3>
            <p className="text-xs text-slate-400 mb-3 line-clamp-2">{crisis.description}</p>

            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[10px] text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded">
                {crisis.fileAttachment} attached
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onTriggerRescue(crisis)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-crimson-600/20 hover:bg-crimson-600/30 text-crimson-400 border border-crimson-500/30 rounded-lg py-2 text-xs font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Zap className="w-3.5 h-3.5" />
                Trigger Agent Rescue
              </button>

              <button
                onClick={() => toggleAutopilot(crisis.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${
                  autopilotStates[crisis.id]
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:border-slate-600'
                }`}
              >
                {autopilotStates[crisis.id] ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                {autopilotStates[crisis.id] ? 'Autopilot ON' : 'Autopilot'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
