import { useMemo } from 'react';
import type { GridProps } from '@mui/material';

export type CleanGridPropsTarget = 'col' | 'row' | 'rowHeader' | 'rowSubheader';

/**
 * MUI Grid `size` prop: a column span (`number`, `'auto'`, `'grow'`, `false`),
 * a responsive map (`{ xs: 12, md: 6 }`), or a breakpoint array.
 */
export type GridColSize = NonNullable<GridProps['size']>;

export interface ColSizeProps {
  size?: GridColSize;
  xs?: number | string;
  sm?: number | string;
  md?: number | string;
  lg?: number | string;
  xl?: number | string;
  offset?: number | Record<string, number>;
  flex?: boolean | number;
}

/** Keys stripped from form props and owned by grid col layout */
export const GRID_COL_STRIP_KEYS = new Set<string>([
  'size',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'offset',
  'flex',
]);

const SHARED_GRID_KEYS = {
  base: ['className', 'style', 'sx', 'id'],
} as const;

const WHITELIST_KEYS: Record<CleanGridPropsTarget, readonly string[]> = {
  col: [
    ...SHARED_GRID_KEYS.base,
    'size',
    'xs',
    'sm',
    'md',
    'lg',
    'xl',
    'offset',
    'flex',
  ],
  row: [
    ...SHARED_GRID_KEYS.base,
    'columns',
    'spacing',
  ],
  rowHeader: [
    ...SHARED_GRID_KEYS.base,
    'leftcontent',
    'rightcontent',
    'backgroundColor',
    'color',
    'size',
    'children',
  ],
  rowSubheader: [
    ...SHARED_GRID_KEYS.base,
    'leftcontent',
    'rightcontent',
    'backgroundColor',
    'color',
    'size',
    'children',
  ],
};

const WHITELISTS = Object.fromEntries(
  Object.entries(WHITELIST_KEYS).map(([target, keys]) => [target, new Set(keys)]),
) as Record<CleanGridPropsTarget, Set<string>>;

const GRID_BREAKPOINTS = new Set(['xs', 'sm', 'md', 'lg', 'xl']);

const isGridSizeToken = (value: unknown): boolean => {
  if (typeof value === 'number') return Number.isFinite(value);
  if (value === false) return true;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === 'auto' || trimmed === 'grow') return true;
    return trimmed !== '' && !Number.isNaN(Number(trimmed));
  }
  return false;
};

/** True when `value` is a valid MUI Grid `size` (including responsive maps). */
export const isGridSizeValue = (value: unknown): boolean => {
  if (isGridSizeToken(value)) return true;
  if (Array.isArray(value)) {
    return value.length > 0 && value.every((item) => item == null || isGridSizeToken(item));
  }
  if (typeof value === 'object' && value !== null) {
    if ('size' in value && isGridSizeValue((value as { size: unknown }).size)) return true;
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record);
    if (keys.length === 0) return false;
    return keys.every(
      (key) => GRID_BREAKPOINTS.has(key) && (record[key] == null || isGridSizeToken(record[key])),
    );
  }
  return false;
};

/**
 * Backward-compatible col sizing extraction (replaces colProps).
 * When `size` is valid it takes precedence and breakpoint props are omitted.
 */
export const pickColSizing = ({ size, xs, sm, md, lg, xl }: ColSizeProps): Record<string, unknown> => {
  if (isGridSizeValue(size)) return { size };

  const ret: Record<string, unknown> = {};
  if (isGridSizeValue(xs)) ret.xs = xs;
  if (isGridSizeValue(sm)) ret.sm = sm;
  if (isGridSizeValue(md)) ret.md = md;
  if (isGridSizeValue(lg)) ret.lg = lg;
  if (isGridSizeValue(xl)) ret.xl = xl;
  return ret;
};

const isPassthroughAttr = (key: string): boolean =>
  key.startsWith('data-') || key.startsWith('aria-');

const isEventHandlerKey = (key: string): boolean => /^on[A-Z]/.test(key);

/**
 * Sizing-only extraction for spreading form props onto ColPadded (replaces colProps).
 */
export const pickColLayoutProps = (props: Record<string, unknown>): Record<string, unknown> => {
  const ret: Record<string, unknown> = {
    ...pickColSizing(props as ColSizeProps),
  };
  if (props.offset !== undefined) ret.offset = props.offset;
  if (props.flex !== undefined) ret.flex = props.flex;
  return ret;
};

const pickCol = (props: Record<string, unknown>): Record<string, unknown> => {
  const ret: Record<string, unknown> = {
    ...pickColLayoutProps(props),
  };

  for (const key of WHITELIST_KEYS.col) {
    if (key === 'size' || key === 'xs' || key === 'sm' || key === 'md' || key === 'lg' || key === 'xl' || key === 'offset' || key === 'flex') {
      continue;
    }
    if (props[key] !== undefined) {
      ret[key] = props[key];
    }
  }

  for (const key of Object.keys(props)) {
    if (isPassthroughAttr(key)) {
      ret[key] = props[key];
      continue;
    }
    if (isEventHandlerKey(key)) {
      ret[key] = props[key];
    }
  }

  return ret;
};

const pickWhitelisted = (
  props: Record<string, unknown>,
  target: CleanGridPropsTarget,
): Record<string, unknown> => {
  if (target === 'col') return pickCol(props);

  const keys = WHITELISTS[target];
  const ret: Record<string, unknown> = {};

  for (const key of Object.keys(props)) {
    if (isPassthroughAttr(key)) {
      ret[key] = props[key];
      continue;
    }
    if (isEventHandlerKey(key)) {
      ret[key] = props[key];
      continue;
    }
    if (keys.has(key)) {
      ret[key] = props[key];
    }
  }

  return ret;
};

export const cleanGridProps = (
  props: Record<string, unknown>,
  target: CleanGridPropsTarget,
): Record<string, unknown> => pickWhitelisted(props, target);

export const isGridColPropKey = (key: string): boolean => GRID_COL_STRIP_KEYS.has(key);

const buildCleanGridPropsDeps = (
  props: Record<string, unknown>,
  target: CleanGridPropsTarget,
): unknown[] => {
  const deps: unknown[] = [target];

  for (const key of WHITELIST_KEYS[target]) {
    deps.push(props[key]);
  }

  for (const key of Object.keys(props)) {
    if (isPassthroughAttr(key)) {
      deps.push(props[key]);
    }
    if (isEventHandlerKey(key)) {
      deps.push(props[key]);
    }
  }

  return deps;
};

export const useCleanGridProps = (
  props: Record<string, unknown>,
  target: CleanGridPropsTarget,
): Record<string, unknown> =>
  useMemo(
    () => cleanGridProps(props, target),
    buildCleanGridPropsDeps(props, target),
  );
