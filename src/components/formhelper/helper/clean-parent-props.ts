import { useMemo } from 'react';
import { isGridColPropKey } from './clean-grid-props';

export type CleanParentPropsTarget =
  | 'textField'
  | 'select'
  | 'checkbox'
  | 'textarea'
  | 'radioGroup'
  | 'autocomplete';

/** Shared prop groups merged into per-target whitelists below */
const SHARED_KEYS = {
  base: [
    'className',
    'style',
    'tabIndex',
  ],
  disabled: ['disabled'],
  sx: ['sx'],
  formControl: [
    'required',
    'variant',
    'inputProps',
    'slotProps',
    'slots',
  ],
  readOnly: ['readOnly'],
} as const;

const WHITELIST_KEYS: Record<CleanParentPropsTarget, readonly string[]> = {
  textField: [
    ...SHARED_KEYS.base,
    ...SHARED_KEYS.disabled,
    ...SHARED_KEYS.sx,
    ...SHARED_KEYS.formControl,
    ...SHARED_KEYS.readOnly,
    'margin',
    'color',
    'focused',
    'hiddenLabel',
    'type',
    'multiline',
    'rows',
    'minRows',
    'maxRows',
    'InputLabelProps',
    'InputProps',
    'FormHelperTextProps',
    'shrink',
    'autoComplete',
    'placeholder',
    'fullWidth',
  ],
  select: [
    ...SHARED_KEYS.base,
    ...SHARED_KEYS.disabled,
    ...SHARED_KEYS.sx,
    ...SHARED_KEYS.formControl,
    'autoWidth',
    'multiple',
    'native',
    'IconComponent',
    'MenuProps',
  ],
  checkbox: [
    ...SHARED_KEYS.base,
    ...SHARED_KEYS.disabled,
    ...SHARED_KEYS.sx,
    'inputProps',
    'icon',
    'checkedIcon',
    'indeterminate',
    'disableRipple',
  ],
  textarea: [
    ...SHARED_KEYS.base,
    ...SHARED_KEYS.disabled,
    ...SHARED_KEYS.readOnly,
    'placeholder',
    'maxRows',
    'autoComplete',
    'spellCheck',
    'wrap',
  ],
  radioGroup: [
    ...SHARED_KEYS.base,
    ...SHARED_KEYS.sx,
  ],
  autocomplete: [
    ...SHARED_KEYS.base,
    ...SHARED_KEYS.disabled,
    ...SHARED_KEYS.sx,
    ...SHARED_KEYS.formControl,
    ...SHARED_KEYS.readOnly,
    'freeSolo',
    'disableClearable',
    'clearOnBlur',
    'selectOnFocus',
    'handleHomeEndKeys',
    'filterSelectedOptions',
    'includeInputInList',
    'openOnFocus',
    'autoHighlight',
    'loading',
    'loadingText',
    'noOptionsText',
    'forcePopupIcon',
    'disablePortal',
    'ListboxProps',
    'ChipProps',
    'limitTags',
  ],
};

const WHITELISTS = Object.fromEntries(
  Object.entries(WHITELIST_KEYS).map(([target, keys]) => [target, new Set(keys)]),
) as Record<CleanParentPropsTarget, Set<string>>;

const MUI_CONTROL_TARGETS = new Set<CleanParentPropsTarget>([
  'textField',
  'select',
  'checkbox',
  'autocomplete',
]);

const PLACEHOLDER_TARGETS = new Set<CleanParentPropsTarget>([
  'textField',
  'textarea',
  'autocomplete',
]);

const isMuiControlSize = (value: unknown): boolean =>
  value === 'small' || value === 'medium' || value === 'large';

const isPassthroughAttr = (key: string): boolean =>
  key.startsWith('data-') || key.startsWith('aria-');

/** Wired by form field components — must not pass through parentProps */
const FORM_FIELD_HANDLER_KEYS = new Set(['onChange', 'onBlur']);

const isEventHandlerKey = (key: string): boolean =>
  /^on[A-Z]/.test(key) && !FORM_FIELD_HANDLER_KEYS.has(key);

const isGridColProp = (key: string): boolean => isGridColPropKey(key);

const pickWhitelisted = (
  props: Record<string, any>,
  target: CleanParentPropsTarget,
): Record<string, any> => {
  const keys = WHITELISTS[target];
  const ret: Record<string, any> = {};

  for (const key of Object.keys(props)) {
    if (isPassthroughAttr(key)) {
      ret[key] = props[key];
      continue;
    }

    if (isEventHandlerKey(key)) {
      ret[key] = props[key];
      continue;
    }

    if (key === 'size') {
      if (MUI_CONTROL_TARGETS.has(target) && isMuiControlSize(props.size)) {
        ret.size = props.size;
      }
      continue;
    }

    if (isGridColProp(key)) continue;

    if (keys.has(key)) {
      ret[key] = props[key];
    }
  }

  return ret;
};

export const cleanParentProps = (
  props: Record<string, any>,
  target: CleanParentPropsTarget,
): Record<string, any> => {
  const ret = pickWhitelisted(props, target);

  if (PLACEHOLDER_TARGETS.has(target) && props.label && !props.placeholder) {
    ret.placeholder = props.label;
  }

  return ret;
};

const buildCleanParentPropsDeps = (
  props: Record<string, any>,
  target: CleanParentPropsTarget,
): unknown[] => {
  const deps: unknown[] = [target];

  for (const key of WHITELIST_KEYS[target]) {
    deps.push(props[key]);
  }

  if (PLACEHOLDER_TARGETS.has(target)) {
    deps.push(props.label, props.placeholder);
  }

  if (MUI_CONTROL_TARGETS.has(target)) {
    deps.push(props.size);
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

/** Memoized cleanParentProps — stable object reference when forwarded prop values are unchanged */
export const useCleanParentProps = (
  props: Record<string, any>,
  target: CleanParentPropsTarget,
): Record<string, any> =>
  useMemo(
    () => cleanParentProps(props, target),
    buildCleanParentPropsDeps(props, target),
  );
