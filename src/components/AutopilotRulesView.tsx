import { useState } from 'react';
import {
  Shield,
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight,
  Lock,
  Zap,
  Clock,
  AlertTriangle,
  Mail,
  FileText,
  Volume2,
  Ban,
  Save,
  RotateCcw,
} from 'lucide-react';

export default function AutopilotRulesView() {
  const [urgencyLimit, setUrgencyLimit] = useState(85);
  const [timeWindow, setTimeWindow] = useState(45);

  const [commScaffold, setCommScaffold] = useState(true);
  const [artifactPreGen, setArtifactPreGen] = useState(true);
  const [acousticOverdrive, setAcousticOverdrive] = useState(false);

  const [exclusionKeywords, setExclusionKeywords] = useState('holiday, vacation, PTO, sabbatical');
  const [emergencyContact, setEmergencyContact] = useState('ops@clutchai.dev');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setUrgencyLimit(85);
    setTimeWindow(45);
    setCommScaffold(true);
    setArtifactPreGen(true);
    setAcousticOverdrive(false);
    setExclusionKeywords('holiday, vacation, PTO, sabbatical');
    setEmergencyContact('ops@clutchai.dev');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-100">Autopilot Governance</h1>
                <p className="text-[11px] text-slate-500">
                  Configure agentic automation guardrails and escalation thresholds
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Defaults
              </button>
              <button
                onClick={handleSave}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  saved
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                {saved ? 'Saved' : 'Save Rules'}
              </button>
            </div>
          </div>

          {/* Top Row: Escalation Core + Permission Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Component 1: Autopilot Escalation Core */}
            <div className="glass-panel p-6 border border-slate-800">
              <div className="flex items-center gap-2 mb-5">
                <SlidersHorizontal className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-semibold text-slate-200 tracking-wide">
                  Autonomous Trigger Thresholds
                </h2>
              </div>

              {/* Critical Urgency Slider */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-slate-300">
                    Critical Urgency Activation Limit
                  </label>
                  <span className="text-xs font-bold text-amber-400">{urgencyLimit}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={urgencyLimit}
                  onChange={(e) => setUrgencyLimit(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-all"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-slate-600">50%</span>
                  <span className="text-[10px] text-slate-600">100%</span>
                </div>
                <div className="mt-3 flex items-start gap-2 bg-amber-500/5 border border-amber-500/15 rounded-lg p-3">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <span className="text-amber-300 font-medium">Current Rule:</span>{' '}
                    Execute shadow-mitigation automatically if any incoming crisis score exceeds{' '}
                    <strong className="text-amber-400">{urgencyLimit}%</strong>.
                  </p>
                </div>
              </div>

              {/* Time Window Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-slate-300">
                    Time Window Threshold
                  </label>
                  <span className="text-xs font-bold text-crimson-400">{timeWindow} min</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={120}
                  step={5}
                  value={timeWindow}
                  onChange={(e) => setTimeWindow(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-crimson-500 hover:accent-crimson-400 transition-all"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-slate-600">15m</span>
                  <span className="text-[10px] text-slate-600">120m</span>
                </div>
                <div className="mt-3 flex items-start gap-2 bg-crimson-500/5 border border-crimson-500/15 rounded-lg p-3">
                  <Clock className="w-4 h-4 text-crimson-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <span className="text-crimson-300 font-medium">Current Rule:</span>{' '}
                    Permit background agents to execute artifact scaffolding if deadline is under{' '}
                    <strong className="text-crimson-400">{timeWindow} minutes</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Component 2: Action Authorization Matrix */}
            <div className="glass-panel p-6 border border-slate-800">
              <div className="flex items-center gap-2 mb-5">
                <Lock className="w-5 h-5 text-emerald-400" />
                <h2 className="text-sm font-semibold text-slate-200 tracking-wide">
                  Agent Permission Matrix
                </h2>
              </div>

              <div className="space-y-4">
                {/* Toggle 1 */}
                <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/30 hover:border-slate-700 transition-all">
                  <button
                    onClick={() => setCommScaffold(!commScaffold)}
                    className={`shrink-0 w-10 h-6 rounded-full relative transition-all duration-300 ${
                      commScaffold ? 'bg-emerald-500/30' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                        commScaffold
                          ? 'left-[18px] bg-emerald-400 text-slate-900'
                          : 'left-0.5 bg-slate-400 text-slate-900'
                      }`}
                    >
                      {commScaffold ? (
                        <ToggleRight className="w-3.5 h-3.5" />
                      ) : (
                        <ToggleLeft className="w-3.5 h-3.5" />
                      )}
                    </span>
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs font-medium text-slate-200">
                        Automated Communication Scaffolding
                      </span>
                      {commScaffold && (
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          ENABLED
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Allows the Logistics Agent to prepare out-of-office / extension email drafts in the Gmail queue.
                    </p>
                  </div>
                </div>

                {/* Toggle 2 */}
                <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/30 hover:border-slate-700 transition-all">
                  <button
                    onClick={() => setArtifactPreGen(!artifactPreGen)}
                    className={`shrink-0 w-10 h-6 rounded-full relative transition-all duration-300 ${
                      artifactPreGen ? 'bg-emerald-500/30' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                        artifactPreGen
                          ? 'left-[18px] bg-emerald-400 text-slate-900'
                          : 'left-0.5 bg-slate-400 text-slate-900'
                      }`}
                    >
                      {artifactPreGen ? (
                        <ToggleRight className="w-3.5 h-3.5" />
                      ) : (
                        <ToggleLeft className="w-3.5 h-3.5" />
                      )}
                    </span>
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs font-medium text-slate-200">
                        Artifact Outline Pre-Generation
                      </span>
                      {artifactPreGen && (
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          ENABLED
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Allows the Scaffold Agent to query the Gemini 1.5 Pro API instantly on critical context files.
                    </p>
                  </div>
                </div>

                {/* Toggle 3 */}
                <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/30 hover:border-slate-700 transition-all">
                  <button
                    onClick={() => setAcousticOverdrive(!acousticOverdrive)}
                    className={`shrink-0 w-10 h-6 rounded-full relative transition-all duration-300 ${
                      acousticOverdrive ? 'bg-crimson-500/30' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                        acousticOverdrive
                          ? 'left-[18px] bg-crimson-400 text-slate-900'
                          : 'left-0.5 bg-slate-400 text-slate-900'
                      }`}
                    >
                      {acousticOverdrive ? (
                        <ToggleRight className="w-3.5 h-3.5" />
                      ) : (
                        <ToggleLeft className="w-3.5 h-3.5" />
                      )}
                    </span>
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs font-medium text-slate-200">
                        Acoustic Overdrive Escalation
                      </span>
                      {acousticOverdrive ? (
                        <span className="text-[9px] font-bold text-crimson-400 bg-crimson-500/10 px-1.5 py-0.5 rounded">
                          ENABLED
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-slate-500 bg-slate-700/60 px-1.5 py-0.5 rounded">
                          DISABLED
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Allows the system to trigger the synthesized browser audio alarm if user response is absent for 10 minutes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Component 3: Guardrail & Constraints Log */}
          <div className="glass-panel p-6 border border-slate-800">
            <div className="flex items-center gap-2 mb-5">
              <Ban className="w-5 h-5 text-crimson-400" />
              <h2 className="text-sm font-semibold text-slate-200 tracking-wide">
                Agent System Guardrails
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Exclusion Keywords */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-300 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Exclusion Keywords
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Tasks containing these words will never run on Autopilot
                </p>
                <textarea
                  value={exclusionKeywords}
                  onChange={(e) => setExclusionKeywords(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all resize-none"
                  placeholder="Enter comma-separated keywords..."
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {exclusionKeywords.split(',').map((kw, i) => {
                    const trimmed = kw.trim();
                    if (!trimmed) return null;
                    return (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      >
                        {trimmed}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-300 mb-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  Emergency Contact Sync Address
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Where to copy critical backup notification alerts
                </p>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  placeholder="ops@clutchai.dev"
                />
                <div className="mt-3 flex items-start gap-2 bg-slate-900/40 rounded-lg p-3 border border-slate-800">
                  <Shield className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    All critical alerts exceeding the urgency threshold will be carbon-copied to this address. Ensure it is monitored 24/7.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
