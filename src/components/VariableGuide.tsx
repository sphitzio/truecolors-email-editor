import React, { useState } from 'react';
import { LIQUID_VARIABLES } from '../utils/presets';
import { Copy, Check, Info, Sparkles } from 'lucide-react';

interface VariableGuideProps {
  onInsertVariable?: (tag: string) => void;
  isDark?: boolean;
}

export default function VariableGuide({ onInsertVariable, isDark = true }: VariableGuideProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const handleCopy = (tag: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const filteredVariables = LIQUID_VARIABLES.filter(v =>
    v.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(LIQUID_VARIABLES.map(v => v.category)));

  return (
    <div 
      id="variable-guide-sidebar" 
      className={`border rounded-2xl p-5 flex flex-col h-full transition-colors duration-200 ${
        isDark 
          ? 'bg-slate-900 border-slate-800 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-indigo-500'}`} />
        <h3 className={`font-bold text-lg font-sans ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>Liquid Variable Vault</h3>
      </div>
      <p className={`text-xs mb-4 font-sans ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Click a tag to insert it into your active field, or use the copy icon. Shopify compiles these dynamically at checkout!
      </p>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Filter variables..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`w-full text-sm border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:border-indigo-500 placeholder-slate-500 transition-all font-sans ${
          isDark 
            ? 'bg-slate-800 text-slate-200 border-slate-700 focus:bg-slate-850' 
            : 'bg-slate-50 text-slate-800 border-slate-200 focus:bg-white'
        }`}
      />

      <div className="flex-1 overflow-y-auto space-y-5 pr-1 max-h-[350px]">
        {categories.map(category => {
          const categoryVars = filteredVariables.filter(v => v.category === category);
          if (categoryVars.length === 0) return null;

          return (
            <div key={category} className="space-y-2">
              <span className={`text-[10px] font-bold tracking-wider uppercase block mb-1 font-mono ${
                isDark ? 'text-indigo-400' : 'text-indigo-600'
              }`}>
                {category}
              </span>
              <div className="grid grid-cols-1 gap-2">
                {categoryVars.map(variable => (
                  <div
                    key={variable.tag}
                    onClick={() => onInsertVariable?.(variable.tag)}
                    className={`group border rounded-xl p-3 text-left transition-all cursor-pointer relative ${
                      isDark 
                        ? 'bg-slate-850/50 hover:bg-slate-800 border-slate-800 hover:border-slate-700' 
                        : 'bg-slate-50/50 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.01)]'
                    }`}
                    title="Click to insert into selected text area"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <code className={`text-[12px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
                        isDark 
                          ? 'text-emerald-400 bg-emerald-950/40 border-emerald-900/30' 
                          : 'text-emerald-700 bg-emerald-50 border-emerald-200/40'
                      } break-all select-all`}>
                        {variable.tag}
                      </code>
                      <button
                        onClick={(e) => handleCopy(variable.tag, e)}
                        className={`p-1 rounded transition ${
                          isDark ? 'text-slate-400 hover:text-slate-150 hover:bg-slate-700' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-200/50'
                        }`}
                      >
                        {copiedTag === variable.tag ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <p className={`text-xs font-sans leading-tight ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {variable.description}
                    </p>
                    <div className={`mt-1.5 flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded w-fit ${
                      isDark ? 'bg-slate-900/40 text-slate-500' : 'bg-slate-200/40 text-slate-500'
                    }`}>
                      <span className={`font-semibold font-sans ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Simulated as:</span>
                      <span className="font-mono text-indigo-400 font-bold italic">"{variable.placeholder}"</span>
                    </div>

                    {/* Copy confirmation toast overlay */}
                    {copiedTag === variable.tag && (
                      <span className="absolute right-8 top-3 text-[10px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-md animate-fade-in shadow">
                        Copied!
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {filteredVariables.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Info className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p className="text-xs font-sans animate-fade-in">No matching variables found</p>
          </div>
        )}
      </div>

      <div className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] font-sans ${
        isDark ? 'border-slate-800 text-slate-500' : 'border-slate-150 text-slate-400'
      }`}>
        <span>Active Sandbox Platform</span>
        <span className={`px-1.5 py-0.5 rounded font-mono ${isDark ? 'bg-slate-800 text-slate-450' : 'bg-slate-100 text-slate-600'}`}>v2.1</span>
      </div>
    </div>
  );
}
