import { useState, useCallback } from 'react';
import { Volume2, AlertTriangle, Radio, Music, MessageSquare } from 'lucide-react';
import { useAudioAlert } from '../hooks/useAudioAlert';
import type { AlertTone } from '../types';

interface Toast {
  id: number;
  message: string;
  level: 'critical' | 'warning' | 'info';
}

const toneOptions: { id: AlertTone; label: string; icon: typeof Radio }[] = [
  { id: 'tactical', label: 'Tactical Siren Override', icon: Radio },
  { id: 'lofi', label: 'Lo-Fi Focus Anchor', icon: Music },
  { id: 'synthetic', label: 'Synthetic Assistant Voice Ingress', icon: MessageSquare },
];

export default function AudioHub() {
  const [selectedTone, setSelectedTone] = useState<AlertTone>('tactical');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { playTactical, playLofi, playSynthetic } = useAudioAlert();

  const simulateAlert = useCallback(() => {
    const id = Date.now();
    const newToast: Toast = {
      id,
      message:
        selectedTone === 'tactical'
          ? 'CRITICAL ALERT: Fintech deck deadline breached. Agent swarm activated.'
          : selectedTone === 'lofi'
          ? 'Focus anchor engaged. 45-minute deep work sprint initiated.'
          : 'Assistant ingress: "I have prepared your pitch deck scaffold. Review now?"',
      level: selectedTone === 'tactical' ? 'critical' : selectedTone === 'lofi' ? 'info' : 'warning',
    };
    setToasts((prev) => [...prev, newToast]);

    if (selectedTone === 'tactical') playTactical();
    else if (selectedTone === 'lofi') playLofi();
    else playSynthetic();

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, [selectedTone, playTactical, playLofi, playSynthetic]);

  return (
    <>
      <div className="glass-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <Volume2 className="w-5 h-5 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-200 tracking-wide">
            Acoustic Escalation & Override
          </h2>
        </div>

        <div className="space-y-2 mb-4">
          {toneOptions.map((tone) => (
            <button
              key={tone.id}
              onClick={() => setSelectedTone(tone.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all duration-200 ${
                selectedTone === tone.id
                  ? 'bg-slate-800/80 border-amber-500/40 text-amber-300'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              <tone.icon className="w-4 h-4 shrink-0" />
              <span className="text-xs font-medium">{tone.label}</span>
              {selectedTone === tone.id && (
                <span className="ml-auto text-[10px] text-amber-400 font-semibold">ACTIVE</span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={simulateAlert}
          className="w-full flex items-center justify-center gap-2 bg-crimson-600/20 hover:bg-crimson-600/30 text-crimson-400 border border-crimson-500/40 rounded-lg py-2.5 text-xs font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] neon-border-crimson"
        >
          <AlertTriangle className="w-4 h-4" />
          Simulate Critical Alert Level
        </button>
      </div>

      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto animate-toast-slide flex items-start gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-sm ${
              toast.level === 'critical'
                ? 'bg-crimson-700/90 border-crimson-500/50 text-white'
                : toast.level === 'warning'
                ? 'bg-amber-700/90 border-amber-500/50 text-white'
                : 'bg-slate-800/95 border-emerald-500/40 text-slate-100'
            }`}
          >
            <AlertTriangle
              className={`w-5 h-5 shrink-0 mt-0.5 ${
                toast.level === 'critical'
                  ? 'text-crimson-200'
                  : toast.level === 'warning'
                  ? 'text-amber-200'
                  : 'text-emerald-400'
              }`}
            />
            <p className="text-xs leading-relaxed">{toast.message}</p>
          </div>
        ))}
      </div>
    </>
  );
}
