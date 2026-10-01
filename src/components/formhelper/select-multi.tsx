import { memo, useCallback, useMemo, useState } from 'react';
import { TextField, Autocomplete as MuiAutocomplete } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useCleanParentProps } from './helper/clean-parent-props';
import { pickColLayoutProps } from './helper/clean-grid-props';
import { getOptionLabelsByKeys } from './helper/option-display';
import { useFormField, UseFormFieldProps } from './form-provider';
import { Info } from './info';
import { ColPadded } from '../grid';
import type { FormControlProps, TextEntryProps } from './control-props';
import type { Option, Options } from './option';

export type SelectMultiOption = Option;

export type SelectMultiProps = UseFormFieldProps & FormControlProps & TextEntryProps & {
  optionsMulti: Options;
};

export const SelectMulti = memo((props: SelectMultiProps) => {
  const { field, readOnly, errorMui, identityProps } = useFormField(props);
  const isReadOnly = readOnly;
  const [inputValue, setInputValue] = useState('');

  const placeholder = props.placeholder !== undefined ? props.placeholder : 'Please Select';

  const selectedOptions = useMemo(() =>
    Array.isArray(field.value)
      ? props.optionsMulti.filter(opt => field.value.includes(opt.key))
      : [],
    [field.value, props.optionsMulti]
  );

  const filteredOptions = useMemo(() => {
    const selectedKeys = Array.isArray(field.value) ? field.value : [];
    return props.optionsMulti.filter(o => !selectedKeys.includes(o.key));
  }, [field.value, props.optionsMulti]);

  const onBlur = useCallback((e: React.FocusEvent) => {
    field.onBlur();
    props.onBlur?.(e as any);
  }, [field, props.onBlur]);

  const onChange = useCallback((_e: any, newValue: SelectMultiOption[]) => {
    if (props.disabled || readOnly) return;
    const selected = Array.isArray(newValue) ? newValue.map(i => i.key) : [];
    field.onChange(selected);
    props.onChange?.(selected as any);
  }, [field, props.disabled, props.onChange, readOnly]);

  const shouldShowPlaceholder = selectedOptions.length === 0 && inputValue === '';

  const displayValue = useMemo(
    () => getOptionLabelsByKeys(props.optionsMulti, field.value).join(', '),
    [props.optionsMulti, field.value]
  );
  const textFieldParentProps = useCleanParentProps(props, 'textField');
  const autocompleteParentProps = useCleanParentProps(props, 'autocomplete');

  if (isReadOnly) {
    return (
      <ColPadded {...pickColLayoutProps(props)}>
        <TextField
          inputRef={field.ref}
          {...identityProps}
          label={props.label}
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
        {props.info && <Info id={`${field.name}Info`} info={props.info} />}
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
        onInputChange={(_e, v) => setInputValue(v)}
        inputValue={inputValue}
        options={filteredOptions}
        getOptionDisabled={option => !!option.disabled}
        getOptionLabel={o => o?.text ?? ''}
        isOptionEqualToValue={(o, v) => o?.key === v?.key}
        popupIcon={<KeyboardArrowDownIcon />}
        value={selectedOptions}
        {...autocompleteParentProps}
        renderInput={params => {
          const inputPlaceholder = shouldShowPlaceholder ? placeholder : '';
          return (
            <TextField
              {...params}
              inputRef={field.ref}
              label={props.label}
              placeholder={inputPlaceholder}
              variant="outlined"
              fullWidth
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
                  ...(shouldShowPlaceholder ? { shrink: true } : {}),
                },
              }}
            />
          );
        }}
      />
      {props.info && <Info id={`${field.name}Info`} info={props.info} />}
    </ColPadded>
  );
});

SelectMulti.displayName = 'SelectMulti';
