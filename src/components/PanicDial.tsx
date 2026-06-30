import { AlertTriangle } from 'lucide-react';

interface PanicDialProps {
  score: number;
}

export default function PanicDial({ score }: PanicDialProps) {
  const clamped = Math.min(100, Math.max(0, score));
  const color =
    clamped >= 75 ? 'text-crimson-400' : clamped >= 40 ? 'text-amber-400' : 'text-emerald-400';
  const glow =
    clamped >= 75
      ? 'neon-border-crimson'
      : clamped >= 40
      ? 'neon-border-amber'
      : 'neon-border-emerald';

  return (
    <div className={`glass-panel p-6 ${glow}`}>
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className={`w-5 h-5 ${color}`} />
        <h2 className="text-sm font-semibold text-slate-200 tracking-wide">
          System Urgency Heatmap
        </h2>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative w-40 h-40 shrink-0">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-[135deg]">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#1e293b"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="235"
              strokeDashoffset="0"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={clamped >= 75 ? '#f87171' : clamped >= 40 ? '#fbbf24' : '#34d399'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="235"
              strokeDashoffset={235 - (clamped / 100) * 235}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${color}`}>{clamped}%</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
              Panic Index
            </span>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Critical</span>
            <div className="flex-1 mx-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-crimson-500 rounded-full"
                style={{ width: `${clamped}%` }}
              />
            </div>
            <span className={`font-semibold ${color}`}>{clamped}%</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-900/60 rounded-lg p-2 border border-slate-800">
              <p className="text-lg font-bold text-crimson-400">3</p>
              <p className="text-[10px] text-slate-500">Active Crises</p>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-2 border border-slate-800">
              <p className="text-lg font-bold text-amber-400">2</p>
              <p className="text-[10px] text-slate-500">Agents Running</p>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-2 border border-slate-800">
              <p className="text-lg font-bold text-emerald-400">1</p>
              <p className="text-[10px] text-slate-500">Resolved Today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
