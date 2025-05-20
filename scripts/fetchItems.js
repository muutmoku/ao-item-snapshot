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
    res.on('end', () => {
      console.log(`Fetched URL: ${url} [${res.statusCode}]`);
      resolve(JSON.parse(data));
    });
  }).on('error', (err) => {
    console.error(`Failed to fetch URL: ${url}`, err);
    reject(err);
  });
});

const fetchAllItemsForSlot = async (slot) => {
  let allItems = [];
  let offset = 0;
  const limit = 50;

  while (true) {
    const url = `https://gameinfo.albiononline.com/api/gameinfo/items/search?slot=${slot}&limit=${limit}&offset=${offset}`;
    console.log(`Fetching slot: ${slot} | offset: ${offset}`);
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
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const datedDir = path.join(__dirname, '../docs/data', yyyy.toString(), mm, dd);
  const latestDir = path.join(__dirname, '../docs/data', 'latest');

  for (const slot of slots) {
    try {
      console.log(`\n=== Processing slot: ${slot} ===`);
      const data = await fetchAllItemsForSlot(slot);
      saveJSON(datedDir, slot, data);
      saveJSON(latestDir, slot, data);
      console.log(`Saved ${data.length} items for slot: ${slot}`);
    } catch (e) {
      console.error(`Error processing slot ${slot}:`, e);
    }
  }
};

run();
