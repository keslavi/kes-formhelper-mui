import { memo, useCallback, useMemo } from 'react';
import {
  TextField,
  Autocomplete as MuiAutocomplete,
  Checkbox as MuiCheckbox,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useCleanParentProps } from './helper/clean-parent-props';
import { pickColLayoutProps } from './helper/clean-grid-props';
import { getOptionLabelsByKeys } from './helper/option-display';
import { useFormField, UseFormFieldProps } from './form-provider';
import { Info } from './info';
import { ColPadded } from '../grid';
import type { FormControlProps, TextEntryProps } from './control-props';
import type { Option, Options } from './option';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export type SelectCheckboxOption = Option;

export type SelectCheckboxProps = UseFormFieldProps & FormControlProps & TextEntryProps & {
  optionsCheckbox: Options;
};

export const SelectCheckbox = memo((props: SelectCheckboxProps) => {
  const { optionsCheckbox: options, label, info, ...restProps } = props;
  const { field, readOnly, errorMui, identityProps } = useFormField(props);
  const isReadOnly = readOnly;
  const placeholder = props.placeholder !== undefined ? props.placeholder : 'Please Select';

  const onBlur = useCallback((e: React.FocusEvent) => {
    field.onBlur((e.target as any).value);
    props.onBlur?.(e as any);
  }, [field, props.onBlur]);

  const onChange = useCallback((_e: any, newValue: SelectCheckboxOption[]) => {
    if (props.disabled || readOnly) return;
    const selected = Array.isArray(newValue) ? newValue.map(i => i.key) : [];
    field.onChange(selected);
    props.onChange?.(selected as any);
  }, [field, props.disabled, props.onChange, readOnly]);

  const selectedOptions = useMemo(() => {
    if (!Array.isArray(field.value) || !Array.isArray(options)) return [];
    return options.filter(o => field.value.includes(o.key));
  }, [field.value, options]);

  const displayValue = useMemo(
    () => getOptionLabelsByKeys(options, field.value).join(', '),
    [options, field.value]
  );
  const textFieldParentProps = useCleanParentProps(restProps, 'textField');
  const autocompleteParentProps = useCleanParentProps(restProps, 'autocomplete');

  if (isReadOnly) {
    return (
      <ColPadded {...pickColLayoutProps(props)}>
        <TextField
          inputRef={field.ref}
          {...identityProps}
          label={label}
          variant="outlined"
          fullWidth
          value={displayValue}
          placeholder={placeholder}
          onBlur={onBlur}
          {...errorMui}
          {...textFieldParentProps}
          slotProps={{
            htmlInput: {
              readOnly: true,
              maxLength: props.maxLength,
              minLength: props.minLength,
            },
          }}
        />
        {info && <Info id={`${field.name}Info`} info={info} />}
      </ColPadded>
    );
  }

  return (
    <ColPadded {...pickColLayoutProps(props)}>
      <MuiAutocomplete
        {...identityProps}
        multiple
        onBlur={onBlur}
        onChange={onChange}
        options={Array.isArray(options) ? options : []}
        getOptionDisabled={option => !!option.disabled}
        disableCloseOnSelect
        popupIcon={<KeyboardArrowDownIcon />}
        getOptionLabel={o => o?.text ?? ''}
        isOptionEqualToValue={(o, v) => o?.key === v?.key}
        value={selectedOptions}
        {...autocompleteParentProps}
        renderOption={(optProps, option, { selected }) => {
          const { key, ...rest } = optProps as any;
          return (
            <li key={key} {...rest}>
              <MuiCheckbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
                disabled={!!option.disabled}
              />
              {option.text}
            </li>
          );
        }}
        renderInput={params => {
          const inputPlaceholder = selectedOptions.length === 0 ? placeholder : '';
          return (
            <TextField
              {...params}
              inputRef={field.ref}
              label={label}
              variant="outlined"
              placeholder={inputPlaceholder}
              {...errorMui}
              slotProps={{
                ...params.slotProps,
                htmlInput: {
                  ...params.slotProps?.htmlInput,
                  placeholder: inputPlaceholder,
                  maxLength: props.maxLength,
                  minLength: props.minLength,
                },
                inputLabel: {
                  ...params.slotProps?.inputLabel,
                  ...(selectedOptions.length === 0 ? { shrink: true } : {}),
                },
              }}
            />
          );
        }}
      />
      {info && <Info id={`${field.name}Info`} info={info} />}
    </ColPadded>
  );
});

SelectCheckbox.displayName = 'SelectCheckbox';
