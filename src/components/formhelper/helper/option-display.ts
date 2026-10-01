import type { Option } from '../option';

export const getOptionLabelByKey = (
  options: Option[] | undefined,
  value: unknown
): string => {
  if (value === undefined || value === null || value === '') return '';
  const key = String(value);
  const match = options?.find(o => String(o.key) === key);
  return match?.text ?? key;
};

export const getOptionLabelsByKeys = (
  options: Option[] | undefined,
  values: unknown
): string[] => {
  if (!Array.isArray(values)) return [];

  return values
    .filter(v => v !== undefined && v !== null && v !== '')
    .map(v => getOptionLabelByKey(options, v));
};
