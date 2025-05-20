const fs = require('fs');
const path = require('path');
const toHTML = require('directory-index-html');

const BASE_URL = 'https://muutmoku.github.io/ao-item-snapshot/';
const ROOT_DIR = path.join(__dirname, '..', 'docs');
const HIDDEN_FILES = ['index.html'];

function generateIndex(dirPath, relativePath) {
  const isRoot = path.resolve(dirPath) === path.resolve(ROOT_DIR);

  let entries = fs.readdirSync(dirPath)
    .filter(name => !HIDDEN_FILES.includes(name))
    .map(name => {
      const fullPath = path.join(dirPath, name);
      const stats = fs.statSync(fullPath);
      return {
        name: stats.isDirectory() ? `${name}/` : name,
        size: stats.size,
        mtime: stats.mtime
      };
    });

  const url = BASE_URL + (relativePath ? relativePath.replace(/\\/g, '/') + '/' : '');
  const htmlRaw = toHTML(url, entries);

  const html = isRoot
    ? htmlRaw.replace('<a href="../">../</a>\n', '')
    : htmlRaw;

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

walkAndGenerate(ROOT_DIR);
