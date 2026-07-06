/**
 * Copies formhelper-mui build artifacts to seed/.
 * Run from formhelper-mui directory: node deploy-to-seed.js
 */
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { copyBuildArtifacts } from './scripts/copy-build-artifacts.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = join(__dirname, '..');

copyBuildArtifacts({
  dist: join(workspaceRoot, 'formhelper-mui-dist'),
  storybook: join(workspaceRoot, 'formhelper-mui-storybook'),
});
