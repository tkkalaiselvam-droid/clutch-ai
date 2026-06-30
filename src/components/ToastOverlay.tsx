import { AlertTriangle, X, Bot } from 'lucide-react';

interface ToastOverlayProps {
  title: string;
  message: string;
  variant: 'crunch' | 'autopilot';
  onDismiss: () => void;
}

export default function ToastOverlay({ title, message, variant, onDismiss }: ToastOverlayProps) {
  const isCrunch = variant === 'crunch';
  return (
    <div className="fixed top-4 right-4 z-[60] animate-slide-in max-w-sm">
      <div
        className={`rounded-xl border p-4 shadow-2xl backdrop-blur-md ${
          isCrunch
            ? 'bg-amber-950/90 border-amber-500/40'
            : 'bg-crimson-950/90 border-crimson-500/40'
        }`}
      >
        <div className="flex items-start gap-3">
          {isCrunch ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <Bot className="w-5 h-5 text-crimson-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <h4 className={`text-xs font-bold mb-1 ${isCrunch ? 'text-amber-300' : 'text-crimson-300'}`}>
              {title}
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">{message}</p>
          </div>
          <button
            onClick={onDismiss}
            className="w-6 h-6 rounded-md bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
