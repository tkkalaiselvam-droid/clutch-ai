import { useState } from 'react';
import {
  LayoutDashboard,
  Bot,
  CalendarDays,
  ShieldAlert,
  Settings,
  Mic,
  CheckCircle2,
  Circle,
  Repeat,
  Zap,
} from 'lucide-react';
import type { TabId } from '../App';
import type { Habit } from '../types';

const navItems: { icon: typeof LayoutDashboard; label: string; tab: TabId }[] = [
  { icon: LayoutDashboard, label: 'Dashboard', tab: 'dashboard' },
  { icon: Bot, label: 'Agentic Workspace', tab: 'workspace' },
  { icon: CalendarDays, label: 'Calendar & Mail Hub', tab: 'calendar' },
  { icon: ShieldAlert, label: 'Autopilot Rules', tab: 'autopilot' },
  { icon: Settings, label: 'Live API Config', tab: 'api' },
];

const initialHabits: Habit[] = [
  { id: 'h1', name: 'Code Review', completed: true, streak: 12, linkedTo: 'Client Bug Hotfix' },
  { id: 'h2', name: 'LeetCode', completed: false, streak: 8, linkedTo: 'System Architecture' },
  { id: 'h3', name: 'Invoice Clear', completed: false, streak: 3, linkedTo: 'Cloud Infra Payment' },
  { id: 'h4', name: 'Pitch Rehearsal', completed: true, streak: 5, linkedTo: 'Fintech Pitch Deck' },
];

function WaveformBars({ active }: { active: boolean }) {
  const bars = Array.from({ length: 12 });
  return (
    <div className="flex items-end justify-center gap-[3px] h-10">
      {bars.map((_, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full animate-waveform ${active ? 'bg-emerald-400' : 'bg-slate-600'}`}
          style={{
            animationDelay: `${i * 0.08}s`,
            height: `${20 + Math.random() * 60}%`,
          }}
        />
      ))}
    </div>
  );
}

interface SidebarProps {
  currentTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function Sidebar({ currentTab, onTabChange }: SidebarProps) {
  const [habits, setHabits] = useState(initialHabits);
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceResponse, setVoiceResponse] = useState('');
  const [showResponse, setShowResponse] = useState(false);

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  };

  const handleVoiceCommand = (_cmd: string) => {
    setVoiceActive(true);
    setShowResponse(false);
    setTimeout(() => {
      setVoiceResponse(
        'ALERT: Your Fintech Pitch Deck is due in less than 45 minutes. Scaffold Agent has already drafted 90% of the slide structure. Check your Agentic Workspace immediately.'
      );
      setShowResponse(true);
    }, 1200);
  };

  return (
    <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col h-screen shrink-0">
      {/* Brand Header */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Zap className="w-6 h-6 text-emerald-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide text-slate-100">
              ClutchAI <span className="text-slate-500 font-normal">v1.0</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-slow" />
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">
                Agentic Mode
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.tab;
            return (
              <button
                key={item.label}
                onClick={() => onTabChange(item.tab)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-800/80 text-emerald-400 font-medium'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Voice Terminal Widget */}
        <div className="mt-6">
          <div className="flex items-center gap-2 px-3 mb-2">
            <Mic className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Voice Terminal
            </span>
          </div>
          <div
            className={`mx-3 rounded-xl border p-4 transition-all duration-300 ${
              voiceActive
                ? 'border-emerald-500/40 bg-emerald-500/5'
                : 'border-slate-800 bg-slate-900/50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400">
                {voiceActive ? 'Processing...' : 'Standby'}
              </span>
              <button
                onClick={() => {
                  setVoiceActive(!voiceActive);
                  if (voiceActive) {
                    setShowResponse(false);
                  }
                }}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  voiceActive
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            </div>
            <WaveformBars active={voiceActive} />

            {/* Quick Commands */}
            <div className="mt-3 space-y-1.5">
              <button
                onClick={() => handleVoiceCommand('What is my highest risk today?')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-800/40 border border-slate-800 hover:border-slate-600 text-[10px] text-slate-400 hover:text-slate-200 transition-all"
              >
                Ask: What is my highest risk today?
              </button>
              <button
                onClick={() => handleVoiceCommand('Queue fintech deck to priority alpha')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-800/40 border border-slate-800 hover:border-slate-600 text-[10px] text-slate-400 hover:text-slate-200 transition-all"
              >
                Queue fintech deck to priority alpha
              </button>
            </div>

            {/* Clutch Response */}
            {showResponse && (
              <div className="mt-3 animate-fade-in">
                <div className="bg-slate-950/60 rounded-lg p-3 border border-amber-500/20">
                  <p className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold mb-1">
                    Clutch Response
                  </p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {voiceResponse}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Habit-Chain Sync */}
        <div className="mt-6">
          <div className="flex items-center gap-2 px-3 mb-2">
            <Repeat className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Habit-Chain Sync
            </span>
          </div>
          <div className="mx-3 space-y-2">
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
                    <p
                      className={`text-xs font-medium truncate ${
                        habit.completed ? 'text-emerald-300' : 'text-slate-300'
                      }`}
                    >
                      {habit.name}
                    </p>
                    <span className="text-[10px] text-emerald-400 font-semibold ml-2">
                      +15% mitigation
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
      </nav>
    </aside>
  );
}
