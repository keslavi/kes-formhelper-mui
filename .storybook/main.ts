import type { StorybookConfig } from '@storybook/react-vite';
import { STORYBOOK_BASE_PATH } from '../src/storybook-constants.ts';

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

    return config;
  },
};

export default config;
