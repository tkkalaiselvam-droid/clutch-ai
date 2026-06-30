import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Radio } from 'lucide-react';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

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

interface VoiceTerminalProps {
  onTranscript?: (text: string) => void;
}

export default function VoiceTerminal({ onTranscript }: VoiceTerminalProps) {
  const [voiceActive, setVoiceActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setVoiceActive(false);
    setInterim('');
  }, []);

  const startRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser.');
      return;
    }

    setError('');
    setTranscript('');
    setInterim('');
    setVoiceActive(true);

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceActive(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
        if (onTranscript) onTranscript(finalTranscript);
      }
      setInterim(interimTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        setError(`Error: ${event.error}`);
      }
      setVoiceActive(false);
    };

    recognition.onend = () => {
      setVoiceActive(false);
      setInterim('');
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [onTranscript]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  const toggle = () => {
    if (voiceActive) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center gap-2 mb-1">
        <Mic className="w-5 h-5 text-slate-400" />
        <h2 className="text-sm font-semibold text-slate-200 tracking-wide">Voice Terminal</h2>
      </div>
      <p className="text-[10px] text-slate-500 mb-4 uppercase tracking-wider font-medium">
        Voice-command your triage queue
      </p>
      <div
        className={`rounded-xl border p-4 transition-all duration-300 ${
          voiceActive ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-slate-800 bg-slate-900/50'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Radio className={`w-3.5 h-3.5 ${voiceActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="text-xs text-slate-400">
              {voiceActive ? 'Listening...' : transcript ? 'Transcribed' : 'Standby'}
            </span>
          </div>
          <button
            onClick={toggle}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              voiceActive
                ? 'bg-emerald-500/20 text-emerald-400 animate-pulse'
                : 'bg-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
        <WaveformBars active={voiceActive} />

        {error && (
          <div className="mt-3 text-[11px] text-crimson-400 bg-crimson-500/5 border border-crimson-500/20 rounded-lg p-2">
            {error}
          </div>
        )}

        {/* Transcript area */}
        <div className="mt-3 bg-slate-950/60 rounded-lg p-3 border border-slate-800 min-h-[60px]">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
            Live Transcript
          </p>
          <p className="text-[11px] text-slate-300 leading-relaxed min-h-[1.5em]">
            {transcript}
            {interim && <span className="text-slate-500">{interim}</span>}
            {!transcript && !interim && (
              <span className="text-slate-600 italic">Click the mic to start speaking...</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
