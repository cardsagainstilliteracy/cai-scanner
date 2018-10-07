const path = require('path');
const fs = require('fs');
const getPinyin = require('pinyin');

const relativeImagePath = process.argv[2];

const fullPinyinPath = path.join(__dirname, '../pinyin/', relativeImagePath.replace(/\.[a-zA-Z]*$/, '.txt'));
if (!fs.existsSync(fullPinyinPath)) {
  console.log('Generating pinyin...');

  const fullTextPath = path.join(__dirname, '../parseResults/', relativeImagePath.replace(/\.[a-zA-Z]*$/, '.txt'));
  if (!fs.existsSync(fullTextPath)) {
    throw new Error('Please scan first (npm run scan).');
  }

  const text = fs.readFileSync(fullTextPath).toString('utf8');
  const lines = text.split('\n').filter(line => line.length > 0);

  const pinyin = lines.map(line => (
    getPinyin(line, {
      segment: true,
    })
      .map(x => x[0])
  ))
    .map(x => x.join(' '));
  fs.writeFileSync(fullPinyinPath, pinyin.join('\n'));
}

process.exit(0);
