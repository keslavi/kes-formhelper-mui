import { memo, useCallback, useMemo } from 'react';
import {
  TextField as MuiTextField,
  Autocomplete as MuiAutocomplete,
} from '@mui/material';
import IconKeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import { useCleanParentProps } from './helper/clean-parent-props';
import { pickColLayoutProps } from './helper/clean-grid-props';
import { getOptionLabelByKey } from './helper/option-display';
import { useFormField, UseFormFieldProps } from './form-provider';
import { Info } from './info';
import { ColPadded } from '../grid';
import type { FormControlProps, TextEntryProps } from './control-props';
import type { Option, Options } from './option';

export type SelectAutocompleteOption = Option;

export type SelectAutocompleteProps = UseFormFieldProps & FormControlProps & TextEntryProps & {
  options?: Options;
};

export const SelectAutocomplete = memo((props: SelectAutocompleteProps) => {
  const options = useMemo(() => props.options ?? [], [props.options]);
  const { field, readOnly, errorMui, identityProps } = useFormField(props);
  const isReadOnly = readOnly;

  const placeholder = props.placeholder !== undefined ? props.placeholder : 'Please Select';

  const isCleared = !field.value || field.value === '' || field.value == null;

  const selectedOption = useMemo(() => {
    if (isCleared) return null;
    return options.find(o => o.key == field.value) ?? null;
  }, [field.value, options, isCleared]);

  const onBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    field.onBlur(e.target.value);
    props.onBlur?.(e as any);
  }, [field, props.onBlur]);

  const onChange = useCallback((_e: any, newValue: SelectAutocompleteOption | null) => {
    if (props.disabled || readOnly) return;
    field.onChange(newValue ? newValue.key : null);
    props.onChange?.(_e, newValue as any);
  }, [field, props.disabled, props.onChange, readOnly]);

  const displayValue = useMemo(() => getOptionLabelByKey(options, field.value), [options, field.value]);
  const textFieldParentProps = useCleanParentProps(props, 'textField');
  const autocompleteParentProps = useCleanParentProps(props, 'autocomplete');

  if (isReadOnly) {
    return (
      <ColPadded {...pickColLayoutProps(props)}>
        <MuiTextField
          fullWidth
          {...identityProps}
          label={props.label}
          inputRef={field.ref}
          onBlur={onBlur}
          value={displayValue}
          placeholder={placeholder}
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
        options={options}
        getOptionDisabled={option => !!option.disabled}
        getOptionLabel={o => o?.text ?? ''}
        onChange={onChange}
        onBlur={onBlur}
        value={selectedOption}
        fullWidth
        popupIcon={<IconKeyboardArrowDown />}
        renderInput={params => (
          <>
            <MuiTextField
              {...params}
              label={props.label}
              placeholder={placeholder}
              {...errorMui}
              slotProps={{
                ...params.slotProps,
                htmlInput: {
                  ...params.slotProps.htmlInput,
                  placeholder,
                  maxLength: props.maxLength,
                  minLength: props.minLength,
                },
                inputLabel: {
                  ...params.slotProps.inputLabel,
                  shrink: true,
                },
              }}
            />
            {props.info && <Info id={`${field.name}Info`} info={props.info} />}
          </>
        )}
        {...autocompleteParentProps}
      />
    </ColPadded>
  );
});

SelectAutocomplete.displayName = 'SelectAutocomplete';
