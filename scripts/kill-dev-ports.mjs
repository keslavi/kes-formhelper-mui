import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

export const DEV_PORTS = [5100, 5200, 5300];

export function killDevPorts(ports = DEV_PORTS) {
  for (const port of ports) {
    try {
      if (process.platform === 'win32') {
        const lines = execSync(`netstat -ano | findstr ":${port}"`, { encoding: 'utf8' });
        const pids = new Set(
          lines
            .split('\n')
            .map((line) => line.trim().split(/\s+/).pop())
            .filter(Boolean),
        );
        for (const pid of pids) {
          execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
          console.log(`Freed port ${port} (pid ${pid})`);
        }
      } else {
        const pids = execSync(`lsof -ti tcp:${port} -sTCP:LISTEN 2>/dev/null || true`, {
          encoding: 'utf8',
          shell: true,
        }).trim();
        if (pids) {
          execSync(`kill -9 ${pids.split('\n').join(' ')}`, { stdio: 'ignore', shell: true });
          console.log(`Freed port ${port} (pid ${pids.replace('\n', ', ')})`);
        }
      }
    } catch {
      // port not in use
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const ports = process.argv.slice(2).map(Number).filter(Boolean);
  killDevPorts(ports.length ? ports : DEV_PORTS);
}
