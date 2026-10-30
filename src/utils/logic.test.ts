import test from 'node:test';
import assert from 'node:assert/strict';
import { buildFoodPhotoPrompt, buildImageEditPrompt } from './promptBuilder';
import { parseRawMenuText } from './menuParser';

test('buildFoodPhotoPrompt generates Rustic/Dark photography prompt correctly', () => {
  const prompt = buildFoodPhotoPrompt({
    dishName: 'Osso Buco alla Milanese',
    category: 'Mains',
    description: 'Braised veal shank with saffron risotto and citrus gremolata',
    ingredients: ['Veal Shank', 'Saffron Risotto', 'Citrus Gremolata'],
    style: 'Rustic/Dark',
  });

  assert.match(prompt, /Osso Buco alla Milanese/);
  assert.match(prompt, /Mains/);
  assert.match(prompt, /Moody, dramatic fine-dining chiaroscuro/);
  assert.match(prompt, /Artisanal stoneware/);
  assert.match(prompt, /Veal Shank/);
});

test('buildFoodPhotoPrompt generates Bright/Modern photography prompt correctly', () => {
  const prompt = buildFoodPhotoPrompt({
    dishName: 'Hamachi Crudo',
    category: 'Starters',
    description: 'Thinly sliced yellowtail with yuzu ponzu and micro cilantro',
    style: 'Bright/Modern',
  });

  assert.match(prompt, /Hamachi Crudo/);
  assert.match(prompt, /Carrara white marble/);
  assert.match(prompt, /Scandinavian high-end/);
  assert.match(prompt, /morning sunlight/);
});

test('buildFoodPhotoPrompt generates Social Media flatlay photography prompt correctly', () => {
  const prompt = buildFoodPhotoPrompt({
    dishName: 'Acai Power Bowl',
    style: 'Social Media',
    description: 'Blended acai topped with dragonfruit, kiwi slices, granola, and chia seeds',
  });

  assert.match(prompt, /90-degree true overhead bird's-eye flatlay/);
  assert.match(prompt, /Instagram and TikTok/);
});

test('buildImageEditPrompt retains dish context and applies retouches', () => {
  const prompt = buildImageEditPrompt('Truffle Fries', 'Add more fresh shaved parmesan and rosemary sprigs');
  assert.match(prompt, /Truffle Fries/);
  assert.match(prompt, /Add more fresh shaved parmesan and rosemary sprigs/);
});

test('parseRawMenuText extracts dishes and categories from text menus', () => {
  const sampleMenu = `
[APPETIZERS]
Burrata Campana - $18
Heirloom tomatoes, fresh basil oil, aged balsamic glaze

Crispy Calamari | $16
Served with spicy marinara and lemon wedges

[MAINS]
Dry-Aged Ribeye 14oz - $54
Charred broccolini, roasted garlic herb butter, bone marrow jus

Truffle Tagliolini - $32
Handmade pasta, winter black truffle, 36-month parmigiano reggiano
  `;

  const dishes = parseRawMenuText(sampleMenu);
  assert.equal(dishes.length >= 4, true);

  const burrata = dishes.find(d => d.name.includes('Burrata'));
  assert.ok(burrata, 'Burrata dish should be detected');
  assert.equal(burrata.price, '$18');
  assert.match(burrata.category, /APPETIZERS/i);

  const ribeye = dishes.find(d => d.name.includes('Ribeye'));
  assert.ok(ribeye, 'Ribeye should be detected');
  assert.equal(ribeye.price, '$54');
});
