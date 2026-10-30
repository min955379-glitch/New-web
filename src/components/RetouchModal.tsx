import React, { useState } from 'react';
import { Wand2, X, Sparkles, Sliders, History, Check, ArrowRight, Download, RefreshCw, ZoomIn } from 'lucide-react';
import { DishItem, ImageResolution } from '../utils/promptBuilder';

interface RetouchModalProps {
  dish: DishItem | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyRetouch: (dishId: string, editPrompt: string, imageSize: ImageResolution) => Promise<void>;
  isRetouching: boolean;
  retouchError: string | null;
}

export const RetouchModal: React.FC<RetouchModalProps> = ({
  dish,
  isOpen,
  onClose,
  onApplyRetouch,
  isRetouching,
  retouchError,
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedSize, setSelectedSize] = useState<ImageResolution>('2K');
  const [showOriginal, setShowOriginal] = useState(false);

  if (!isOpen || !dish || !dish.imageUrl) return null;

  const quickChefRetouches = [
    'Add curls of fragrant steam rising from the hot dish',
    'Add fresh micro-herb garnish, edible violas, and flaky Maldon salt',
    'Drizzle a glossy 25-year aged balsamic reduction swirl on the plate',
    'Place a vintage brass fork resting beside the plate',
    'Make the background darker rustic reclaimed timber with warm candle glow',
    'Enhance golden-brown caramelized sear marks and crisp texture',
    'Add a delicate glass of chilled dry white wine in soft background focus',
    'Replace the dishware with an artisanal matte black charcoal stoneware plate',
  ];

  const originalImage = dish.history?.[0]?.imageUrl || dish.imageUrl;
  const currentImage = dish.imageUrl;

  const handleApply = async () => {
    if (!prompt.trim()) return;
    await onApplyRetouch(dish.id, prompt.trim(), selectedSize);
    setPrompt('');
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `${dish.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-retouched.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#13151a] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0e1014]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-serif-culinary">
                  AI Culinary Retouch & Food Styling
                </h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  gemini-nano-banana-2.1
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Refine garnish, lighting, steam, tableware, or camera mood for {dish.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close retouch modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Photo Preview Panel */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            <div className="relative aspect-square sm:aspect-4/3 w-full rounded-xl overflow-hidden bg-[#090a0c] border border-white/10 flex items-center justify-center">
              <img
                src={showOriginal ? originalImage : currentImage}
                alt={dish.name}
                className="w-full h-full object-cover"
              />

              {/* Compare Button */}
              {dish.history && dish.history.length > 1 && (
                <button
                  type="button"
                  onMouseDown={() => setShowOriginal(true)}
                  onMouseUp={() => setShowOriginal(false)}
                  onTouchStart={() => setShowOriginal(true)}
                  onTouchEnd={() => setShowOriginal(false)}
                  className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/75 hover:bg-black/90 text-amber-200 border border-amber-400/30 text-xs font-semibold backdrop-blur-md shadow-lg transition-all cursor-pointer"
                >
                  {showOriginal ? 'Showing Original' : 'Hold to View Original'}
                </button>
              )}

              <button
                type="button"
                onClick={handleDownload}
                className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/75 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-colors"
                title="Download this version"
              >
                <Download className="w-4 h-4" />
              </button>

              {isRetouching && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center mb-3">
                    <Sparkles className="w-6 h-6 text-purple-300 animate-spin" />
                  </div>
                  <p className="text-sm font-bold text-white">Nano Banana 2.1 Styling Shot...</p>
                  <p className="text-xs text-purple-300 mt-1">Applying chef retouch prompt & realistic food lighting</p>
                </div>
              )}
            </div>

            {/* Revision Timeline */}
            {dish.history && dish.history.length > 0 && (
              <div className="bg-[#101216] p-3 rounded-xl border border-white/5 space-y-2">
                <span className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <History className="w-3 h-3 text-purple-400" />
                  <span>Version History ({dish.history.length})</span>
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {dish.history.map((rev, idx) => (
                    <div
                      key={rev.id || idx}
                      className="shrink-0 flex items-center gap-2 p-1.5 rounded-lg bg-[#181a20] border border-white/5 text-[11px]"
                    >
                      <img src={rev.imageUrl} alt="" className="w-8 h-8 rounded-md object-cover" />
                      <div className="leading-tight">
                        <p className="font-semibold text-neutral-200">
                          {idx === 0 ? 'Initial Shot' : `Retouch ${idx}`}
                        </p>
                        <p className="text-[10px] text-neutral-500 truncate max-w-[130px]">
                          {rev.editPrompt || rev.style}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Retouch Controls Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Resolution affordance for retouch */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5 mb-1.5">
                  <Sliders className="w-3.5 h-3.5 text-purple-400" />
                  <span>Output Resolution:</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['1K', '2K', '4K'] as ImageResolution[]).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'border-purple-500 bg-purple-950/40 text-purple-200 ring-1 ring-purple-500'
                          : 'border-white/10 bg-[#17191f] text-neutral-400 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Natural Language Prompt Input */}
              <div>
                <label htmlFor="retouch-input" className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  Natural Language Retouch Prompt
                </label>
                <textarea
                  id="retouch-input"
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Add extra fresh basil leaves and coarse sea salt, or make lighting more dramatic with steam..."
                  className="w-full rounded-xl bg-[#0e1014] border border-white/10 p-3 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Chef Suggestions Quick Chips */}
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
                  Chef Styling Suggestions (Click to Use):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {quickChefRetouches.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPrompt(chip)}
                      className="text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/5 transition-colors cursor-pointer"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              {retouchError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                  {retouchError}
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={!prompt.trim() || isRetouching}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30 disabled:opacity-40 transition-all cursor-pointer"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isRetouching ? 'animate-spin' : ''}`} />
                <span>{isRetouching ? 'Retouching with Nano Banana...' : 'Apply Retouch'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
