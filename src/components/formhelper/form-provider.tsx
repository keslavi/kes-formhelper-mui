import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import {
  useForm,
  useController as useRealController,
  UseFormProps,
  UseFormReturn,
  FieldValues,
  UseControllerProps,
  UseControllerReturn,
} from 'react-hook-form';

import { isTruthy } from '../../utils/is-truthy';
import {
  buildFieldErrorState,
  type FieldErrorProp,
} from './helper/field-errors';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface FormContextValue {
  control: any;
  errors: Record<string, any>;
  reset: (...args: any[]) => any;
  register: (...args: any[]) => any;
  handleSubmit: (...args: any[]) => any;
  watch: (...args: any[]) => any;
  setValue: (...args: any[]) => any;
  getValues: (...args: any[]) => any;
  formMethods: UseFormReturn<any>;
}

const FormContext = createContext<FormContextValue | null>(null);

// Global registry (allows external access to form methods by id, e.g. for multi-step)
const formMethodsRegistry = new Map<string, UseFormReturn<any>>();

// Re-export for components that need it directly
export { useRealController };
export type { FieldErrorProp } from './helper/field-errors';
export {
  collectFieldErrorMessages,
  collectParentErrorMessages,
  renderFieldErrorMessages,
} from './helper/field-errors';

function withResolverCriteriaMode<T extends FieldValues>(
  options: UseFormProps<T> = {},
): UseFormProps<T> {
  if (options.criteriaMode || !options.resolver) {
    return options;
  }

  return {
    ...options,
    criteriaMode: 'all',
  };
}

// ---------------------------------------------------------------------------
// useFormProvider
// ---------------------------------------------------------------------------

export const useFormProvider = <T extends FieldValues = FieldValues>(
  options: UseFormProps<T> = {}
): UseFormReturn<T> & { _formId: string } => {
  const formMethods = useForm<T>(withResolverCriteriaMode({
    defaultValues: options.defaultValues,
    resolver: options.resolver,
    ...options,
  }));

  const formId = useRef(Math.random().toString(36).substr(2, 9)).current;
  formMethodsRegistry.set(formId, formMethods as UseFormReturn<any>);

  useEffect(() => {
    return () => {
      formMethodsRegistry.delete(formId);
    };
  }, [formId]);

  (formMethods as any)._formId = formId;
  return formMethods as UseFormReturn<T> & { _formId: string };
};

// ---------------------------------------------------------------------------
// FormProvider
// ---------------------------------------------------------------------------

export interface FormProviderProps {
  children: ReactNode;
  onSubmit: (data: any) => void;
  formProps?: React.FormHTMLAttributes<HTMLFormElement>;
  formOptions?: UseFormProps<any>;
  formMethods?: UseFormReturn<any>;
}

export const FormProvider = ({
  children,
  onSubmit,
  formProps = {},
  formOptions = {},
  formMethods: externalFormMethods,
}: FormProviderProps) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const frmMethods = externalFormMethods ?? useForm<any>(withResolverCriteriaMode({
    defaultValues: formOptions.defaultValues ?? {},
    resolver: formOptions.resolver,
    ...formOptions,
  }));

  const { control, formState, reset, register, handleSubmit, watch, setValue, getValues } = frmMethods;
  const errors = formState?.errors ?? {};

  const value = useMemo<FormContextValue>(
    () => ({
      control,
      errors,
      reset,
      register,
      handleSubmit,
      watch,
      setValue,
      getValues,
      formMethods: frmMethods,
    }),
    [control, errors, reset, register, handleSubmit, watch, setValue, getValues, frmMethods]
  );

  return (
    <FormContext.Provider value={value}>
      <form onSubmit={handleSubmit(onSubmit)} {...formProps}>
        {children}
      </form>
    </FormContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// useController  (context-aware wrapper)
// ---------------------------------------------------------------------------

export const useController = (props: UseControllerProps<any> & { errors?: any }): UseControllerReturn<any> => {
  const ctx = useContext(FormContext);

  if (!ctx && !props?.control) {
    console.warn('useController: no FormProvider or control prop found for field', props?.name);
  }

  const control = props.control ?? ctx?.control;

  if (!control) {
    throw new Error('Form control is not available. Make sure FormProvider is properly configured.');
  }

  return useRealController({ control, name: props.name });
};

// ---------------------------------------------------------------------------
// useFormContext
// ---------------------------------------------------------------------------

export const useFormContext = (): FormContextValue => {
  const context = useContext(FormContext);
  if (!context) throw new Error('Missing FormProvider');
  return context;
};

// ---------------------------------------------------------------------------
// useFormField — common hook for all input controls
// ---------------------------------------------------------------------------

export interface UseFormFieldProps {
  name: string;
  'data-testid'?: string;
  control?: any;
  error?: FieldErrorProp;
  helperText?: string;
  defaultValue?: any;
  value?: any;
  unbound?: any;
  [key: string]: any;
}

export interface FormFieldIdentityProps {
  id: string;
  name: string;
  'data-testid': string;
}

export interface UseFormFieldReturn {
  field: any;
  error: any;
  errorMessages: string[];
  errorMui: { error?: boolean; helperText?: ReactNode };
  valueProp: { value?: any } | { defaultValue?: any } | Record<string, never>;
  identityProps: FormFieldIdentityProps;
}

export const useFormField = (props: UseFormFieldProps): UseFormFieldReturn => {
  const ctx = useContext(FormContext);
  const control = props.control ?? ctx?.control;

  if (!control) {
    console.warn('useFormField: no FormProvider or control prop found for field', props.name);
    throw new Error('Form control is not available. Make sure FormProvider is properly configured.');
  }

  const { field, fieldState } = useRealController({ control, name: props.name });
  const fieldStateError = fieldState.error;

  let errorMessages: string[] = [];
  let errorMui: { error?: boolean; helperText?: ReactNode } = {};
  let valueProp: Record<string, any> = {};

  const errorState = buildFieldErrorState(
    fieldStateError,
    props.error,
    props.helperText,
    props.name,
  );
  errorMessages = errorState.messages;
  errorMui = errorState.errorMui;

  const error = errorMessages.length
    ? { message: errorMessages[0], messages: errorMessages }
    : undefined;

  if (!props.defaultValue) {
    if (!isTruthy(props.unbound)) {
      valueProp = { value: field?.value ?? props.value ?? '' };
    }
  } else {
    valueProp = { defaultValue: props.defaultValue };
  }

  const identityProps: FormFieldIdentityProps = {
    id: props.name,
    name: props.name,
    'data-testid': props['data-testid'] ?? props.name,
  };

  return { field, error, errorMessages, errorMui, valueProp, identityProps };
};
