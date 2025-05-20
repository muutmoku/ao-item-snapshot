const fs = require('fs');
const path = require('path');
const toHTML = require('directory-index-html');

const BASE_URL = 'https://muutmoku.github.io/ao-item-snapshot/';

function generateIndex(dirPath, relativePath) {
  const entries = fs.readdirSync(dirPath).map(name => {
    const fullPath = path.join(dirPath, name);
    const stats = fs.statSync(fullPath);
    return {
      name: stats.isDirectory() ? `${name}/` : name,
      size: stats.size,
      mtime: stats.mtime
    };
  });

  const fullURL = BASE_URL + relativePath.replace(/\\/g, '/');
  const html = toHTML(fullURL, entries);
  fs.writeFileSync(path.join(dirPath, 'index.html'), html);
}

function walkAndGenerate(currentPath, relativePath = '') {
  generateIndex(currentPath, relativePath);
  fs.readdirSync(currentPath).forEach(name => {
    const fullPath = path.join(currentPath, name);
    if (fs.statSync(fullPath).isDirectory()) {
      walkAndGenerate(fullPath, path.join(relativePath, name));
    }
  });
}

walkAndGenerate(path.join(__dirname, '..', 'docs'));
