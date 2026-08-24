const fs = require('fs');
const https = require('https');
const path = require('path');

const CATEGORIES_PATH = path.join(__dirname, '../data/categories.json');

async function scrapeBingImageThumb(query) {
  return new Promise((resolve, reject) => {
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`;
    
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Look for Bing's thumbnail CDN URLs
        const match = data.match(/https:\/\/tse[0-9]\.mm\.bing\.net\/th\?id=[A-Za-z0-9_.-]+/);
        if (match) {
          resolve(match[0] + "&w=400&h=420&c=7"); // append sizing params for consistency
        } else {
          resolve(null);
        }
      });
    }).on('error', err => reject(err));
  });
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
  console.log('Starting Bing Images Scraper...');
  const categories = JSON.parse(fs.readFileSync(CATEGORIES_PATH, 'utf8'));
  let updatedCount = 0;

  for (let category of categories) {
    console.log(`Processing category: ${category.name}`);
    for (let sub of category.subcategories) {
      if (!sub.image || sub.image.includes('placeholder.svg') || sub.image.includes('assets/images/categories/')) {
        const query = `${category.name} ${sub.name} stationery product high resolution photography`;
        console.log(`  Scraping image for: ${sub.name}...`);
        
        try {
          const imgUrl = await scrapeBingImageThumb(query);
          if (imgUrl) {
            sub.image = imgUrl;
            console.log(`  -> Found: ${imgUrl}`);
            updatedCount++;
          } else {
            console.log(`  -> No image found.`);
          }
          await delay(500); // 0.5s delay
        } catch (err) {
          console.error(`  -> Error scraping ${sub.name}:`, err.message);
        }
      }
    }
  }

  if (updatedCount > 0) {
    fs.writeFileSync(CATEGORIES_PATH, JSON.stringify(categories, null, 2));
    console.log(`\nSuccessfully updated ${updatedCount} subcategories with Web Image links!`);
  } else {
    console.log('\nNo missing images found or scraper failed.');
  }
}

main();
