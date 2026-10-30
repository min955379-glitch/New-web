import React, { useState, useRef } from 'react';
import { Upload, FileText, Sparkles, AlertCircle, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { SAMPLE_MENUS, SampleMenu } from '../utils/sampleMenus';
import { PhotographyStyle } from '../utils/promptBuilder';

interface MenuInputSectionProps {
  onMenuParsed: (text: string) => Promise<void>;
  isParsing: boolean;
  parseError: string | null;
  onSelectSampleStyle?: (style: PhotographyStyle) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const MenuInputSection: React.FC<MenuInputSectionProps> = ({
  onMenuParsed,
  isParsing,
  parseError,
  onSelectSampleStyle,
  isOpen,
  onClose,
}) => {
  const [inputText, setInputText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setInputText(content);
        setSelectedSample(null);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const loadSample = (sample: SampleMenu) => {
    setInputText(sample.rawText);
    setSelectedSample(sample.id);
    if (onSelectSampleStyle) {
      onSelectSampleStyle(sample.suggestedStyle);
    }
  };

  const handleSubmit = async () => {
    if (!inputText.trim()) return;
    await onMenuParsed(inputText);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#14161b] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#101216]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white font-serif-culinary">
                Upload or Paste Restaurant Menu
              </h2>
              <p className="text-xs text-neutral-400">
                AI parses your dishes, descriptions, and courses into a professional photo shoot roster
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close menu upload modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Sample Menu Quick Pickers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Or Try A Curated Sample Restaurant Menu:
              </span>
              <span className="text-[11px] text-neutral-500">1-click preview</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SAMPLE_MENUS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => loadSample(sample)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedSample === sample.id
                      ? 'border-amber-500 bg-amber-950/30 ring-1 ring-amber-500'
                      : 'border-white/10 bg-[#191c22] hover:border-white/20 hover:bg-[#1e222a]'
                  }`}
                >
                  <p className="text-xs font-bold text-white truncate">{sample.restaurantName}</p>
                  <p className="text-[11px] text-amber-400/90 truncate">{sample.cuisine}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-400">
                    <span>Style: {sample.suggestedStyle}</span>
                    <ChevronRight className="w-3 h-3 text-neutral-500" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Drag & Drop File Upload or Paste Box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="menu-textarea" className="text-xs font-semibold text-neutral-300">
                Menu Text or File
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>Upload .txt, .md, .csv file</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.json,.csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`relative rounded-xl border transition-all ${
                dragActive ? 'border-amber-400 bg-amber-950/20' : 'border-white/10 bg-[#0e1014]'
              }`}
            >
              <textarea
                id="menu-textarea"
                rows={9}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setSelectedSample(null);
                }}
                placeholder="Paste your restaurant menu here, for example:

[STARTERS]
Crispy Truffle Arancini - $16
Carnaroli rice, wild forest mushroom, taleggio cheese core, black truffle aioli

Pan-Seared Sea Scallops - $22
Caramelized jumbo scallops, sweet corn emulsion, crispy pancetta lardons

[MAINS]
Prime Dry-Aged Ribeye 14oz - $58
Grilled over white oak, roasted bone marrow butter, blistered vine tomatoes"
                className="w-full bg-transparent p-4 text-xs font-mono text-neutral-200 placeholder-neutral-600 focus:outline-none resize-none leading-relaxed"
              />
              {dragActive && (
                <div className="absolute inset-0 bg-amber-500/10 backdrop-blur-xs flex items-center justify-center rounded-xl pointer-events-none">
                  <p className="text-sm font-semibold text-amber-300">Drop your menu file here</p>
                </div>
              )}
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] text-neutral-500">
              <span>Supports appetizers, mains, desserts, drinks with price & culinary notes</span>
              <span>{inputText.length} characters</span>
            </div>
          </div>

          {parseError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{parseError}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#101216] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!inputText.trim() || isParsing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 font-bold shadow-lg shadow-orange-500/20 disabled:opacity-40 transition-all cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 ${isParsing ? 'animate-spin' : ''}`} />
            <span>{isParsing ? 'Consultant Analyzing Menu...' : 'Parse & Prepare Photo Shoot'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
