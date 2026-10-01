import { memo, useCallback, useMemo, useState } from 'react';
import { TextField as MuiTextField, IconButton, InputAdornment } from '@mui/material';
import IconVisibility from '@mui/icons-material/Visibility';
import IconVisibilityOff from '@mui/icons-material/VisibilityOff';
import { useCleanParentProps } from './helper/clean-parent-props';
import { pickColLayoutProps } from './helper/clean-grid-props';
import { useFormField, UseFormFieldProps } from './form-provider';
import { Info } from './info';
import { ColPadded } from '../grid';
import type { FormControlProps, TextEntryProps } from './control-props';

export type PasswordProps = UseFormFieldProps & FormControlProps & TextEntryProps;

export const Password = memo((props: PasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { field, readOnly, errorMui, valueProp, identityProps } = useFormField(props);

  const onBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    field.onBlur(e.target.value);
    props.onBlur?.(e as any);
  }, [field, props.onBlur]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e.target.value);
    props.onChange?.(e as any);
  }, [field, props.onChange]);

  const parentProps = useCleanParentProps(props, 'textField');
  const placeholder = props.placeholder ?? parentProps.placeholder;

  const htmlInputProps = useMemo(() => ({
    readOnly,
    maxLength: props.maxLength,
    minLength: props.minLength,
    ...(placeholder ? { placeholder } : {}),
  }), [readOnly, props.maxLength, props.minLength, placeholder]);

  return (
    <ColPadded {...pickColLayoutProps(props)}>
      <MuiTextField
        fullWidth
        type={showPassword ? 'text' : 'password'}
        {...identityProps}
        label={props.label}
        placeholder={placeholder}
        inputRef={field.ref}
        onBlur={onBlur}
        onChange={onChange}
        {...parentProps}
        {...valueProp}
        {...errorMui}
        slotProps={{
          ...parentProps.slotProps,
          htmlInput: {
            ...parentProps.slotProps?.htmlInput,
            ...htmlInputProps,
          },
          input: {
            ...parentProps.slotProps?.input,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    if (!props.disabled) setShowPassword(v => !v);
                  }}
                  onMouseDown={e => e.preventDefault()}
                  edge="end"
                  disabled={props.disabled}
                >
                  {showPassword ? <IconVisibilityOff /> : <IconVisibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      {props.info && <Info id={`${field.name}Info`} info={props.info} />}
    </ColPadded>
  );
});

Password.displayName = 'Password';
