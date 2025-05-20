const fs = require('fs');
const path = require('path');
const https = require('https');

const slots = [
  'mainhand', 'offhand', 'head', 'armor', 'shoes',
  'bag', 'cape', 'mount', 'food', 'potion'
];

const fetchJSON = (url) => new Promise((resolve, reject) => {
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => resolve(JSON.parse(data)));
  }).on('error', reject);
});

const fetchAllItemsForSlot = async (slot) => {
  let allItems = [];
  let offset = 0;
  const limit = 50;

  while (true) {
    const url = `https://gameinfo.albiononline.com/api/gameinfo/items/search?slot=${slot}&limit=${limit}&offset=${offset}`;
    const data = await fetchJSON(url);
    if (!data.length) break;
    allItems = allItems.concat(data);
    if (data.length < limit) break;
    offset += limit;
  }

  return allItems;
};

const saveJSON = (dir, slot, data) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${slot}.json`), JSON.stringify(data, null, 2));
};

const run = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const week = Math.ceil((((today - new Date(year, 0, 1)) / 86400000) + today.getDay() + 1) / 7);
  const datedDir = path.join(__dirname, '../public/items', `${year}-${week.toString().padStart(2, '0')}`);
  const latestDir = path.join(__dirname, '../public/items', 'latest');

  for (const slot of slots) {
    try {
      const data = await fetchAllItemsForSlot(slot);
      saveJSON(datedDir, slot, data);
      saveJSON(latestDir, slot, data);
      console.log(`Saved: ${slot}`);
    } catch (e) {
      console.error(`Error fetching ${slot}:`, e);
    }
  }
};

run();
