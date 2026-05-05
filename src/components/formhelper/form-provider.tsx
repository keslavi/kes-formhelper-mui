import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useRef,
  ReactNode,
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

// ---------------------------------------------------------------------------
// useFormProvider
// ---------------------------------------------------------------------------

export const useFormProvider = <T extends FieldValues = FieldValues>(
  options: UseFormProps<T> = {}
): UseFormReturn<T> & { _formId: string } => {
  const formMethods = useForm<T>({
    defaultValues: options.defaultValues,
    resolver: options.resolver,
    ...options,
  });

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
  const frmMethods = externalFormMethods ?? useForm<any>({
    defaultValues: formOptions.defaultValues ?? {},
    resolver: formOptions.resolver,
    ...formOptions,
  });

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
  control?: any;
  error?: { message?: string };
  helperText?: string;
  defaultValue?: any;
  value?: any;
  unbound?: any;
  [key: string]: any;
}

export interface UseFormFieldReturn {
  field: any;
  error: any;
  errorMui: { error?: boolean; helperText?: string };
  valueProp: { value?: any } | { defaultValue?: any } | Record<string, never>;
}

export const useFormField = (props: UseFormFieldProps): UseFormFieldReturn => {
  let field: any, error: any;
  const errorMui: { error?: boolean; helperText?: string } = {};
  let valueProp: Record<string, any> = {};

  try {
    if (props.control) {
      const result = useRealController({ control: props.control, name: props.name });
      field = result.field;
      error = props.error
        ? { message: props.error.message ?? props.helperText ?? `${props.name}: custom error` }
        : result.fieldState.error;
    } else {
      const result = useController(props);
      field = result.field;
      error = props.error
        ? { message: props.error.message ?? props.helperText ?? `${props.name}: custom error` }
        : result.fieldState.error;
    }
  } catch (err) {
    const result = useController(props);
    field = result.field;
    error = result.fieldState.error;
    console.warn(`${props.name} - Error in useFormField:`, err);
  }

  if (error) {
    errorMui.error = true;
    errorMui.helperText = error?.message ?? props.helperText ?? '?no error message?';
  }

  if (!props.defaultValue) {
    if (!isTruthy(props.unbound)) {
      valueProp = { value: field?.value ?? props.value ?? '' };
    }
  } else {
    valueProp = { defaultValue: props.defaultValue };
  }

  return { field, error, errorMui, valueProp };
};
