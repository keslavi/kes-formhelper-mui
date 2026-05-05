import { useEffect, ReactNode } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormProvider, useFormProvider } from '../form-provider';
import { Row } from '../../grid';

export interface TestHarnessProps {
  item?: Record<string, any>;
  schema?: yup.AnyObjectSchema;
  children: ReactNode;
  noRow?: boolean;
  noResults?: boolean;
  onSubmit?: (values: Record<string, any>) => void;
}

export const TestHarness = ({
  item = {},
  schema,
  children,
  noRow = false,
  noResults = false,
  onSubmit: onSubmitProp,
}: TestHarnessProps) => {
  const resolver = schema ? yupResolver(schema) : undefined;

  const formMethods = useFormProvider({
    resolver,
    defaultValues: item,
  });
  const { reset } = formMethods;

  useEffect(() => {
    if (item && Object.keys(item).length > 0) {
      reset(item);
    }
  }, [item, reset]);

  const onSubmit = (values: Record<string, any>) => {
    const textarea = document.getElementById('submit-results') as HTMLTextAreaElement | null;
    if (textarea) {
      textarea.value = JSON.stringify(values, null, 2);
    }
    onSubmitProp?.(values);
  };

  return (
    <FormProvider formMethods={formMethods} onSubmit={onSubmit}>
      {!noRow ? <Row>{children}</Row> : children}
      {!noResults && (
        <>
          <button type="submit">Submit</button>
          <div>
            <label htmlFor="submit-results">submit results</label>
            <br />
            <textarea
              id="submit-results"
              rows={10}
              readOnly
              placeholder="Form submission results will appear here..."
              style={{
                width: '100%',
                fontFamily: 'monospace',
                fontSize: '12px',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </div>
        </>
      )}
    </FormProvider>
  );
};

export default TestHarness;
