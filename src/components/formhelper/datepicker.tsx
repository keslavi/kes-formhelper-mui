import { memo, useCallback, useMemo } from 'react';
import { TextField as MuiTextField } from '@mui/material';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { cleanParentProps } from './helper/clean-parent-props';
import { colProps } from './helper/col-props';
import { useFormField, UseFormFieldProps } from './form-provider';
import { ColPadded } from '../grid';

export type DatepickerProps = UseFormFieldProps & {
  label?: string;
  min?: string;
  max?: string;
  readOnly?: boolean;
  size?: number | string;
};

const normalizeDateInput = (raw?: any): string | undefined => {
  if (!raw) return raw;

  if (typeof raw === 'string') {
    const isoMatch = raw.match(/^\d{4}-\d{2}-\d{2}/);
    if (isoMatch) return isoMatch[0];
  }

  const parsed = dayjs(raw);
  if (parsed.isValid()) {
    return parsed.format('YYYY-MM-DD');
  }

  return typeof raw === 'string' ? raw : undefined;
};

export const Datepicker = memo((props: DatepickerProps) => {
  const { field, errorMui, valueProp } = useFormField(props);
  const isReadOnly = !!props.readOnly;

  const attributes = useMemo(() => {
    const inputProps: Record<string, string> = {};
    if (!isEmpty(props.min)) inputProps.min = dayjs(props.min).format('YYYY-MM-DD');
    if (!isEmpty(props.max)) inputProps.max = dayjs(props.max).format('YYYY-MM-DD');
    return inputProps;
  }, [props.min, props.max]);

  const normalizedValueProp = useMemo(() => {
    if ('value' in valueProp && valueProp.value !== undefined) {
      return { value: normalizeDateInput(valueProp.value) };
    }
    if ('defaultValue' in valueProp && valueProp.defaultValue !== undefined) {
      return { defaultValue: normalizeDateInput(valueProp.defaultValue) };
    }
    return valueProp;
  }, [valueProp]);

  const displayValue = useMemo(
    () => normalizeDateInput(field?.value ?? (valueProp as any)?.value ?? (valueProp as any)?.defaultValue) ?? '',
    [field?.value, valueProp]
  );

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e.target.value);
    props.onChange?.(e as any);
  }, [field, props.onChange]);

  if (isReadOnly) {
    const readOnlyFieldProps = { ...cleanParentProps(props) } as Record<string, unknown>;
    delete readOnlyFieldProps.type;

    return (
      <ColPadded {...colProps(props)}>
        <MuiTextField
          fullWidth
          type="text"
          id={field.name}
          name={field.name}
          label={props.label}
          inputRef={field.ref}
          onBlur={field.onBlur}
          value={
            displayValue
              ? (dayjs(displayValue).isValid()
                ? dayjs(displayValue).format('MM/DD/YYYY')
                : String(displayValue))
              : ''
          }
          {...readOnlyFieldProps}
          {...errorMui}
          slotProps={{
            htmlInput: {
              readOnly: true,
              style: { cursor: 'text' },
            },
          }}
        />
      </ColPadded>
    );
  }

  return (
    <ColPadded {...colProps(props)}>
      <MuiTextField
        fullWidth
        type="date"
        id={field.name}
        name={field.name}
        label={props.label}
        inputRef={field.ref}
        onBlur={field.onBlur}
        onChange={onChange}
        {...cleanParentProps(props)}
        {...normalizedValueProp}
        {...errorMui}
        slotProps={{
          htmlInput: {
            ...attributes,
            style: { cursor: 'pointer' },
          },
        }}
      />
    </ColPadded>
  );
});

Datepicker.displayName = 'Datepicker';
