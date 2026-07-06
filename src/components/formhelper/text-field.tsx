import { memo, useCallback, useMemo } from 'react';
import { TextField as MuiTextField } from '@mui/material';
import { useCleanParentProps } from './helper/clean-parent-props';
import { pickColLayoutProps } from './helper/clean-grid-props';
import { useFormField, UseFormFieldProps } from './form-provider';
import { Info } from './info';
import { ColPadded } from '../grid';

export type TextFieldProps = UseFormFieldProps & {
  label?: string;
  placeholder?: string;
  info?: any;
  autoFocus?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  spellCheck?: boolean;
  inputMode?: string;
  autoComplete?: string;
  size?: number | string;
};

export const TextField = memo((props: TextFieldProps) => {
  const { field, errorMui, valueProp, identityProps } = useFormField(props);

  const onBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    field.onBlur(e.target.value);
    props.onBlur?.(e as any);
  }, [field, props.onBlur]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e.target.value);
    props.onChange?.(e as any);
  }, [field, props.onChange]);

  const inputProps = useMemo(() => ({
    readOnly: props.readOnly,
    maxLength: props.maxLength,
    minLength: props.minLength,
    pattern: props.pattern,
    spellCheck: props.spellCheck,
    inputMode: props.inputMode,
    autoComplete: props.autoComplete,
  }), [props.readOnly, props.maxLength, props.minLength, props.pattern, props.spellCheck, props.inputMode, props.autoComplete]);

  const parentProps = useCleanParentProps(props, 'textField');

  return (
    <ColPadded {...pickColLayoutProps(props)}>
      <MuiTextField
        fullWidth
        {...identityProps}
        label={props.label}
        {...(props.placeholder && { placeholder: props.placeholder })}
        inputRef={field.ref}
        onBlur={onBlur}
        onChange={onChange}
        autoFocus={props.autoFocus}
        {...parentProps}
        {...valueProp}
        {...errorMui}
        slotProps={{ htmlInput: inputProps }}
      />
      {props.info && <Info id={`${field.name}Info`} info={props.info} />}
    </ColPadded>
  );
});

TextField.displayName = 'TextField';
