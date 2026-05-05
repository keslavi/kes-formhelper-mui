import { memo, useCallback, useMemo, useState } from 'react';
import { TextField, Autocomplete as MuiAutocomplete } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { cleanParentProps } from './helper/clean-parent-props';
import { colProps } from './helper/col-props';
import { getOptionLabelsByKeys } from './helper/option-display';
import { useFormField, UseFormFieldProps } from './form-provider';
import { Info } from './info';
import { ColPadded } from '../grid';

export interface SelectMultiOption {
  key: string | number;
  text: string;
}

export type SelectMultiProps = UseFormFieldProps & {
  label?: string;
  placeholder?: string;
  optionsMulti: SelectMultiOption[];
  info?: any;
  size?: number | string;
};

export const SelectMulti = memo((props: SelectMultiProps) => {
  const { field, errorMui } = useFormField(props);
  const isReadOnly = !!props.readOnly;
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
    const selected = Array.isArray(newValue) ? newValue.map(i => i.key) : [];
    field.onChange(selected);
    props.onChange?.(selected as any);
  }, [field, props.onChange]);

  const shouldShowPlaceholder = selectedOptions.length === 0 && inputValue === '';

  const displayValue = useMemo(
    () => getOptionLabelsByKeys(props.optionsMulti, field.value).join(', '),
    [props.optionsMulti, field.value]
  );

  if (isReadOnly) {
    return (
      <ColPadded {...colProps(props)}>
        <TextField
          inputRef={field.ref}
          id={field.name}
          name={field.name}
          label={props.label}
          variant="outlined"
          fullWidth
          value={displayValue}
          placeholder={placeholder}
          onBlur={onBlur}
          {...errorMui}
          {...cleanParentProps(props)}
          slotProps={{ htmlInput: { readOnly: true } }}
        />
        {props.info && <Info id={`${field.name}Info`} info={props.info} />}
      </ColPadded>
    );
  }

  return (
    <ColPadded {...colProps(props)}>
      <MuiAutocomplete
        id={field.name}
        multiple
        onBlur={onBlur}
        onChange={onChange}
        onInputChange={(_e, v) => setInputValue(v)}
        inputValue={inputValue}
        options={filteredOptions}
        getOptionLabel={o => o?.text ?? ''}
        isOptionEqualToValue={(o, v) => o?.key === v?.key}
        popupIcon={<KeyboardArrowDownIcon />}
        value={selectedOptions}
        {...cleanParentProps(props)}
        renderInput={params => (
          <TextField
            {...params}
            inputRef={field.ref}
            label={props.label}
            placeholder={shouldShowPlaceholder ? placeholder : ''}
            variant="outlined"
            fullWidth
            {...errorMui}
          />
        )}
      />
      {props.info && <Info id={`${field.name}Info`} info={props.info} />}
    </ColPadded>
  );
});

SelectMulti.displayName = 'SelectMulti';
