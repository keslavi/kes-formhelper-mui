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
import type { FormControlProps } from './control-props';
import type { Option } from './option';

export type RadioOption = Option;

export type RadioProps = UseFormFieldProps & FormControlProps & {
  optionsRadio: RadioOption[];
  disabledKeys?: string[];
  row?: boolean;
};

export const Radio = memo((props: RadioProps) => {
  const { field, readOnly, errorMui, valueProp, identityProps } = useFormField(props);

  const onBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    field.onBlur(e.target.value);
    props.onBlur?.(e as any);
  }, [field, props.onBlur]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    field.onChange(e.target.value);
    props.onChange?.(e as any);
  }, [field, props.onChange, readOnly]);

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
          {...valueProp}
          {...parentProps}
          onBlur={onBlur}
          onChange={onChange}
          onClick={(e) => {
            if (readOnly) e.preventDefault();
          }}
        >
          {props.optionsRadio.map(x => (
            <FormControlLabel
              key={x.key}
              value={x.key}
              control={<MuiRadio slotProps={{ input: { readOnly } }} />}
              label={x.text}
              disabled={!!(
                props.disabled
                || (props.disabledKeys
                  ? props.disabledKeys.includes(String(x.key))
                  : x.disabled)
              )}
            />
          ))}
        </RadioGroup>
      </FormControl>
      {props.info && <Info id={`${field.name}Info`} info={props.info} />}
    </ColPadded>
  );
});

Radio.displayName = 'Radio';
