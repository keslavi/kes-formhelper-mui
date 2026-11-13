#!/usr/bin/env node
import {
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import { dirname, join, relative, sep } from 'path';
import { fileURLToPath } from 'url';
import { zipSync } from 'fflate';
import { assertNoSensitivePatterns } from './scan-sensitive-patterns.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const SOURCE_ARCHIVE = join(root, 'source.zip');
const SOURCE_EXCLUDED_DIRS = new Set([
  '.git',
  '.nyc_output',
  '.vite',
  '.cache',
  'coverage',
  'dist',
  'dist-formhelper-mui',
  'node_modules',
  'storybook-static',
]);

function collectSourceFiles(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SOURCE_EXCLUDED_DIRS.has(entry.name)) {
        collectSourceFiles(path, files);
      }
      continue;
    }

    if (
      entry.isFile()
      && relative(root, path) !== 'source.zip'
      && entry.name !== '.DS_Store'
      && !entry.name.endsWith('.tsbuildinfo')
      && !entry.name.endsWith('.log')
      && !(entry.name.startsWith('.env') && entry.name !== '.env.example')
    ) {
      files.push(path);
    }
  }
  return files;
}

const sourceFiles = collectSourceFiles(root);
// Tests include synthetic SSNs and card numbers as mask fixtures.
const nonTestFiles = sourceFiles.filter((path) => !/\.(test|spec)\./i.test(path));
assertNoSensitivePatterns(nonTestFiles, root);

const archiveEntries = Object.fromEntries(
  sourceFiles.map((path) => [
    `source/${relative(root, path).split(sep).join('/')}`,
    readFileSync(path),
  ]),
);
writeFileSync(SOURCE_ARCHIVE, zipSync(archiveEntries, { level: 6 }));
console.log(`Created source archive at ${SOURCE_ARCHIVE}`);
