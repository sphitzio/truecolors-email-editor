import { useState, useEffect, useRef } from 'react';
import { Monitor, Smartphone, Check, Copy, Code, Eye, FileJson, AlertCircle } from 'lucide-react';

interface PreviewFrameProps {
  // The raw (still-Liquid) template — what gets copied/downloaded for Shopify.
  rawHtml: string;
  // The Liquid-rendered, style-rewritten HTML used for the live preview iframe.
  previewHtml: string;
  // Filename stem for downloads.
  fileName: string;
  viewMode: 'preview' | 'code';
  onChangeViewMode: (mode: 'preview' | 'code') => void;
  isDark?: boolean;
}

export default function PreviewFrame({
  rawHtml,
  previewHtml,
  fileName,
  viewMode,
  onChangeViewMode,
  isDark = true,
}: PreviewFrameProps) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(650);

  // Write the rendered HTML into the sandboxed iframe and auto-size it.
  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(previewHtml);
    doc.close();

    const updateHeight = () => {
      const idoc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
      const body = idoc?.body;
      if (!body) return;
      setIframeHeight(body.scrollHeight || 650);
      body.querySelectorAll('img').forEach((img) => {
        if (!img.complete) img.addEventListener('load', updateHeight, { once: true });
      });
    };

    updateHeight();
    const win = iframeRef.current.contentWindow;
    win?.addEventListener('resize', updateHeight);
    const t1 = setTimeout(updateHeight, 150);
    const t2 = setTimeout(updateHeight, 450);

    return () => {
      win?.removeEventListener('resize', updateHeight);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [previewHtml, viewMode, device]);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHTMLFile = () => {
    const blob = new Blob([rawHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName || 'notification'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`border rounded-3xl p-6 shadow-sm flex flex-col h-auto transition-colors duration-200 ${
      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
    }`}>
      {/* Toolbar */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 mb-5 ${
        isDark ? 'border-slate-800' : 'border-slate-100'
      }`}>
        <div>
          <h3 className={`font-bold text-lg flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            <span>Template Sandbox</span>
            <span className={`text-[10px] font-mono select-none px-2 py-0.5 rounded-full ${
              isDark ? 'bg-slate-950 text-slate-400 border border-slate-850' : 'bg-slate-100 text-slate-600'
            } font-medium`}>
              Live Preview
            </span>
          </h3>
          <p className={`text-xs font-sans mt-0.5 ${isDark ? 'text-slate-450' : 'text-slate-400'}`}>
            Real TrueColors notification rendered with mock data. Raw Liquid is preserved on copy/export.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`border p-0.5 rounded-lg flex gap-0.5 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100/80'
          }`}>
            <button
              onClick={() => onChangeViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'preview'
                  ? isDark ? 'bg-slate-800 text-indigo-400 shadow-sm' : 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Sandbox Preview</span>
            </button>
            <button
              onClick={() => onChangeViewMode('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'code'
                  ? isDark ? 'bg-slate-800 text-indigo-400 shadow-sm' : 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Liquid HTML</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 duration-100 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 animate-ping" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Get HTML</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Device selector */}
      {viewMode === 'preview' && (
        <div className={`border p-3.5 rounded-2xl flex flex-wrap items-center justify-end gap-3 mb-5 text-sm animate-fade-in ${
          isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50/80 border-slate-100'
        }`}>
          <div className="flex items-center gap-2 font-sans">
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Width:</span>
            <div className={`p-0.5 rounded-md flex gap-0.5 ${isDark ? 'bg-slate-900' : 'bg-slate-200/60'}`}>
              <button
                onClick={() => setDevice('desktop')}
                className={`p-1.5 rounded transition ${
                  device === 'desktop'
                    ? isDark ? 'bg-slate-800 text-indigo-400 shadow-sm' : 'bg-white text-indigo-600 shadow-sm'
                    : isDark ? 'text-slate-500 hover:text-slate-350' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Desktop view"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`p-1.5 rounded transition ${
                  device === 'mobile'
                    ? isDark ? 'bg-slate-800 text-indigo-400 shadow-sm' : 'bg-white text-indigo-600 shadow-sm'
                    : isDark ? 'text-slate-500 hover:text-slate-350' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Mobile viewport (375px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sandbox panel */}
      <div className={`flex-1 border rounded-2xl p-4 flex justify-center items-start h-auto transition-colors duration-200 ${
        isDark ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-100'
      }`}>
        {viewMode === 'preview' ? (
          <div
            className={`transition-all duration-300 ease-out border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col ${
              isDark ? 'border-slate-800' : 'border-slate-200/40'
            }`}
            style={{ width: device === 'mobile' ? '375px' : '100%', maxWidth: '100%', height: 'auto' }}
          >
            {device === 'mobile' && (
              <div className="bg-slate-900 text-white py-1.5 px-4 flex justify-between items-center text-[11px] font-mono select-none shrink-0">
                <span>9:41 🛍️</span>
                <span className="w-16 h-4 bg-slate-800 rounded-full mx-auto hidden sm:block"></span>
                <span className="flex items-center gap-1">5G 🔋</span>
              </div>
            )}
            <iframe
              ref={iframeRef}
              title="Shopify Email Live Render Sandbox"
              className="w-full border-0 bg-white"
              style={{ height: `${iframeHeight}px`, overflow: 'hidden' }}
              scrolling="no"
            />
          </div>
        ) : (
          <div className="w-full h-[700px] flex flex-col bg-slate-950 rounded-xl overflow-hidden text-slate-200 border border-slate-800">
            <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-800 text-xs shrink-0">
              <div className="flex items-center gap-2 text-slate-400 font-mono">
                <FileJson className="w-4 h-4 text-emerald-400" />
                <span>{fileName || 'notification'}.liquid</span>
              </div>
              <button
                onClick={downloadHTMLFile}
                className="text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 border border-slate-700 px-2.5 py-1 rounded transition cursor-pointer"
              >
                Download HTML File
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 font-mono text-[12px] leading-relaxed select-all">
              <pre className="text-emerald-400/90 whitespace-pre-wrap font-mono select-text selection:bg-neutral-800 selection:text-white">
                {rawHtml}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Footer note */}
      <div className={`mt-4 pt-4 border-t flex items-start gap-2.5 text-xs transition-colors p-3.5 rounded-xl ${
        isDark ? 'border-slate-800 text-slate-400 bg-slate-950/40' : 'border-slate-100 text-slate-400 bg-slate-50/50'
      }`}>
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="font-sans leading-relaxed">
          <strong className={`font-semibold font-sans ${isDark ? 'text-slate-350' : 'text-slate-600'}`}>Shopify Deployment Tip: </strong>
          Paste the copied HTML directly under <code className={`font-mono px-1 py-0.5 rounded text-[10px] ${
            isDark ? 'text-indigo-400 bg-indigo-950/30' : 'text-indigo-600 bg-indigo-50'
          }`}>Settings &gt; Notifications &gt; [Template] &gt; Edit Code</code>. The preview uses mock data; the exported file keeps all raw Liquid tags.
        </p>
      </div>
    </div>
  );
}
