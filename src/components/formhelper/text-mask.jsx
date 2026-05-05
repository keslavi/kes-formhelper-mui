import { memo, useCallback, useMemo, useState, useEffect, useRef } from "react";
import { 
  TextField as MuiTextField, 
  FormHelperText,
  IconButton, 
  InputAdornment 
} from "@mui/material";
import IconVisibility from "@mui/icons-material/Visibility";
import IconVisibilityOff from "@mui/icons-material/VisibilityOff";
import { cleanParentProps, colProps } from "./helper";
import { useFormField } from "./form-provider";
import { Info } from "./info";
import { ColPadded } from "../grid";
import { DateMask } from "./date-mask";
import { color } from "../../theme-material";
import { maskPattern } from "./mask-pattern";

// Utility functions for masking and formatting
const applyMask = (value, mask) => {
  if (!value || !mask) return value;
  
  // Remove all non-alphanumeric characters from input
  const cleanValue = value.replace(/[^a-zA-Z0-9]/g, '');
  let result = '';
  let valueIndex = 0;
  
  for (let i = 0; i < mask.length && valueIndex < cleanValue.length; i++) {
    const maskChar = mask[i];
    
    if (maskChar === '#') {
      // Only allow digits
      if (/\d/.test(cleanValue[valueIndex])) {
        result += cleanValue[valueIndex];
        valueIndex++;
      } else {
        break;
      }
    } else if (maskChar === 'A') {
      // Only allow letters
      if (/[a-zA-Z]/.test(cleanValue[valueIndex])) {
        result += cleanValue[valueIndex];
        valueIndex++;
      } else {
        break;
      }
    } else if (maskChar === '*') {
      // Allow any character
      result += cleanValue[valueIndex];
      valueIndex++;
    } else {
      // Static character from mask
      result += maskChar;
    }
  }
  
  return result;
};

const applyFormat = (value, format) => {
  if (!value || !format) return value;
  
  // Remove all non-alphanumeric characters from input
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
  
  // For removal, we just extract alphanumeric characters
  return value.replace(/[^a-zA-Z0-9]/g, '');
};

// Function to create partial mask showing only last N characters
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
    return formattedValue; // If actual characters are fewer than showLast, show all
  }
  
  // Create a mask pattern that shows asterisks for all but the last N characters
  let result = '';
  let actualCharIndex = 0;
  let lastChars = actualChars.slice(-showLast);
  let lastCharIndex = 0;
  
  // Process only up to the length of the formatted value
  for (let i = 0; i < formattedValue.length; i++) {
    const maskChar = maskPattern[i];
    
    if (maskChar === '#' || maskChar === 'A' || maskChar === '*') {
      // This is a character position
      if (actualCharIndex < actualChars.length - showLast) {
        // Mask this character
        result += '*';
      } else if (lastCharIndex < lastChars.length) {
        // Show the actual character from the last N characters
        result += lastChars[lastCharIndex];
        lastCharIndex++;
      } else {
        // No more characters to show, use asterisk
        result += '*';
      }
      actualCharIndex++;
    } else {
      // Static character from mask
      result += maskChar;
    }
  }
  
  return result;
};

export const TextMask = memo((props) => {
  // Check if this is a date mask pattern and redirect to DateMask

  if (props.mask === maskPattern.date) return <DateMask {...props} />

  const timeoutRef = useRef(null);
  
  const { 
    field, 
    errorMui, 
    valueProp,
  } = useFormField(props);

  const [showValue, setShowValue] = useState(
    !(valueProp && valueProp.value && String(valueProp.value).trim() !== '')
  );

  // Get mask pattern from props or predefined patterns
  const resolvedMaskPattern = useMemo(() => {
    if (props.mask) {
      // First check if it's a predefined pattern
      if (maskPattern[props.mask]) {
        return maskPattern[props.mask];
      }
      // If not found in predefined patterns, treat as custom string pattern
      return props.mask;
    }
    return null;
  }, [props.mask]);

  // Get format pattern
  const formatPattern = useMemo(() => {
    if (props.format) {
      // First check if it's a predefined pattern
      if (maskPattern[props.format]) {
        return maskPattern[props.format];
      }
      // If not found in predefined patterns, treat as custom string pattern
      return props.format;
    }
    return null;
  }, [props.format]);

  // Apply mask/format to display value
  const displayValue = useMemo(() => {
    const rawValue = field.value || '';
    
    if (resolvedMaskPattern) {
      const formattedValue = applyMask(rawValue, resolvedMaskPattern);
      
          // If value is visible, show formatted value
    if (showValue || !rawValue) {
      return formattedValue;
    }
    
    // If value is hidden, check if partial masking is requested
    if (props.showLast && typeof props.showLast === 'number' && props.showLast > 0) {
      // Show partial mask with last N characters
      return createPartialMask(rawValue, resolvedMaskPattern, props.showLast);
    }
    
          // If value is hidden and no partial masking, show asterisks instead
      if (resolvedMaskPattern === '##/##/####') {
        return '**/**/****';
      }
      return resolvedMaskPattern.replace(/[#A*]/g, '*');
    }
    
    if (formatPattern) {
      const formattedValue = applyFormat(rawValue, formatPattern);
      
          // If value is visible, show formatted value
    if (showValue || !rawValue) {
      return formattedValue;
    }
    
    // If value is hidden, check if partial masking is requested for format patterns
    if (props.showLast && typeof props.showLast === 'number' && props.showLast > 0) {
      // Show partial mask with last N characters
      return createPartialMask(rawValue, formatPattern, props.showLast);
    }
    
          // If value is hidden and no partial masking, show asterisks instead
      if (formatPattern === '##/##/####') {
        return '**/**/****';
      }
      return formatPattern.replace(/[#A*]/g, '*');
    }
    
    return rawValue;
  }, [field.value, maskPattern, formatPattern, showValue, props.showLast]);

  const onFocus = useCallback((e) => {
    props.onFocus?.(e);
  }, []);

  const onBlur = useCallback((e) => {
    field.onBlur(e.target.value);
    props.onBlur?.(e);
  }, [field]);

  const onChange = useCallback((e) => {
    let newValue = e.target.value;
    
    // If using mask, remove mask characters for storage
    if (resolvedMaskPattern) {
      newValue = removeMask(newValue, resolvedMaskPattern);
    }
    
    // If using format, clean the value
    if (formatPattern) {
      newValue = newValue.replace(/[^a-zA-Z0-9]/g, '');
    }
    
    field.onChange(newValue);
    props.onChange?.(newValue);
    
    // Reset the auto-mask timer when user types
    if (showValue) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setShowValue(false);
      }, 30000); // 30 seconds
    }
  }, [field, props, maskPattern, formatPattern, showValue]);

  // Handle show/hide toggle
  const onClickShowValue = useCallback(() => {
    const newShowValue = !showValue;
    setShowValue(newShowValue);
    
    // Set up auto-mask timer when showing value
    if (newShowValue) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setShowValue(false);
      }, 30000); // 30 seconds
    } else {
      // Clear timer when manually hiding
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [showValue]);

  // const onMouseDownShowValue = useCallback((event) => {
  //   event.preventDefault();
  // }, []);

  // Prevent keyboard input when field is masked
  const onKeyDown = useCallback((event) => {
    const hasValue = field.value && String(field.value).trim() !== '';
    const isMasked = hasValue && !showValue;
    
    if (isMasked) {
      // Allow only specific keys: Tab, Escape, Enter, Arrow keys, Home, End, Page Up, Page Down
      const allowedKeys = [
        'Tab', 'Escape', 'Enter', 
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End', 'PageUp', 'PageDown'
      ];
      
      if (!allowedKeys.includes(event.key)) {
        event.preventDefault();
        return;
      }
    }
  }, [field.value, showValue]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <ColPadded {...colProps(props)}>
      hmm<br/>
      <MuiTextField
        fullWidth
        size="small"
        sx={{
          '& .MuiOutlinedInput-root': { minHeight: 34, overflow: 'visible' },
          '& .MuiOutlinedInput-input': { padding: '6px 8px' }
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
                        onMouseDown={(e) => e.preventDefault()}
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
      {props.info && <Info id={`${field.id}Info`} info={props.info} />}
      {/* {!props.persistent && (
        <FormHelperText id={`${field.id}HelperText`}
          style={{
            color: color.primary.blue,
            cursor: 'pointer',
            fontSize: 'inherit',
          }}
          onClick={onClickShowValue}
        >
          {showValue ? 'Hide' : 'Show'}
        </FormHelperText>
      )} */}
    </ColPadded>
  );
});


TextMask.displayName = 'TextMask';

export default TextMask; 