import {
  STORYBOOK_BASE_PATH,
  STORYBOOK_PUBLIC_DIR,
  storybookIndexUrl,
} from './storybook-constants';

export { STORYBOOK_BASE_PATH, STORYBOOK_PUBLIC_DIR, storybookIndexUrl };

export type FormhelperStorybookProps = {
  /** Full iframe URL. Defaults to storybookIndexUrl(srcBasePath). */
  src?: string;
  /** Base path for default src; ignored when src is set. */
  srcBasePath?: string;
  className?: string;
  title?: string;
};

const defaultFrameStyle = {
  border: 0,
  width: '100%',
  height: '100vh',
} as const;

export function FormhelperStorybook({
  src,
  srcBasePath = STORYBOOK_BASE_PATH,
  className,
  title = 'Formhelper component docs',
}: FormhelperStorybookProps) {
  return (
    <iframe
      src={src ?? storybookIndexUrl(srcBasePath)}
      title={title}
      loading="lazy"
      className={className}
      style={defaultFrameStyle}
    />
  );
}
