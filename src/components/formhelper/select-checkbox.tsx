import { memo, useCallback, useMemo } from 'react';
import {
  TextField,
  Autocomplete as MuiAutocomplete,
  Checkbox as MuiCheckbox,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { cleanParentProps } from './helper/clean-parent-props';
import { colProps } from './helper/col-props';
import { getOptionLabelsByKeys } from './helper/option-display';
import { useFormField, UseFormFieldProps } from './form-provider';
import { Info } from './info';
import { ColPadded } from '../grid';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export interface SelectCheckboxOption {
  key: string | number;
  text: string;
}

export type SelectCheckboxProps = UseFormFieldProps & {
  label?: string;
  optionsCheckbox: SelectCheckboxOption[];
  info?: any;
  size?: number | string;
};

export const SelectCheckbox = memo((props: SelectCheckboxProps) => {
  const { optionsCheckbox: options, label, info, ...restProps } = props;
  const { field, errorMui } = useFormField(props);
  const isReadOnly = !!props.readOnly;

  const onBlur = useCallback((e: React.FocusEvent) => {
    field.onBlur((e.target as any).value);
    props.onBlur?.(e as any);
  }, [field, props.onBlur]);

  const onChange = useCallback((_e: any, newValue: SelectCheckboxOption[]) => {
    const selected = Array.isArray(newValue) ? newValue.map(i => i.key) : [];
    field.onChange(selected);
    props.onChange?.(selected as any);
  }, [field, props.onChange]);

  const selectedOptions = useMemo(() => {
    if (!Array.isArray(field.value) || !Array.isArray(options)) return [];
    return options.filter(o => field.value.includes(o.key));
  }, [field.value, options]);

  const displayValue = useMemo(
    () => getOptionLabelsByKeys(options, field.value).join(', '),
    [options, field.value]
  );

  if (isReadOnly) {
    return (
      <ColPadded {...colProps(props)}>
        <TextField
          inputRef={field.ref}
          id={field.name}
          name={field.name}
          label={label}
          variant="outlined"
          fullWidth
          value={displayValue}
          placeholder="Please Select"
          onBlur={onBlur}
          {...errorMui}
          {...cleanParentProps(restProps)}
          slotProps={{ htmlInput: { readOnly: true } }}
        />
        {info && <Info id={`${field.name}Info`} info={info} />}
      </ColPadded>
    );
  }

  return (
    <ColPadded {...colProps(props)}>
      <MuiAutocomplete
        id={field.name}
        multiple
        onBlur={onBlur}
        onChange={onChange}
        options={Array.isArray(options) ? options : []}
        disableCloseOnSelect
        popupIcon={<KeyboardArrowDownIcon />}
        getOptionLabel={o => o?.text ?? ''}
        isOptionEqualToValue={(o, v) => o?.key === v?.key}
        value={selectedOptions}
        {...cleanParentProps(restProps)}
        renderOption={(optProps, option, { selected }) => {
          const { key, ...rest } = optProps as any;
          return (
            <li key={key} {...rest}>
              <MuiCheckbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.text}
            </li>
          );
        }}
        renderInput={params => (
          <TextField
            {...params}
            inputRef={field.ref}
            label={label}
            variant="outlined"
            placeholder={selectedOptions.length === 0 ? 'Please Select' : ''}
            {...errorMui}
          />
        )}
      />
      {info && <Info id={`${field.name}Info`} info={info} />}
    </ColPadded>
  );
});

SelectCheckbox.displayName = 'SelectCheckbox';
