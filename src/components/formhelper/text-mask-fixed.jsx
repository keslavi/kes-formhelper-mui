import { memo, useCallback, useMemo, useState, useEffect, useRef } from "react";
import { TextField as MuiTextField, IconButton, InputAdornment } from "@mui/material";
import IconVisibility from "@mui/icons-material/Visibility";
import IconVisibilityOff from "@mui/icons-material/VisibilityOff";
import { cleanParentProps, colProps } from "./helper";
import { useFormField } from "./form-provider";
import { Info } from "./info";
import { ColPadded } from "../grid";


const applyMask = (value, mask) => {
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

const applyFormat = (value, format) => {
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

const removeMask = (value, mask) => {
  if (!value || !mask) return value;
  
  return value.replace(/[^a-zA-Z0-9]/g, '');
};

const MASK_PATTERNS = {
  creditCard: '#### #### #### ####',
  creditCardExpiry: '##/##',
  currency: '$#,###.##',
  date: '##/##/####',
  licensePlate: 'AAA-####',
  percentage: '##%',
  phone: '(###) ###-####',
  phoneExt: '(###) ###-#### x####',
  ssn: '###-##-####',
  time: '##:##',
  zipCode: '#####',
  zipCodePlus4: '#####-####',
};

const createPartialMask = (value, maskPattern, showLast = 4) => {
  if (!value || !maskPattern) return value;
  
  // Apply the mask first to get the formatted value
  const formattedValue = applyMask(value, maskPattern);
  
  if (formattedValue.length <= showLast) {
    return formattedValue; // If value is shorter than showLast, show all
  }
  
  // Count the actual characters (excluding mask characters)
  const actualChars = value.replace(/[^a-zA-Z0-9]/g, '');
  
  if (actualChars.length <= showLast) {
    return formattedValue;
  }
  
  let result = '';
  let actualCharIndex = 0;
  let lastChars = actualChars.slice(-showLast);
  let lastCharIndex = 0;
  
  for (let i = 0; i < maskPattern.length; i++) {
    const maskChar = maskPattern[i];
    
    if (maskChar === '#' || maskChar === 'A' || maskChar === '*') {
      if (actualCharIndex < actualChars.length - showLast) {
        result += '*';
      } else {
        result += lastChars[lastCharIndex] || '*';
        lastCharIndex++;
      }
      actualCharIndex++;
    } else {
      result += maskChar;
    }
  }
  
  return result;
};

export const TextMask = memo((props) => {
  const [showValue, setShowValue] = useState(false);
  const timeoutRef = useRef(null);
  
  const { 
    field, 
    errorMui, 
    valueProp,
  } = useFormField(props);
  
  const isPersistent = props.persistent || props.alwaysVisible;

  const maskPattern = useMemo(() => {
    if (props.mask) {
      if (MASK_PATTERNS[props.mask]) {
        return MASK_PATTERNS[props.mask];
      }
      return props.mask;
    }
    return null;
  }, [props.mask]);

  const formatPattern = useMemo(() => {
    if (props.format) {
      if (MASK_PATTERNS[props.format]) {
        return MASK_PATTERNS[props.format];
      }
      return props.format;
    }
    return null;
  }, [props.format]);

  const displayValue = useMemo(() => {
    const rawValue = field.value || '';
    
    if (maskPattern) {
      const formattedValue = applyMask(rawValue, maskPattern);
      
      // If persistent or value is visible, show formatted value
      if (isPersistent || showValue || !rawValue) {
        return formattedValue;
      }
      
      // If value is hidden, check if partial masking is requested
      if (props.showLast && typeof props.showLast === 'number' && props.showLast > 0) {
        // Show partial mask with last N characters
        return createPartialMask(rawValue, maskPattern, props.showLast);
      }
      
      // If value is hidden and no partial masking, show asterisks instead
      return maskPattern.replace(/[#A*]/g, '*');
    }
    
    if (formatPattern) {
      const formattedValue = applyFormat(rawValue, formatPattern);
      
      if (isPersistent || showValue || !rawValue) {
        return formattedValue;
      }
      
      if (props.showLast && typeof props.showLast === 'number' && props.showLast > 0) {
        return createPartialMask(rawValue, formatPattern, props.showLast);
      }
      
      return formatPattern.replace(/[#A*]/g, '*');
    }
    
    return rawValue;
  }, [field.value, maskPattern, formatPattern, showValue, isPersistent, props.showLast]);

  const onBlur = useCallback((e) => {
    field.onBlur(e.target.value);
    props.onBlur?.(e);
  }, [field, props]);

  const onChange = useCallback((e) => {
    if (!isPersistent && !showValue && field.value) {
      return;
    }
    
    let newValue = e.target.value;
    
    if (maskPattern) {
      newValue = removeMask(newValue, maskPattern);
    }
    
    if (formatPattern) {
      newValue = newValue.replace(/[^a-zA-Z0-9]/g, '');
    }
    
    field.onChange(newValue);
    props.onChange?.(e);
    
    if (showValue && !isPersistent) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setShowValue(false);
      }, 30000); // 30 seconds
    }
  }, [field, props, maskPattern, formatPattern, showValue, isPersistent]);

  const onKeyDown = useCallback((e) => {
    if (!isPersistent && !showValue && field.value) {
      const allowedKeys = [
        'Tab', 'Escape', 'Enter', 'ArrowUp', 'ArrowDown', 
        'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'
      ];
      
      if (!allowedKeys.includes(e.key)) {
        e.preventDefault();
        return;
      }
    }
    
    props.onKeyDown?.(e);
  }, [isPersistent, showValue, field.value, props]);

  const onClickShowValue = useCallback(() => {
    if (isPersistent) return;
    
    const newShowValue = !showValue;
    setShowValue(newShowValue);
    
    if (newShowValue) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setShowValue(false);
      }, 30000); // 30 seconds
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [showValue, isPersistent]);

  const onMouseDownShowValue = useCallback((event) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <ColPadded {...colProps(props)}>
      <MuiTextField
        fullWidth
        id={field.name}
        name={field.name}
        label={props.label}
        inputRef={field.ref}
        onBlur={onBlur}
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={displayValue}
        {...cleanParentProps(props)}
        {...errorMui}
        {...(!isPersistent
          ? {
              slotProps: {
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle value visibility"
                        onClick={onClickShowValue}
                        onMouseDown={onMouseDownShowValue}
                        edge="end"
                      >
                        {showValue ? <IconVisibilityOff /> : <IconVisibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              },
            }
          : {})}
      />
      {props.info && <Info id={`${field.id}Info`} info={props.info} />}
    </ColPadded>
  );
});

TextMask.displayName = 'TextMask';

export default TextMask; 