/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  server: {
    port: 5100,
    strictPort: true,
    open: true,
  },
  plugins: [
    react(),
    dts({
      include: ['src/index.ts', 'src/storybook-embed.tsx', 'src/storybook-constants.ts'],
      tsconfigPath: './tsconfig.app.json',
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        'formhelper-mui': resolve(dirname, 'src/index.ts'),
        'storybook-embed': resolve(dirname, 'src/storybook-embed.tsx'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // Externalize deps that should not be bundled into the library
      external: ['react', 'react-dom', 'react/jsx-runtime', '@mui/material', '@mui/system', '@mui/utils', '@mui/styled-engine-sc', '@mui/icons-material', '@mui/lab', '@mui/x-date-pickers', '@emotion/react', '@emotion/styled', 'react-hook-form', '@hookform/resolvers', 'yup'],
      output: {
        // Provide globals for UMD build (not used here but good practice)
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJsxRuntime',
          '@mui/material': 'MuiMaterial',
          '@emotion/react': 'EmotionReact',
          '@emotion/styled': 'EmotionStyled'
        }
      }
    }
  },
  test: {
    api: {
      port: 5300,
    },
    projects: [
    {
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
    },
    {
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        },
      }
    }]
  }
});