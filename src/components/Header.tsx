import React from 'react';
import { Camera, Sparkles, UtensilsCrossed, Download, HelpCircle, Layers, Image as ImageIcon } from 'lucide-react';
import { DishItem } from '../utils/promptBuilder';

interface HeaderProps {
  activeTab: 'menu' | 'custom' | 'gallery';
  setActiveTab: (tab: 'menu' | 'custom' | 'gallery') => void;
  dishes: DishItem[];
  onOpenUpload: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  dishes,
  onOpenUpload,
  onOpenHelp,
}) => {
  const generatedCount = dishes.filter(d => d.imageUrl).length;
  const totalCount = dishes.length;

  return (
    <header className="sticky top-0 z-30 bg-[#0e1013]/90 backdrop-blur-md border-b border-white/10 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 flex items-center justify-center shadow-lg shadow-orange-500/20 ring-1 ring-white/20">
            <Camera className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0e1013]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white font-serif-culinary">
                Culinaire Lens
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Virtual Food Photographer
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Studio-grade photography for restaurant menus & dining concepts
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#17191d] rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'menu'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-orange-900/30'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Menu Studio</span>
            {totalCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 text-amber-200">
                {generatedCount}/{totalCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'custom'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-orange-900/30'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Custom Shoot</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'gallery'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-orange-900/30'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Gallery ({generatedCount})</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Upload Menu</span>
          </button>

          <button
            onClick={onOpenHelp}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Studio Guide & Tips"
            aria-label="Studio Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
