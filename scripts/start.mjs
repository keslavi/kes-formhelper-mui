#!/usr/bin/env node
import { concurrently } from 'concurrently';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { killDevPorts } from './kill-dev-ports.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const killPortsScript = join(root, 'scripts', 'kill-dev-ports.mjs');

killDevPorts();

const services = [
  { name: 'fh', command: 'npm run dev', prefixColor: 'blue' },
  { name: 'sb', command: 'npm run storybook', prefixColor: 'yellow' },
  { name: 'tests', command: 'npm run test', prefixColor: 'magenta' },
  // { name: 'server', command: 'cd ../server-koa && npm run dev' },
  // { name: 'seed', command: 'cd ../seed && npm run dev' },
];

const { commands, result } = concurrently(services, {
  cwd: root,
  killTimeout: 3000,
  teardown: [`node "${killPortsScript}"`],
});

// When the app dev server (5100) stops, take storybook (5200) and vitest (5300) down with it.
const devServer = commands.find((command) => command.name === 'fh');
devServer.close.subscribe(() => {
  for (const command of commands) {
    if (command !== devServer) command.kill();
  }
});

result.then(
  () => process.exit(0),
  () => process.exit(0),
);
