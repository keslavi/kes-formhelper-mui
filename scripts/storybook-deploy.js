/**
 * Copies storybook-static to the workspace seed folder for local consumption.
 */
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { copyBuildArtifacts } from './copy-build-artifacts.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = join(__dirname, '..', '..');

copyBuildArtifacts({
  storybook: join(workspaceRoot, 'formhelper-mui-storybook'),
});
