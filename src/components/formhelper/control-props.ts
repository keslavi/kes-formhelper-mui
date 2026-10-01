import type { GridColSize } from './helper/clean-grid-props';
import type { InfoValue } from './info';

/**
 * Props shared by every formhelper control.
 * `size` is the MUI Grid `size` prop — see {@link GridColSize}.
 */
export interface FormControlProps {
  label?: string;
  info?: InfoValue;
  readOnly?: boolean;
  disabled?: boolean;
  /** MUI control density; `size` remains reserved for the Grid column span. */
  sizeInput?: 'small' | 'medium';
  size?: GridColSize;
}

/** Props for controls that contain a text-entry `<input>` or textarea. */
export interface TextEntryProps {
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
}
