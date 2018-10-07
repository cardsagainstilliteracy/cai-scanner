const path = require('path');
const fs = require('fs');
const { Translate } = require('@google-cloud/translate');

const relativeImagePath = process.argv[2] || process.env.IMAGE_PATH;

const fullTranslationPath = path.join(__dirname, '../translations/', relativeImagePath.replace(/\.[a-zA-Z]*$/, '.txt'));
if (!fs.existsSync(fullTranslationPath)) {
  console.log('Translating...');

  const fullTextPath = path.join(__dirname, '../parseResults/', relativeImagePath.replace(/\.[a-zA-Z]*$/, '.txt'));
  if (!fs.existsSync(fullTextPath)) {
    throw new Error('Please scan first (npm run scan).');
  }

  const text = fs.readFileSync(fullTextPath).toString('utf8');
  const lines = text.split('\n').filter(line => line.length > 0);

  const projectId = 'cai-scanner';
  const translate = new Translate({ projectId });
  const translated = await Promise.all(
    lines
      .map(line => (
        translate.translate(line, 'en')
          .then(result => result[0])
      ))
  );
  fs.writeFileSync(fullTranslationPath, translated.join('\n'));
}
