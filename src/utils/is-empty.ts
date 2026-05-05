import lodashIsEmpty from 'lodash/isEmpty';

export const isEmpty = (value: unknown, legacyBehavior = false): boolean => {
  if (legacyBehavior) return lodashIsEmpty(value);

  const originalResult = lodashIsEmpty(value);
  if (originalResult) return true;

  if (typeof value === 'string' && value.trim() === '') return true;
  if (typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === 0) {
    return true;
  }

  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const keys = Object.keys(value);
    if (keys.length === 0) return true;
    return keys.every((key) => isEmpty((value as Record<string, unknown>)[key]));
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return true;
    return value.every((item) => isEmpty(item));
  }

  return false;
};

export default isEmpty;

