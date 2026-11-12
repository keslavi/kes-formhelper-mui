#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { extname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const TEXT_EXTENSIONS = new Set([
  '.cjs', '.css', '.html', '.js', '.json', '.jsx', '.map', '.md', '.mdx', '.mjs', '.ts', '.tsx', '.txt',
]);

/** Shapes that sensitive-data scanners flag even when the value is a demo. */
const PATTERNS = [
  { name: 'SSN', re: /\b\d{3}-\d{2}-\d{4}\b/g },
  { name: 'EIN', re: /\b\d{2}-\d{7}\b/g },
  { name: 'SSN/EIN digits', re: /(["'`])\d{9}\1/g },
  { name: 'card number', re: /\b\d{4}([ -])\d{4}\1\d{4}\1\d{4}\b/g },
  { name: 'card digits', re: /(["'`])\d{13,19}\1/g },
];

function walk(dir, visit) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, visit);
    else if (entry.isFile()) visit(path);
  }
}

/**
 * @param {string[]} paths files or directories
 * @returns {{ file: string, pattern: string, match: string }[]}
 */
export function findSensitivePatterns(paths) {
  const findings = [];
  const scan = (path) => {
    if (!TEXT_EXTENSIONS.has(extname(path).toLowerCase())) return;
    const text = readFileSync(path, 'utf8');
    for (const { name, re } of PATTERNS) {
      for (const match of text.matchAll(re)) {
        findings.push({ file: path, pattern: name, match: match[0] });
      }
    }
  };
  for (const path of paths) {
    if (!existsSync(path)) continue;
    if (statSync(path).isDirectory()) walk(path, scan);
    else scan(path);
  }
  return findings;
}

/** Exits the process when any directory contains a flagged pattern. */
export function assertNoSensitivePatterns(dirs, root = process.cwd()) {
  const findings = findSensitivePatterns(dirs);
  if (!findings.length) return;
  console.error('Sensitive-data patterns found; build demo values from parts (see src/stories/sample-data.js):');
  for (const { file, pattern, match } of findings) {
    console.error(`  ${relative(root, file)}: ${pattern} ${match}`);
  }
  process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dirs = process.argv.slice(2);
  assertNoSensitivePatterns(dirs.length ? dirs : ['dist', 'storybook-static', 'src/stories']);
  console.log('No sensitive-data patterns found');
}
