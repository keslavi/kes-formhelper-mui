import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { STORYBOOK_BASE_PATH } from '../src/storybook-constants.ts';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: '@storybook/react-vite',
  managerHead: (head, { configType }) => {
    if (configType === 'PRODUCTION') {
      return `${head}<base href="${STORYBOOK_BASE_PATH}/" />`;
    }
    return head;
  },
  async viteFinal(config, { configType }) {
    if (configType === 'PRODUCTION') {
      config.base = `${STORYBOOK_BASE_PATH}/`;
    }

    // Root vite.config.js is library-mode for npm builds; strip settings that break Storybook dev.
    if (config.build) {
      delete config.build.lib;
      delete config.build.rollupOptions;
    }

    config.plugins = config.plugins?.filter((plugin) => {
      const name = plugin && typeof plugin === 'object' && 'name' in plugin ? plugin.name : '';
      return name !== 'vite-plugin-dts' && name !== 'vite:dts';
    });

    // Self-alias so stories can import from '@formhelper' (same as downstream consumers).
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      '@formhelper': path.resolve(dirname, '../src/index.ts'),
      ...(typeof config.resolve.alias === 'object' && !Array.isArray(config.resolve.alias)
        ? config.resolve.alias
        : {}),
    };

    return config;
  },
};

export default config;
