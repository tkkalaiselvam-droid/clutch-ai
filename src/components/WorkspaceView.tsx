import { useState, useEffect, useCallback } from 'react';
import {
  Bot,
  CheckCircle2,
  Clock,
  Loader2,
  Zap,
  FileText,
  ShieldAlert,
  Copy,
  Download,
  ChevronRight,
  UploadCloud,
} from 'lucide-react';
import { crises } from '../data/mockData';
import type { Crisis, AgentStep } from '../types';
import { initialAgentSteps, scaffoldOutputs, logisticsOutputs } from '../data/mockData';

interface WorkspaceViewProps {
  activeCrisis: Crisis | null;
  onTriggerRescue: (crisis: Crisis) => void;
  onOpenDocs: (crisis: Crisis) => void;
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

function TimelineStep({
  step,
  isLast,
}: {
  step: AgentStep & { isVisible: boolean };
  isLast: boolean;
}) {
  if (!step.isVisible) return null;

  const ringColor =
    step.status === 'complete'
      ? 'border-emerald-500 text-emerald-400'
      : step.status === 'active'
      ? 'border-amber-500 text-amber-400'
      : 'border-slate-700 text-slate-500';

  return (
    <div className="flex gap-4 animate-fade-in">
      <div className="flex flex-col items-center">
        <div
          className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 bg-slate-900 ${ringColor}`}
        >
          {step.id}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-slate-800 my-1" />}
      </div>

      <div className="flex-1 pb-6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-slate-200">{step.agent}</span>
          <StepBadge status={step.status} />
        </div>
        <p className="text-xs text-slate-400 mb-2">{step.label}</p>
      </div>
    </div>
  );
}

function MarkdownOutput({ crisisId }: { crisisId: string }) {
  const scaffold = scaffoldOutputs[crisisId] || '';
  const logistics = logisticsOutputs[crisisId] || '';
  const fullContent = `${scaffold}\n\n---\n\n${logistics}`;

  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(fullContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [fullContent]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([fullContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clutchai-resolution-${crisisId}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [fullContent, crisisId]);

  return (
    <div className="mt-4 glass-panel border border-emerald-500/20">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-300">Resolution Artifact</span>
          <span className="text-[10px] text-slate-500">90% complete</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-xs text-slate-300 hover:text-slate-100 hover:border-slate-600 transition-all"
          >
            <Copy className="w-3 h-3" />
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-xs text-slate-300 hover:text-slate-100 hover:border-slate-600 transition-all"
          >
            <Download className="w-3 h-3" />
            Download
          </button>
        </div>
      </div>
      <div className="p-4 max-h-80 overflow-y-auto bg-slate-950/40">
        <pre className="text-[11px] text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
          {fullContent}
        </pre>
      </div>
    </div>
  );
}

function AgentExecutionBoard({ crisis, onOpenDocs }: { crisis: Crisis; onOpenDocs: (c: Crisis) => void }) {
  const [steps, setSteps] = useState<(AgentStep & { isVisible: boolean })[]>(
    initialAgentSteps.map((s) => ({ ...s, isVisible: false }))
  );
  const [allComplete, setAllComplete] = useState(false);

  useEffect(() => {
    setSteps(initialAgentSteps.map((s) => ({ ...s, isVisible: false })));
    setAllComplete(false);

    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s) => (s.id === 1 ? { ...s, isVisible: true, status: 'active' as const } : s))
        );
      }, 200)
    );

    timers.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s) => (s.id === 1 ? { ...s, status: 'complete' as const } : s))
        );
        setSteps((prev) =>
          prev.map((s) => (s.id === 2 ? { ...s, isVisible: true, status: 'active' as const } : s))
        );
      }, 3200)
    );

    timers.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s) => (s.id === 2 ? { ...s, status: 'complete' as const } : s))
        );
        setSteps((prev) =>
          prev.map((s) => (s.id === 3 ? { ...s, isVisible: true, status: 'active' as const } : s))
        );
      }, 6200)
    );

    timers.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s) => (s.id === 3 ? { ...s, status: 'complete' as const } : s))
        );
        setAllComplete(true);
      }, 9200)
    );

    return () => timers.forEach(clearTimeout);
  }, [crisis.id]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-5 h-5 text-amber-400" />
        <h2 className="text-sm font-semibold text-slate-200 tracking-wide">
          Real-Time Multi-Agent Execution Board
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        <div className="pl-2">
          {steps.map((step, idx) => (
            <TimelineStep key={step.id} step={step} isLast={idx === steps.length - 1} />
          ))}
        </div>

        {allComplete && (
          <>
            <MarkdownOutput crisisId={crisis.id} />
            <button
              onClick={() => onOpenDocs(crisis)}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-slate-800/60 hover:bg-slate-800/80 text-slate-300 border border-slate-700 rounded-lg py-2.5 text-xs font-medium transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <UploadCloud className="w-4 h-4" />
              Open in Google Docs Live Workspace
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function CrisisSelector({
  crises,
  selectedId,
  onSelect,
  onTriggerRescue,
}: {
  crises: Crisis[];
  selectedId: string | null;
  onSelect: (c: Crisis) => void;
  onTriggerRescue: (c: Crisis) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="w-5 h-5 text-crimson-400" />
        <h2 className="text-sm font-semibold text-slate-200 tracking-wide">Active Crises</h2>
      </div>
      <div className="space-y-2 overflow-y-auto pr-1">
        {crises.map((crisis) => {
          const isSelected = selectedId === crisis.id;
          return (
            <button
              key={crisis.id}
              onClick={() => onSelect(crisis)}
              className={`w-full text-left rounded-xl border p-4 transition-all duration-200 ${
                isSelected
                  ? 'border-amber-500/40 bg-amber-500/5'
                  : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <UrgencyBadge urgency={crisis.urgency} />
                <span className="text-[10px] text-slate-500">{crisis.dueInMinutes}m</span>
              </div>
              <h3 className="text-sm font-medium text-slate-100 mb-1">{crisis.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-2">{crisis.description}</p>
              <div className="flex items-center gap-2">
                <FileText className="w-3 h-3 text-slate-500" />
                <span className="text-[10px] text-slate-500">{crisis.fileAttachment}</span>
              </div>
              {isSelected && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTriggerRescue(crisis);
                  }}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 bg-crimson-600/20 hover:bg-crimson-600/30 text-crimson-400 border border-crimson-500/30 rounded-lg py-2 text-xs font-medium transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Trigger Agent Rescue
                </button>
              )}
              {!isSelected && (
                <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-500">
                  <ChevronRight className="w-3 h-3" />
                  Click to select
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function WorkspaceView({ activeCrisis, onTriggerRescue, onOpenDocs }: WorkspaceViewProps) {
  const [selectedCrisis, setSelectedCrisis] = useState<Crisis | null>(activeCrisis);

  const handleSelect = (crisis: Crisis) => {
    setSelectedCrisis(crisis);
  };

  const handleTrigger = (crisis: Crisis) => {
    setSelectedCrisis(crisis);
    onTriggerRescue(crisis);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-hidden p-6">
        <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-7xl mx-auto">
          <div className="lg:col-span-4 h-full overflow-hidden">
            <div className="glass-panel p-5 h-full flex flex-col">
              <CrisisSelector
                crises={crises}
                selectedId={selectedCrisis?.id || null}
                onSelect={handleSelect}
                onTriggerRescue={handleTrigger}
              />
            </div>
          </div>

          <div className="lg:col-span-8 h-full overflow-hidden">
            <div className="glass-panel p-5 h-full flex flex-col">
              {activeCrisis ? (
                <AgentExecutionBoard crisis={activeCrisis} onOpenDocs={onOpenDocs} />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Bot className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">
                      Select a crisis and click <strong>Trigger Agent Rescue</strong> to initialize the swarm.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
