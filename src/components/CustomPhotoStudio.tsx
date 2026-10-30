import React, { useState } from 'react';
import { Camera, Sparkles, Sliders, Cpu, Maximize2, Download, Wand2, RefreshCw } from 'lucide-react';
import { PhotographyStyle, ImageResolution, AspectRatioOption, ImageModelOption } from '../utils/promptBuilder';

interface CustomPhotoStudioProps {
  onAddDishToMenu?: (dishName: string, imageUrl: string) => void;
}

export const CustomPhotoStudio: React.FC<CustomPhotoStudioProps> = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<PhotographyStyle>('Rustic/Dark');
  const [imageSize, setImageSize] = useState<ImageResolution>('2K');
  const [model, setModel] = useState<ImageModelOption>('gemini-nano-banana-2.1');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleIdeas = [
    'Artisanal Truffle Burrata with blistered heirloom tomatoes, 25-year aged balsamic & rosemary focaccia',
    'Crispy Skin Kurobuta Pork Belly with spiced apple reduction, parsnip purée & micro-greens',
    'Japanese A5 Wagyu Katsu Sando on toasted milk bread with sweet tonkatsu glaze',
    'Matcha Molten Lava Cake with black sesame gelato & candied ginger crumble',
    'Signature Smoked Rosemary Paloma cocktail with pink grapefruit slice and chili-salt rim',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/custom-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style,
          imageSize,
          aspectRatio,
          model,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate custom photograph');
      }

      setResultImage(data.imageUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Generation error. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `culinaire-shoot-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Intro Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
          Dish Studio & Bespoke Shoot
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-culinary">
          Shoot Any Culinary Concept from Scratch
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400">
          Create signature seasonal specials, experimental plating, or beverage pairings using text prompts with our photographic AI engines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-5 bg-[#14161b] p-6 rounded-2xl border border-white/10 shadow-xl">
          {/* Prompt Input */}
          <div>
            <label htmlFor="custom-prompt-input" className="text-xs font-semibold text-neutral-200 block mb-2">
              Dish & Plating Description
            </label>
            <textarea
              id="custom-prompt-input"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Pan-seared sea scallops on sweet corn purée with crispy chorizo crumbles and herb oil..."
              className="w-full rounded-xl bg-[#0e1014] border border-white/10 p-3.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
            />
          </div>

          {/* Quick Idea Chips */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
              Inspiring Culinary Ideas:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sampleIdeas.map((idea, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPrompt(idea)}
                  className="text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/5 transition-colors cursor-pointer"
                >
                  {idea.slice(0, 48)}...
                </button>
              ))}
            </div>
          </div>

          {/* Style Toggles */}
          <div>
            <label className="text-xs font-semibold text-neutral-200 block mb-2">
              Aesthetic Style:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Rustic/Dark', 'Bright/Modern', 'Social Media'] as PhotographyStyle[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStyle(s)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                    style === s
                      ? 'border-amber-500 bg-amber-950/40 text-amber-200 ring-1 ring-amber-500'
                      : 'border-white/10 bg-[#181a20] text-neutral-400 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Affordance (1K, 2K, 4K) & Model Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
            {/* Resolution */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5 mb-2">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Resolution:</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['1K', '2K', '4K'] as ImageResolution[]).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setImageSize(sz)}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      imageSize === sz
                        ? 'border-amber-500 bg-amber-500 text-neutral-950 font-bold'
                        : 'border-white/10 bg-[#181a20] text-neutral-400 hover:text-white'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Model */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5 mb-2">
                <Cpu className="w-3.5 h-3.5 text-orange-400" />
                <span>AI Model:</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'gemini-nano-banana-2.1', label: 'Nano Banana' },
                  { id: 'gemini-3-pro-image-preview', label: '3 Pro Image' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setModel(m.id as ImageModelOption)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border truncate transition-all cursor-pointer ${
                      model === m.id
                        ? 'border-orange-500 bg-orange-950/40 text-orange-200'
                        : 'border-white/10 bg-[#181a20] text-neutral-400 hover:text-white'
                    }`}
                    title={m.id}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5 mb-2">
              <Maximize2 className="w-3.5 h-3.5 text-neutral-400" />
              <span>Aspect Ratio:</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['1:1', '4:3', '16:9', '9:16'] as AspectRatioOption[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setAspectRatio(r)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    aspectRatio === r
                      ? 'border-white/30 bg-white/15 text-white'
                      : 'border-white/10 bg-[#181a20] text-neutral-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white shadow-xl shadow-orange-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Camera className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Cooking & Styling Studio Shot...' : 'Capture Studio Photography'}</span>
          </button>
        </div>

        {/* Output Photo Preview Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl bg-[#090a0c] border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center">
            {resultImage ? (
              <>
                <img src={resultImage} alt="Custom Dish" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-amber-300 border border-amber-400/30 backdrop-blur-md">
                    {style}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white border border-white/20 backdrop-blur-md">
                    {imageSize}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/60 text-neutral-300 border border-white/20 backdrop-blur-md">
                    {model === 'gemini-nano-banana-2.1' ? 'Nano Banana 2.1' : '3 Pro Image'}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={downloadImage}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black text-white text-xs font-medium border border-white/20 backdrop-blur-md transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {imageSize}</span>
                  </button>
                </div>
              </>
            ) : isGenerating ? (
              <div className="text-center p-8 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
                </div>
                <p className="text-sm font-bold text-white">Fine-Dining Virtual Camera Active</p>
                <p className="text-xs text-neutral-400 max-w-xs">
                  Rendering {style} lighting, depth of field, and authentic culinary textures at {imageSize} resolution...
                </p>
              </div>
            ) : (
              <div className="text-center p-8 space-y-3 text-neutral-500">
                <Camera className="w-12 h-12 mx-auto opacity-30" />
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Studio Viewfinder Ready
                </p>
                <p className="text-xs text-neutral-500 max-w-xs">
                  Enter a dish concept on the left and select your aesthetic to generate a high-end photograph.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
