#!/usr/bin/env node
import { execFileSync, execSync } from 'child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs';
import { tmpdir } from 'os';
import { dirname, extname, join, relative, sep } from 'path';
import { fileURLToPath } from 'url';
import { zipSync } from 'fflate';
import { assertNoSensitivePatterns } from './scan-sensitive-patterns.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dest = join(root, 'dist-formhelper-mui');
const SOURCE_ARCHIVE = join(root, 'source.zip');
const STAGED_SOURCE_ARCHIVE = join(dest, 'source.zip');
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
const PASSWORD_ASSIGNMENT = /password\s+=/gi;
const TEXT_EXTENSIONS = new Set([
  '.css',
  '.csv',
  '.htm',
  '.html',
  '.js',
  '.json',
  '.jsx',
  '.map',
  '.md',
  '.mjs',
  '.cjs',
  '.svg',
  '.ts',
  '.tsx',
  '.txt',
  '.xml',
  '.yml',
  '.yaml',
]);

function quoteArg(value) {
  if (!/[\s"]/.test(value)) {
    return value;
  }
  return `"${value.replaceAll('"', '\\"')}"`;
}

function runNpm(args, inheritOutput = false) {
  return execSync(['npm', ...args].map(quoteArg).join(' '), {
    cwd: root,
    ...(inheritOutput ? { stdio: 'inherit' } : { encoding: 'utf8' }),
  });
}

function requirePublishArtifacts() {
  const missing = ['dist', 'storybook-static'].filter((name) => !existsSync(join(root, name)));
  if (missing.length) {
    console.error(
      `Build did not produce ${missing.join(' and ')}; check the build output and try again`,
    );
    process.exit(1);
  }
}

function packToTemp() {
  const packDir = mkdtempSync(join(tmpdir(), 'stage-package-dist-'));
  const output = runNpm([
    'pack',
    '--pack-destination',
    packDir,
    '--ignore-scripts',
    '--json',
    '--loglevel=error',
  ]);

  const parsed = JSON.parse(output.trim());
  const packed = Array.isArray(parsed) ? parsed[0] : parsed;
  const filename = packed?.filename;
  if (!filename) {
    rmSync(packDir, { recursive: true, force: true });
    console.error('npm pack did not report a tarball filename');
    process.exit(1);
  }

  return { packDir, tarball: join(packDir, filename) };
}

function extractTarball(tarball) {
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });
  execFileSync('tar', ['-xzf', tarball, '-C', dest, '--strip-components=1']);
}

function walkFiles(dir, visit) {
  if (!existsSync(dir)) {
    return;
  }

  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, name.name);
    if (name.isDirectory()) {
      walkFiles(path, visit);
      continue;
    }
    if (name.isFile()) {
      visit(path);
    }
  }
}

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

function createSourceArchive() {
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
}

function sanitizeStorybookStatic() {
  const storybookDir = join(dest, 'storybook-static');
  if (!existsSync(storybookDir)) {
    console.error('storybook-static missing from packed package; it is listed in package.json files');
    process.exit(1);
  }

  let changedFiles = 0;
  walkFiles(storybookDir, (path) => {
    if (!TEXT_EXTENSIONS.has(extname(path).toLowerCase())) {
      return;
    }

    const buf = readFileSync(path);
    if (buf.includes(0)) {
      return;
    }

    const original = buf.toString('utf8');
    const sanitized = original.replace(PASSWORD_ASSIGNMENT, 'password=');
    if (sanitized === original) {
      return;
    }

    writeFileSync(path, sanitized, 'utf8');
    changedFiles += 1;
  });

  return changedFiles;
}

runNpm(['run', 'build'], true);
requirePublishArtifacts();
createSourceArchive();
try {
  const { packDir, tarball } = packToTemp();
  try {
    extractTarball(tarball);
  } finally {
    rmSync(packDir, { recursive: true, force: true });
  }
} finally {
  rmSync(SOURCE_ARCHIVE, { force: true });
}

const sanitized = sanitizeStorybookStatic();
assertNoSensitivePatterns([dest], root);
const topLevel = readdirSync(dest).sort().join(', ');
console.log(`Staged npm pack contents and source archive in ${dest}`);
console.log(`Top-level: ${topLevel}`);
console.log(`Source snapshot: ${STAGED_SOURCE_ARCHIVE}`);
if (sanitized) {
  console.log(`Sanitized password assignment in ${sanitized} storybook-static file(s)`);
}
