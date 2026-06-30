import { useState, useEffect } from 'react';
import { Settings, Key, Eye, EyeOff, CheckCircle2, AlertCircle, Shield } from 'lucide-react';

export default function ApiConfigView() {
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    try {
      return localStorage.getItem('clutch_gemini_api_key') || '';
    } catch {
      return '';
    }
  });
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const isLive = geminiApiKey.trim().length > 0;

  const handleSave = () => {
    try {
      localStorage.setItem('clutch_gemini_api_key', geminiApiKey);
    } catch {
      /* noop */
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem('clutch_gemini_api_key');
      if (stored) setGeminiApiKey(stored);
    } catch {
      /* noop */
    }
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-6 h-6 text-emerald-400" />
              <h1 className="text-lg font-bold text-slate-100">Live API Config</h1>
            </div>
            <p className="text-sm text-slate-400">
              Securely configure your Google AI Studio Gemini API key to enable live agentic inference.
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold ${
                isLive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              {isLive ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Status: Live Connection
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" />
                  Status: Mock Mode Sandbox (Active)
                </>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <Shield className="w-3 h-3" />
              Key stored in localStorage
            </div>
          </div>

          {/* Form */}
          <div className="glass-panel p-6 space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-200 mb-2">
                <Key className="w-4 h-4 text-slate-400" />
                Google AI Studio Gemini API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 pr-12 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Your key is persisted to localStorage for convenience. The dashboard functions fully in Mock Mode when empty.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {saved ? <CheckCircle2 className="w-4 h-4" /> : <Key className="w-4 h-4" />}
                {saved ? 'Saved' : 'Save Configuration'}
              </button>
              {geminiApiKey && (
                <button
                  onClick={() => {
                    setGeminiApiKey('');
                    try {
                      localStorage.removeItem('clutch_gemini_api_key');
                    } catch {
                      /* noop */
                    }
                  }}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Clear key
                </button>
              )}
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-panel p-4 border border-slate-800">
              <h3 className="text-xs font-semibold text-slate-200 mb-2">Mock Mode Features</h3>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Full crisis queue simulation
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Multi-agent war room with typewriter output
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Acoustic escalation & override
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Habit-chain sync & voice terminal
                </li>
              </ul>
            </div>
            <div className="glass-panel p-4 border border-slate-800">
              <h3 className="text-xs font-semibold text-slate-200 mb-2">Live Mode Features</h3>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Gemini-powered artifact generation
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Dynamic context analysis
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Real-time triage recommendations
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Adaptive escalation routing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
