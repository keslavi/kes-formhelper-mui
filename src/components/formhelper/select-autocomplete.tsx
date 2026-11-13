import { cloneElement, memo, useCallback, useMemo, useState, type HTMLAttributes, type Key, type ReactElement } from 'react';
import {
  TextField as MuiTextField,
  Autocomplete as MuiAutocomplete,
  createFilterOptions,
  useTheme,
  type FilterOptionsState,
} from '@mui/material';
import IconKeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import { useCleanParentProps } from './helper/clean-parent-props';
import { pickColLayoutProps } from './helper/clean-grid-props';
import { getOptionLabelByKey } from './helper/option-display';
import { useOptionColumns } from './helper/option-columns';
import type { OptionColumns } from './helper/option-columns';
import { useFormField, UseFormFieldProps } from './form-provider';
import { Info } from './info';
import { ColPadded } from '../grid';
import { ModalCommon } from '../modal';
import type { FormControlProps, TextEntryProps } from './control-props';
import type { Option, Options } from './option';

export type SelectAutocompleteOption = Option;

export type SelectAutocompleteProps = UseFormFieldProps & FormControlProps & TextEntryProps & {
  options?: Options;
  /** Bind dropdown columns to option attributes: { text: { heading: 'Name', width: '2fr' }, state: 'State' } */
  columns?: OptionColumns;
  /**
   * Form component (with its own FormProvider) shown in a modal when the add button is clicked.
   * It receives an `onSubmit(values)` prop that wraps its own `onSubmit` and closes the modal;
   * if its own `onSubmit` returns an option, that option is appended to the list and selected.
   */
  addNew?: ReactElement<AddNewFormProps>;
  /** Modal header and add button label (default 'Add New') */
  addNewLabel?: string;
};

export interface AddNewFormProps {
  onSubmit?: (values: Record<string, any>) => Option | void | Promise<Option | void>;
}

const ADD_NEW_KEY = '__selectAutocompleteAddNew__';
const isAddNewOption = (option: Option | null | undefined) => option?.key === ADD_NEW_KEY;
const defaultFilterOptions = createFilterOptions<Option>();

export const SelectAutocomplete = memo((props: SelectAutocompleteProps) => {
  const { addNew, addNewLabel = 'Add New', ...parentProps } = props;
  const [isAddNewOpen, setIsAddNewOpen] = useState(false);
  const [addedOptions, setAddedOptions] = useState<Options>([]);
  const theme = useTheme();

  const options = useMemo(() => {
    const base = props.options ?? [];
    if (!addedOptions.length) return base;
    return [...base, ...addedOptions.filter(a => !base.some(o => o.key == a.key))];
  }, [props.options, addedOptions]);
  const columnProps = useOptionColumns(options, props.columns);
  const { field, readOnly, errorMui, identityProps } = useFormField(props);
  const isReadOnly = readOnly;

  const placeholder = props.placeholder !== undefined ? props.placeholder : 'Please Select';

  const isCleared = !field.value || field.value === '' || field.value == null;

  const selectedOption = useMemo(() => {
    if (isCleared) return null;
    return options.find(o => o.key == field.value) ?? null;
  }, [field.value, options, isCleared]);

  const onBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    field.onBlur(e.target.value);
    props.onBlur?.(e as any);
  }, [field, props.onBlur]);

  const onChange = useCallback((_e: any, newValue: SelectAutocompleteOption | null) => {
    if (props.disabled || readOnly) return;
    if (isAddNewOption(newValue)) {
      setIsAddNewOpen(true);
      return;
    }
    field.onChange(newValue ? newValue.key : null);
    props.onChange?.(_e, newValue as any);
  }, [field, props.disabled, props.onChange, readOnly]);

  const toggleAddNew = useCallback(() => setIsAddNewOpen(open => !open), []);

  const addNewProps = useMemo(() => {
    if (!addNew) return {};
    const addNewOption: Option = { key: ADD_NEW_KEY, text: addNewLabel };
    const baseFilter = columnProps.filterOptions ?? defaultFilterOptions;
    const baseRenderOption = columnProps.renderOption;
    return {
      options: [...options, addNewOption],
      filterOptions: (opts: Options, state: FilterOptionsState<Option>) => [
        ...baseFilter(opts.filter(o => !isAddNewOption(o)), state),
        addNewOption,
      ],
      renderOption: (liProps: HTMLAttributes<HTMLLIElement> & { key?: Key }, option: Option) => {
        if (!isAddNewOption(option)) {
          if (baseRenderOption) return baseRenderOption(liProps, option);
          const { key, ...rest } = liProps;
          return <li key={key} {...rest}>{option.text}</li>;
        }
        const { key, style, ...rest } = liProps;
        return (
          <li
            key={key}
            {...rest}
            data-testid={`${field.name}AddNew`}
            style={{ ...style, borderTop: `1px solid ${theme.palette.divider}`, fontWeight: 500, color: theme.palette.primary.main }}
          >
            {addNewLabel}
          </li>
        );
      },
    };
  }, [addNew, addNewLabel, options, columnProps, field.name, theme]);

  const addNewOnSubmit = addNew?.props.onSubmit;
  const onSubmitAddNew = useCallback(async (values: Record<string, any>) => {
    const newOption = await addNewOnSubmit?.(values);
    if (newOption && newOption.key != null) {
      setAddedOptions(prev => [...prev.filter(o => o.key != newOption.key), newOption]);
      field.onChange(newOption.key);
    }
    setIsAddNewOpen(false);
    return newOption;
  }, [field, addNewOnSubmit]);

  const displayValue = useMemo(() => getOptionLabelByKey(options, field.value), [options, field.value]);
  const textFieldParentProps = useCleanParentProps(parentProps, 'textField');
  const autocompleteParentProps = useCleanParentProps(parentProps, 'autocomplete');

  if (isReadOnly) {
    return (
      <ColPadded {...pickColLayoutProps(props)}>
        <MuiTextField
          fullWidth
          {...identityProps}
          label={props.label}
          inputRef={field.ref}
          onBlur={onBlur}
          value={displayValue}
          placeholder={placeholder}
          {...errorMui}
          {...textFieldParentProps}
          slotProps={{
            htmlInput: {
              readOnly: true,
              maxLength: props.maxLength,
              minLength: props.minLength,
            },
          }}
        />
        {props.info && <Info id={`${field.name}Info`} info={props.info} />}
      </ColPadded>
    );
  }

  const autocomplete = (
    <MuiAutocomplete
      {...identityProps}
      options={options}
      getOptionDisabled={option => !!option.disabled}
      getOptionLabel={o => o?.text ?? ''}
      {...columnProps}
      {...addNewProps}
      onChange={onChange}
      onBlur={onBlur}
      value={selectedOption}
      fullWidth
      popupIcon={<IconKeyboardArrowDown />}
      renderInput={params => (
        <>
          <MuiTextField
            {...params}
            label={props.label}
            placeholder={placeholder}
            {...errorMui}
            slotProps={{
              ...params.slotProps,
              htmlInput: {
                ...params.slotProps.htmlInput,
                placeholder,
                maxLength: props.maxLength,
                minLength: props.minLength,
              },
              inputLabel: {
                ...params.slotProps.inputLabel,
                shrink: true,
              },
            }}
          />
          {props.info && <Info id={`${field.name}Info`} info={props.info} />}
        </>
      )}
      {...autocompleteParentProps}
    />
  );

  return (
    <ColPadded {...pickColLayoutProps(props)}>
      {autocomplete}
      {addNew && (
        <ModalCommon isModalOpen={isAddNewOpen} toggleModal={toggleAddNew} onClose={toggleAddNew} header={addNewLabel}>
          {cloneElement(addNew, { onSubmit: onSubmitAddNew })}
        </ModalCommon>
      )}
    </ColPadded>
  );
});

SelectAutocomplete.displayName = 'SelectAutocomplete';
