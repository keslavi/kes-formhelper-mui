/** URL subpath where the host app serves storybook-static (no trailing slash). */
export const STORYBOOK_BASE_PATH = '/formhelper-storybook';

/** Folder name inside the published package (and public/ copy target in host apps). */
export const STORYBOOK_PUBLIC_DIR = 'formhelper-storybook';

export function storybookIndexUrl(basePath = STORYBOOK_BASE_PATH): string {
  const normalized = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  return `${normalized}/index.html`;
}
