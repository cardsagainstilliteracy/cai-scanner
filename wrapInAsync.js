const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const code = fs.readFileSync(path.join(__dirname, 'src/' + process.argv[2]))
  .toString('utf8');
fs.writeFileSync(
  path.join(__dirname, 'dist/' + process.argv[2]),
  '(async () => {' + code + '})()',
);

try {
  const stdout = execSync('node dist/' + process.argv[2] + ' ' + process.argv[3]);
  console.log(stdout.toString('utf8'));
} catch (_) {
  process.exit(1);
}
