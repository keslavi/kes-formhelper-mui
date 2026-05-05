import type { CSSProperties } from 'react';

/** Deep-clone via JSON round-trip */
const clone = (obj: unknown): unknown => JSON.parse(JSON.stringify(obj));

interface TextareaDebugProps {
  value?: unknown;
  /** Show the debug textarea. Typically wire to your app's config.debug flag. */
  debug?: boolean;
  hidden?: boolean;
  rows?: number;
  cols?: number;
  style?: CSSProperties;
}

export const TextareaDebug = ({
  value = {},
  debug = true,
  hidden,
  rows = 10,
  cols = 100,
  style,
}: TextareaDebugProps) => {
  if (!debug || hidden) return null;

  let display: string;
  try {
    display = JSON.stringify(clone(value), null, 2);
  } catch {
    display = String(value);
  }

  return (
    <div style={style}>
      Debug:<br />
      <textarea
        readOnly
        rows={rows}
        cols={cols}
        value={display}
      />
    </div>
  );
};

export default TextareaDebug;
