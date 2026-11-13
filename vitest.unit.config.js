import { spawn } from 'node:child_process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export const unitTestConfig = {
  name: 'unit',
  globals: true,
  environment: 'jsdom',
  setupFiles: ['./src/test/_setupTest.ts'],
  css: true,
  include: ['src/**/*.test.{ts,tsx,js,jsx}'],
  exclude: ['node_modules', 'dist'],
  clearMocks: true,
  restoreMocks: true,
};

export const unitTestProject = {
  extends: true,
  test: unitTestConfig,
};

function openUrl(url) {
  const [command, args] =
    process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]]
    : process.platform === 'darwin' ? ['open', [url]]
    : ['xdg-open', [url]];
  spawn(command, args, { stdio: 'ignore', detached: true }).unref();
}

// Vitest's built-in --open only sends ?token= on the first run ever, then relies on a cookie.
// Always open the authenticated URL instead; the env flag prevents new tabs on config restarts.
const openVitestUiWithToken = () => ({
  name: 'open-vitest-ui-with-token',
  configureVitest({ vitest }) {
    const { ui, watch, api, uiBase } = vitest.config;
    const origin = vitest.vite.resolvedUrls?.local[0];
    if (!ui || !watch || !origin || process.env.VITEST_UI_OPENED) return;
    process.env.VITEST_UI_OPENED = '1';
    const url = new URL(uiBase, origin);
    url.searchParams.set('token', api.token);
    openUrl(url.href);
  },
});

export default defineConfig({
  plugins: [react(), openVitestUiWithToken()],
  test: unitTestConfig,
});
