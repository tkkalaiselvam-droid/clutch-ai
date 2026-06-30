import { useEffect, useState } from 'react';
import { Bot, CheckCircle2, Clock, Loader2, Calendar, Mail } from 'lucide-react';
import type { Crisis, AgentStep } from '../types';
import { initialAgentSteps, scaffoldOutputs, logisticsOutputs } from '../data/mockData';
import { useTypewriter } from '../hooks/useTypewriter';

interface AgentWarRoomProps {
  activeCrisis: Crisis | null;
}

function StepBadge({ status }: { status: AgentStep['status'] }) {
  if (status === 'complete') {
    return (
      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
        <CheckCircle2 className="w-3 h-3" /> COMPLETE
      </span>
    );
  }
  if (status === 'active') {
    return (
      <span className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
        <Loader2 className="w-3 h-3 animate-spin" /> ACTIVE
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
      <Clock className="w-3 h-3" /> PENDING
    </span>
  );
}

function TriageContent({ crisis }: { crisis: Crisis }) {
  const { displayed } = useTypewriter(
    `Context window loaded: ${crisis.title}\nDeadline velocity: ${(
      100 / crisis.dueInMinutes
    ).toFixed(2)} urgency units/min\nTime-to-impact: ${crisis.dueInMinutes} minutes\nRisk classification: ${crisis.urgency.toUpperCase()}\nRecommended agent swarm: Triage → Scaffold → Logistics`,
    18,
    300
  );
  return (
    <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/60">
      <pre className="text-[11px] text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
        {displayed}
        <span className="inline-block w-2 h-4 bg-amber-400/80 ml-0.5 animate-type-cursor align-text-bottom" />
      </pre>
    </div>
  );
}

function ScaffoldContent({ crisisId }: { crisisId: string }) {
  const output = scaffoldOutputs[crisisId] || '';
  const { displayed } = useTypewriter(output, 8, 600);
  return (
    <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/60 max-h-64 overflow-y-auto">
      <pre className="text-[11px] text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
        {displayed}
        <span className="inline-block w-2 h-4 bg-emerald-400/80 ml-0.5 animate-type-cursor align-text-bottom" />
      </pre>
    </div>
  );
}

function LogisticsContent({ crisisId }: { crisisId: string }) {
  const output = logisticsOutputs[crisisId] || '';
  const { displayed } = useTypewriter(output, 10, 1200);
  return (
    <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/60 max-h-64 overflow-y-auto">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5 bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-700">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] text-slate-300">Calendar synced</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-700">
          <Mail className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] text-slate-300">Draft ready</span>
        </div>
      </div>
      <pre className="text-[11px] text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
        {displayed}
        <span className="inline-block w-2 h-4 bg-emerald-400/80 ml-0.5 animate-type-cursor align-text-bottom" />
      </pre>
    </div>
  );
}

export default function AgentWarRoom({ activeCrisis }: AgentWarRoomProps) {
  const [steps, setSteps] = useState<AgentStep[]>(initialAgentSteps);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);

  useEffect(() => {
    if (!activeCrisis) {
      setSteps(initialAgentSteps);
      setVisibleSteps([]);
      return;
    }

    setSteps(initialAgentSteps);
    setVisibleSteps([]);

    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(
      setTimeout(() => {
        setVisibleSteps([1]);
        setSteps((prev) =>
          prev.map((s) => (s.id === 1 ? { ...s, status: 'active' as const } : s))
        );
      }, 200)
    );

    timers.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s) => (s.id === 1 ? { ...s, status: 'complete' as const } : s))
        );
        setVisibleSteps((prev) => [...prev, 2]);
        setSteps((prev) =>
          prev.map((s) => (s.id === 2 ? { ...s, status: 'active' as const } : s))
        );
      }, 3500)
    );

    timers.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s) => (s.id === 2 ? { ...s, status: 'complete' as const } : s))
        );
        setVisibleSteps((prev) => [...prev, 3]);
        setSteps((prev) =>
          prev.map((s) => (s.id === 3 ? { ...s, status: 'active' as const } : s))
        );
      }, 9000)
    );

    timers.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s) => (s.id === 3 ? { ...s, status: 'complete' as const } : s))
        );
      }, 15000)
    );

    return () => timers.forEach(clearTimeout);
  }, [activeCrisis]);

  if (!activeCrisis) {
    return (
      <div className="glass-panel p-5 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-semibold text-slate-200 tracking-wide">
            Real-Time Multi-Agent War Room
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Bot className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-500">
              Select a crisis and trigger Agent Rescue to initialize the swarm.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-5 h-5 text-amber-400" />
        <h2 className="text-sm font-semibold text-slate-200 tracking-wide">
          Real-Time Multi-Agent War Room
        </h2>
        <span className="ml-auto text-[10px] text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded">
          {activeCrisis.title}
        </span>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto">
        {steps.map((step) => {
          const isVisible = visibleSteps.includes(step.id);
          if (!isVisible) return null;

          return (
            <div
              key={step.id}
              className="animate-fade-in"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.status === 'complete'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : step.status === 'active'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {step.id}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">
                      {step.agent}
                    </span>
                    <StepBadge status={step.status} />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{step.label}</p>
                </div>
              </div>

              {step.id === 1 && <TriageContent crisis={activeCrisis} />}
              {step.id === 2 && <ScaffoldContent crisisId={activeCrisis.id} />}
              {step.id === 3 && <LogisticsContent crisisId={activeCrisis.id} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
