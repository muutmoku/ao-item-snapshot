const fs = require('fs');
const path = require('path');
const toHTML = require('directory-index-html');

function generateIndex(dirPath) {
  const entries = fs.readdirSync(dirPath).map(name => {
    const fullPath = path.join(dirPath, name);
    const stats = fs.statSync(fullPath);
    return {
      name: stats.isDirectory() ? `${name}/` : name,
      size: stats.size,
      mtime: stats.mtime
    };
  });

  const html = toHTML(dirPath, entries);
  fs.writeFileSync(path.join(dirPath, 'index.html'), html);
}

function walkDir(currentPath) {
  generateIndex(currentPath);
  fs.readdirSync(currentPath).forEach(name => {
    const fullPath = path.join(currentPath, name);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    }
  });
}

walkDir(path.join(__dirname, '..', 'docs'));
