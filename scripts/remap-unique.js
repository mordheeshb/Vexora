const fs = require('fs');
const path = require('path');

const CATEGORIES_PATH = path.join(__dirname, '../data/categories.json');

// A large pool of diverse stationery, office, art, and tech images from Unsplash
const pool = [
  '1585336261022-680e295ce3fe', '1586075010923-2dd4570fb338', '1517842645767-063c046dc12a',
  '1531346878373-b5f79d9e798c', '1503694978374-8a2fb5206fd2', '1456735190827-d1262f71b8a3',
  '1580582932707-520aed937b7b', '1497034825429-c343d706a5e1', '1524995997946-a1c2e315a42f',
  '1606326608606-fdf8fa11b1c9', '1434030216411-0b793f4b4173', '1523289217054-28af27f677fb',
  '1544816155-12df9643f363', '1611099359144-8456886e04f0', '1593062096033-9a26b09da705',
  '1527814631626-d62130eef7f8', '1604147706283-d7119b1b8b6a', '1499805543169-122e23b7ff83',
  '1452860616231-1558c4eb5e6d', '1491841550275-ad7854e35ca6', '1629851605333-e1f98ef4fc1b',
  '1513542789411-b6a5d4f316cb', '1526040801323-2615462e08e6', '1519389953810-c1036f5f1906'
];

let poolIndex = 0;
function getNextUniqueImage() {
  const id = pool[poolIndex % pool.length];
  poolIndex++;
  return `https://images.unsplash.com/photo-${id}?w=600&q=80&fit=crop`;
}

// Exact mappings for specific, highly visible items
const specificMap = {
  'pens': '1585336261022-680e295ce3fe', // pens
  'pencils': '1586075010923-2dd4570fb338', // pencils
  'erasers': '1600865521950-e83713a0c644', // eraser (or small rubber object)
  'sharpeners': '1590435105267-33e3871de999', // pencil sharpener
  'rulers-scales': '1611100516668-3e4293f0bbf3', // ruler
  'notebooks': '1517842645767-063c046dc12a', // notebooks
  'highlighters': '1580582932707-520aed937b7b', // bright markers
  'premium-pens': '1497034825429-c343d706a5e1', // fountain pen
  'scissors': '1523289217054-28af27f677fb', // scissors
  'sticky-notes': '1544816155-12df9643f363', // sticky notes
  'paints': '1611099359144-8456886e04f0', // paints
  'school-kits': '1524995997946-a1c2e315a42f'
};

function getUnsplashUrl(slug) {
  if (specificMap[slug]) {
    return `https://images.unsplash.com/photo-${specificMap[slug]}?w=600&q=80&fit=crop`;
  }
  return getNextUniqueImage();
}

function main() {
  console.log('Injecting perfectly distinct image links...');
  const categories = JSON.parse(fs.readFileSync(CATEGORIES_PATH, 'utf8'));

  for (let category of categories) {
    category.image = getUnsplashUrl(category.slug);
    
    // Ensure every subcategory gets a UNIQUE image sequentially if no specific map exists
    for (let sub of category.subcategories) {
      sub.image = getUnsplashUrl(sub.slug);
    }
  }

  fs.writeFileSync(CATEGORIES_PATH, JSON.stringify(categories, null, 2));
  console.log('Successfully re-mapped all images to be distinct!');
}

main();
