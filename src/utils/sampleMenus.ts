export interface SampleMenu {
  id: string;
  restaurantName: string;
  cuisine: string;
  tagline: string;
  suggestedStyle: 'Rustic/Dark' | 'Bright/Modern' | 'Social Media';
  rawText: string;
}

export const SAMPLE_MENUS: SampleMenu[] = [
  {
    id: 'trattoria',
    restaurantName: 'Osteria del Fuoco',
    cuisine: 'Modern Italian & Tuscan Grill',
    tagline: 'Artisanal handmade pasta, wood-fired heritage meats, and rustic cellar classics',
    suggestedStyle: 'Rustic/Dark',
    rawText: `[ANTIPASTI]
Burrata Pugliese - $19
Creamy burrata heart, blistered heirloom cherry tomatoes, cold-pressed Ligurian olive oil, 25-year Modena balsamic drizzle, grilled sourdough crisps

Carpaccio di Manzo - $22
Paper-thin prime beef tenderloin, shaved black winter truffle, wild baby arugula, crispy capers, 36-month parmigiano-reggiano curls

[PRIMI PIATTI]
Truffle & Porcini Tagliolini - $34
House-extruded egg ribbon pasta, wild Umbrian porcini, mountain butter emulsion, generous fresh shaved black summer truffle

Squid Ink Risotto al Frutti di Mare - $36
Acquerello carnaroli rice tinted with cuttlefish ink, pan-seared sea scallops, tiger prawns, tender baby calamari, Meyer lemon zest

[SECONDI]
Bistecca alla Fiorentina 24oz - $68
Dry-aged Chianina porterhouse grilled over olive wood embers, rosemary sea salt, charred rosemary sprig, roasted garlic bulb

Crispy Skin Branzino - $42
Pan-roasted Mediterranean sea bass fillet, saffron fennel confit, castelvetrano olive emulsion, crisp thyme garnish

[DOLCI]
Tiramisù al Mascarpone e Caffè - $14
Savoiardi ladyfingers steeped in single-origin espresso and dark rum, whipped velvety mascarpone, bitter Valrhona cocoa dust`
  },
  {
    id: 'brasserie',
    restaurantName: 'Lumière Café & Brasserie',
    cuisine: 'Contemporary French & Nordic Botanical',
    tagline: 'Sun-drenched marble, delicate micro-botanicals, and luminous modern bistro plating',
    suggestedStyle: 'Bright/Modern',
    rawText: `[STARTERS]
Citrus Cured Hamachi Crudo - $21
Yellowtail amberjack sashimi ribbons, white yuzu kosho gel, blood orange segments, shaved radishes, edible violas

Green Pea & Mint Velouté - $16
Chilled sweet spring pea soup, goat cheese foam quenelle, toasted pine nuts, pea tendril drizzle

[MAINS]
Diver Scallops Saint-Jacques - $38
Caramelized jumbo Maine scallops, silky cauliflower mousseline, golden sultana-caper emulsion, crispy Romanesco florets

Roasted Duck Breast with Cherry Glaze - $44
Crispy scored Moulard duck breast cooked medium rare, spiced griotte cherry reduction, glazed baby heritage carrots

Wild Morel Mushroom Gnocchi - $32
Pan-crisped potato gnocchi, foraged morels, sweet shallot confit, lemon thyme emulsion, shaved Pecorino

[DESSERTS]
Pistachio & Raspberry Mille-Feuille - $15
Caramelized inverted puff pastry sheets, roasted Bronte pistachio diplomat cream, fresh wild raspberries, gold leaf

Yuzu Tart Meringuée - $14
Crisp buttery sable shell, tart Japanese yuzu curd, torched Swiss meringue peaks, candied yuzu peel`
  },
  {
    id: 'izakaya',
    restaurantName: 'Neo Tokyo Gastrobar',
    cuisine: 'Vibrant Japanese Fusion & Street Tapas',
    tagline: 'High-contrast neon tabletop flatlays, street snacks, craft highballs & izakaya skewers',
    suggestedStyle: 'Social Media',
    rawText: `[IZAKAYA BITES]
Wagyu A5 Katsu Sando - $29
Crispy panko-breaded Miyazaki A5 wagyu cutlet, toasted Hokkaido milk bread, house-made tonkatsu glaze, Japanese mustard

Spicy Salmon Crispy Rice - $18
Golden pan-crisped sushi rice cakes topped with spicy sashimi-grade King salmon tartare, serrano pepper slice, unagi sweet glaze

Truffle Edamame with Maldon Salt - $11
Steamed young soybeans tossed in white truffle oil, coarse Maldon sea salt flakes, togarashi chili dusting

[ROBATA SKEWERS]
Glazed Tsukune Chicken Meatballs - $16
Skewered tare-glazed minced chicken skewers, tare reduction, pasture-raised egg yolk dip, toasted sesame seeds

Miso-Glazed Black Cod Skewer - $24
Sweet saikyo miso marinated Alaskan black cod cubes caramelized over binchotan charcoal, pickled ginger bud

[SWEETS & SHAKES]
Matcha Lava Fondant Cake - $16
Warm Uji ceremonial grade matcha molten center cake, black sesame gelato scoop, white chocolate soil`
  }
];
