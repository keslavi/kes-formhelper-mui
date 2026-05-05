import { useCallback, memo } from 'react';
import {
  Radio as MuiRadio,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  FormHelperText,
} from '@mui/material';
import { cleanParentProps } from './helper/clean-parent-props';
import { colProps } from './helper/col-props';
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
  const { field, error, valueProp } = useFormField(props);

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
      <FormControl>
        <FormLabel>{props.label ?? ''}</FormLabel>
        {error && <FormHelperText className="Mui-error">{error.message}</FormHelperText>}
        <RadioGroup
          row={props.row}
          id={field.name}
          name={field.name}
          onBlur={onBlur}
          onChange={onChange}
          {...valueProp}
          {...cleanParentProps(props)}
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
