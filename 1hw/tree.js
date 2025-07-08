#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// Парсинг аргументов
const args = process.argv.slice(2);
let dir = '.';
let maxDepth = Infinity;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--depth' || args[i] === '-d') {
    maxDepth = parseInt(args[i + 1], 10);
    i++;
  } else if (!args[i].startsWith('-')) {
    dir = args[i];
  }
}

async function tree(currentPath, depth = 0, prefix = '', isLast = true) {
  if (depth > maxDepth) return '';
  let output = '';
  const baseName = path.basename(currentPath);
  if (depth === 0) {
    output += baseName + '\n';
  } else {
    output += prefix + (isLast ? '└── ' : '├── ') + baseName + '\n';
  }
  if (depth === maxDepth) return output;
  let stats;
  try {
    stats = await fs.lstat(currentPath);
  } catch (e) {
    return output;
  }
  if (!stats.isDirectory()) return output;
  let files;
  try {
    files = await fs.readdir(currentPath);
  } catch (e) {
    return output;
  }
  files.sort();
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(currentPath, file);
    const last = i === files.length - 1;
    const newPrefix =
      depth === 0
        ? ''
        : prefix + (isLast ? '    ' : '│   ');
    output += await tree(filePath, depth + 1, newPrefix, last);
  }
  return output;
}

(async () => {
  const absPath = path.resolve(dir);
  const result = await tree(absPath, 0, '', true);
  process.stdout.write(result.replace(/\r?\n/g, '\n'));
})(); 