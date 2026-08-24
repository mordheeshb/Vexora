const fs = require('fs');
const path = require('path');

// Map of broken 404 Unsplash photo IDs -> verified working HTTP 200 photo IDs
const REPLACEMENT_MAP = {
  '1585336261026-8f5786372966': '1585336261022-680e295ce3fe', // pens
  '1579783902614-a3fb3927b675': '1491841550275-ad7854e35ca6', // art
  '1600865521950-e83713a0c644': '1586075010923-2dd4570fb338', // erasers
  '1590435105267-33e3871de999': '1586075010923-2dd4570fb338', // sharpeners
  '1611100516668-3e4293f0bbf3': '1586075010923-2dd4570fb338', // rulers
  '1497034825429-c343d706a5e1': '1583485088034-697b5bc54ccd', // premium pens
  '1517842645767-063c046dc12a': '1583485088034-697b5bc54ccd', // parker pens
  '1531346878373-b5f79d9e798c': '1456735190827-d1262f71b8a3', // notebooks/paper
  '1503694978374-8a2fb5206fd2': '1456735190827-d1262f71b8a3', // long notebooks
  '1606326608606-fdf8fa11b1c9': '1456735190827-d1262f71b8a3', // drawing books
  '1523289217054-28af27f677fb': '1593062096033-9a26b09da705', // files
  '1611099359144-8456886e04f0': '1509062522246-3755977927d7', // geometry
  '1527814631626-d62130eef7f8': '1544816155-12df9643f363', // water bottles
  '1604147706283-d7119b1b8b6a': '1524995997946-a1c2e315a42f', // school accessories
  '1499805543169-122e23b7ff83': '1544816155-12df9643f363', // labels
  '1452860616231-1558c4eb5e6d': '1532094349884-543bc11b234d', // educational
  '1629851605333-e1f98ef4fc1b': '1491841550275-ad7854e35ca6', // colour pencils
  '1513542789411-b6a5d4f316cb': '1580582932707-520aed937b7b', // sketch pens
  '1526040801323-2615462e08e6': '1491841550275-ad7854e35ca6', // crayons
  '1519389953810-c1036f5f1906': '1491841550275-ad7854e35ca6'  // brushes
};

function fixFileContent(filePath) {
  if (!fs.existsSync(filePath)) return;
  let contentStr = fs.readFileSync(filePath, 'utf8');
  let replacementsMade = 0;

  for (const [badId, goodId] of Object.entries(REPLACEMENT_MAP)) {
    if (contentStr.includes(badId)) {
      contentStr = contentStr.split(badId).join(goodId);
      replacementsMade++;
    }
  }

  fs.writeFileSync(filePath, contentStr, 'utf8');
  console.log(`Updated ${filePath} (${replacementsMade} ID replacements made)`);
}

function main() {
  console.log('Fixing broken Unsplash photo IDs...');
  fixFileContent(path.join(__dirname, '../data/categories.json'));
  fixFileContent(path.join(__dirname, '../data/products.json'));
  fixFileContent(path.join(__dirname, '../src/data/vexora-catalog.json'));
  console.log('Done!');
}

main();
