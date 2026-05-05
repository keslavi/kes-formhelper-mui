import { memo, useCallback, useEffect } from 'react';
import {
  TextareaAutosize,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import { color } from '../../theme-material';
import { cleanParentProps } from './helper/clean-parent-props';
import { colProps } from './helper/col-props';
import { useFormField, UseFormFieldProps } from './form-provider';
import { Info } from './info';
import { ColPadded } from '../grid';

export type TextareaProps = UseFormFieldProps & {
  label?: string;
  charCount?: number;
  minRows?: number;
  info?: any;
  size?: number | string;
};

export const Textarea = memo((props: TextareaProps) => {
  const { field, errorMui, valueProp } = useFormField(props);

  const onBlur = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
    field.onBlur(e.target.value);
    props.onBlur?.(e as any);
  }, [field, props.onBlur]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    field.onChange(e.target.value);
    props.onChange?.(e as any);
  }, [field, props.onChange]);

  const currentLength = ((field.value as string) ?? '').length;
  const isWithinLimit = props.charCount ? currentLength <= props.charCount : true;
  const msgChars = `${currentLength} / ${props.charCount} characters`;
  const hasCountError = !!props.charCount && !isWithinLimit;

  useEffect(() => {
    if (!props.charCount) return;

    const handleSubmit = (event: Event) => {
      if (!isWithinLimit) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    let form: HTMLFormElement | null = null;
    if (field.ref?.current) {
      form = (field.ref.current as HTMLElement).closest('form');
    }
    if (!form) form = document.querySelector('form');

    if (form) {
      form.addEventListener('submit', handleSubmit, true);
      return () => form!.removeEventListener('submit', handleSubmit, true);
    }
  }, [isWithinLimit, currentLength, props.charCount, field.ref]);

  const hasError = errorMui?.error || hasCountError;
  const labelStyle = hasError ? { color: color.primary.red } : {};

  return (
    <ColPadded {...colProps(props)}>
      <InputLabel
        htmlFor={field.name}
        style={{
          ...labelStyle,
          display: 'block',
          marginBottom: 2,
          marginTop: 0,
          lineHeight: 1.1,
          transform: 'none',
          fontSize: '0.875rem',
        }}
      >
        {props.label}
      </InputLabel>
      <TextareaAutosize
        style={{
          width: '100%',
          border: hasError
            ? `1px solid ${color.primary.red}`
            : `1px solid ${(color as any).cobe1?.grey ?? '#ccc'}`,
          borderRadius: 4,
          padding: 8,
          outline: 'none',
          resize: 'vertical',
          fontFamily: 'inherit',
          fontSize: 14,
          lineHeight: 1.5,
          color: hasError ? color.primary.red : 'inherit',
        }}
        id={field.name}
        name={field.name}
        {...(props.minRows && { minRows: props.minRows })}
        ref={field.ref}
        onBlur={onBlur}
        onChange={onChange}
        {...cleanParentProps(props)}
        {...valueProp}
      />
      {props.info && <Info id={`${field.name}Info`} info={props.info} />}
      {props.charCount && (
        <FormHelperText
          className={hasCountError ? 'Mui-error' : 'primaryText'}
          style={{ marginTop: -2 }}
        >
          {msgChars}
        </FormHelperText>
      )}
      {errorMui?.helperText && (
        <FormHelperText className="Mui-error" style={{ marginTop: -5 }}>
          {errorMui.helperText}
        </FormHelperText>
      )}
    </ColPadded>
  );
});

Textarea.displayName = 'Textarea';
