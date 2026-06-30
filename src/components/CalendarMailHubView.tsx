import { useState, useMemo } from 'react';
import {
  CalendarDays,
  Mail,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Zap,
  Inbox,
  Star,
  Paperclip,
  Clock,
  X,
  ShieldAlert,
  FileText,
  Bot,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import type { Crisis } from '../types';
import { crises } from '../data/mockData';

interface CalendarMailHubViewProps {
  onTriggerRescue: (crisis: Crisis) => void;
}

const crisisDeadlines: Record<string, { day: number; crisisId: string }> = {
  '22': { day: 22, crisisId: '1' },
  '25': { day: 25, crisisId: '2' },
  '29': { day: 29, crisisId: '3' },
};

const mockEmails = [
  {
    id: 'e1',
    sender: 'AWS Billing Team',
    subject: 'WARNING: Overdue AWS Billing Notification',
    preview: 'Your AWS account has an outstanding balance of $28,400. Service suspension in 24 hours.',
    time: '14:32',
    urgent: true,
  },
  {
    id: 'e2',
    sender: 'Certora Security',
    subject: 'URGENT: Smart Contract Audit Failure',
    preview: 'Critical re-entrancy vulnerability detected in withdrawAndDistribute(). Immediate patch required.',
    time: '13:15',
    urgent: true,
  },
  {
    id: 'e3',
    sender: 'NovaFin Investors',
    subject: 'RE: Series A Pitch Deck — Deadline Reminder',
    preview: 'Friendly reminder: materials due by 4:00 PM today. Please confirm receipt.',
    time: '11:48',
    urgent: false,
  },
  {
    id: 'e4',
    sender: 'Google Cloud',
    subject: 'GCP Committed Use Discount Expiring',
    preview: 'Your committed use discount expires in 3 days. Renew now to maintain 18% savings.',
    time: '09:22',
    urgent: false,
  },
];

const mockTasks = [
  { id: 't1', title: 'Draft Fintech Pitch Deck v3', due: 'Jun 22', delegated: false, agent: 'Scaffold Agent' },
  { id: 't2', title: 'Reconcile Q3 Cloud Invoice', due: 'Jun 25', delegated: false, agent: 'Logistics Agent' },
  { id: 't3', title: 'Deploy Bug Patch #4412', due: 'Jun 29', delegated: false, agent: 'Triage Agent' },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarMailHubView({ onTriggerRescue }: CalendarMailHubViewProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedCrisis, setSelectedCrisis] = useState<Crisis | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ingestedEmails, setIngestedEmails] = useState<Set<string>>(new Set());
  const [tasks, setTasks] = useState(mockTasks);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysInMonth = useMemo(() => getDaysInMonth(currentYear, currentMonth), [currentYear, currentMonth]);
  const firstDay = useMemo(() => getFirstDayOfMonth(currentYear, currentMonth), [currentYear, currentMonth]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleDateClick = (day: number) => {
    const key = String(day);
    if (crisisDeadlines[key]) {
      const crisis = crises.find((c) => c.id === crisisDeadlines[key].crisisId);
      if (crisis) {
        setSelectedCrisis(crisis);
        setDrawerOpen(true);
      }
    }
  };

  const handleIngest = (emailId: string) => {
    setIngestedEmails((prev) => new Set(prev).add(emailId));
  };

  const handleDeployTriage = () => {
    if (selectedCrisis) {
      onTriggerRescue(selectedCrisis);
      setDrawerOpen(false);
    }
  };

  const handleDelegate = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, delegated: true } : t))
    );
  };

  const handleReset = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, delegated: false } : t))
    );
  };

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-5">
          {/* Top Row: Calendar + Gmail Queue */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Panel: Calendar */}
            <div className="lg:col-span-7">
              <div className="glass-panel p-5 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarDays className="w-5 h-5 text-amber-400" />
                  <h2 className="text-sm font-semibold text-slate-200 tracking-wide">
                    Google Workspace Calendar
                  </h2>
                  <div className="ml-auto flex items-center gap-2">
                    <button
                      onClick={prevMonth}
                      className="w-7 h-7 rounded-lg bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-medium text-slate-200 min-w-[100px] text-center">
                      {monthNames[currentMonth]} {currentYear}
                    </span>
                    <button
                      onClick={nextMonth}
                      className="w-7 h-7 rounded-lg bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div key={d} className="text-center text-[10px] text-slate-500 font-semibold py-1">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 flex-1">
                  {calendarDays.map((day, idx) => {
                    if (day === null) {
                      return <div key={`empty-${idx}`} className="rounded-lg" />;
                    }
                    const hasCrisis = crisisDeadlines[String(day)];
                    const isToday =
                      day === today.getDate() &&
                      currentMonth === today.getMonth() &&
                      currentYear === today.getFullYear();

                    return (
                      <button
                        key={day}
                        onClick={() => handleDateClick(day)}
                        className={`relative rounded-lg border p-2 flex flex-col items-start justify-start min-h-[80px] transition-all duration-200 ${
                          hasCrisis
                            ? 'border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10'
                            : isToday
                            ? 'border-emerald-500/30 bg-emerald-500/5'
                            : 'border-slate-800 bg-slate-900/20 hover:border-slate-700'
                        }`}
                      >
                        <span
                          className={`text-xs font-medium ${
                            isToday ? 'text-emerald-400' : hasCrisis ? 'text-amber-300' : 'text-slate-400'
                          }`}
                        >
                          {day}
                        </span>
                        {hasCrisis && (
                          <div className="mt-auto flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-crimson-400 animate-pulse" />
                            <span className="text-[9px] text-crimson-300 font-semibold">CRISIS</span>
                          </div>
                        )}
                        {hasCrisis && (
                          <div className="absolute inset-0 rounded-lg ring-2 ring-amber-500/30 ring-offset-0 animate-pulse pointer-events-none" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-crimson-400 animate-pulse" />
                    <span className="text-[10px] text-slate-500">Active Crisis Event</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[10px] text-slate-500">Today</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Gmail Queue */}
            <div className="lg:col-span-5">
              <div className="glass-panel p-5 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-sm font-semibold text-slate-200 tracking-wide">
                    Gmail Pre-Crisis Queue
                  </h2>
                  <span className="ml-auto text-xs text-slate-500">{mockEmails.length} new</span>
                </div>

                <div className="space-y-2 overflow-y-auto pr-1 flex-1">
                  {mockEmails.map((email) => {
                    const ingested = ingestedEmails.has(email.id);
                    return (
                      <div
                        key={email.id}
                        className={`rounded-xl border p-4 transition-all duration-200 ${
                          ingested
                            ? 'border-emerald-500/30 bg-emerald-500/5'
                            : email.urgent
                            ? 'border-crimson-500/30 bg-crimson-500/5 hover:border-crimson-500/50'
                            : 'border-slate-800 bg-slate-900/30 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Inbox className={`w-3.5 h-3.5 ${email.urgent ? 'text-crimson-400' : 'text-slate-500'}`} />
                            <span className="text-[10px] text-slate-500">{email.time}</span>
                          </div>
                          {email.urgent && (
                            <span className="text-[9px] font-bold text-crimson-400 bg-crimson-500/10 px-1.5 py-0.5 rounded">
                              URGENT
                            </span>
                          )}
                        </div>
                        <h3 className="text-xs font-medium text-slate-100 mb-1">{email.subject}</h3>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">{email.preview}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleIngest(email.id)}
                            disabled={ingested}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                              ingested
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 cursor-default'
                                : 'bg-slate-800/60 text-slate-300 border border-slate-700 hover:border-slate-600 hover:text-slate-100'
                            }`}
                          >
                            {ingested ? (
                              <>
                                <Star className="w-3 h-3" />
                                Ingested
                              </>
                            ) : (
                              <>
                                <Paperclip className="w-3 h-3" />
                                Ingest into Clutch Engine
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Google Tasks Sync Portal */}
          <div className="glass-panel p-5 border border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm font-semibold text-slate-200 tracking-wide">
                Google Tasks Sync Portal
              </h2>
              <span className="ml-auto text-xs text-slate-500">{tasks.length} tasks queued</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`rounded-xl border p-4 transition-all duration-200 ${
                    task.delegated
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-slate-800 bg-slate-900/30 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 ${task.delegated ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span className="text-[10px] text-slate-500">{task.due}</span>
                    </div>
                    {task.delegated && (
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        DELEGATED
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-medium text-slate-100 mb-1">{task.title}</h3>
                  <p className="text-[11px] text-slate-500 mb-3">Assigned to {task.agent}</p>
                  <div className="flex items-center gap-2">
                    {task.delegated ? (
                      <button
                        onClick={() => handleReset(task.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium bg-slate-800/60 text-slate-400 border border-slate-700 hover:border-slate-600 hover:text-slate-200 transition-all"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDelegate(task.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium bg-emerald-600/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/25 transition-all"
                      >
                        <Bot className="w-3 h-3" />
                        Auto-Delegate to Gemini Agent
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Side Drawer */}
      {drawerOpen && selectedCrisis && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setDrawerOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-96 bg-slate-950 border-l border-slate-800 z-50 shadow-2xl animate-slide-in flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-crimson-400" />
                <h3 className="text-sm font-bold text-slate-100">Crisis Detail</h3>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      selectedCrisis.urgency === 'critical'
                        ? 'bg-crimson-500/10 text-crimson-400 border-crimson-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {selectedCrisis.urgency.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                    {selectedCrisis.category}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-100 mb-2">{selectedCrisis.title}</h2>
                <p className="text-xs text-slate-400 leading-relaxed">{selectedCrisis.description}</p>
              </div>

              <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-slate-300">
                    Due in <strong className="text-amber-400">{selectedCrisis.dueInMinutes} minutes</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span className="text-xs text-slate-400">{selectedCrisis.fileAttachment} attached</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-crimson-400" />
                  <span className="text-xs text-slate-400">
                    Panic contribution: +{(selectedCrisis.urgency === 'critical' ? 35 : 25).toFixed(0)}%
                  </span>
                </div>
              </div>

              <button
                onClick={handleDeployTriage}
                className="w-full flex items-center justify-center gap-2 bg-crimson-600/20 hover:bg-crimson-600/30 text-crimson-400 border border-crimson-500/40 rounded-lg py-3 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Zap className="w-4 h-4" />
                Deploy Clutch Triage
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
