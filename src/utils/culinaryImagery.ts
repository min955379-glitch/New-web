import { PhotographyStyle } from './promptBuilder';

interface VisualDishConfig {
  name: string;
  category: string;
  primaryColor: string;
  accentColor: string;
  dishType: 'pasta' | 'steak' | 'burrata' | 'seafood' | 'dessert' | 'soup' | 'sandwich' | 'general';
}

function classifyDish(name: string): VisualDishConfig {
  const n = name.toLowerCase();
  if (n.includes('burrata') || n.includes('mozzarella') || n.includes('cheese') || n.includes('salad')) {
    return { name, category: 'Starters', primaryColor: '#faf8f5', accentColor: '#d9381e', dishType: 'burrata' };
  }
  if (n.includes('bistecca') || n.includes('steak') || n.includes('ribeye') || n.includes('carpaccio') || n.includes('beef')) {
    return { name, category: 'Mains', primaryColor: '#6e1e1a', accentColor: '#e0a96d', dishType: 'steak' };
  }
  if (n.includes('tagliolini') || n.includes('pasta') || n.includes('spaghetti') || n.includes('risotto') || n.includes('gnocchi')) {
    return { name, category: 'Primi', primaryColor: '#f3c66b', accentColor: '#2b2118', dishType: 'pasta' };
  }
  if (n.includes('scallop') || n.includes('branzino') || n.includes('hamachi') || n.includes('squid') || n.includes('calamari') || n.includes('salmon') || n.includes('crudo')) {
    return { name, category: 'Seafood', primaryColor: '#ff9e79', accentColor: '#f7d070', dishType: 'seafood' };
  }
  if (n.includes('tiramisu') || n.includes('cake') || n.includes('tart') || n.includes('mille-feuille') || n.includes('fondant') || n.includes('dessert')) {
    return { name, category: 'Dessert', primaryColor: '#4a2f1c', accentColor: '#d4af37', dishType: 'dessert' };
  }
  if (n.includes('soup') || n.includes('velouté')) {
    return { name, category: 'Soup', primaryColor: '#7ba05b', accentColor: '#ffffff', dishType: 'soup' };
  }
  if (n.includes('katsu') || n.includes('sando') || n.includes('burger')) {
    return { name, category: 'Bites', primaryColor: '#b06d3b', accentColor: '#df3c3c', dishType: 'sandwich' };
  }
  return { name, category: 'Specialty', primaryColor: '#c97a3e', accentColor: '#386641', dishType: 'general' };
}

/**
 * Generates an SVG Data URI representing studio-shot culinary photography
 * tailored to the 3 photographic styles:
 * - 'Rustic/Dark': deep moody slate/charred oak, warm amber directional spotlight, dark artisanal stoneware
 * - 'Bright/Modern': Carrara white marble, soft window daylight, pristine porcelain, fresh green botanicals
 * - 'Social Media': 90° flatlay overhead, terrazzo surface, props entering frame (utensils/cocktail glass)
 */
export function getFallbackFoodPhoto(dishName: string, style: PhotographyStyle): string {
  const config = classifyDish(dishName);

  let bgDef = '';
  let lightingFilter = '';
  let plateSvg = '';
  let foodSvg = '';
  let propsSvg = '';
  let styleBadge = '';

  if (style === 'Rustic/Dark') {
    // Chiaroscuro moody dark oak & slate table, warm amber rim light
    bgDef = `
      <radialGradient id="tableBg" cx="40%" cy="35%" r="75%">
        <stop offset="0%" stop-color="#2a231d" />
        <stop offset="50%" stop-color="#181411" />
        <stop offset="100%" stop-color="#090807" />
      </radialGradient>
      <linearGradient id="woodGrip" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#3a2e24" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.8" />
      </linearGradient>
      <filter id="moodGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="-10" dy="18" stdDeviation="25" flood-color="#ff9933" flood-opacity="0.12" />
        <feDropShadow dx="8" dy="12" stdDeviation="28" flood-color="#000000" flood-opacity="0.9" />
      </filter>
    `;

    lightingFilter = `<rect width="800" height="800" fill="url(#tableBg)" />
      <!-- Subtle wood grain lines -->
      <path d="M0,150 Q400,180 800,160 M0,380 Q400,350 800,390 M0,600 Q400,620 800,590" stroke="#443528" stroke-width="1.5" opacity="0.25" fill="none" />
      <!-- Directional candlelight flare -->
      <circle cx="180" cy="180" r="260" fill="#ffa733" opacity="0.08" filter="blur(60px)" />
    `;

    // Artisanal dark charcoal stoneware
    plateSvg = `
      <circle cx="410" cy="420" r="240" fill="#0c0c0e" opacity="0.7" />
      <circle cx="400" cy="400" r="240" fill="#1e2023" stroke="#33373d" stroke-width="6" filter="url(#moodGlow)" />
      <circle cx="400" cy="400" r="190" fill="#15171a" stroke="#25282d" stroke-width="3" />
      <!-- Salt crystals & peppercorns on rim -->
      <circle cx="210" cy="380" r="3.5" fill="#fdfbf7" opacity="0.85" />
      <circle cx="230" cy="440" r="2.5" fill="#fdfbf7" opacity="0.9" />
      <circle cx="580" cy="340" r="3" fill="#111" stroke="#444" stroke-width="1" />
      <circle cx="600" cy="420" r="4" fill="#111" stroke="#555" stroke-width="1" />
    `;

    // Vintage brass fork & dark cloth napkin
    propsSvg = `
      <!-- Folded charcoal linen napkin corner -->
      <path d="M0,0 L220,0 L140,240 L0,180 Z" fill="#1a1c1e" opacity="0.85" />
      <!-- Brass fork -->
      <path d="M680,680 L760,760 M670,690 L750,770" stroke="#c49746" stroke-width="4" stroke-linecap="round" opacity="0.5" />
      <!-- Rising steam trails -->
      <path d="M370,280 Q360,200 390,140 Q410,90 380,40" stroke="#fff" stroke-width="3" fill="none" opacity="0.18" filter="blur(4px)" />
      <path d="M420,290 Q440,220 420,160 Q400,100 430,50" stroke="#fff" stroke-width="2.5" fill="none" opacity="0.14" filter="blur(4px)" />
    `;

    styleBadge = 'Rustic • Dark Fine Dining';
  } else if (style === 'Bright/Modern') {
    // Sun-drenched Carrara white marble, soft diffused morning window light
    bgDef = `
      <linearGradient id="marbleLight" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="60%" stop-color="#f5f6f8" />
        <stop offset="100%" stop-color="#e9ecf0" />
      </linearGradient>
      <filter id="softDaylight">
        <feDropShadow dx="12" dy="24" stdDeviation="22" flood-color="#4a5568" flood-opacity="0.12" />
        <feDropShadow dx="-4" dy="-4" stdDeviation="15" flood-color="#ffffff" flood-opacity="0.8" />
      </filter>
    `;

    lightingFilter = `<rect width="800" height="800" fill="url(#marbleLight)" />
      <!-- Grey marble veins -->
      <path d="M0,80 Q250,140 450,90 T800,200" stroke="#d5dbe2" stroke-width="2.5" fill="none" opacity="0.6" />
      <path d="M100,500 Q300,420 550,560 T800,480" stroke="#d5dbe2" stroke-width="2" fill="none" opacity="0.5" />
      <!-- Soft window light sheen -->
      <polygon points="0,0 450,0 200,800 0,800" fill="#ffffff" opacity="0.4" />
    `;

    // Pristine white porcelain with gold/thin rim
    plateSvg = `
      <circle cx="400" cy="400" r="230" fill="#fdfdfd" stroke="#e2e8f0" stroke-width="3" filter="url(#softDaylight)" />
      <circle cx="400" cy="400" r="180" fill="#fafbfd" stroke="#d4af37" stroke-width="1.2" opacity="0.7" />
    `;

    // Raw ivory linen runner & fresh botanicals
    propsSvg = `
      <rect x="0" y="280" width="130" height="520" fill="#f3eee8" opacity="0.9" rx="4" />
      <!-- Green micro-herb sprig beside plate -->
      <path d="M620,540 Q650,520 680,560" stroke="#48bb78" stroke-width="3" fill="none" />
      <circle cx="670" cy="535" r="5" fill="#38a169" />
      <circle cx="650" cy="520" r="4" fill="#48bb78" />
    `;

    styleBadge = 'Bright • Modern Scandinavian';
  } else {
    // Social Media: 90° Overhead Flatlay, punchy terrazzo, trendy props entering frame
    bgDef = `
      <radialGradient id="terrazzoBg" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="#2d3038" />
        <stop offset="100%" stop-color="#181a1f" />
      </radialGradient>
      <filter id="flatlayShadow">
        <feDropShadow dx="8" dy="14" stdDeviation="16" flood-color="#000000" flood-opacity="0.45" />
      </filter>
    `;

    lightingFilter = `<rect width="800" height="800" fill="url(#terrazzoBg)" />
      <!-- Terrazzo specks -->
      <circle cx="80" cy="120" r="8" fill="#e28743" opacity="0.4" />
      <circle cx="720" cy="140" r="6" fill="#76b5c5" opacity="0.4" />
      <circle cx="150" cy="650" r="9" fill="#eab676" opacity="0.4" />
      <circle cx="710" cy="680" r="7" fill="#eeeee4" opacity="0.3" />
    `;

    // Modern flat ceramic dish
    plateSvg = `
      <circle cx="400" cy="400" r="215" fill="#f4ede4" stroke="#c8bcac" stroke-width="4" filter="url(#flatlayShadow)" />
      <circle cx="400" cy="400" r="175" fill="#faf6f0" />
    `;

    // Modern props entering frame: chopsticks / fork and cocktail glass
    propsSvg = `
      <!-- Matte black modern fork entering bottom-right -->
      <g transform="rotate(-35 620 620)" opacity="0.85">
        <rect x="615" y="460" width="10" height="260" rx="4" fill="#1a1a1a" />
        <path d="M605,430 L635,430 L630,470 L610,470 Z" fill="#2d3748" />
        <line x1="610" y1="410" x2="610" y2="440" stroke="#1a1a1a" stroke-width="2.5" />
        <line x1="620" y1="410" x2="620" y2="440" stroke="#1a1a1a" stroke-width="2.5" />
        <line x1="630" y1="410" x2="630" y2="440" stroke="#1a1a1a" stroke-width="2.5" />
      </g>
      <!-- Half cocktail glass / ramekin top-left -->
      <circle cx="110" cy="110" r="75" fill="#d69e2e" opacity="0.3" stroke="#ecc94b" stroke-width="3" filter="url(#flatlayShadow)" />
      <circle cx="110" cy="110" r="62" fill="#d69e2e" opacity="0.6" />
      <circle cx="95" cy="95" r="18" fill="#ffffff" opacity="0.3" />
      <!-- Dipping sauce ramekin -->
      <circle cx="680" cy="220" r="48" fill="#e2e8f0" stroke="#cbd5e0" stroke-width="3" filter="url(#flatlayShadow)" />
      <circle cx="680" cy="220" r="38" fill="#742a2a" />
      <circle cx="675" cy="215" r="8" fill="#ffffff" opacity="0.35" />
    `;

    styleBadge = 'Social Media • 90° Flatlay';
  }

  // Dish-specific visual gourmet culinary layers
  switch (config.dishType) {
    case 'burrata':
      foodSvg = `
        <!-- Blistered heirloom cherry tomatoes -->
        <circle cx="340" cy="350" r="28" fill="#c53030" stroke="#9b2c2c" stroke-width="2" />
        <circle cx="450" cy="340" r="26" fill="#dd6b20" stroke="#c05621" stroke-width="2" />
        <circle cx="430" cy="450" r="27" fill="#e53e3e" stroke="#9b2c2c" stroke-width="2" />
        <circle cx="340" cy="440" r="24" fill="#c53030" stroke="#742a2a" stroke-width="2" />
        <!-- Tomato char blisters -->
        <ellipse cx="335" cy="345" rx="7" ry="4" fill="#2d3748" opacity="0.6" />
        <ellipse cx="455" cy="335" rx="6" ry="3" fill="#2d3748" opacity="0.6" />
        <!-- White creamy burrata pouch in center -->
        <ellipse cx="395" cy="395" rx="78" ry="74" fill="#fffdfa" stroke="#e8e2d8" stroke-width="3" filter="drop-shadow(0 12px 14px rgba(0,0,0,0.18))" />
        <!-- Burrata top pinch / knot -->
        <ellipse cx="395" cy="340" rx="22" ry="16" fill="#f7f3ea" stroke="#d6cdbe" stroke-width="2" />
        <!-- Glossy Ligurian olive oil pool -->
        <path d="M330,420 Q380,480 460,430 Q440,380 400,470 Z" fill="#b7791f" opacity="0.45" />
        <!-- Aged balsamic reduction drizzle swirls -->
        <path d="M330,330 Q400,320 460,370 T390,460" stroke="#2a160c" stroke-width="4.5" stroke-linecap="round" fill="none" opacity="0.85" />
        <!-- Fresh green basil leaves -->
        <path d="M375,340 C350,320 370,290 395,300 C410,325 390,345 375,340 Z" fill="#38a169" stroke="#22543d" stroke-width="1.5" />
        <path d="M415,445 C440,435 450,405 435,395 C410,410 405,435 415,445 Z" fill="#2f855a" stroke="#1c4532" stroke-width="1.5" />
        <!-- Flaky sea salt flakes -->
        <rect x="385" y="380" width="5" height="5" fill="#ffffff" transform="rotate(25 385 380)" opacity="0.95" />
        <rect x="410" y="395" width="4" height="4" fill="#ffffff" transform="rotate(40 410 395)" opacity="0.9" />
      `;
      break;

    case 'steak':
      foodSvg = `
        <!-- Roasted garlic bulb & rosemary sprig -->
        <circle cx="310" cy="320" r="32" fill="#e2d4be" stroke="#b8a183" stroke-width="2" />
        <circle cx="300" cy="315" r="9" fill="#f5eee3" />
        <circle cx="320" cy="325" r="10" fill="#eedec9" />
        <path d="M260,370 Q320,400 370,390" stroke="#276749" stroke-width="4" stroke-linecap="round" fill="none" />
        <!-- Thick grilled dry-aged ribeye steak -->
        <path d="M320,350 C360,300 480,310 510,380 C530,450 460,500 390,490 C330,480 290,420 320,350 Z"
          fill="#4a1818" stroke="#220b0b" stroke-width="4" filter="drop-shadow(0 14px 18px rgba(0,0,0,0.5))" />
        <!-- Medium rare pink center reveal / succulent sheen -->
        <ellipse cx="410" cy="410" rx="65" ry="48" fill="#8c2b2b" opacity="0.8" />
        <!-- Distinctive charred criss-cross diamond grill marks -->
        <line x1="340" y1="360" x2="480" y2="440" stroke="#1a0909" stroke-width="5" stroke-linecap="round" />
        <line x1="360" y1="340" x2="500" y2="420" stroke="#1a0909" stroke-width="5" stroke-linecap="round" />
        <line x1="380" y1="330" x2="510" y2="400" stroke="#1a0909" stroke-width="5" stroke-linecap="round" />
        <line x1="350" y1="440" x2="470" y2="350" stroke="#1a0909" stroke-width="5" stroke-linecap="round" />
        <line x1="380" y1="460" x2="500" y2="370" stroke="#1a0909" stroke-width="5" stroke-linecap="round" />
        <!-- Melting herb butter quenelle on top -->
        <ellipse cx="420" cy="390" rx="26" ry="14" fill="#ecc94b" stroke="#d69e2e" stroke-width="1.5" />
        <circle cx="416" cy="388" r="2.5" fill="#22543d" />
        <circle cx="425" cy="391" r="2" fill="#22543d" />
        <!-- Glistening bone marrow jus reduction -->
        <path d="M470,450 Q520,470 540,430" stroke="#320f0f" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.8" />
        <!-- Coarse Maldon sea salt flakes -->
        <rect x="400" y="380" width="6" height="6" fill="#ffffff" transform="rotate(20 400 380)" opacity="0.9" />
        <rect x="440" y="420" width="5" height="5" fill="#ffffff" transform="rotate(45 440 420)" opacity="0.85" />
      `;
      break;

    case 'pasta':
      foodSvg = `
        <!-- Silky mountain butter emulsion base -->
        <ellipse cx="400" cy="405" rx="140" ry="120" fill="#ecc94b" opacity="0.25" />
        <!-- Swirled nest of golden egg tagliolini pasta strands -->
        <g stroke="#d69e2e" stroke-width="6.5" stroke-linecap="round" fill="none">
          <path d="M300,410 Q350,330 420,360 T480,420" />
          <path d="M320,380 Q400,320 470,370 T460,450" />
          <path d="M310,430 Q370,490 440,450 T490,390" />
          <path d="M340,360 Q420,390 450,340 T380,440" />
          <path d="M330,410 Q390,360 450,400 T370,470" />
          <path d="M350,340 Q410,430 460,370 T340,420" />
        </g>
        <g stroke="#f6e05e" stroke-width="4.5" stroke-linecap="round" fill="none">
          <path d="M325,395 Q385,345 445,375" />
          <path d="M335,425 Q395,475 455,415" />
          <path d="M365,355 Q425,415 455,365" />
        </g>
        <!-- Foraged brown porcini mushroom slices -->
        <ellipse cx="350" cy="360" rx="22" ry="14" fill="#523924" stroke="#332214" stroke-width="1.5" transform="rotate(-15 350 360)" />
        <ellipse cx="450" cy="430" rx="24" ry="15" fill="#5e4129" stroke="#332214" stroke-width="1.5" transform="rotate(25 450 430)" />
        <ellipse cx="430" cy="340" rx="19" ry="12" fill="#523924" stroke="#332214" stroke-width="1.5" />
        <!-- Shaved winter black truffle curls -->
        <path d="M370,390 Q390,380 405,395 Q385,405 370,390 Z" fill="#171923" stroke="#2d3748" stroke-width="1" />
        <path d="M420,380 Q440,370 455,385 Q435,395 420,380 Z" fill="#171923" stroke="#2d3748" stroke-width="1" />
        <path d="M390,430 Q410,420 425,435 Q405,445 390,430 Z" fill="#171923" stroke="#2d3748" stroke-width="1" />
        <!-- Grated parmigiano snow dusting -->
        <circle cx="360" cy="380" r="2" fill="#fffdfa" />
        <circle cx="380" cy="360" r="1.8" fill="#fffdfa" />
        <circle cx="440" cy="390" r="2" fill="#fffdfa" />
        <circle cx="410" cy="410" r="1.7" fill="#fffdfa" />
      `;
      break;

    case 'seafood':
      foodSvg = `
        <!-- Saffron & citrus emulsion pool -->
        <ellipse cx="400" cy="405" rx="130" ry="110" fill="#f6ad55" opacity="0.3" />
        <path d="M320,440 Q390,470 480,420" stroke="#ed8936" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.7" />
        <!-- Pan-seared caramelized diver scallops & fish fillet -->
        <circle cx="350" cy="380" r="44" fill="#fffff0" stroke="#d69e2e" stroke-width="2" filter="drop-shadow(0 10px 14px rgba(0,0,0,0.25))" />
        <ellipse cx="350" cy="375" rx="40" ry="24" fill="#b7791f" opacity="0.85" />
        <circle cx="450" cy="390" r="46" fill="#fffff0" stroke="#d69e2e" stroke-width="2" filter="drop-shadow(0 10px 14px rgba(0,0,0,0.25))" />
        <ellipse cx="450" cy="385" rx="42" ry="25" fill="#975a16" opacity="0.85" />
        <circle cx="395" cy="450" r="42" fill="#fffff0" stroke="#d69e2e" stroke-width="2" filter="drop-shadow(0 10px 14px rgba(0,0,0,0.25))" />
        <ellipse cx="395" cy="445" rx="38" ry="22" fill="#b7791f" opacity="0.85" />
        <!-- Romanesco floret & micro cilantro -->
        <circle cx="400" cy="350" r="12" fill="#48bb78" />
        <circle cx="310" cy="430" r="10" fill="#38a169" />
        <!-- Red chili or blood orange segment -->
        <path d="M480,340 Q510,360 495,380 Z" fill="#e53e3e" opacity="0.9" />
      `;
      break;

    case 'dessert':
      foodSvg = `
        <!-- Espresso cocoa dust ring on plate -->
        <circle cx="400" cy="400" r="140" fill="none" stroke="#321c10" stroke-width="18" stroke-dasharray="4,8" opacity="0.45" />
        <!-- Layered square or quenelle of tiramisu -->
        <rect x="320" y="330" width="160" height="130" rx="16" fill="#4a2c17" filter="drop-shadow(0 16px 20px rgba(0,0,0,0.4))" />
        <!-- Mascarpone velvety cream top layer -->
        <rect x="320" y="330" width="160" height="45" rx="14" fill="#faf5ee" />
        <ellipse cx="360" cy="350" rx="18" ry="12" fill="#f7ede2" />
        <ellipse cx="400" cy="350" rx="18" ry="12" fill="#f7ede2" />
        <ellipse cx="440" cy="350" rx="18" ry="12" fill="#f7ede2" />
        <!-- Valrhona bitter cocoa powder dusting on top -->
        <rect x="325" y="332" width="150" height="40" rx="12" fill="#2d170b" opacity="0.85" />
        <!-- Fresh wild raspberry and mint leaf garnish -->
        <circle cx="365" cy="335" r="12" fill="#9b2c2c" stroke="#742a2a" stroke-width="1.5" />
        <circle cx="385" cy="330" r="11" fill="#c53030" stroke="#742a2a" stroke-width="1.5" />
        <!-- Mint leaf -->
        <path d="M405,325 C420,310 435,325 425,335 Z" fill="#38a169" />
        <!-- Edible gold leaf flake -->
        <polygon points="435,340 442,336 445,344 438,346" fill="#ecc94b" />
      `;
      break;

    default:
      foodSvg = `
        <!-- Harmonious gourmet culinary arrangement -->
        <circle cx="400" cy="400" r="110" fill="${config.primaryColor}" opacity="0.85" filter="drop-shadow(0 14px 18px rgba(0,0,0,0.3))" />
        <circle cx="400" cy="400" r="70" fill="${config.accentColor}" opacity="0.8" />
        <circle cx="370" cy="370" r="30" fill="#ffffff" opacity="0.4" />
        <path d="M340,360 Q400,310 460,370 Q420,450 360,420 Z" fill="none" stroke="${config.accentColor}" stroke-width="4" />
        <circle cx="410" cy="380" r="4" fill="#38a169" />
        <circle cx="380" cy="420" r="3" fill="#e53e3e" />
        <rect x="390" y="390" width="5" height="5" fill="#ffffff" transform="rotate(30 390 390)" opacity="0.9" />
      `;
      break;
  }

  // Compose high-resolution 800x800 SVG
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
    <defs>
      ${bgDef}
    </defs>
    <!-- Background & Studio Environment -->
    ${lightingFilter}
    <!-- Props & Environment Setting -->
    ${propsSvg}
    <!-- Tableware & Plating Base -->
    ${plateSvg}
    <!-- Gourmet Culinary Dish Composition -->
    ${foodSvg}
    <!-- Vignette Framing -->
    <rect width="800" height="800" fill="none" stroke="#000000" stroke-width="12" opacity="0.4" />
    <!-- Fine-Dining Watermark / Style indicator -->
    <rect x="24" y="740" width="220" height="34" rx="17" fill="#000000" fill-opacity="0.65" />
    <text x="134" y="762" fill="#f7fafc" font-size="12" font-weight="600" font-family="system-ui, sans-serif" text-anchor="middle" letter-spacing="0.5">
      ${styleBadge}
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
