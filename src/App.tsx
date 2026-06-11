import { useState, useEffect, useRef, useCallback } from 'react';
import { TemplateMeta, BrandState } from './types';
import PreviewFrame from './components/PreviewFrame';
import VariableGuide from './components/VariableGuide';
import { renderTemplatePreview } from './utils/liquidPreview';
import { mergeBrandHeader, injectHeaderFooter, imageSnippet } from './utils/headerMerge';
import {
  Settings,
  ImagePlus,
  Layers,
  RefreshCw,
  Moon,
  Sun,
  Search,
  Mail,
  Info,
  PanelTop,
  PanelBottom,
} from 'lucide-react';

const BASE = import.meta.env.BASE_URL || '/';

// Default brand header = the existing tool's TrueColors logo.
const DEFAULT_BRAND: BrandState = {
  logoUrl: 'https://cdn.shopify.com/s/files/1/0819/7518/1554/files/Frame_626401_430x.png?v=1781048209',
  logoWidth: 160,
  storeName: 'TrueColors',
};

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [templates, setTemplates] = useState<TemplateMeta[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [search, setSearch] = useState('');

  // The original fetched template, the brand fields, and the live editable text.
  const [originalHtml, setOriginalHtml] = useState('');
  const [brand, setBrand] = useState<BrandState>(DEFAULT_BRAND);
  const [editedHtml, setEditedHtml] = useState('');

  // Optional custom header / footer banners injected into every template.
  const [headerHtml, setHeaderHtml] = useState('');
  const [footerHtml, setFooterHtml] = useState('');

  const [previewHtml, setPreviewHtml] = useState('');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [imageUrl, setImageUrl] = useState('');

  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Build the editable HTML from the original: brand logo + header/footer bands.
  const buildEdited = useCallback(
    (html: string) =>
      injectHeaderFooter(mergeBrandHeader(html, brand), headerHtml, footerHtml),
    [brand, headerHtml, footerHtml],
  );

  // Load the template index once.
  useEffect(() => {
    fetch(`${BASE}templates/index.json`)
      .then((r) => r.json())
      .then((list: TemplateMeta[]) => {
        setTemplates(list);
        if (list.length) setActiveId(list[0].id);
      })
      .catch(() => setTemplates([]));
  }, []);

  // Fetch a template's raw HTML when the selection changes.
  useEffect(() => {
    if (!activeId) return;
    const meta = templates.find((t) => t.id === activeId);
    if (!meta) return;
    fetch(`${BASE}templates/${encodeURIComponent(meta.file)}`)
      .then((r) => r.text())
      .then((html) => {
        setOriginalHtml(html);
        setEditedHtml(buildEdited(html));
      })
      .catch(() => {
        setOriginalHtml('');
        setEditedHtml('');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, templates]);

  // Rebuild from the ORIGINAL whenever brand / header / footer fields change.
  useEffect(() => {
    if (originalHtml) setEditedHtml(buildEdited(originalHtml));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand, headerHtml, footerHtml]);

  // Render the edited template through liquidjs for the preview (debounced).
  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      const out = await renderTemplatePreview(editedHtml, BASE);
      if (!cancelled) setPreviewHtml(out);
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [editedHtml]);

  const activeMeta = templates.find((t) => t.id === activeId);

  // Insert text (Liquid variable or image) at the editor cursor.
  const insertAtCursor = useCallback((snippet: string) => {
    const el = editorRef.current;
    if (!el) {
      setEditedHtml((prev) => prev + snippet);
      return;
    }
    const start = el.selectionStart ?? editedHtml.length;
    const end = el.selectionEnd ?? editedHtml.length;
    const next = editedHtml.slice(0, start) + snippet + editedHtml.slice(end);
    setEditedHtml(next);
    setTimeout(() => {
      el.focus();
      const pos = start + snippet.length;
      el.setSelectionRange(pos, pos);
    }, 30);
  }, [editedHtml]);

  const handleInsertImage = () => {
    if (!imageUrl.trim()) return;
    insertAtCursor(imageSnippet(imageUrl.trim()));
    setImageUrl('');
  };

  const handleReset = () => {
    if (originalHtml) setEditedHtml(buildEdited(originalHtml));
  };

  const card = isDark
    ? 'bg-slate-900 border-slate-800'
    : 'bg-white border-slate-200/70';
  const labelClass = isDark
    ? 'text-xs font-bold text-slate-300 block mb-1.5 font-sans'
    : 'text-xs font-bold text-slate-700 block mb-1.5 font-sans';
  const inputClass = isDark
    ? 'w-full text-slate-100 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 transition-all font-sans text-sm'
    : 'w-full text-slate-800 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 transition-all font-sans text-sm';

  const filtered = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-200 ${
      isDark ? 'bg-slate-950 text-slate-150' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Header */}
      <header className={`shrink-0 sticky top-0 z-30 border-b ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-100 text-slate-900'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center border shrink-0 ${
              isDark ? 'bg-slate-850 border-slate-800' : 'bg-slate-100 border-slate-100'
            }`}>
              <img
                src="https://cdn.shopify.com/s/files/1/0819/7518/1554/files/TC_MONOGRAM_430x.png?v=1780956710#"
                alt="TrueColors"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className={`text-md font-extrabold tracking-tight flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-850'}`}>
                TrueColors Notification Editor
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isDark ? 'bg-slate-950 text-indigo-400 border-indigo-950/60' : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                }`}>
                  {templates.length} templates
                </span>
              </h1>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                Edit the live Shopify notification templates and export the Liquid HTML.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDark(!isDark)}
              className={`w-11 h-6.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer border ${
                isDark ? 'bg-slate-800 border-slate-750' : 'bg-slate-200 border-slate-300'
              }`}
              title="Toggle interface theme"
            >
              <div className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 flex items-center justify-center ${
                isDark ? 'translate-x-4.5 bg-indigo-650 text-white' : 'translate-x-0 bg-white'
              }`}>
                {isDark ? <Moon className="w-3 h-3 text-indigo-400" /> : <Sun className="w-3 h-3 text-amber-500" />}
              </div>
            </button>
            <button
              onClick={handleReset}
              className={`group flex items-center gap-1.5 text-xs border px-3 py-2 rounded-xl transition font-semibold cursor-pointer ${
                isDark ? 'text-slate-300 hover:text-white border-slate-800 bg-slate-900/60 hover:bg-slate-800' : 'text-slate-500 hover:text-indigo-600 border-slate-100 bg-slate-50 hover:bg-indigo-50/50'
              }`}
              title="Revert edits to the original template (with brand header)"
            >
              <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-45 transition duration-300" />
              <span>Reset Template</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT column */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-4 overflow-y-auto max-h-[850px] lg:max-h-[calc(100vh-140px)] pr-1">
          {/* Notification Presets picker */}
          <div className={`border rounded-2xl p-5 ${card}`}>
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-4 h-4 text-indigo-400" />
              <h3 className={`font-bold text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Notification Presets</h3>
            </div>
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates..."
                className={`${inputClass} pl-9`}
              />
            </div>
            <div className="grid grid-cols-1 gap-1.5 max-h-72 overflow-y-auto pr-1">
              {filtered.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveId(t.id)}
                  className={`text-left text-sm px-3 py-2 rounded-lg border transition-all ${
                    activeId === t.id
                      ? isDark ? 'bg-indigo-950/40 border-indigo-800 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-800'
                      : isDark ? 'bg-slate-850/40 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-slate-50/50 border-slate-200/70 text-slate-700 hover:bg-white'
                  }`}
                >
                  {t.name}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-xs text-slate-500 py-4 text-center">No templates match.</p>
              )}
            </div>
          </div>

          {/* Brand header fields */}
          <div className={`border rounded-2xl p-5 ${card}`}>
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-4 h-4 text-pink-400" />
              <h3 className={`font-bold text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Brand Header</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className={labelClass}>Logo Image URL (merged into every template)</label>
                <input
                  value={brand.logoUrl}
                  onChange={(e) => setBrand({ ...brand, logoUrl: e.target.value })}
                  className={inputClass}
                  placeholder="https://"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Logo Width (px)</label>
                  <input
                    type="number"
                    value={brand.logoWidth}
                    onChange={(e) => setBrand({ ...brand, logoWidth: Number(e.target.value) })}
                    className={inputClass}
                    min={40}
                    max={400}
                  />
                </div>
                <div>
                  <label className={labelClass}>Logo Alt / Store Name</label>
                  <input
                    value={brand.storeName}
                    onChange={(e) => setBrand({ ...brand, storeName: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Custom header / footer banners */}
          <div className={`border rounded-2xl p-5 ${card}`}>
            <div className="flex items-center gap-2 mb-3">
              <PanelTop className="w-4 h-4 text-sky-400" />
              <h3 className={`font-bold text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Header & Footer</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className={`${labelClass} flex items-center gap-1.5`}>
                  <PanelTop className="w-3 h-3" /> Custom Header (HTML, injected at top)
                </label>
                <textarea
                  value={headerHtml}
                  onChange={(e) => setHeaderHtml(e.target.value)}
                  spellCheck={false}
                  placeholder="e.g. <strong>Free shipping over Dhs. 200</strong>"
                  className={`w-full h-20 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 font-mono text-[11px] border ${
                    isDark ? 'text-slate-100 bg-slate-950 border-slate-800' : 'text-slate-800 bg-white border-slate-200'
                  }`}
                />
              </div>
              <div>
                <label className={`${labelClass} flex items-center gap-1.5`}>
                  <PanelBottom className="w-3 h-3" /> Custom Footer (HTML, injected at bottom)
                </label>
                <textarea
                  value={footerHtml}
                  onChange={(e) => setFooterHtml(e.target.value)}
                  spellCheck={false}
                  placeholder="e.g. TrueColors · Dubai, UAE · <a href='{{ shop.url }}'>Visit store</a>"
                  className={`w-full h-20 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 font-mono text-[11px] border ${
                    isDark ? 'text-slate-100 bg-slate-950 border-slate-800' : 'text-slate-800 bg-white border-slate-200'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Image inserter */}
          <div className={`border rounded-2xl p-5 ${card}`}>
            <div className="flex items-center gap-2 mb-3">
              <ImagePlus className="w-4 h-4 text-amber-400" />
              <h3 className={`font-bold text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Insert Image</h3>
            </div>
            <div className="flex gap-2">
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleInsertImage()}
                className={inputClass}
                placeholder="https://image-url.png"
              />
              <button
                onClick={handleInsertImage}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl text-xs font-bold shrink-0 cursor-pointer"
              >
                Insert
              </button>
            </div>
            <p className={`text-[10px] mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Inserts a responsive <code>&lt;img&gt;</code> at the cursor in the editor below.
            </p>
          </div>

          {/* Raw HTML editor */}
          <div className={`border rounded-2xl p-5 ${card}`}>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h3 className={`font-bold text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Template HTML — {activeMeta?.name || '…'}
              </h3>
            </div>
            <textarea
              ref={editorRef}
              value={editedHtml}
              onChange={(e) => setEditedHtml(e.target.value)}
              spellCheck={false}
              className={`w-full h-80 rounded-xl px-3.5 py-3 focus:outline-none focus:border-indigo-500 transition-all font-mono text-[11px] leading-relaxed border ${
                isDark ? 'text-slate-100 bg-slate-950 border-slate-800' : 'text-slate-800 bg-white border-slate-200'
              }`}
            />
          </div>

          {/* Liquid Variable Vault */}
          <VariableGuide onInsertVariable={insertAtCursor} isDark={isDark} />

          {/* Notice */}
          <div className={`border rounded-2xl p-4 flex items-start gap-3 ${
            isDark ? 'bg-indigo-950/20 border-indigo-900/40 text-indigo-300' : 'bg-indigo-950 border-indigo-900 text-indigo-200'
          }`}>
            <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Preview uses mock data to resolve <code className="font-mono">{'{{ liquid }}'}</code> tags and a bundled copy of Shopify's notification stylesheet. The exported HTML keeps the original raw Liquid intact for pasting into Shopify Admin.
            </p>
          </div>
        </div>

        {/* RIGHT column */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-5">
          <PreviewFrame
            rawHtml={editedHtml}
            previewHtml={previewHtml}
            fileName={activeMeta?.name || 'notification'}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            isDark={isDark}
          />
        </div>
      </main>

      <footer className={`py-3 text-center text-xs shrink-0 border-t ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-100 text-slate-400'
      }`}>
        TrueColors notification template editor — Liquid preview rendered client-side.
      </footer>
    </div>
  );
}
