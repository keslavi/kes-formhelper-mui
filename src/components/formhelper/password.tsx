import { memo, useCallback, useState } from 'react';
import { TextField as MuiTextField, IconButton, InputAdornment } from '@mui/material';
import IconVisibility from '@mui/icons-material/Visibility';
import IconVisibilityOff from '@mui/icons-material/VisibilityOff';
import { cleanParentProps } from './helper/clean-parent-props';
import { colProps } from './helper/col-props';
import { useFormField, UseFormFieldProps } from './form-provider';
import { Info } from './info';
import { ColPadded } from '../grid';

export type PasswordProps = UseFormFieldProps & {
  label?: string;
  info?: any;
  size?: number | string;
};

export const Password = memo((props: PasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { field, errorMui, valueProp } = useFormField(props);

  const onBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    field.onBlur(e.target.value);
    props.onBlur?.(e as any);
  }, [field, props.onBlur]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e.target.value);
    props.onChange?.(e as any);
  }, [field, props.onChange]);

  return (
    <ColPadded {...colProps(props)}>
      <MuiTextField
        fullWidth
        type={showPassword ? 'text' : 'password'}
        id={field.name}
        name={field.name}
        label={props.label}
        inputRef={field.ref}
        onBlur={onBlur}
        onChange={onChange}
        {...cleanParentProps(props)}
        {...valueProp}
        {...errorMui}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(v => !v)}
                  onMouseDown={e => e.preventDefault()}
                  edge="end"
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
