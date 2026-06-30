import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import WorkspaceView from './components/WorkspaceView';
import CalendarMailHubView from './components/CalendarMailHubView';
import AutopilotRulesView from './components/AutopilotRulesView';
import ApiConfigView from './components/ApiConfigView';
import ToastOverlay from './components/ToastOverlay';
import GoogleDocsCanvas from './components/GoogleDocsCanvas';
import type { Crisis } from './types';
import { scaffoldOutputs, logisticsOutputs } from './data/mockData';

export type TabId = 'dashboard' | 'workspace' | 'calendar' | 'autopilot' | 'api';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabId>('dashboard');
  const [activeCrisis, setActiveCrisis] = useState<Crisis | null>(null);
  const [docsOpen, setDocsOpen] = useState(false);
  const [docsContent, setDocsContent] = useState({ title: '', body: '' });

  const [crunchToast, setCrunchToast] = useState<string | null>(null);
  const [autoSubmitLog, setAutoSubmitLog] = useState<string | null>(null);

  const handleTriggerRescue = useCallback((crisis: Crisis) => {
    setActiveCrisis(null);
    setTimeout(() => {
      setActiveCrisis(crisis);
      setCurrentTab('workspace');
    }, 50);
  }, []);

  const handleOpenDocs = useCallback((crisis: Crisis) => {
    const scaffold = scaffoldOutputs[crisis.id] || '';
    const logistics = logisticsOutputs[crisis.id] || '';
    setDocsContent({
      title: crisis.title,
      body: `${scaffold}\n\n---\n\n${logistics}`,
    });
    setDocsOpen(true);
  }, []);

  const handleCloseDocs = useCallback(() => {
    setDocsOpen(false);
  }, []);

  const handleTabChange = useCallback((tab: TabId) => {
    setCurrentTab(tab);
  }, []);

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar currentTab={currentTab} onTabChange={handleTabChange} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {currentTab === 'dashboard' && (
          <DashboardView
            onTriggerRescue={handleTriggerRescue}
            onOpenDocs={handleOpenDocs}
            onCrunchToast={setCrunchToast}
            onAutoSubmitLog={setAutoSubmitLog}
          />
        )}
        {currentTab === 'workspace' && (
          <WorkspaceView
            activeCrisis={activeCrisis}
            onTriggerRescue={handleTriggerRescue}
            onOpenDocs={handleOpenDocs}
          />
        )}
        {currentTab === 'calendar' && (
          <CalendarMailHubView onTriggerRescue={handleTriggerRescue} />
        )}
        {currentTab === 'autopilot' && <AutopilotRulesView />}
        {currentTab === 'api' && <ApiConfigView />}

        {/* Toasts */}
        {crunchToast && (
          <ToastOverlay
            title="⚠️ CLUTCH CRUNCH ZONE ACTIVE"
            message={`Crisis ${crunchToast} has dropped below 1 hour. Shadow agents are pre-generating resolution artifacts.`}
            variant="crunch"
            onDismiss={() => setCrunchToast(null)}
          />
        )}
        {autoSubmitLog && (
          <ToastOverlay
            title="🤖 AUTOPILOT EXECUTION MODE"
            message="Autopilot taking over... Accessing resolution artifacts... Dispatching completed asset payload via Google Tasks/Webhook APIs... Project Submitted Successfully."
            variant="autopilot"
            onDismiss={() => setAutoSubmitLog(null)}
          />
        )}

        {/* Google Docs Canvas Overlay */}
        {docsOpen && (
          <div className="fixed inset-0 z-[70] flex">
            <div className="flex-1 bg-black/60" onClick={handleCloseDocs} />
            <div className="w-[800px] h-full bg-white shadow-2xl animate-slide-in flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">Google Docs Live Workspace [REPLICATED]</span>
                </div>
                <button
                  onClick={handleCloseDocs}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium px-3 py-1.5 rounded hover:bg-slate-200 transition-all"
                >
                  Close
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <GoogleDocsCanvas content={docsContent.body} title={docsContent.title} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
