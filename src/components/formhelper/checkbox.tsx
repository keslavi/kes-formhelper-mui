import { memo, useCallback, useMemo } from 'react';
import {
  Checkbox as MuiCheckbox,
  FormControlLabel as MuiFormControlLabel,
  Typography,
  FormHelperText,
} from '@mui/material';
import { color } from '../../theme-material';
import { useFormField, UseFormFieldProps } from './form-provider';
import { cleanParentProps } from './helper/clean-parent-props';
import { colProps } from './helper/col-props';
import { ColPadded } from '../grid';
import { isTruthy } from '../../utils/is-truthy';

export type CheckboxProps = UseFormFieldProps & {
  label?: string;
  variant?: 'h1' | 'h2' | 'h3' | string;
  isChecked?: any;
  size?: number | string;
};

export const Checkbox = memo((props: CheckboxProps) => {
  const variant = props.variant ?? '';
  const { field, error, errorMui } = useFormField(props);

  const isChecked = useCallback(() => isTruthy(field.value ?? props.isChecked), [field.value, props.isChecked]);

  const label = useMemo(() => {
    const labelText = props.label ?? '';
    switch (variant) {
      case 'h1':
        return (
          <Typography style={{ fontSize: '1.2rem', fontWeight: 500, color: color.primary.blue }}>
            {labelText}
          </Typography>
        );
      case 'h2':
        return (
          <Typography style={{ fontWeight: 400, color: color.primary.blue }}>
            {labelText}
          </Typography>
        );
      case 'h3':
        return (
          <Typography style={{ fontSize: '.8rem', fontWeight: 300, color: color.primary.blue }}>
            {labelText}
          </Typography>
        );
      default:
        return labelText;
    }
  }, [props.label, variant]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e.target.checked);
    props.onChange?.(e as any);
  }, [field, props.onChange]);

  const onBlur = useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
    field.onBlur(e.target);
    props.onBlur?.(e as any);
  }, [field, props.onBlur]);

  return (
    <ColPadded {...colProps(props)}>
      <MuiFormControlLabel
        control={
          <MuiCheckbox
            id={field.name}
            name={field.name}
            onChange={onChange}
            onBlurCapture={onBlur}
            checked={isChecked()}
            color="success"
            {...cleanParentProps(props)}
          />
        }
        label={<>&nbsp;{label}</>}
        style={{ marginLeft: 0 }}
      />
      {error && (
        <FormHelperText className="Mui-error">{errorMui.helperText}</FormHelperText>
      )}
    </ColPadded>
  );
});

Checkbox.displayName = 'Checkbox';
