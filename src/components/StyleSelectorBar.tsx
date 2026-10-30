import React from 'react';
import { Sparkles, Moon, Sun, Smartphone, Sliders, Cpu, Maximize2 } from 'lucide-react';
import { PhotographyStyle, ImageResolution, AspectRatioOption, ImageModelOption } from '../utils/promptBuilder';

interface StyleSelectorBarProps {
  currentStyle: PhotographyStyle;
  onSelectStyle: (style: PhotographyStyle) => void;
  imageSize: ImageResolution;
  onSelectImageSize: (size: ImageResolution) => void;
  model: ImageModelOption;
  onSelectModel: (model: ImageModelOption) => void;
  aspectRatio: AspectRatioOption;
  onSelectAspectRatio: (ratio: AspectRatioOption) => void;
  onBatchGenerate?: () => void;
  isBatchGenerating?: boolean;
  unphotographedCount: number;
}

export const StyleSelectorBar: React.FC<StyleSelectorBarProps> = ({
  currentStyle,
  onSelectStyle,
  imageSize,
  onSelectImageSize,
  model,
  onSelectModel,
  aspectRatio,
  onSelectAspectRatio,
  onBatchGenerate,
  isBatchGenerating = false,
  unphotographedCount,
}) => {
  const stylesConfig = [
    {
      id: 'Rustic/Dark' as PhotographyStyle,
      label: 'Rustic / Dark',
      subtitle: 'Moody chiaroscuro, dark slate, warm candlelight, deep shadows',
      icon: Moon,
      color: 'from-amber-900/60 to-stone-900/80 border-amber-600/40 text-amber-200',
      activeGlow: 'ring-2 ring-amber-500/80 border-amber-500 bg-amber-950/40',
      badge: 'Fine Dining & Cellars',
    },
    {
      id: 'Bright/Modern' as PhotographyStyle,
      label: 'Bright / Modern',
      subtitle: 'Crisp morning daylight, honed white marble, clean linen, vibrant herbs',
      icon: Sun,
      color: 'from-sky-900/40 to-slate-900/80 border-sky-600/40 text-sky-200',
      activeGlow: 'ring-2 ring-sky-400/80 border-sky-400 bg-sky-950/40',
      badge: 'Brasseries & Cafes',
    },
    {
      id: 'Social Media' as PhotographyStyle,
      label: 'Social Media',
      subtitle: '90° top-down flatlay, utensils entering frame, cocktail pairing, Instagram aesthetic',
      icon: Smartphone,
      color: 'from-pink-900/40 to-purple-900/80 border-pink-500/40 text-pink-200',
      activeGlow: 'ring-2 ring-pink-500/80 border-pink-500 bg-pink-950/40',
      badge: 'Flatlay & Reels',
    },
  ];

  const resolutionOptions: { value: ImageResolution; label: string; note: string }[] = [
    { value: '1K', label: '1K', note: 'Fast • Web & QR' },
    { value: '2K', label: '2K', note: 'Crisp • Delivery Apps' },
    { value: '4K', label: '4K', note: 'Master • Print Menus' },
  ];

  const modelOptions: { value: ImageModelOption; label: string; desc: string }[] = [
    { value: 'gemini-3-pro-image-preview', label: 'Gemini 3 Pro Image', desc: 'Supreme Gourmet Realism' },
    { value: 'gemini-nano-banana-2.1', label: 'Nano Banana 2.1', desc: 'Precision & Retouch Ready' },
  ];

  const aspectRatios: { value: AspectRatioOption; label: string; desc: string }[] = [
    { value: '1:1', label: '1:1', desc: 'Square' },
    { value: '4:3', label: '4:3', desc: 'Classic' },
    { value: '16:9', label: '16:9', desc: 'Banner' },
    { value: '9:16', label: '9:16', desc: 'Story' },
  ];

  return (
    <div className="bg-[#121418] border-y border-white/10 py-5 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Style Toggles Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Studio Photographic Aesthetic
              </span>
              <h2 className="text-sm text-neutral-300 font-medium">
                Choose the lighting, surface, and composition mood for your dishes
              </h2>
            </div>
            {onBatchGenerate && unphotographedCount > 0 && (
              <button
                onClick={onBatchGenerate}
                disabled={isBatchGenerating}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isBatchGenerating ? 'animate-spin' : ''}`} />
                <span>
                  {isBatchGenerating
                    ? 'Photographer Shooting...'
                    : `Shoot All Remaining (${unphotographedCount})`}
                </span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {stylesConfig.map((style) => {
              const Icon = style.icon;
              const isSelected = currentStyle === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => onSelectStyle(style.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? `${style.activeGlow} shadow-xl`
                      : 'border-white/10 bg-[#16181d] hover:border-white/20 hover:bg-[#1a1c22]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-white/5 text-neutral-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-white tracking-wide">
                        {style.label}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                      {style.badge}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {style.subtitle}
                  </p>
                  {isSelected && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Technical Camera Controls: Resolution Affordance, Model & Aspect Ratio */}
        <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Resolution Affordance (1K, 2K, 4K) */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 flex items-center gap-1.5 font-medium">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Image Resolution:</span>
            </span>
            <div className="inline-flex rounded-lg bg-[#181a20] p-1 border border-white/10">
              {resolutionOptions.map((res) => (
                <button
                  key={res.value}
                  onClick={() => onSelectImageSize(res.value)}
                  className={`px-3 py-1 rounded-md font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                    imageSize === res.value
                      ? 'bg-amber-500 text-neutral-950 shadow-sm font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title={res.note}
                >
                  <span>{res.label}</span>
                  <span className="text-[9px] opacity-75 hidden sm:inline">({res.note.split('•')[0].trim()})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Model Selector */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 flex items-center gap-1.5 font-medium">
              <Cpu className="w-3.5 h-3.5 text-orange-400" />
              <span>Photography Engine:</span>
            </span>
            <div className="inline-flex rounded-lg bg-[#181a20] p-1 border border-white/10">
              {modelOptions.map((m) => (
                <button
                  key={m.value}
                  onClick={() => onSelectModel(m.value)}
                  className={`px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer ${
                    model === m.value
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-medium'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title={m.desc}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 flex items-center gap-1.5 font-medium">
              <Maximize2 className="w-3.5 h-3.5 text-neutral-400" />
              <span>Frame:</span>
            </span>
            <div className="inline-flex rounded-lg bg-[#181a20] p-1 border border-white/10">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio.value}
                  onClick={() => onSelectAspectRatio(ratio.value)}
                  className={`px-2 py-1 rounded-md text-xs transition-all cursor-pointer ${
                    aspectRatio === ratio.value
                      ? 'bg-white/15 text-white font-medium'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title={ratio.desc}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
