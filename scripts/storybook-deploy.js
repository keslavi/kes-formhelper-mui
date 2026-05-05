/** 
 * copies storybook build output to workspace storybook-static 
 * ./formhelerp-mui/ npm run storybook:deploy
 * 
 * **/

import {cpSync, existsSync, rmSync} from 'fs';
import {dirname, join} from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const src = join(__dirname, '..', '../storybook-static');
const trg= join(__dirname, '..', 'storybook-static');
 
if (!existsSync(src)) {
    console.error('storybook build output not found, run "npm run storybook:build" first');
    process.exit(1);
}

rmSync(trg, { recursive: true, force: true });
cpSync(src, trg, { recursive: true });

console.log ('storybook build output copied to workspace storybook-static');
