import { DishItem } from './promptBuilder';

/**
 * Heuristic parser for text-based restaurant menus.
 * Robustly parses dish names (including compound names like "Dry-Aged Ribeye" or "Pan-Seared Scallops"),
 * prices, descriptions, and categories.
 */
export function parseRawMenuText(text: string): DishItem[] {
  if (!text || !text.trim()) return [];

  // Split into blocks or lines
  const rawLines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const dishes: DishItem[] = [];

  let currentCategory = 'Main Specialties';
  let currentDish: Partial<DishItem> | null = null;

  const categoryRegex = /^(===+|---+|\[.*\]|APPETIZERS|STARTERS|ANTIPASTI|MAINS|ENTREES|PASTA|PIZZA|DESSERTS|SWEETS|BEVERAGES|DRINKS|COCKTAILS|SIDES|SPECIALS|SOUP|SALAD)/i;
  // Price pattern: "$18", "$18.50", "18.00 USD", "€24", "£15", etc.
  const priceRegex = /(\$\s*\d+(?:\.\d{2})?|€\s*\d+(?:\.\d{2})?|£\s*\d+(?:\.\d{2})?|\b\d{1,3}\s*(?:USD|EUR|GBP))/i;

  const flushDish = () => {
    if (currentDish && currentDish.name && currentDish.name.length > 2) {
      dishes.push({
        id: `dish-${Date.now()}-${dishes.length}-${Math.random().toString(36).substring(2, 6)}`,
        name: cleanDishName(currentDish.name),
        category: currentDish.category || currentCategory,
        description: currentDish.description ? currentDish.description.trim() : '',
        price: currentDish.price || '',
        ingredients: extractIngredientsFromDescription(currentDish.description || ''),
        status: 'idle',
      });
      currentDish = null;
    }
  };

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];

    // Check if line is a category header
    if (
      (line.toUpperCase() === line && line.length < 35 && !line.match(/\d/) && !line.includes('$')) ||
      categoryRegex.test(line) ||
      line.startsWith('#')
    ) {
      flushDish();
      currentCategory = line.replace(/^[#=\-\[\]\s]+|[=\-\[\]\s]+$/g, '').trim() || 'Specialties';
      continue;
    }

    const priceMatch = line.match(priceRegex);
    const hasExplicitPrice = !!priceMatch;

    // Check if line contains a price or starts with a bullet/number or follows an empty break
    if (hasExplicitPrice) {
      flushDish();
      const price = priceMatch ? priceMatch[0].trim() : '';
      // Remove the price from the line
      let lineWithoutPrice = line.replace(priceRegex, '').trim();

      // Clean trailing separators like " - " or " | "
      lineWithoutPrice = lineWithoutPrice.replace(/\s*[-–—|•]+\s*$/, '').trim();

      // If the line has an intentional delimiter like "Dish Name | Description"
      let name = lineWithoutPrice;
      let desc = '';

      if (lineWithoutPrice.includes(' | ')) {
        const parts = lineWithoutPrice.split(' | ');
        name = parts[0].trim();
        desc = parts.slice(1).join(' | ').trim();
      } else if (lineWithoutPrice.includes(' — ')) {
        const parts = lineWithoutPrice.split(' — ');
        name = parts[0].trim();
        desc = parts.slice(1).join(' — ').trim();
      } else if (lineWithoutPrice.includes(' - ') && !lineWithoutPrice.match(/\b\w+-\w+\b/)) {
        // Only split if not a hyphenated word like Dry-Aged
        const parts = lineWithoutPrice.split(' - ');
        name = parts[0].trim();
        desc = parts.slice(1).join(' - ').trim();
      }

      currentDish = {
        name,
        category: currentCategory,
        description: desc,
        price,
      };
    } else if (currentDish) {
      // Line without price is description of the current dish
      if (currentDish.description) {
        currentDish.description += ' ' + line;
      } else {
        currentDish.description = line;
      }
    } else {
      // Could be dish name on one line without price
      currentDish = {
        name: line,
        category: currentCategory,
        description: '',
        price: '',
      };
    }
  }

  flushDish();
  return dishes;
}

function cleanDishName(name: string): string {
  return name
    .replace(/^[\d+.)\-*•\s]+/, '')
    .replace(/[-–—|•\s]+$/, '')
    .trim();
}

function extractIngredientsFromDescription(desc: string): string[] {
  if (!desc) return [];
  const withMatches = desc.match(/(?:with|featuring|topped with|served with|garnished with)\s+([^.]+)/i);
  const target = withMatches ? withMatches[1] : desc;
  return target
    .split(/[,&/]| and /)
    .map(s => s.trim().replace(/^fresh\s+|^organic\s+|^house-made\s+/i, ''))
    .filter(s => s.length > 2 && s.length < 35)
    .slice(0, 5);
}
