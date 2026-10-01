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
import { dirname, extname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dest = join(root, '.dist-package-state');
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

function runNpm(args) {
  return execSync(['npm', ...args].map(quoteArg).join(' '), {
    cwd: root,
    encoding: 'utf8',
  });
}

function requirePublishArtifacts() {
  const missing = ['dist', 'storybook-static'].filter((name) => !existsSync(join(root, name)));
  if (missing.length) {
    console.error(
      `${missing.join(' and ')} not found; run "npm run build" first (same as prepublishOnly)`,
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

requirePublishArtifacts();

const { packDir, tarball } = packToTemp();

try {
  extractTarball(tarball);
} finally {
  rmSync(packDir, { recursive: true, force: true });
}

const sanitized = sanitizeStorybookStatic();
const topLevel = readdirSync(dest).sort().join(', ');
console.log(`Staged uncompressed npm pack contents in ${dest}`);
console.log(`Top-level: ${topLevel}`);
if (sanitized) {
  console.log(`Sanitized password assignment in ${sanitized} storybook-static file(s)`);
}
