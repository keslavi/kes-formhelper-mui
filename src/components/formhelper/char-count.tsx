import { memo, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { TextField as MuiTextField } from '@mui/material';
import { color } from '../../theme-material';
import { cleanParentProps } from './helper/clean-parent-props';
import { colProps } from './helper/col-props';
import { useFormField, UseFormFieldProps } from './form-provider';
import { Info } from './info';
import { ColPadded } from '../grid';

const CharMessage = ({
  msg,
  withinLimit,
  children,
}: {
  msg: string;
  withinLimit: boolean;
  children?: ReactNode;
}) => (
  <>
    <span style={{ color: withinLimit ? color.primary.gray : color.primary.red }}>
      {msg}
    </span>
    {children && (
      <>
        <br />
        {children}
      </>
    )}
  </>
);

export type CharCountProps = UseFormFieldProps & {
  label?: string;
  charCount: number;
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

export const CharCount = memo((props: CharCountProps) => {
  const { field, errorMui, valueProp } = useFormField(props);

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

  const currentLength = (field.value as string)?.length ?? 0;
  const isWithinLimit = currentLength <= props.charCount;
  const msgChars = `${currentLength} / ${props.charCount} characters`;

  // Block form submission when over limit
  useEffect(() => {
    const handleFormSubmit = (event: Event) => {
      if (!isWithinLimit) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };

    let formElement: HTMLFormElement | null = null;
    if (field.ref?.current) {
      formElement = (field.ref.current as HTMLElement).closest('form');
    }
    if (!formElement) {
      formElement = document.querySelector('form');
    }

    if (formElement) {
      formElement.addEventListener('submit', handleFormSubmit, true);
      return () => {
        formElement!.removeEventListener('submit', handleFormSubmit, true);
      };
    }
  }, [isWithinLimit, currentLength, props.charCount, field.ref]);

  return (
    <ColPadded {...colProps(props)}>
      <MuiTextField
        fullWidth
        id={field.name}
        name={field.name}
        label={props.label}
        {...(props.placeholder && { placeholder: props.placeholder })}
        inputRef={field.ref}
        onBlur={onBlur}
        onChange={onChange}
        autoFocus={props.autoFocus}
        {...cleanParentProps(props)}
        {...valueProp}
        slotProps={{ htmlInput: inputProps }}
        {...(errorMui?.error || !isWithinLimit ? { error: true } : {})}
        helperText={
          <CharMessage msg={msgChars} withinLimit={isWithinLimit}>
            {errorMui.helperText}
          </CharMessage>
        }
      />
      {props.info && <Info id={`${field.name}Info`} info={props.info} />}
    </ColPadded>
  );
});

CharCount.displayName = 'CharCount';
