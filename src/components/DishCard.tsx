import React, { useState } from 'react';
import { Camera, Sparkles, RefreshCw, Wand2, Download, Eye, Tag, AlertTriangle, Layers, Info } from 'lucide-react';
import { DishItem, PhotographyStyle, ImageResolution } from '../utils/promptBuilder';

interface DishCardProps {
  dish: DishItem;
  currentGlobalStyle: PhotographyStyle;
  currentResolution: ImageResolution;
  onGenerate: (dishId: string, style?: PhotographyStyle) => Promise<void>;
  onOpenRetouch: (dish: DishItem) => void;
  onInspect: (dish: DishItem) => void;
}

export const DishCard: React.FC<DishCardProps> = ({
  dish,
  currentGlobalStyle,
  currentResolution,
  onGenerate,
  onOpenRetouch,
  onInspect,
}) => {
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const isGenerating = dish.status === 'generating';

  const downloadImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!dish.imageUrl) return;
    const link = document.createElement('a');
    link.href = dish.imageUrl;
    const safeName = dish.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    link.download = `${safeName}-${currentResolution.toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStyleBadgeColor = (style?: PhotographyStyle) => {
    switch (style) {
      case 'Rustic/Dark':
        return 'bg-amber-950/70 text-amber-300 border-amber-600/40';
      case 'Bright/Modern':
        return 'bg-sky-950/70 text-sky-300 border-sky-600/40';
      case 'Social Media':
        return 'bg-pink-950/70 text-pink-300 border-pink-600/40';
      default:
        return 'bg-white/10 text-white border-white/20';
    }
  };

  const activeStyle = dish.history?.[dish.history.length - 1]?.style || currentGlobalStyle;

  return (
    <div className="bg-[#14161b] rounded-2xl border border-white/10 overflow-hidden shadow-xl flex flex-col transition-all hover:border-white/20 group">
      {/* Photo Frame Container */}
      <div className="relative aspect-square sm:aspect-4/3 w-full bg-[#0a0b0d] overflow-hidden flex items-center justify-center">
        {dish.imageUrl ? (
          <>
            <img
              src={dish.imageUrl}
              alt={dish.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md shadow-md ${getStyleBadgeColor(
                  activeStyle
                )}`}
              >
                {activeStyle}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 text-amber-300 border border-amber-400/30 backdrop-blur-md">
                {dish.history?.[dish.history.length - 1]?.imageSize || currentResolution}
              </span>
              {dish.history && dish.history.length > 1 && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30 backdrop-blur-md flex items-center gap-1">
                  <Wand2 className="w-2.5 h-2.5" />
                  <span>v{dish.history.length}</span>
                </span>
              )}
            </div>

            {/* Hover Actions Bar */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 gap-2">
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => onInspect(dish)}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
                  title="Inspect Fullscreen"
                  aria-label="Inspect Fullscreen"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onOpenRetouch(dish)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold backdrop-blur-md shadow-lg transition-transform active:scale-95 cursor-pointer"
                  title="Retouch with AI (gemini-nano-banana-2.1)"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>AI Retouch</span>
                </button>

                <button
                  type="button"
                  onClick={downloadImage}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors cursor-pointer"
                  title="Download Image"
                  aria-label="Download Image"
                >
                  <Download className="w-4 h-4" />
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsStyleMenuOpen(!isStyleMenuOpen)}
                    className="p-2 rounded-xl bg-amber-500/30 hover:bg-amber-500/40 text-amber-200 border border-amber-500/40 backdrop-blur-md transition-colors cursor-pointer"
                    title="Reshoot in another style"
                    aria-label="Reshoot in another style"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  {isStyleMenuOpen && (
                    <div className="absolute bottom-full right-0 mb-2 w-44 rounded-xl bg-[#1a1c22] border border-white/10 shadow-2xl p-1 z-20 text-xs">
                      <p className="px-2 py-1 text-[10px] uppercase font-semibold text-neutral-400">
                        Reshoot Aesthetic:
                      </p>
                      {(['Rustic/Dark', 'Bright/Modern', 'Social Media'] as PhotographyStyle[]).map(
                        (s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setIsStyleMenuOpen(false);
                              onGenerate(dish.id, s);
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg text-neutral-200 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            {s}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : isGenerating ? (
          /* Generating State */
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="relative w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Camera className="w-7 h-7 text-amber-400 animate-pulse" />
              <div className="absolute inset-0 rounded-2xl border-2 border-amber-500/40 animate-ping opacity-25" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-300">Styling & Shooting Dish...</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Applying {currentGlobalStyle} studio lighting & {currentResolution} resolution
              </p>
            </div>
          </div>
        ) : (
          /* Empty / Ready to Shoot State */
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            {/* Camera Viewfinder Overlay Grid */}
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-500 group-hover:text-amber-400 group-hover:border-amber-500/30 group-hover:bg-amber-500/5 transition-all">
              <Camera className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                Studio Viewfinder
              </span>
              <p className="text-xs text-neutral-400">No photography captured yet</p>
            </div>
            <button
              type="button"
              onClick={() => onGenerate(dish.id)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 font-bold shadow-md shadow-orange-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Capture Shot</span>
            </button>
          </div>
        )}

        {dish.lastError && (
          <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-rose-950/90 border border-rose-500/40 text-[11px] text-rose-300 flex items-center gap-1.5 z-10">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
            <span className="truncate">{dish.lastError}</span>
          </div>
        )}
      </div>

      {/* Dish Details Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400/90">
              {dish.category || 'Specialty'}
            </span>
            {dish.price && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white/5 text-emerald-400 border border-emerald-500/20">
                {dish.price}
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-white font-serif-culinary group-hover:text-amber-200 transition-colors">
            {dish.name}
          </h3>
          <p className="text-xs text-neutral-400 mt-1 line-clamp-3 leading-relaxed">
            {dish.description || 'Delicious chef specialty prepared fresh with premium artisanal ingredients.'}
          </p>
        </div>

        {/* Visible Ingredients */}
        {dish.ingredients && dish.ingredients.length > 0 && (
          <div className="pt-2 border-t border-white/5 flex flex-wrap gap-1">
            {dish.ingredients.slice(0, 4).map((ing, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-neutral-300 border border-white/5"
              >
                {ing}
              </span>
            ))}
          </div>
        )}

        {/* Plating Note */}
        {dish.suggestedPlating && (
          <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 bg-[#101215] p-2 rounded-lg border border-white/5">
            <Info className="w-3.5 h-3.5 shrink-0 text-amber-500/70" />
            <span className="truncate">Plating: {dish.suggestedPlating}</span>
          </div>
        )}
      </div>
    </div>
  );
};
