#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

/**
 * @param {string} srcDir
 * @param {string} destDir
 */
export function copyDir(srcDir, destDir) {
  if (!existsSync(srcDir)) {
    return false;
  }

  mkdirSync(destDir, { recursive: true });

  for (const name of readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = join(srcDir, name.name);
    const destPath = join(destDir, name.name);

    if (name.isDirectory()) {
      copyDir(srcPath, destPath);
      continue;
    }

    cpSync(srcPath, destPath);
  }

  return true;
}

/**
 * @param {{ dist?: string, storybook?: string }} targets
 */
export function copyBuildArtifacts(targets) {
  const distSrc = join(root, 'dist');
  const storybookSrc = join(root, 'storybook-static');
  let copied = false;

  if (targets.dist) {
    if (!copyDir(distSrc, targets.dist)) {
      console.error(`dist output not found at ${distSrc}; run "npm run build:lib" first`);
      process.exit(1);
    }
    console.log(`dist copied to ${targets.dist}`);
    copied = true;
  }

  if (targets.storybook) {
    if (!copyDir(storybookSrc, targets.storybook)) {
      console.error(`storybook-static not found at ${storybookSrc}; run "npm run storybook-build" first`);
      process.exit(1);
    }
    console.log(`storybook-static copied to ${targets.storybook}`);
    copied = true;
  }

  if (!copied) {
    console.error('No deploy targets configured');
    process.exit(1);
  }
}
