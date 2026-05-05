import { memo, useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { IconButton } from '@mui/material';
import IconVisibility from '@mui/icons-material/Visibility';
import IconVisibilityOff from '@mui/icons-material/VisibilityOff';
import type { ReactNode, CSSProperties } from 'react';

import { maskPattern } from '../formhelper/mask-pattern';

// ── Mask utilities ────────────────────────────────────────────────────────────

const applyMask = (value: string, mask: string): string => {
  if (!value || !mask) return value;
  const clean = value.replace(/[^a-zA-Z0-9]/g, '');
  let result = '';
  let vi = 0;
  for (let i = 0; i < mask.length && vi < clean.length; i++) {
    const mc = mask[i];
    if (mc === '#') {
      if (/\d/.test(clean[vi])) { result += clean[vi++]; } else break;
    } else if (mc === 'A') {
      if (/[a-zA-Z]/.test(clean[vi])) { result += clean[vi++]; } else break;
    } else if (mc === '*') {
      result += clean[vi++];
    } else {
      result += mc;
    }
  }
  return result;
};

const createPartialMask = (value: string, pattern: string, showLast = 4): string => {
  if (!value || !pattern) return value;
  const formatted = applyMask(value, pattern);
  const actual = value.replace(/[^a-zA-Z0-9]/g, '');
  if (actual.length <= showLast) return formatted;

  const lastChars = actual.slice(-showLast);
  let result = '';
  let actualIdx = 0;
  let lastIdx = 0;
  for (let i = 0; i < pattern.length; i++) {
    const mc = pattern[i];
    if (mc === '#' || mc === 'A' || mc === '*') {
      if (actualIdx < actual.length - showLast) {
        result += '*';
      } else {
        result += lastChars[lastIdx++] ?? '*';
      }
      actualIdx++;
    } else {
      result += mc;
    }
  }
  return result;
};

// ── Component ─────────────────────────────────────────────────────────────────

interface LabelMaskProps {
  /** Text value to display / mask */
  text?: string;
  children?: ReactNode;
  /** Mask key from maskPattern, or a custom pattern string (# digit, A letter, * any) */
  mask?: string;
  /** If true, value is always visible with no toggle */
  persistent?: boolean;
  alwaysVisible?: boolean;
  /** Show last N characters unmasked */
  showLast?: number;
  style?: CSSProperties;
  [key: string]: any;
}

export const LabelMask = memo(({
  text,
  children,
  mask,
  persistent,
  alwaysVisible,
  showLast,
  style,
}: LabelMaskProps) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showValue, setShowValue] = useState(false);

  const isPersistent = persistent || alwaysVisible;

  const pattern = useMemo(() => {
    if (!mask) return null;
    return maskPattern[mask] ?? mask;
  }, [mask]);

  const textValue = useMemo(() => {
    if (text) return text;
    if (children != null) return String(children);
    return '';
  }, [text, children]);

  const displayValue = useMemo(() => {
    if (!textValue) return '';
    if (!pattern) return textValue;

    const formatted = applyMask(textValue, pattern);

    if (isPersistent || showValue) return formatted;

    if (showLast && showLast > 0) return createPartialMask(textValue, pattern, showLast);

    return pattern.replace(/[#A*]/g, '*');
  }, [textValue, pattern, showValue, isPersistent, showLast]);

  const onClickShowValue = useCallback(() => {
    if (isPersistent) return;
    const next = !showValue;
    setShowValue(next);
    if (next) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowValue(false), 30_000);
    } else {
      if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    }
  }, [showValue, isPersistent]);

  const onMouseDownShowValue = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return (
    <span style={style}>
      <span>{displayValue}</span>
      {!isPersistent && textValue && (
        <IconButton
          aria-label="toggle value visibility"
          onClick={onClickShowValue}
          onMouseDown={onMouseDownShowValue}
          size="small"
          sx={{
            ml: '8px',
            p: '2px',
            minWidth: 'auto',
            transform: 'translateY(-2px)',
            '& svg': { fontSize: '1.15rem' },
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
          }}
        >
          {showValue
            ? <IconVisibilityOff sx={{ transform: 'translateY(-2px)' }} />
            : <IconVisibility    sx={{ transform: 'translateY(-2px)' }} />}
        </IconButton>
      )}
    </span>
  );
});

LabelMask.displayName = 'LabelMask';

export default LabelMask;
