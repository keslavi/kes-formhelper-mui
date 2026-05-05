import { memo, useCallback, useMemo } from 'react';
import {
  TextField as MuiTextField,
  Autocomplete as MuiAutocomplete,
  InputLabel as MuiInputLabel,
} from '@mui/material';
import IconKeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import { cleanParentProps } from './helper/clean-parent-props';
import { colProps } from './helper/col-props';
import { getOptionLabelByKey } from './helper/option-display';
import { useFormField, UseFormFieldProps } from './form-provider';
import { Info } from './info';
import { ColPadded } from '../grid';

export interface SelectAutocompleteOption {
  key: string | number;
  text: string;
}

export type SelectAutocompleteProps = UseFormFieldProps & {
  label?: string;
  placeholder?: string;
  options?: SelectAutocompleteOption[];
  info?: any;
  size?: number | string;
};

export const SelectAutocomplete = memo((props: SelectAutocompleteProps) => {
  const options = useMemo(() => props.options ?? [], [props.options]);
  const { field, errorMui } = useFormField(props);
  const isReadOnly = !!props.readOnly;

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
    field.onChange(newValue ? newValue.key : null);
    props.onChange?.(_e, newValue as any);
  }, [field, props.onChange]);

  const displayValue = useMemo(() => getOptionLabelByKey(options, field.value), [options, field.value]);

  if (isReadOnly) {
    return (
      <ColPadded {...colProps(props)}>
        <MuiTextField
          fullWidth
          id={field.name}
          name={field.name}
          label={props.label}
          inputRef={field.ref}
          onBlur={onBlur}
          value={displayValue}
          placeholder={placeholder}
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
        options={options}
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
              slots={{
                inputLabel: (ilProps: any) => <MuiInputLabel {...ilProps} shrink />,
              }}
            />
            {props.info && <Info id={`${field.name}Info`} info={props.info} />}
          </>
        )}
        {...cleanParentProps(props)}
      />
    </ColPadded>
  );
});

SelectAutocomplete.displayName = 'SelectAutocomplete';
