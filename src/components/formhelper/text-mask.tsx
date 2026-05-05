import { memo, useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { TextField as MuiTextField, IconButton, InputAdornment } from '@mui/material';
import IconVisibility from '@mui/icons-material/Visibility';
import IconVisibilityOff from '@mui/icons-material/VisibilityOff';
import { cleanParentProps } from './helper/clean-parent-props';
import { colProps } from './helper/col-props';
import { useFormField, UseFormFieldProps } from './form-provider';
import { Info } from './info';
import { ColPadded } from '../grid';
import { DateMask } from './date-mask';
import { maskPattern } from './mask-pattern';

// ---------------------------------------------------------------------------
// Types & mask patterns
// ---------------------------------------------------------------------------

export type TextMaskProps = UseFormFieldProps & {
  label?: string;
  /** Mask key from maskPattern, a custom pattern string, or boolean (for date mask legacy shorthand) */
  mask?: string | boolean;
  /** Format key from maskPattern or a custom pattern string */
  format?: string;
  /** Show last N characters when masked */
  showLast?: number;
  /** If true, value is always visible (no toggle) */
  persistent?: boolean;
  info?: any;
  size?: number | string;
};



// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

const applyMask = (value: string, mask: string): string => {
  if (!value || !mask) return value;

  const cleanValue = value.replace(/[^a-zA-Z0-9]/g, '');
  let result = '';
  let valueIndex = 0;

  for (let i = 0; i < mask.length && valueIndex < cleanValue.length; i++) {
    const maskChar = mask[i];

    if (maskChar === '#') {
      if (/\d/.test(cleanValue[valueIndex])) {
        result += cleanValue[valueIndex];
        valueIndex++;
      } else {
        break;
      }
    } else if (maskChar === 'A') {
      if (/[a-zA-Z]/.test(cleanValue[valueIndex])) {
        result += cleanValue[valueIndex];
        valueIndex++;
      } else {
        break;
      }
    } else if (maskChar === '*') {
      result += cleanValue[valueIndex];
      valueIndex++;
    } else {
      result += maskChar;
    }
  }

  return result;
};

const applyFormat = (value: string, format: string): string => {
  if (!value || !format) return value;

  const cleanValue = value.replace(/[^a-zA-Z0-9]/g, '');
  let result = '';
  let valueIndex = 0;

  for (let i = 0; i < format.length && valueIndex < cleanValue.length; i++) {
    const formatChar = format[i];

    if (formatChar === '#') {
      result += cleanValue[valueIndex] || '';
      valueIndex++;
    } else if (formatChar === 'A') {
      result += cleanValue[valueIndex] || '';
      valueIndex++;
    } else {
      result += formatChar;
    }
  }

  return result;
};

const removeMask = (value: string, mask: string): string => {
  if (!value || !mask) return value;
  return value.replace(/[^a-zA-Z0-9]/g, '');
};

const createPartialMask = (value: string, pattern: string, showLast = 4): string => {
  if (!value || !pattern) return value;

  const formattedValue = applyMask(value, pattern);
  if (formattedValue.length <= showLast) return formattedValue;

  const actualChars = value.replace(/[^a-zA-Z0-9]/g, '');
  if (actualChars.length <= showLast) return formattedValue;

  let result = '';
  let actualCharIndex = 0;
  const lastChars = actualChars.slice(-showLast);
  let lastCharIndex = 0;

  for (let i = 0; i < formattedValue.length; i++) {
    const maskChar = pattern[i];

    if (maskChar === '#' || maskChar === 'A' || maskChar === '*') {
      if (actualCharIndex < actualChars.length - showLast) {
        result += '*';
      } else if (lastCharIndex < lastChars.length) {
        result += lastChars[lastCharIndex];
        lastCharIndex++;
      } else {
        result += '*';
      }
      actualCharIndex++;
    } else {
      result += maskChar;
    }
  }

  return result;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const TextMask = memo((props: TextMaskProps) => {
  // Delegate plain boolean mask (e.g. <Input mask />) and explicit date mask to DateMask
  if (props.mask === true || props.mask === maskPattern.date) {
    return <DateMask {...props} />;
  }

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { field, errorMui, valueProp } = useFormField(props);

  const [showValue, setShowValue] = useState(
    !(valueProp && (valueProp as any).value && String((valueProp as any).value).trim() !== '')
  );

  const pattern = useMemo(() => {
    if (typeof props.mask === 'string' && props.mask) {
      if (maskPattern[props.mask]) return maskPattern[props.mask];
      return props.mask;
    }
    return null;
  }, [props.mask]);

  const formatPattern = useMemo(() => {
    if (props.format) {
      if (maskPattern[props.format]) return maskPattern[props.format];
      return props.format;
    }
    return null;
  }, [props.format]);

  const displayValue = useMemo(() => {
    const rawValue: string = field.value ?? '';

    if (pattern) {
      const formattedValue = applyMask(rawValue, pattern);

      if (showValue || !rawValue) return formattedValue;

      if (props.showLast && typeof props.showLast === 'number' && props.showLast > 0) {
        return createPartialMask(rawValue, pattern, props.showLast);
      }

      if (pattern === '##/##/####') return '**/**/****';
      return pattern.replace(/[#A*]/g, '*');
    }

    if (formatPattern) {
      const formattedValue = applyFormat(rawValue, formatPattern);

      if (showValue || !rawValue) return formattedValue;

      if (props.showLast && typeof props.showLast === 'number' && props.showLast > 0) {
        return createPartialMask(rawValue, formatPattern, props.showLast);
      }

      if (formatPattern === '##/##/####') return '**/**/****';
      return formatPattern.replace(/[#A*]/g, '*');
    }

    return rawValue;
  }, [field.value, pattern, formatPattern, showValue, props.showLast]);

  const onFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      props.onFocus?.(e);
    },
    [props]
  );

  const onBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      field.onBlur(e.target.value);
      props.onBlur?.(e);
    },
    [field, props]
  );

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;

      if (pattern) newValue = removeMask(newValue, pattern);
      if (formatPattern) newValue = newValue.replace(/[^a-zA-Z0-9]/g, '');

      field.onChange(newValue);
      props.onChange?.(newValue);

      if (showValue) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setShowValue(false);
        }, 30000);
      }
    },
    [field, props, pattern, formatPattern, showValue]
  );

  const onClickShowValue = useCallback(() => {
    const next = !showValue;
    setShowValue(next);

    if (next) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowValue(false);
      }, 30000);
    } else if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [showValue]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const hasValue = field.value && String(field.value).trim() !== '';
      const isMasked = hasValue && !showValue;

      if (isMasked) {
        const allowedKeys = [
          'Tab',
          'Escape',
          'Enter',
          'ArrowLeft',
          'ArrowRight',
          'ArrowUp',
          'ArrowDown',
          'Home',
          'End',
          'PageUp',
          'PageDown',
        ];

        if (!allowedKeys.includes(event.key)) {
          event.preventDefault();
        }
      }
    },
    [field.value, showValue]
  );

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  return (
    <ColPadded {...colProps(props)}>
      <MuiTextField
        fullWidth
        size="small"
        sx={{
          '& .MuiOutlinedInput-root': { minHeight: 34, overflow: 'visible' },
          '& .MuiOutlinedInput-input': { padding: '6px 8px' },
        }}
        id={field.name}
        name={field.name}
        label={props.label}
        inputRef={field.ref}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={displayValue}
        {...cleanParentProps(props)}
        {...errorMui}
        {...(!props.persistent
          ? {
              slotProps: {
                input: {
                  endAdornment: (
                    <InputAdornment position="end" sx={{ height: 'auto' }}>
                      <IconButton
                        aria-label="toggle value visibility"
                        onClick={onClickShowValue}
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
                        {showValue ? (
                          <IconVisibilityOff sx={{ transform: 'translateY(-2px)' }} />
                        ) : (
                          <IconVisibility sx={{ transform: 'translateY(-2px)' }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              },
            }
          : {})}
      />
      {props.info && <Info id={`${props.id ?? field.name}Info`} info={props.info} />}
    </ColPadded>
  );
});

TextMask.displayName = 'TextMask';

export default TextMask;

