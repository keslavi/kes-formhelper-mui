import React, { useCallback, useMemo } from 'react';
import {
  Select as MuiSelect,
  MenuItem,
  FormControl,
  InputLabel,
  TextField as MuiTextField,
} from '@mui/material';
import { useCleanParentProps } from './helper/clean-parent-props';
import { pickColLayoutProps } from './helper/clean-grid-props';
import { getOptionLabelByKey } from './helper/option-display';
import { useFormField, UseFormFieldProps } from './form-provider';
import { Info } from './info';
import { ColPadded } from '../grid';

export interface SelectOption {
  key: string | number;
  text: string;
}

export type SelectProps = UseFormFieldProps & {
  label?: string;
  placeholder?: string;
  options?: SelectOption[];
  info?: any;
  size?: number | string;
};

export const Select = React.memo((props: SelectProps) => {
  const { field, error, valueProp, identityProps } = useFormField(props);
  const isReadOnly = !!props.readOnly;

  const renderedOptions = useMemo(() =>
    props.options?.map(x => (
      <MenuItem key={x.key} value={x.key}>{x.text}</MenuItem>
    )) ?? [],
    [props.options]
  );

  const onBlur = useCallback((e: React.FocusEvent) => {
    field.onBlur((e.target as any).value);
    props.onBlur?.(e as any);
  }, [field, props.onBlur]);

  const onChange = useCallback((e: React.ChangeEvent<{ value: unknown }>) => {
    field.onChange((e.target as any).value);
    props.onChange?.(e as any);
  }, [field, props.onChange]);

  const hasError = !!error || !!props.error;
  const errorMessage = error?.message ?? (typeof props.error === 'object' ? props.error?.message : props.error);

  const rawValue = (field?.value ?? (valueProp as any)?.value ?? (valueProp as any)?.defaultValue) as unknown;
  const displayValue = useMemo(() => getOptionLabelByKey(props.options, rawValue), [props.options, rawValue]);
  const textFieldParentProps = useCleanParentProps(props, 'textField');
  const selectParentProps = useCleanParentProps(props, 'select');

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
          {...(hasError ? { error: true, helperText: errorMessage } : {})}
          {...textFieldParentProps}
          slotProps={{ htmlInput: { readOnly: true } }}
        />
        {props.info && <Info id={`${field.name}Info`} info={props.info} />}
      </ColPadded>
    );
  }

  return (
    <ColPadded {...pickColLayoutProps(props)}>
      <FormControl fullWidth error={hasError}>
        <InputLabel id={`${field.name}-label`}>{props.label}</InputLabel>
        <MuiSelect
          labelId={`${field.name}-label`}
          {...identityProps}
          label={props.label ?? ''}
          onBlur={onBlur}
          onChange={onChange as any}
          {...valueProp}
          displayEmpty
          renderValue={(selected: any) => {
            if (!selected || selected === '') {
              return <span style={{ color: '#666' }}>{props.placeholder ?? 'Please Select'}</span>;
            }
            const opt = props.options?.find(o => String(o.key) === String(selected));
            return opt ? opt.text : selected;
          }}
          {...selectParentProps}
        >
          {renderedOptions}
        </MuiSelect>
        {errorMessage && (
          <div style={{ color: 'red', fontSize: '0.75rem', marginTop: 3 }}>
            {errorMessage}
          </div>
        )}
      </FormControl>
      {props.info && <Info id={`${field.name}Info`} info={props.info} />}
    </ColPadded>
  );
});

Select.displayName = 'Select';
