import { useCallback, memo } from 'react';
import {
  Radio as MuiRadio,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  FormHelperText,
} from '@mui/material';
import { useCleanParentProps } from './helper/clean-parent-props';
import { pickColLayoutProps } from './helper/clean-grid-props';
import { Info } from './info';
import { useFormField, UseFormFieldProps } from './form-provider';
import { ColPadded } from '../grid';

export interface RadioOption {
  key: string | number;
  text: string;
}

export type RadioProps = UseFormFieldProps & {
  label?: string;
  optionsRadio: RadioOption[];
  row?: boolean;
  info?: any;
  disabled?: boolean;
  size?: number | string;
};

export const Radio = memo((props: RadioProps) => {
  const { field, errorMui, valueProp, identityProps } = useFormField(props);

  const onBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    field.onBlur(e.target.value);
    props.onBlur?.(e as any);
  }, [field, props.onBlur]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e.target.value);
    props.onChange?.(e as any);
  }, [field, props.onChange]);

  const parentProps = useCleanParentProps(props, 'radioGroup');

  return (
    <ColPadded {...pickColLayoutProps(props)}>
      <FormControl error={!!errorMui.error}>
        <FormLabel>{props.label ?? ''}</FormLabel>
        {errorMui.error && (
          <FormHelperText className="Mui-error">{errorMui.helperText}</FormHelperText>
        )}
        <RadioGroup
          row={props.row}
          {...identityProps}
          onBlur={onBlur}
          onChange={onChange}
          {...valueProp}
          {...parentProps}
        >
          {props.optionsRadio.map(x => (
            <FormControlLabel
              key={x.key}
              value={x.key}
              control={<MuiRadio />}
              label={x.text}
              {...(props.disabled ? { disabled: true } : {})}
            />
          ))}
        </RadioGroup>
      </FormControl>
      {props.info && <Info id={`${field.name}Info`} info={props.info} />}
    </ColPadded>
  );
});

Radio.displayName = 'Radio';
