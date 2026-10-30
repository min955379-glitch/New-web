/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StyleSelectorBar } from './components/StyleSelectorBar';
import { MenuInputSection } from './components/MenuInputSection';
import { DishCard } from './components/DishCard';
import { RetouchModal } from './components/RetouchModal';
import { InspectorModal } from './components/InspectorModal';
import { CustomPhotoStudio } from './components/CustomPhotoStudio';
import { GalleryExportView } from './components/GalleryExportView';
import { GuideModal } from './components/GuideModal';
import {
  DishItem,
  PhotographyStyle,
  ImageResolution,
  AspectRatioOption,
  ImageModelOption,
} from './utils/promptBuilder';
import { SAMPLE_MENUS } from './utils/sampleMenus';
import { parseRawMenuText } from './utils/menuParser';
import { Plus, Sparkles, Filter, AlertCircle, Utensils, CheckCircle } from 'lucide-react';

export default function App() {
  // Primary application state
  const [activeTab, setActiveTab] = useState<'menu' | 'custom' | 'gallery'>('menu');
  const [currentStyle, setCurrentStyle] = useState<PhotographyStyle>('Rustic/Dark');
  const [imageSize, setImageSize] = useState<ImageResolution>('2K');
  const [model, setModel] = useState<ImageModelOption>('gemini-3-pro-image-preview');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>('1:1');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [retouchDish, setRetouchDish] = useState<DishItem | null>(null);
  const [inspectDish, setInspectDish] = useState<DishItem | null>(null);

  // Dishes state
  const [dishes, setDishes] = useState<DishItem[]>(() => {
    // Initialise with sample menu so restaurant owners immediately experience the studio
    const initial = parseRawMenuText(SAMPLE_MENUS[0].rawText);
    return initial;
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [isRetouching, setIsRetouching] = useState(false);
  const [retouchError, setRetouchError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. Menu Parsing Handler
  const handleMenuParsed = async (text: string) => {
    setIsParsing(true);
    setParseError(null);
    try {
      const res = await fetch('/api/parse-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to parse menu');
      }

      if (Array.isArray(data.dishes) && data.dishes.length > 0) {
        setDishes(data.dishes);
        setIsUploadOpen(false);
        setActiveCategory('all');
        showToast(`Parsed ${data.dishes.length} menu items ready for photography shoot!`);
      } else {
        throw new Error('No dishes detected. Please verify your menu text format.');
      }
    } catch (err: any) {
      console.error(err);
      setParseError(err.message || 'Error parsing menu. You can try a sample menu or reformat.');
    } finally {
      setIsParsing(false);
    }
  };

  // 2. Generate Photo for Single Dish
  const handleGeneratePhoto = async (dishId: string, overrideStyle?: PhotographyStyle) => {
    const dish = dishes.find((d) => d.id === dishId);
    if (!dish) return;

    const styleToUse = overrideStyle || currentStyle;

    setDishes((prev) =>
      prev.map((d) =>
        d.id === dishId ? { ...d, status: 'generating', lastError: undefined } : d
      )
    );

    try {
      const res = await fetch('/api/generate-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dish,
          style: styleToUse,
          imageSize,
          aspectRatio,
          model,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to capture food photograph');
      }

      setDishes((prev) =>
        prev.map((d) => {
          if (d.id !== dishId) return d;
          const newHistory = [
            ...(d.history || []),
            {
              id: `hist-${Date.now()}`,
              imageUrl: data.imageUrl,
              style: styleToUse,
              model: data.model,
              imageSize: data.imageSize,
              timestamp: Date.now(),
              promptUsed: data.promptUsed,
            },
          ];
          return {
            ...d,
            imageUrl: data.imageUrl,
            status: 'completed',
            history: newHistory,
          };
        })
      );
      showToast(`Captured studio photo for "${dish.name}" in ${styleToUse} aesthetic!`);
    } catch (err: any) {
      console.error(err);
      setDishes((prev) =>
        prev.map((d) =>
          d.id === dishId
            ? { ...d, status: 'error', lastError: err.message || 'Generation failed' }
            : d
        )
      );
    }
  };

  // 3. Batch Generate Photography for Remaining Dishes
  const handleBatchGenerate = async () => {
    const unphotographed = dishes.filter((d) => !d.imageUrl && d.status !== 'generating');
    if (unphotographed.length === 0 || isBatchGenerating) return;

    setIsBatchGenerating(true);
    for (const dish of unphotographed) {
      await handleGeneratePhoto(dish.id);
    }
    setIsBatchGenerating(false);
    showToast(`Batch shoot finished for all menu items!`);
  };

  // 4. Retouch Photo with gemini-nano-banana-2.1
  const handleApplyRetouch = async (
    dishId: string,
    editPrompt: string,
    targetSize: ImageResolution
  ) => {
    const dish = dishes.find((d) => d.id === dishId);
    if (!dish || !dish.imageUrl) return;

    setIsRetouching(true);
    setRetouchError(null);

    try {
      const res = await fetch('/api/edit-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dishName: dish.name,
          base64Image: dish.imageUrl,
          editPrompt,
          imageSize: targetSize,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to apply AI retouch');
      }

      setDishes((prev) =>
        prev.map((d) => {
          if (d.id !== dishId) return d;
          const updatedHistory = [
            ...(d.history || []),
            {
              id: `hist-${Date.now()}`,
              imageUrl: data.imageUrl,
              style: d.history?.[d.history.length - 1]?.style || currentStyle,
              model: 'gemini-nano-banana-2.1',
              imageSize: targetSize,
              timestamp: Date.now(),
              promptUsed: editPrompt,
              editPrompt,
            },
          ];
          const updatedDish = {
            ...d,
            imageUrl: data.imageUrl,
            history: updatedHistory,
          };
          if (retouchDish && retouchDish.id === dishId) {
            setRetouchDish(updatedDish);
          }
          return updatedDish;
        })
      );
      showToast(`AI Retouch applied to "${dish.name}" via Gemini Nano Banana 2.1!`);
    } catch (err: any) {
      console.error(err);
      setRetouchError(err.message || 'Retouch failed. Please try a different instruction.');
    } finally {
      setIsRetouching(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(dishes.map((d) => d.category)))];
  const filteredDishes = dishes.filter(
    (d) => activeCategory === 'all' || d.category === activeCategory
  );
  const unphotographedCount = dishes.filter((d) => !d.imageUrl).length;

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-neutral-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-2xl border border-white/20 text-xs font-semibold animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Studio Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dishes={dishes}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenHelp={() => setIsGuideOpen(true)}
      />

      {/* Photographic Style & Camera Controls Bar (Sticky in Menu Studio) */}
      {activeTab === 'menu' && (
        <StyleSelectorBar
          currentStyle={currentStyle}
          onSelectStyle={(s) => setCurrentStyle(s)}
          imageSize={imageSize}
          onSelectImageSize={(sz) => setImageSize(sz)}
          model={model}
          onSelectModel={(m) => setModel(m)}
          aspectRatio={aspectRatio}
          onSelectAspectRatio={(r) => setAspectRatio(r)}
          onBatchGenerate={handleBatchGenerate}
          isBatchGenerating={isBatchGenerating}
          unphotographedCount={unphotographedCount}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'menu' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
            {/* Category Filter & Stats Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                <span className="text-xs text-neutral-400 font-medium flex items-center gap-1 shrink-0">
                  <Filter className="w-3.5 h-3.5 text-amber-400" />
                  <span>Course:</span>
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all cursor-pointer ${
                        activeCategory === cat
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                          : 'bg-[#15171d] text-neutral-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-neutral-400">
                <span>
                  Showing {filteredDishes.length} dishes ({dishes.filter((d) => d.imageUrl).length}{' '}
                  photographed)
                </span>
              </div>
            </div>

            {/* Dishes Grid */}
            {filteredDishes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    currentGlobalStyle={currentStyle}
                    currentResolution={imageSize}
                    onGenerate={handleGeneratePhoto}
                    onOpenRetouch={(d) => setRetouchDish(d)}
                    onInspect={(d) => setInspectDish(d)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#121418] rounded-2xl border border-white/5 space-y-3">
                <Utensils className="w-12 h-12 text-neutral-600 mx-auto" />
                <h3 className="text-base font-bold text-white font-serif-culinary">
                  No Dishes in this Category
                </h3>
                <p className="text-xs text-neutral-400">
                  Try selecting 'All' courses or upload a new restaurant menu.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Custom Shoot / Prompt-to-Photo Studio */}
        {activeTab === 'custom' && <CustomPhotoStudio />}

        {/* Gallery & Export */}
        {activeTab === 'gallery' && (
          <GalleryExportView
            dishes={dishes}
            onInspect={(d) => setInspectDish(d)}
            onOpenRetouch={(d) => setRetouchDish(d)}
          />
        )}
      </main>

      {/* Menu Upload Modal */}
      <MenuInputSection
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onMenuParsed={handleMenuParsed}
        isParsing={isParsing}
        parseError={parseError}
        onSelectSampleStyle={(s) => setCurrentStyle(s)}
      />

      {/* Retouch Modal */}
      <RetouchModal
        dish={retouchDish}
        isOpen={!!retouchDish}
        onClose={() => setRetouchDish(null)}
        onApplyRetouch={handleApplyRetouch}
        isRetouching={isRetouching}
        retouchError={retouchError}
      />

      {/* Fullscreen Inspector Modal */}
      <InspectorModal
        dish={inspectDish}
        isOpen={!!inspectDish}
        onClose={() => setInspectDish(null)}
        onOpenRetouch={(d) => setRetouchDish(d)}
        onReshoot={handleGeneratePhoto}
      />

      {/* Studio Guide Modal */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
