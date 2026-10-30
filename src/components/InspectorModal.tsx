import React from 'react';
import { X, Download, Wand2, RefreshCw, ZoomIn, Info, Sparkles } from 'lucide-react';
import { DishItem, PhotographyStyle, ImageResolution } from '../utils/promptBuilder';

interface InspectorModalProps {
  dish: DishItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRetouch: (dish: DishItem) => void;
  onReshoot: (dishId: string, style?: PhotographyStyle) => Promise<void>;
}

export const InspectorModal: React.FC<InspectorModalProps> = ({
  dish,
  isOpen,
  onClose,
  onOpenRetouch,
  onReshoot,
}) => {
  if (!isOpen || !dish || !dish.imageUrl) return null;

  const latestHistory = dish.history?.[dish.history.length - 1];

  const handleDownload = () => {
    if (!dish.imageUrl) return;
    const link = document.createElement('a');
    link.href = dish.imageUrl;
    link.download = `${dish.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121418] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0e1014]">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-amber-400">
                  {dish.category}
                </span>
                <span className="text-neutral-500">•</span>
                <h2 className="text-base font-bold text-white font-serif-culinary">
                  {dish.name}
                </h2>
                {dish.price && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/20">
                    {dish.price}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400">Studio Photo Inspection & Culinary Analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close inspector modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Visual */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            <div className="relative aspect-square sm:aspect-4/3 w-full rounded-xl overflow-hidden bg-black border border-white/10">
              <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
              <span>{latestHistory?.imageSize || '2K'} Master Resolution</span>
              <span>Aesthetic: {latestHistory?.style || 'Gourmet'}</span>
            </div>
          </div>

          {/* Details & Specs */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                  Dish Profile
                </h3>
                <p className="text-xs text-neutral-200 leading-relaxed bg-[#171920] p-3 rounded-xl border border-white/5">
                  {dish.description}
                </p>
              </div>

              {dish.ingredients && dish.ingredients.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Styling Ingredients
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {dish.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-amber-200 border border-amber-500/20"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {dish.suggestedPlating && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Plating & Dishware Recommendation
                  </h3>
                  <p className="text-xs text-neutral-300 bg-[#171920] p-3 rounded-xl border border-white/5">
                    {dish.suggestedPlating}
                  </p>
                </div>
              )}

              {latestHistory?.promptUsed && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Studio Lighting & Camera Directives
                  </h3>
                  <p className="text-[11px] text-neutral-400 bg-[#0e1014] p-3 rounded-xl border border-white/5 font-mono max-h-36 overflow-y-auto leading-relaxed">
                    {latestHistory.promptUsed}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRetouch(dish);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-colors cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>AI Retouch</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 shadow-md transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Photo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
