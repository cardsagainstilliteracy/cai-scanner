(async () => {const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const ocr = require('ocr-space-api');

const relativeImagePath = process.argv[2];
if (relativeImagePath === undefined) {
  console.error('You are required to pass the image path (relative to images/) as the first argument.');
  process.exit(1);
}

const notChinese = /[^\/\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]/gi;
const processText = text => (
  text
    .split('\n')
    .map(line => line.replace(notChinese, ''))
    .filter(line => line.length > 0)
    .map(line => (
      line.split('/').length === 1 ? line : line.split('/')[0]
    ))
    .join('\n')
);

const fullTextPath = path.join(__dirname, '../parseResults/', relativeImagePath.replace(/\.[a-zA-Z]*$/, '.txt'));
if (!fs.existsSync(fullTextPath)) {
  console.log('Scanning...');
  
  const fullImagePath = path.join(__dirname, '../images/', relativeImagePath);
  const fullCompressedImagePath = path.join(__dirname, '../compressedImages/', relativeImagePath);

  await sharp(fullImagePath)
    .resize(1200)
    .toFile(fullCompressedImagePath);

  const { parsedText } = await ocr.parseImageFromLocalFile(fullCompressedImagePath, {
    apikey: '43cfbc818988957',
    language: 'chs',
  });

  fs.writeFileSync(fullTextPath, processText(parsedText));
}

process.exit(0);
})()