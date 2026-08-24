const https = require('https');

function searchUnsplash(keyword) {
  return new Promise((resolve) => {
    const url = `https://unsplash.com/s/photos/${encodeURIComponent(keyword)}?orientation=landscape`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        // Look for the first high-res photo URL
        const match = data.match(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+[^\s"'\\]+/);
        if (match) {
          resolve(match[0]);
        } else {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

searchUnsplash('eraser').then(res => console.log('Eraser:', res));
searchUnsplash('pencil').then(res => console.log('Pencil:', res));
