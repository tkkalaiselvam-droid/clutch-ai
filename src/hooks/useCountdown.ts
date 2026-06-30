import { useState, useEffect, useCallback } from 'react';
import type { Crisis } from '../types';

export interface CountdownState {
  id: string;
  remainingSeconds: number;
  isCrunchZone: boolean;
  isAutoSubmit: boolean;
  isAutopilotEnabled: boolean;
  formatted: string;
}

export function useCountdown(initialCrises: Crisis[]) {
  const [states, setStates] = useState<Record<string, CountdownState>>(() => {
    const map: Record<string, CountdownState> = {};
    for (const c of initialCrises) {
      const secs = c.dueInMinutes * 60;
      map[c.id] = {
        id: c.id,
        remainingSeconds: secs,
        isCrunchZone: secs <= 3600,
        isAutoSubmit: secs <= 600,
        isAutopilotEnabled: false,
        formatted: formatTime(secs),
      };
    }
    return map;
  });

  const [crunchToast, setCrunchToast] = useState<string | null>(null);
  const [autoSubmitLog, setAutoSubmitLog] = useState<string | null>(null);

  const toggleAutopilot = useCallback((crisisId: string) => {
    setStates((prev) => ({
      ...prev,
      [crisisId]: {
        ...prev[crisisId],
        isAutopilotEnabled: !prev[crisisId].isAutopilotEnabled,
      },
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStates((prev) => {
        const next: Record<string, CountdownState> = {};
        let newToast: string | null = null;
        let newAutoLog: string | null = null;

        for (const key of Object.keys(prev)) {
          const s = prev[key];
          const remaining = Math.max(0, s.remainingSeconds - 1);
          const wasCrunch = s.isCrunchZone;
          const isCrunch = remaining <= 3600 && remaining > 0;
          const isAuto = remaining <= 600 && remaining > 0;

          if (isCrunch && !wasCrunch) {
            newToast = key;
          }

          if (isAuto && s.isAutopilotEnabled && !s.isAutoSubmit) {
            newAutoLog = key;
          }

          next[key] = {
            ...s,
            remainingSeconds: remaining,
            isCrunchZone: isCrunch,
            isAutoSubmit: isAuto,
            formatted: formatTime(remaining),
          };
        }

        if (newToast) setCrunchToast(newToast);
        if (newAutoLog) setAutoSubmitLog(newAutoLog);

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const dismissToast = useCallback(() => setCrunchToast(null), []);
  const dismissAutoLog = useCallback(() => setAutoSubmitLog(null), []);

  return { states, crunchToast, autoSubmitLog, toggleAutopilot, dismissToast, dismissAutoLog };
}

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  return `${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
}
