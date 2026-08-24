const fs = require('fs');
const path = require('path');

// Highly curated, semantically relevant Unsplash Photo IDs mapped to exact categories & products
const PERFECT_MAP = {
  // --- PRODUCTS ---
  'notebook-aura-dotgrid': '1544716278-ca5e3f4abd8c', // notebook / book
  'pen-crest-gel': '1585336261022-680e295ce3fe', // gel pens
  'parker-vector-stainless': '1583485088034-697b5bc54ccd', // metal pen
  'arduino-starter-kit-uno': '1553406830-ef2513450d76', // arduino STEM circuit
  'foam-board-pack-white': '1513519245088-0e12902e5a38', // craft board
  'geometry-camlin-metal': '1509062522246-3755977927d7', // geometry classroom
  'acrylic-color-set-12': '1491841550275-ad7854e35ca6', // art paints / colors
  'organizer-deskframe': '1507499739999-097706ad8914', // desk organizer
  'usb-led-study-light': '1534073828943-f801091bb18c', // USB desk lamp
  'executive-leather-journal': '1589829085413-56de8ae18c73', // leather journal
  'anime-vinyl-sticker-pack': '1618005182384-a83a8bd57fbe', // stickers
  'microscope-science-kit': '1532094349884-543bc11b234d', // microscope STEM

  // --- CATEGORIES ---
  'stationery-writing': '1585336261022-680e295ce3fe',
  'notebooks-paper-products': '1544716278-ca5e3f4abd8c',
  'school-supplies': '1524995997946-a1c2e315a42f',
  'art-craft-creativity': '1491841550275-ad7854e35ca6',
  'project-materials': '1513519245088-0e12902e5a38',
  'electronics-diy-kits': '1553406830-ef2513450d76',
  'toys-kids': '1566576912321-d58ddd7a6088',
  'educational-learning': '1532094349884-543bc11b234d',
  'gadgets-accessories': '1434030216411-0b793f4b4173',
  'office-supplies': '1593062096033-9a26b09da705',
  'premium-corporate-gifts': '1583485088034-697b5bc54ccd',
  'sports-recreation': '1511886929837-354d827aae26',
  'stickers-personalization': '1618005182384-a83a8bd57fbe',
  'gift-party-supplies': '1513151233558-d860c5398176',

  // --- SUBCATEGORIES ---
  'pens': '1585336261022-680e295ce3fe',
  'pencils': '1586075010923-2dd4570fb338',
  'erasers': '1586075010923-2dd4570fb338',
  'sharpeners': '1586075010923-2dd4570fb338',
  'rulers-scales': '1586075010923-2dd4570fb338',
  'highlighters': '1580582932707-520aed937b7b',
  'markers': '1580582932707-520aed937b7b',
  'premium-pens': '1583485088034-697b5bc54ccd',
  'parker-branded-pens': '1583485088034-697b5bc54ccd',

  'notebooks': '1544716278-ca5e3f4abd8c',
  'long-notebooks': '1456735190827-d1262f71b8a3',
  'a4-a5-notebooks': '1456735190827-d1262f71b8a3',
  'journals': '1589829085413-56de8ae18c73',
  'diaries': '1589829085413-56de8ae18c73',
  'scrapbooks': '1544716278-ca5e3f4abd8c',
  'drawing-books': '1491841550275-ad7854e35ca6',
  'writing-pads': '1434030216411-0b793f4b4173',
  'sticky-notes': '1544816155-12df9643f363',
  'files-folders': '1593062096033-9a26b09da705',

  'school-kits': '1524995997946-a1c2e315a42f',
  'geometry-boxes': '1509062522246-3755977927d7',
  'pencil-boxes': '1585336261022-680e295ce3fe',
  'water-bottles': '1544816155-12df9643f363',
  'school-accessories': '1524995997946-a1c2e315a42f',
  'name-labels': '1544816155-12df9643f363',
  'educational-supplies': '1509062522246-3755977927d7',

  'colour-pencils': '1491841550275-ad7854e35ca6',
  'sketch-pens': '1580582932707-520aed937b7b',
  'crayons': '1491841550275-ad7854e35ca6',
  'paints': '1491841550275-ad7854e35ca6',
  'brushes': '1491841550275-ad7854e35ca6',
  'craft-paper': '1513519245088-0e12902e5a38',
  'glue': '1513519245088-0e12902e5a38',
  'scissors': '1513519245088-0e12902e5a38',
  'stickers': '1618005182384-a83a8bd57fbe',
  'diy-craft-materials': '1513519245088-0e12902e5a38',

  'foam-boards': '1513519245088-0e12902e5a38',
  'cardboards': '1513519245088-0e12902e5a38',
  'thermocol': '1513519245088-0e12902e5a38',
  'chart-papers': '1491841550275-ad7854e35ca6',
  'wires': '1553406830-ef2513450d76',
  'leds': '1534073828943-f801091bb18c',
  'motors': '1553406830-ef2513450d76',
  'switches': '1553406830-ef2513450d76',
  'batteries': '1553406830-ef2513450d76',
  'connectors': '1553406830-ef2513450d76',
  'general-project-making-materials': '1513519245088-0e12902e5a38',

  'arduino-based-kits': '1553406830-ef2513450d76',
  'sensors': '1553406830-ef2513450d76',
  'breadboards': '1553406830-ef2513450d76',
  'jumper-wires': '1553406830-ef2513450d76',
  'electronic-components': '1553406830-ef2513450d76',
  'robotics-kits': '1553406830-ef2513450d76',
  'stem-kits': '1553406830-ef2513450d76',
  'diy-experiment-kits': '1553406830-ef2513450d76',
  'school-exhibition-kits': '1553406830-ef2513450d76',

  'educational-toys': '1566576912321-d58ddd7a6088',
  'building-blocks': '1566576912321-d58ddd7a6088',
  'toy-sets': '1566576912321-d58ddd7a6088',
  'cars': '1566576912321-d58ddd7a6088',
  'dolls': '1566576912321-d58ddd7a6088',
  'puzzles': '1566576912321-d58ddd7a6088',
  'activity-sets': '1566576912321-d58ddd7a6088',
  'indoor-games': '1566576912321-d58ddd7a6088',
  'outdoor-toys': '1566576912321-d58ddd7a6088',
  'balls-sports-toys': '1511886929837-354d827aae26',

  'learning-kits': '1532094349884-543bc11b234d',
  'science-experiment-kits': '1532094349884-543bc11b234d',
  'mathematics-learning-products': '1509062522246-3755977927d7',
  'flash-cards': '1544816155-12df9643f363',
  'activity-books': '1456735190827-d1262f71b8a3',
  'educational-games': '1566576912321-d58ddd7a6088',

  'small-electronic-gadgets': '1434030216411-0b793f4b4173',
  'mobile-accessories': '1434030216411-0b793f4b4173',
  'usb-accessories': '1534073828943-f801091bb18c',
  'desk-gadgets': '1507499739999-097706ad8914',
  'study-gadgets': '1534073828943-f801091bb18c',
  'massage-gadgets': '1434030216411-0b793f4b4173',
  'useful-everyday-gadgets': '1434030216411-0b793f4b4173',

  'office-stationery': '1593062096033-9a26b09da705',
  'files': '1593062096033-9a26b09da705',
  'folders': '1593062096033-9a26b09da705',
  'staplers': '1593062096033-9a26b09da705',
  'paper-clips': '1593062096033-9a26b09da705',
  'registers': '1456735190827-d1262f71b8a3',
  'printer-paper': '1456735190827-d1262f71b8a3',
  'desk-organizers-office': '1507499739999-097706ad8914',
  'packaging-supplies': '1593062096033-9a26b09da705',

  'premium-pens': '1583485088034-697b5bc54ccd',
  'executive-notebooks': '1589829085413-56de8ae18c73',
  'gift-sets': '1513151233558-d860c5398176',
  'desk-accessories-gifts': '1507499739999-097706ad8914',
  'corporate-stationery': '1583485088034-697b5bc54ccd',
  'customized-gift-kits': '1513151233558-d860c5398176',

  'balls': '1511886929837-354d827aae26',
  'skipping-ropes': '1511886929837-354d827aae26',
  'basic-sports-equipment': '1511886929837-354d827aae26',
  'fitness-recreation-accessories': '1511886929837-354d827aae26',

  'decorative-stickers': '1618005182384-a83a8bd57fbe',
  'educational-stickers': '1618005182384-a83a8bd57fbe',
  'school-labels': '1544816155-12df9643f363',
  'name-stickers': '1544816155-12df9643f363',
  'custom-stickers': '1618005182384-a83a8bd57fbe',
  'promotional-stickers': '1618005182384-a83a8bd57fbe',

  'gift-items': '1513151233558-d860c5398176',
  'gift-wrapping': '1513151233558-d860c5398176',
  'greeting-cards': '1513151233558-d860c5398176',
  'party-accessories': '1513151233558-d860c5398176',
  'return-gifts': '1513151233558-d860c5398176',
  'childrens-gift-sets': '1513151233558-d860c5398176'
};

function getPhoto(slug) {
  const photoId = PERFECT_MAP[slug] || '1585336261022-680e295ce3fe';
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=600&q=80&item=${encodeURIComponent(slug)}`;
}

function main() {
  console.log('Applying exact semantic image mappings...');

  // 1. data/products.json
  const prodPath = path.join(__dirname, '../data/products.json');
  const prods = JSON.parse(fs.readFileSync(prodPath, 'utf8'));
  for (let p of prods) {
    p.images = [getPhoto(p.id)];
  }
  fs.writeFileSync(prodPath, JSON.stringify(prods, null, 2));

  // 2. src/data/vexora-catalog.json
  const vexoraPath = path.join(__dirname, '../src/data/vexora-catalog.json');
  const vexoraData = JSON.parse(fs.readFileSync(vexoraPath, 'utf8'));
  for (let p of vexoraData.featured_products) {
    p.image = getPhoto(p.id).replace('w=600&q=80', 'w=400&q=60');
  }
  for (let c of vexoraData.categories) {
    c.cover = getPhoto(c.id).replace('w=600&q=80', 'w=400&q=60');
  }
  fs.writeFileSync(vexoraPath, JSON.stringify(vexoraData, null, 2));

  // 3. data/categories.json
  const catPath = path.join(__dirname, '../data/categories.json');
  const cats = JSON.parse(fs.readFileSync(catPath, 'utf8'));
  for (let c of cats) {
    c.image = getPhoto(c.slug);
    for (let sub of c.subcategories) {
      sub.image = getPhoto(sub.slug);
    }
  }
  fs.writeFileSync(catPath, JSON.stringify(cats, null, 2));
  console.log('Successfully applied semantically perfect image mappings!');
}

main();
