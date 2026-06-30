import { useState } from 'react';
import { UploadCloud, FileText, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Type, Printer, Download } from 'lucide-react';

interface GoogleDocsCanvasProps {
  content: string;
  title: string;
}

export default function GoogleDocsCanvas({ content, title }: GoogleDocsCanvasProps) {
  const [fontSize, setFontSize] = useState(14);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('left');

  const lines = content.split('\n');

  const textStyle = {
    fontSize: `${fontSize}px`,
    fontWeight: isBold ? 'bold' : 'normal',
    fontStyle: isItalic ? 'italic' : 'normal',
    textDecoration: isUnderline ? 'underline' : 'none',
    textAlign: align,
  } as React.CSSProperties;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-slate-200 rounded-t-xl">
        <div className="flex items-center gap-1">
          <Type className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="text-xs text-slate-700 bg-transparent border-none focus:outline-none cursor-pointer"
          >
            {[10, 11, 12, 13, 14, 16, 18, 20, 24].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="w-px h-4 bg-slate-300 mx-1" />
        <button
          onClick={() => setIsBold(!isBold)}
          className={`w-7 h-7 rounded flex items-center justify-center transition-all ${
            isBold ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setIsItalic(!isItalic)}
          className={`w-7 h-7 rounded flex items-center justify-center transition-all ${
            isItalic ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setIsUnderline(!isUnderline)}
          className={`w-7 h-7 rounded flex items-center justify-center transition-all ${
            isUnderline ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-4 bg-slate-300 mx-1" />
        <button
          onClick={() => setAlign('left')}
          className={`w-7 h-7 rounded flex items-center justify-center transition-all ${
            align === 'left' ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setAlign('center')}
          className={`w-7 h-7 rounded flex items-center justify-center transition-all ${
            align === 'center' ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setAlign('right')}
          className={`w-7 h-7 rounded flex items-center justify-center transition-all ${
            align === 'right' ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-4 bg-slate-300 mx-1" />
        <button className="w-7 h-7 rounded flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-all">
          <List className="w-3.5 h-3.5" />
        </button>
        <div className="flex-1" />
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-all">
          <UploadCloud className="w-3.5 h-3.5" />
          Export Directly to Google Drive
        </button>
      </div>

      {/* Document Canvas */}
      <div className="flex-1 bg-slate-100 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto bg-white min-h-[800px] shadow-lg rounded-sm p-10 relative">
          {/* Page header */}
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500">Google Docs Live Workspace [REPLICATED]</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
                <Printer className="w-3.5 h-3.5" />
              </button>
              <button className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-900 mb-6">{title}</h1>

          {/* Content */}
          <div className="space-y-1 text-slate-800 leading-relaxed" style={textStyle}>
            {lines.map((line, idx) => {
              if (line.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-lg font-bold text-slate-900 mt-4 mb-2">
                    {line.replace('## ', '')}
                  </h2>
                );
              }
              if (line.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-base font-semibold text-slate-800 mt-3 mb-1">
                    {line.replace('### ', '')}
                  </h3>
                );
              }
              if (line.startsWith('---')) {
                return <hr key={idx} className="border-slate-200 my-3" />;
              }
              if (line.trim() === '') {
                return <div key={idx} className="h-2" />;
              }
              if (line.startsWith('|') && line.endsWith('|')) {
                return (
                  <div key={idx} className="font-mono text-[11px] text-slate-600 bg-slate-50 px-2 py-1 rounded my-1 overflow-x-auto">
                    {line}
                  </div>
                );
              }
              if (line.startsWith('```')) {
                return (
                  <pre key={idx} className="bg-slate-50 text-slate-700 font-mono text-xs p-3 rounded-lg my-2 overflow-x-auto">
                    {line.replace(/```/g, '')}
                  </pre>
                );
              }
              return (
                <p key={idx} className="py-0.5">
                  {line}
                </p>
              );
            })}
          </div>

          {/* Blinking cursor at end */}
          <div className="mt-8 flex items-center">
            <span className="w-0.5 h-5 bg-slate-900 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
