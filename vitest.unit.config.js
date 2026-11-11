import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export const unitTestProject = {
  extends: true,
  test: {
    name: 'unit',
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/_setupTest.ts'],
    css: true,
    include: ['src/**/*.test.{ts,tsx,js,jsx}'],
    exclude: ['node_modules', 'dist'],
    clearMocks: true,
    restoreMocks: true,
  },
};

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [unitTestProject],
  },
});
