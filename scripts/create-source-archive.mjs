#!/usr/bin/env node
import {
  existsSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import { dirname, join, relative } from 'path';
import { execFileSync } from 'child_process';
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

function collectTrackedSourceFiles() {
  const trackedPaths = execFileSync('git', ['ls-files', '--cached', '-z'], {
    cwd: root,
    encoding: 'buffer',
  }).toString('utf8').split('\0').filter(Boolean);

  return trackedPaths
    .filter((path) => {
      const segments = path.split('/');
      const filename = segments.at(-1);
      return existsSync(join(root, path))
        && !segments.some((segment) => SOURCE_EXCLUDED_DIRS.has(segment))
        && path !== 'source.zip'
        && filename !== '.DS_Store'
        && !filename.endsWith('.tsbuildinfo')
        && !filename.endsWith('.log')
        && !(filename.startsWith('.env') && filename !== '.env.example');
    })
    .map((path) => join(root, path));
}

const sourceFiles = collectTrackedSourceFiles();
// Tests include synthetic SSNs and card numbers as mask fixtures.
const nonTestFiles = sourceFiles.filter((path) => !/\.(test|spec)\./i.test(path));
assertNoSensitivePatterns(nonTestFiles, root);

const archiveEntries = Object.fromEntries(
  sourceFiles.map((path) => [
    `source/${relative(root, path).replaceAll('\\', '/')}`,
    readFileSync(path),
  ]),
);
writeFileSync(SOURCE_ARCHIVE, zipSync(archiveEntries, { level: 6 }));
console.log(`Created source archive at ${SOURCE_ARCHIVE}`);
