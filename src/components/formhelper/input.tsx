import { isEmpty } from '../../utils/is-empty';
import { ArrayInput, ArrayInputProps } from './array-input';
import { Checkbox, CheckboxProps } from './checkbox';
import { Datepicker, DatepickerProps } from './datepicker';
import { DateMask, DateMaskProps } from './date-mask';
import { SelectMulti, SelectMultiProps } from './select-multi';
import { Select, SelectProps } from './select';
import { Radio, RadioProps } from './radio';
import { SelectAutocomplete, SelectAutocompleteProps } from './select-autocomplete';
import { SelectCheckbox, SelectCheckboxProps } from './select-checkbox';
import { Textarea, TextareaProps } from './textarea';
import { TextField, TextFieldProps } from './text-field';
import { TextMask, TextMaskProps } from './text-mask';
import { Password, PasswordProps } from './password';
import { CharCount, CharCountProps } from './char-count';

/**
 * Multi-type input dispatcher — selects the right component based on props.
 *
 * - `arrayInput` → ArrayInput
 * - `datepicker` → Datepicker
 * - `datemask` → DateMask (masked date input)
 * - `checkbox` → Checkbox
 * - `password` → Password
 * - `options` + `select` → Select
 * - `options` (no select) → SelectAutocomplete
 * - `optionsMulti` → SelectMulti
 * - `optionsRadio` → Radio
 * - `optionsCheckbox` → SelectCheckbox
 * - `textarea` → Textarea
 * - `charCount` → CharCount
 * - default → TextField
 */

export type InputProps =
  & Partial<ArrayInputProps>
  & Partial<CheckboxProps>
  & Partial<DatepickerProps>
  & Partial<DateMaskProps>
  & Partial<TextMaskProps>
  & Partial<SelectMultiProps>
  & Partial<SelectProps>
  & Partial<RadioProps>
  & Partial<SelectAutocompleteProps>
  & Partial<SelectCheckboxProps>
  & Partial<TextareaProps>
  & Partial<TextFieldProps>
  & Partial<PasswordProps>
  & Partial<CharCountProps>
  & {
  arrayInput?: boolean;
  select?: boolean;
  /** When true (optionally with `datepicker`), renders a masked date using DateMask */
  datemask?: boolean;
};

export const Input = (props: InputProps) => {
  const {
    arrayInput,
    charCount,
    checkbox,
    datepicker,
    datemask,
    mask,
    options,
    optionsMulti,
    optionsRadio,
    optionsCheckbox,
    password,
    select,
    textarea,
  } = props;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Ctl: React.ComponentType<any> = arrayInput
    ? ArrayInput
    : datemask
    ? DateMask
    : mask
    ? TextMask
    : datepicker
    ? Datepicker
    : checkbox
    ? Checkbox
    : password
    ? Password
    : !isEmpty(options)
    ? select
      ? Select
      : SelectAutocomplete
    : !isEmpty(optionsMulti)
    ? SelectMulti
    : !isEmpty(optionsRadio)
    ? Radio
    : !isEmpty(optionsCheckbox)
    ? SelectCheckbox
    : textarea
    ? Textarea
    : charCount
    ? CharCount
    : TextField;

  return <Ctl {...props} />;
};

Input.displayName = 'Input';
