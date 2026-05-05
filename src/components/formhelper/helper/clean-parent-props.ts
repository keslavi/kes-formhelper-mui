/** Props to strip from native/MUI element forwarding */
const EXCLUDED_KEYS = new Set([
  'name', 
  'id', 
  'charCount', 
  'checkbox', 
  'datepicker', 
  'defaultvalue',
  'error', 
  'helperText', 
  'info', 
  'label', 
  'lg', 
  'max', 
  'md', 
  'min',
  'onBlur', 
  'onChange', 
  'value',
  'options', 
  'optionsMulti', 
  'optionsRadio',
  'optionsCheckbox', 
  'password',
  'pword', 
  'mask', 
  'format', 
  'persistent',
  'alwaysVisible', 
  'select', 
  'showLast', 
  'size', 
  'textarea', 
  'sm', 
  'xl', 
  'xs',
]);

const isMuiControlSize=(value:unknown):boolean=>  value=== 'small' || value === 'medium' || value === 'large';


export const cleanParentProps = (props: Record<string, any>): Record<string, any> => {
  const ret: Record<string, any> = { ...props };
  EXCLUDED_KEYS.forEach(k => { if (k in ret) delete ret[k]; });
  if ('size' in ret && isMuiControlSize(ret.size)) delete ret.size  ;
  
  if (props.label && !props.placeholder) ret.placeholder = props.label;
  return ret;
};
