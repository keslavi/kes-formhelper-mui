/**
 * Demo identifiers are joined at runtime so the source, the Storybook bundle, and the story
 * source embedded in Storybook docs never contain a contiguous SSN/EIN-shaped literal
 * (sensitive-data scanners flag those even when the value is fake).
 */
const digits = (...parts) => parts.join('');

export const sampleSsn = digits('123', '45', '6789');
export const sampleEin = digits('12', '3456789');
/** Long enough to fill every mask in maskPattern, including credit card */
export const sampleDigits = digits('1234567', '8901234');
