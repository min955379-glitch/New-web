import React, { useState } from 'react';
import { Download, Eye, Sparkles, Filter, ExternalLink, Printer, Wand2 } from 'lucide-react';
import { DishItem, PhotographyStyle } from '../utils/promptBuilder';

interface GalleryExportViewProps {
  dishes: DishItem[];
  onInspect: (dish: DishItem) => void;
  onOpenRetouch: (dish: DishItem) => void;
}

export const GalleryExportView: React.FC<GalleryExportViewProps> = ({
  dishes,
  onInspect,
  onOpenRetouch,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');

  const photographedDishes = dishes.filter((d) => d.imageUrl);
  const categories = ['all', ...Array.from(new Set(photographedDishes.map((d) => d.category)))];

  const filteredDishes = photographedDishes.filter((dish) => {
    const matchesCat = selectedCategory === 'all' || dish.category === selectedCategory;
    const dishStyle = dish.history?.[dish.history.length - 1]?.style;
    const matchesStyle = selectedStyle === 'all' || dishStyle === selectedStyle;
    return matchesCat && matchesStyle;
  });

  const downloadAll = () => {
    photographedDishes.forEach((dish, idx) => {
      setTimeout(() => {
        if (!dish.imageUrl) return;
        const link = document.createElement('a');
        link.href = dish.imageUrl;
        link.download = `${dish.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, idx * 250);
    });
  };

  const handlePrintMenu = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#14161b] p-6 rounded-2xl border border-white/10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Menu Photography Portfolio
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-serif-culinary">
            Completed Food Photography ({photographedDishes.length} of {dishes.length} Dishes)
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Studio-quality assets ready for printed tasting menus, delivery apps, and social campaigns
          </p>
        </div>

        {photographedDishes.length > 0 && (
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrintMenu}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Menu Deck</span>
            </button>
            <button
              type="button"
              onClick={downloadAll}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 font-bold shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download All Photos</span>
            </button>
          </div>
        )}
      </div>

      {/* Filters Bar */}
      {photographedDishes.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111317] p-3 rounded-xl border border-white/5 text-xs">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 flex items-center gap-1">
              <Filter className="w-3 h-3 text-amber-400" />
              <span>Course:</span>
            </span>
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                      : 'text-neutral-400 hover:text-white bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Style Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400">Aesthetic:</span>
            {['all', 'Rustic/Dark', 'Bright/Modern', 'Social Media'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStyle(st)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                  selectedStyle === st
                    ? 'bg-white/20 text-white font-semibold'
                    : 'text-neutral-400 hover:text-white bg-white/5'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {filteredDishes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              className="bg-[#14161b] rounded-2xl border border-white/10 overflow-hidden shadow-xl flex flex-col group hover:border-white/20 transition-all"
            >
              <div className="relative aspect-square w-full bg-black overflow-hidden">
                <img
                  src={dish.imageUrl}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                  <button
                    type="button"
                    onClick={() => onInspect(dish)}
                    className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md"
                    title="Inspect"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenRetouch(dish)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium backdrop-blur-md shadow-md"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Retouch</span>
                  </button>
                </div>
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-amber-400 font-semibold uppercase">{dish.category}</span>
                    {dish.price && <span className="text-emerald-400 font-bold">{dish.price}</span>}
                  </div>
                  <h3 className="text-sm font-bold text-white font-serif-culinary truncate">
                    {dish.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#121418] rounded-2xl border border-white/5 space-y-3">
          <p className="text-sm font-semibold text-neutral-300">No Food Photography Captured Yet</p>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Head over to the Menu Studio to generate high-end photographs for your dishes in Rustic/Dark, Bright/Modern, or Social Media aesthetic.
          </p>
        </div>
      )}
    </div>
  );
};
