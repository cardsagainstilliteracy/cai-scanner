const { execSync } = require('child_process');
const imagePath = process.argv[2] || process.env.IMAGE_PATH;

console.log(execSync('npm run scan ' + imagePath).toString('utf8'));
console.log(execSync('npm run translate ' + imagePath).toString('utf8'));
console.log(execSync('npm run pinyin ' + imagePath).toString('utf8'));
console.log(execSync('npm run segment ' + imagePath).toString('utf8'));
