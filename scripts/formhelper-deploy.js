import {copyFileSync, mkdirSync, existsSync,readdirSync} from 'fs';
import {dirname, join} from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src= join(__dirname, '..', 'dist');
const trg= join(__dirname, '..', '../seed/formhelper-mui-dist');

if (!existsSync(src)) {
    console.error('build output not found, run "npm run build" first');
    process.exit(1);
}

mkdirSync(trg, { recursive: true });
for (const file of readdirSync(src)) {
    copyFileSync(join(src, file), join(trg, file));
}
console.log('build output copied to seed folder');
