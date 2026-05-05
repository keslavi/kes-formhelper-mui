/**
 * Copies formhelper-mui dist to seed/formhelper-mui-dist.
 * Run from formhelper-mui directory: node deploy-to-seed.js
 */
import { copyFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, 'dist');
const seedDest = join(__dirname, '..', 'seed', 'formhelper-mui-dist');

if (!existsSync(distDir)) {
  console.error('No dist/ folder. Run: npm run build');
  process.exit(1);
}

mkdirSync(seedDest, { recursive: true });
for (const name of readdirSync(distDir)) {
  copyFileSync(join(distDir, name), join(seedDest, name));
}
console.log('Deployed dist to seed/formhelper-mui-dist');
