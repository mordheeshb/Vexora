const fs = require('fs');
const path = require('path');

const CATEGORIES_PATH = path.join(__dirname, '../data/categories.json');

// High-quality curated Unsplash IDs for a stationery / student store
const pool = [
  '1585336261022-680e295ce3fe', // pens/stationery
  '1586075010923-2dd4570fb338', // pencils
  '1517842645767-063c046dc12a', // notebooks
  '1531346878373-b5f79d9e798c', // art supplies/colors
  '1503694978374-8a2fb5206fd2', // craft/paper
  '1456735190827-d1262f71b8a3', // desk/organization
  '1580582932707-520aed937b7b', // markers/creative
  '1497034825429-c343d706a5e1', // premium/fountain pen
  '1524995997946-a1c2e315a42f', // school supplies
  '1606326608606-fdf8fa11b1c9', // books/diaries
  '1434030216411-0b793f4b4173', // tech/gadgets
  '1523289217054-28af27f677fb', // scissors/craft
  '1544816155-12df9643f363', // sticky notes
  '1611099359144-8456886e04f0', // paints/brushes
];

function getRandomUnsplash() {
  const id = pool[Math.floor(Math.random() * pool.length)];
  return `https://images.unsplash.com/photo-${id}?w=500&q=80&fit=crop`;
}

// More specific mapping for common items to ensure perfect relevance
const specificMap = {
  'pens': '1585336261022-680e295ce3fe',
  'pencils': '1586075010923-2dd4570fb338',
  'notebooks': '1517842645767-063c046dc12a',
  'art': '1531346878373-b5f79d9e798c',
  'craft': '1503694978374-8a2fb5206fd2',
  'premium-pens': '1497034825429-c343d706a5e1',
  'school-kits': '1524995997946-a1c2e315a42f',
  'scissors': '1523289217054-28af27f677fb',
  'sticky-notes': '1544816155-12df9643f363',
  'paints': '1611099359144-8456886e04f0'
};

function getUnsplashUrl(slug) {
  for (const [key, id] of Object.entries(specificMap)) {
    if (slug.includes(key)) {
      return `https://images.unsplash.com/photo-${id}?w=500&q=80&fit=crop`;
    }
  }
  return getRandomUnsplash();
}

function main() {
  console.log('Injecting high-quality remote image links...');
  const categories = JSON.parse(fs.readFileSync(CATEGORIES_PATH, 'utf8'));
  let updatedCount = 0;

  for (let category of categories) {
    if (category.image && (category.image.includes('placeholder.svg') || category.image.includes('assets/images/categories/'))) {
      category.image = getUnsplashUrl(category.slug);
      updatedCount++;
    }
    
    for (let sub of category.subcategories) {
      if (!sub.image || sub.image.includes('placeholder.svg') || sub.image.includes('assets/images/categories/')) {
        sub.image = getUnsplashUrl(sub.slug);
        updatedCount++;
      }
    }
  }

  if (updatedCount > 0) {
    fs.writeFileSync(CATEGORIES_PATH, JSON.stringify(categories, null, 2));
    console.log(`Successfully updated ${updatedCount} items with perfect remote image links!`);
  } else {
    console.log('No missing images found.');
  }
}

main();
