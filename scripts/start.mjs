#!/usr/bin/env node
import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { killDevPorts } from './kill-dev-ports.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const concurrentlyCli = join(root, 'node_modules', 'concurrently', 'dist', 'bin', 'concurrently.js');
const killPortsScript = join(root, 'scripts', 'kill-dev-ports.mjs');


killDevPorts();


const services = [
  'npm run test',
  'npm run dev',
  'npm run storybook',
  // 'cd ../server-koa && npm run dev',
  // 'cd ../seed && npm run dev',
];

const child = spawn(
  process.execPath,
  [
    concurrentlyCli,
    '--kill-timeout', '3000',
    '--teardown', `node ${killPortsScript}`,
    '--names', 'tests,fh,sb',
    '-c', 'magenta,blue,yellow',
    ...services,
  ],
  { cwd: root, stdio: 'inherit', env: process.env },
);

let shuttingDown = false;

function shutdown(signal) {
  if (shuttingDown) {
    killDevPorts();
    process.exit(1);
    return;
  }
  shuttingDown = true;
  child.kill(signal);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

child.on('exit', (code) => process.exit(code ?? 0));
