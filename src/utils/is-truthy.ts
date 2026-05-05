export const isTruthy = (value: unknown): boolean => {
  const truthyValues = ['1', 'enabled', 'ok', 'on', 'true', 'yes'];

  if (value === true) return true;

  const normalizedValue = (value ?? '').toString().toLowerCase();
  return truthyValues.includes(normalizedValue);
};

export const isFalsy = (value: unknown): boolean => !isTruthy(value);

export default { isTruthy, isFalsy };

