import { memo, useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { TextField as MuiTextField, IconButton, InputAdornment } from '@mui/material';
import IconVisibility from '@mui/icons-material/Visibility';
import IconVisibilityOff from '@mui/icons-material/VisibilityOff';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { useCleanParentProps } from './helper/clean-parent-props';
import { pickColLayoutProps } from './helper/clean-grid-props';
import { useFormField, UseFormFieldProps } from './form-provider';
import { ColPadded } from '../grid';

export type DateMaskProps = UseFormFieldProps & {
  label?: string;
  min?: string;
  max?: string;
  readOnly?: boolean;
  size?: number | string;
};

export const DateMask = memo((props: DateMaskProps) => {
  const { field, errorMui, valueProp, identityProps } = useFormField(props);

  const hasValue = !!(valueProp && (valueProp as any).value && String((valueProp as any).value).trim() !== '');
  const [masked, setMasked] = useState(hasValue);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const attributes = useMemo(() => {
    const inputProps: Record<string, string> = {};
    if (!isEmpty(props.min)) inputProps.min = dayjs(props.min).format('YYYY-MM-DD');
    if (!isEmpty(props.max)) inputProps.max = dayjs(props.max).format('YYYY-MM-DD');
    return inputProps;
  }, [props.min, props.max]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e.target.value);
    props.onChange?.(e as any);
  }, [field, props.onChange]);

  const onBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    field.onBlur(e.target.value);
    props.onBlur?.(e as any);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setMasked(true), 30000);
  }, [field, props.onBlur]);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const inputStyle = { cursor: 'pointer' } as const;

  const cleanedParentProps = useCleanParentProps(props, 'textField');
  const parentFieldProps = useMemo(() => {
    const { type, ...rest } = cleanedParentProps as Record<string, unknown>;
    return rest;
  }, [cleanedParentProps]);

  const testIdBase = useMemo(
    () => (parentFieldProps['data-testid'] as string | undefined) ?? identityProps['data-testid'],
    [parentFieldProps, identityProps],
  );

  const fieldIdentity = useCallback(
    (suffix: string, includeName = false) => ({
      id: `${identityProps.id}${suffix}`,
      'data-testid': `${testIdBase}${suffix}`,
      ...(includeName ? { name: identityProps.name } : {}),
    }),
    [identityProps, testIdBase],
  );

  const sharedFieldProps = {
    fullWidth: true,
    label: props.label,
    onBlur,
    onChange,
    ...parentFieldProps,
    ...errorMui,
  };

  const endAdornment = (
    <InputAdornment position="end" sx={{ height: 'auto' }}>
      <IconButton
        aria-label="toggle date visibility"
        onClick={() => setMasked(v => !v)}
        onMouseDown={e => e.preventDefault()}
        edge="end"
        size="small"
        sx={{
          p: '2px',
          minWidth: 'auto',
          transform: 'translateY(-2px)',
          '& svg': { fontSize: '1.15rem' },
        }}
      >
        {masked ? (
          <IconVisibilityOff sx={{ transform: 'translateY(-2px)' }} />
        ) : (
          <IconVisibility sx={{ transform: 'translateY(-2px)' }} />
        )}
      </IconButton>
    </InputAdornment>
  );

  /** MUI 7: end adornment on `slotProps.input`; keep min/max on `htmlInput`. */
  const slotMasked = {
    input: { endAdornment },
    htmlInput: { ...attributes, style: inputStyle, readOnly: true },
  };

  const slotDateEditable = {
    input: { endAdornment },
    htmlInput: { ...attributes, style: inputStyle },
  };

  const slotReadOnlyFormatted = {
    input: { endAdornment },
    htmlInput: { ...attributes, style: inputStyle, readOnly: true },
  };

  return (
    <ColPadded {...pickColLayoutProps(props)}>
      {/* Masked view — text only (no type=date) so native calendar never appears */}
      <MuiTextField
        className={masked ? '' : 'hidden'}
        {...sharedFieldProps}
        {...fieldIdentity('-masked')}
        type="text"
        value="**/**/****"
        slotProps={slotMasked}
      />
      {/* Date input — only when !readOnly (native calendar allowed here) */}
      <MuiTextField
        className={!masked && !props.readOnly ? '' : 'hidden'}
        {...sharedFieldProps}
        {...fieldIdentity('', true)}
        inputRef={field.ref}
        type="date"
        {...valueProp}
        slotProps={slotDateEditable}
      />
      {/* Read-only formatted — text only, no native date picker */}
      <MuiTextField
        className={!masked && props.readOnly ? '' : 'hidden'}
        {...sharedFieldProps}
        {...fieldIdentity('-readonly')}
        inputRef={props.readOnly ? field.ref : undefined}
        type="text"
        value={(valueProp as any)?.value ? dayjs((valueProp as any).value).format('MM/DD/YYYY') : ''}
        slotProps={slotReadOnlyFormatted}
      />
    </ColPadded>
  );
});

DateMask.displayName = 'DateMask';
