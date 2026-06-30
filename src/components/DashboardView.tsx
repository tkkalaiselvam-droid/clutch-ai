import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Zap,
  FileText,
  ShieldAlert,
  CheckCircle2,
  Repeat,
  Circle,
  Timer,
  Flame,
  UploadCloud,
} from 'lucide-react';
import type { Crisis } from '../types';
import { crises } from '../data/mockData';
import VoiceTerminal from './VoiceTerminal';

interface DashboardViewProps {
  onTriggerRescue: (crisis: Crisis) => void;
  onOpenDocs: (crisis: Crisis) => void;
  onCrunchToast: (id: string | null) => void;
  onAutoSubmitLog: (id: string | null) => void;
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

function PanicDial({ score }: { score: number }) {
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

function CrisisQueue({
  crises,
  onTriggerRescue,
  onOpenDocs,
  onCrunchToast,
  onAutoSubmitLog,
}: {
  crises: Crisis[];
  onTriggerRescue: (c: Crisis) => void;
  onOpenDocs: (c: Crisis) => void;
  onCrunchToast: (id: string | null) => void;
  onAutoSubmitLog: (id: string | null) => void;
}) {
  const [autopilotStates, setAutopilotStates] = useState<Record<string, boolean>>({});
  const [countdowns, setCountdowns] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    for (const c of crises) map[c.id] = c.dueInMinutes * 60;
    return map;
  });
  const [crunchFired, setCrunchFired] = useState<Set<string>>(new Set());
  const [autoFired, setAutoFired] = useState<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns((prev) => {
        const next: Record<string, number> = {};
        for (const id of Object.keys(prev)) {
          next[id] = Math.max(0, prev[id] - 1);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    for (const c of crises) {
      const secs = countdowns[c.id] ?? 0;
      if (secs <= 3600 && secs > 0 && !crunchFired.has(c.id)) {
        setCrunchFired((prev) => new Set(prev).add(c.id));
        onCrunchToast(c.id);
      }
      if (
        secs <= 600 &&
        secs > 0 &&
        autopilotStates[c.id] &&
        !autoFired.has(c.id)
      ) {
        setAutoFired((prev) => new Set(prev).add(c.id));
        onAutoSubmitLog(c.id);
      }
    }
  }, [countdowns, crises, crunchFired, autoFired, autopilotStates, onCrunchToast, onAutoSubmitLog]);

  const toggleAutopilot = (id: string) => {
    setAutopilotStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
    return `${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="glass-panel p-5 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-1">
        <ShieldAlert className="w-5 h-5 text-crimson-400" />
        <h2 className="text-sm font-semibold text-slate-200 tracking-wide">Active Crisis Queue</h2>
        <span className="ml-auto text-xs text-slate-500">{crises.length} items</span>
      </div>
      <p className="text-[10px] text-slate-500 mb-4 uppercase tracking-wider font-medium">
        HIGH URGENCY TASKS — Immediate action required
      </p>

      <div className="space-y-3 overflow-y-auto flex-1">
        {crises.map((crisis) => {
          const secs = countdowns[crisis.id] ?? 0;
          const isUnder10 = secs <= 600 && secs > 0;
          const isUnder60 = secs <= 3600 && secs > 0;
          const autopilotOn = !!autopilotStates[crisis.id];

          return (
            <div
              key={crisis.id}
              className={`group rounded-xl p-4 transition-all duration-200 ${
                isUnder10 && autopilotOn
                  ? 'border-2 border-crimson-500/60 bg-crimson-500/5 animate-pulse'
                  : isUnder60
                  ? 'border border-amber-500/40 bg-amber-500/5'
                  : 'border border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <UrgencyBadge urgency={crisis.urgency} />
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                    {crisis.category}
                  </span>
                </div>
                <div className={`flex items-center gap-1 text-xs font-mono ${isUnder10 ? 'text-crimson-400' : isUnder60 ? 'text-amber-400' : 'text-slate-400'}`}>
                  <Timer className="w-3 h-3" />
                  <span>{formatTime(secs)}</span>
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

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => onTriggerRescue(crisis)}
                  className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 bg-crimson-600/20 hover:bg-crimson-600/30 text-crimson-400 border border-crimson-500/30 rounded-lg py-2 text-xs font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Trigger Agent Rescue
                </button>

                <button
                  onClick={() => onOpenDocs(crisis)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border bg-slate-800/60 text-slate-300 border-slate-700 hover:border-slate-600 hover:text-slate-100"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  Docs
                </button>

                <button
                  onClick={() => toggleAutopilot(crisis.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${
                    autopilotOn
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {autopilotOn ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  )}
                  {autopilotOn ? 'Autopilot ON' : 'Autopilot'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HabitChain() {
  const [habits, setHabits] = useState([
    { id: 'h1', name: 'Code Review', completed: true, streak: 12, linkedTo: 'Client Bug Hotfix', mitigation: 15 },
    { id: 'h2', name: 'LeetCode', completed: false, streak: 8, linkedTo: 'System Architecture', mitigation: 15 },
    { id: 'h3', name: 'Invoice Clear', completed: false, streak: 3, linkedTo: 'Cloud Infra Payment', mitigation: 15 },
    { id: 'h4', name: 'Pitch Rehearsal', completed: true, streak: 5, linkedTo: 'Fintech Pitch Deck', mitigation: 15 },
  ]);

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  };

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center gap-2 mb-1">
        <Repeat className="w-5 h-5 text-emerald-400" />
        <h2 className="text-sm font-semibold text-slate-200 tracking-wide">Habit-Chain Sync</h2>
      </div>
      <p className="text-[10px] text-slate-500 mb-4 uppercase tracking-wider font-medium">
        Daily micro-habits linked to macro deadlines
      </p>
      <div className="space-y-2">
        {habits.map((habit) => (
          <button
            key={habit.id}
            onClick={() => toggleHabit(habit.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-200 text-left ${
              habit.completed
                ? 'border-emerald-500/30 bg-emerald-500/5'
                : 'border-slate-800 bg-slate-900/30 hover:border-slate-700'
            }`}
          >
            {habit.completed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-slate-600 shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className={`text-xs font-medium truncate ${habit.completed ? 'text-emerald-300' : 'text-slate-300'}`}>
                  {habit.name}
                </p>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold ml-2 shrink-0">
                  <Flame className="w-3 h-3" />
                  +{habit.mitigation}% mitigation
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">
                {habit.streak}d streak → {habit.linkedTo}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DashboardView({
  onTriggerRescue,
  onOpenDocs,
  onCrunchToast,
  onAutoSubmitLog,
}: DashboardViewProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-5">
          <PanicDial score={78} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="min-h-0">
              <CrisisQueue
                crises={crises}
                onTriggerRescue={onTriggerRescue}
                onOpenDocs={onOpenDocs}
                onCrunchToast={onCrunchToast}
                onAutoSubmitLog={onAutoSubmitLog}
              />
            </div>
            <div className="space-y-5">
              <HabitChain />
              <VoiceTerminal />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
