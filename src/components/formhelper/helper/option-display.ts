export interface OptionDisplayItem {
  key: string | number;
  text: string;
}

export const getOptionLabelByKey = (
  options: OptionDisplayItem[] | undefined,
  value: unknown
): string => {
  if (value === undefined || value === null || value === '') return '';
  const key = String(value);
  const match = options?.find(o => String(o.key) === key);
  return match?.text ?? key;
};

export const getOptionLabelsByKeys = (
  options: OptionDisplayItem[] | undefined,
  values: unknown
): string[] => {
  if (!Array.isArray(values)) return [];

  return values
    .filter(v => v !== undefined && v !== null && v !== '')
    .map(v => getOptionLabelByKey(options, v));
};
