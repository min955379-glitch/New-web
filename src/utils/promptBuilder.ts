export type PhotographyStyle = 'Rustic/Dark' | 'Bright/Modern' | 'Social Media';
export type ImageResolution = '1K' | '2K' | '4K';
export type AspectRatioOption = '1:1' | '4:3' | '3:4' | '16:9' | '9:16';
export type ImageModelOption = 'gemini-3-pro-image-preview' | 'gemini-nano-banana-2.1';

export interface DishItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price?: string;
  ingredients?: string[];
  suggestedPlating?: string;
  imageUrl?: string;
  history?: Array<{
    id: string;
    imageUrl: string;
    style: PhotographyStyle;
    model: string;
    imageSize: ImageResolution;
    timestamp: number;
    promptUsed: string;
    editPrompt?: string;
  }>;
  status: 'idle' | 'generating' | 'completed' | 'error';
  lastError?: string;
}

export interface PromptOptions {
  dishName: string;
  description?: string;
  category?: string;
  ingredients?: string[];
  suggestedPlating?: string;
  style: PhotographyStyle;
  customNotes?: string;
}

/**
 * Builds a photographic prompt optimized for restaurant food photography.
 */
export function buildFoodPhotoPrompt(options: PromptOptions): string {
  const { dishName, description = '', category = '', ingredients = [], suggestedPlating = '', style, customNotes } = options;

  let styleDirectives = '';
  let lightingAndSurface = '';
  let cameraSettings = '';

  switch (style) {
    case 'Rustic/Dark':
      styleDirectives = 'Moody, dramatic fine-dining chiaroscuro aesthetic with rich shadows and warm golden highlights. Artisanal stoneware, hand-thrown rustic ceramic plate or dark slate board.';
      lightingAndSurface = 'Warm amber directional side-and-back lighting, subtle natural rim light highlighting steam and glistening textures. Background features weathered dark walnut timber, textured charcoal linen napkin, scattered whole peppercorns and sea salt flakes.';
      cameraSettings = 'Shot on Hasselblad 100MP with 85mm f/2.2 prime macro lens. Shallow depth of field with creamy bokeh, razor-sharp focus on the hero ingredient. 45-degree angled perspective.';
      break;

    case 'Bright/Modern':
      styleDirectives = 'Clean, luminous, Scandinavian high-end culinary magazine editorial aesthetic. Pristine matte white Nordic ceramic dinnerware or minimalist pastel dish.';
      lightingAndSurface = 'Basked in soft, diffused morning sunlight streaming through an airy cafe window. Honed Carrara white marble tabletop with subtle grey veins, neatly folded raw ivory linen runner. Fresh micro-greens and vibrant botanical garnish.';
      cameraSettings = 'Shot on Canon EOS R5 with 50mm f/2.8 lens. High-key natural lighting, crisp crisp detail, perfectly balanced soft fill reflections. 35-degree intimate dining perspective.';
      break;

    case 'Social Media':
      styleDirectives = '90-degree true overhead bird\'s-eye flatlay food photography. Viral high-engagement Instagram and TikTok food influencer presentation.';
      lightingAndSurface = 'Crisp, even studio ambient light with pop and punchy saturation. Modern terrazzo or polished light concrete bistro table. Artfully composed props entering the frame: sleek modern matte-black utensils or wooden chopsticks, a half-visible condensation-beaded artisanal beverage or cocktail, and a small ramekin of finishing sauce or sea salt.';
      cameraSettings = 'Flatlay 90-degree overhead angle, perfectly level, edge-to-edge sharpness with zero wide-angle distortion. 35mm f/4, mouthwatering commercial food catalog quality.';
      break;
  }

  const ingredientClause = ingredients && ingredients.length > 0
    ? `Featuring visible high-quality ingredients: ${ingredients.join(', ')}.`
    : '';

  const platingClause = suggestedPlating
    ? `Plating presentation: ${suggestedPlating}.`
    : '';

  const notesClause = customNotes ? `Specific chef instruction: ${customNotes}.` : '';

  return [
    `Award-winning professional food photography of ${dishName}.`,
    category ? `Course: ${category}.` : '',
    description ? `Dish description: ${description}.` : '',
    ingredientClause,
    platingClause,
    styleDirectives,
    lightingAndSurface,
    cameraSettings,
    notesClause,
    'Hyper-realistic, mouth-watering gourmet restaurant presentation, appetizing natural food textures, photorealistic commercial standard.'
  ].filter(Boolean).join(' ');
}

/**
 * Builds an image editing prompt for retouches using gemini-nano-banana-2.1.
 */
export function buildImageEditPrompt(baseDishName: string, userInstruction: string): string {
  return `Maintain the core food photography of the dish "${baseDishName}" while applying this realistic culinary retouch: ${userInstruction}. Keep the professional studio lighting, realistic food textures, and seamless photorealism.`;
}
