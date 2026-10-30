import React from 'react';
import { X, Sparkles, Moon, Sun, Smartphone, Sliders, Wand2, CheckCircle2 } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#14161b] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-neutral-200">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#101216]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-serif-culinary">
                Food Photographer Studio Guide
              </h2>
              <p className="text-xs text-neutral-400">
                How to get the highest Michelin-grade visuals from your menu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close guide modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Aesthetic Styles */}
          <div>
            <h3 className="text-sm font-bold text-white mb-2 font-serif-culinary">
              1. The Three Signature Photographic Styles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#191c22] border border-amber-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <Moon className="w-3.5 h-3.5" />
                  <span>Rustic / Dark</span>
                </div>
                <p className="text-neutral-400 leading-relaxed">
                  Deep chiaroscuro shadows, slate & dark timber, candle warmth, and artisanal ceramics. Best for steakhouses, Italian trattorias, and cozy wine bars.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#191c22] border border-sky-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-sky-300 font-bold">
                  <Sun className="w-3.5 h-3.5" />
                  <span>Bright / Modern</span>
                </div>
                <p className="text-neutral-400 leading-relaxed">
                  Sun-drenched morning light, honed Carrara marble, crisp linen, vibrant fresh micro-herbs. Best for French bistros, brunch spots, seafood, and cafes.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#191c22] border border-pink-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-pink-300 font-bold">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Social Media (Top-Down)</span>
                </div>
                <p className="text-neutral-400 leading-relaxed">
                  True 90° bird's-eye flatlay, stylish cutlery or chopsticks entering frame, cocktail pairings. Engineered for Instagram feeds, TikTok reels, and digital delivery apps.
                </p>
              </div>
            </div>
          </div>

          {/* Resolution Affordance */}
          <div className="bg-[#101215] p-4 rounded-xl border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>2. Resolution Affordances (1K, 2K, 4K)</span>
            </div>
            <ul className="space-y-1 text-neutral-300 pl-4 list-disc">
              <li><strong>1K Resolution:</strong> Optimized for fast website menus, digital QR codes, and lightweight thumbnails.</li>
              <li><strong>2K Resolution:</strong> Ultra HD clarity for tablet menus, DoorDash / UberEats storefronts, and retina displays.</li>
              <li><strong>4K Resolution:</strong> Maximum master clarity for physical printed dinner menus, posters, and billboard prints.</li>
            </ul>
          </div>

          {/* AI Retouching with Nano Banana 2.1 */}
          <div className="bg-[#101215] p-4 rounded-xl border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Wand2 className="w-4 h-4 text-purple-400" />
              <span>3. AI Retouching with Gemini Nano Banana 2.1</span>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Every dish card includes an <strong>AI Retouch</strong> button. Use simple natural language prompts like:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-purple-200">
              <div className="p-2 rounded-lg bg-purple-950/30 border border-purple-500/20">
                "Add curls of fresh steam rising from the bowl"
              </div>
              <div className="p-2 rounded-lg bg-purple-950/30 border border-purple-500/20">
                "Drizzle glossy aged balsamic reduction on the plate"
              </div>
              <div className="p-2 rounded-lg bg-purple-950/30 border border-purple-500/20">
                "Place a vintage brass fork entering the frame"
              </div>
              <div className="p-2 rounded-lg bg-purple-950/30 border border-purple-500/20">
                "Make background darker rustic charred wood"
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-white/10 bg-[#101216] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors"
          >
            Got it, Let's Shoot!
          </button>
        </div>
      </div>
    </div>
  );
};
