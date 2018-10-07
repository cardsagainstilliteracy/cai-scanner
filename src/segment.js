const path = require('path');
const fs = require('fs');
const nodejieba = require('nodejieba');
const stringifyObject = require('stringify-object');

const relativeImagePath = process.argv[2];

const segmentPinyin = (pinyin, characters) => {
  const characterPinyin = pinyin.split(' ');
  const segmentLengths = nodejieba.cut(characters).map(segment => segment.length);
  const pinyinSegments = [];
  segmentLengths.forEach((len) => {
    pinyinSegments.push(characterPinyin.splice(0, len).join(''));
  });
  return pinyinSegments.join(' ');
};

const fullDeckPath = path.join(__dirname, '../decks/', relativeImagePath.replace(/\.[a-zA-Z]*$/, '.js'));
if (!fs.existsSync(fullDeckPath)) {
  const fullTextPath = path.join(__dirname, '../parseResults/', relativeImagePath.replace(/\.[a-zA-Z]*$/, '.txt'));
  if (!fs.existsSync(fullTextPath)) {
    throw new Error('Please scan first (npm run scan).');
  }
  const fullTranslationPath = path.join(__dirname, '../translations/', relativeImagePath.replace(/\.[a-zA-Z]*$/, '.txt'));
  if (!fs.existsSync(fullTranslationPath)) {
    throw new Error('Please translate first (npm run translate).');
  }
  const fullPinyinPath = path.join(__dirname, '../pinyin/', relativeImagePath.replace(/\.[a-zA-Z]*$/, '.txt'));
  if (!fs.existsSync(fullPinyinPath)) {
    throw new Error('Please generate pinyin first (npm run pinyin).');
  }
  const text = fs.readFileSync(fullTextPath)
    .toString('utf8')
    .split('\n')
    .filter(line => line.length > 0);
  const translations = fs.readFileSync(fullTranslationPath)
    .toString('utf8')
    .split('\n')
    .filter(line => line.length > 0);
  const pinyin = fs.readFileSync(fullPinyinPath)
    .toString('utf8')
    .split('\n')
    .filter(line => line.length > 0);
  const cards = text.map((characters, i) => ({
    characters,
    meaning: translations[i],
    pinyin: segmentPinyin(pinyin[i], characters),
  }));
  const deck = {
    name: relativeImagePath.replace(/\.[a-zA-Z]*$/, ''),
    cards,
  };
  const deckString = stringifyObject(deck, {
    indent: '  ',
    singleQuotes: true,
  });
  const code = 'export default ' + deckString + ';';
  fs.writeFileSync(fullDeckPath, code);
}

process.exit(0);
