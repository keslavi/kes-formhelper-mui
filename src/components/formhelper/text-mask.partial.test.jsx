import React from 'react';
import { FormProvider, useFormProvider } from './form-provider';
import { TextMask } from './text-mask';

const TestWrapper = ({ children, formOptions = {} }) => {
  const methods = useFormProvider(formOptions);
  return (
    <FormProvider formMethods={methods}>
      {children}
    </FormProvider>
  );
};

describe('TextMask Partial Masking (showLast)', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  test('shows only last 4 characters for credit card when masked', async () => {
    render(
      <TestWrapper>
        <TextMask 
          name="card" 
          label="Credit Card" 
          mask="creditCard"
          showLast={4}
        />
      </TestWrapper>
    );
    
    const input = screen.getByLabelText('Credit Card');
    await user.type(input, '1234567890123456');
    
    // When visible, should show full formatted value
    expect(input.value).toBe('1234 5678 9012 3456');
    
    // Focus the input to show the helper text
    await user.click(input);
    
    // Click the toggle visibility button
    const toggleButton = screen.getByRole('button', { name: /toggle value visibility/i });
    await user.click(toggleButton);
    
    // When hidden, should show asterisks with last 4 characters
    expect(input.value).toBe('**** **** **** 3456');
  });

  test('starts unmasked and shows partial mask when toggled (no initial value)', async () => {
    render(
      <TestWrapper>
        <TextMask 
          name="ssn" 
          label="SSN" 
          mask="ssn"
          showLast={4}
        />
      </TestWrapper>
    );
    
    const input = screen.getByLabelText('SSN');
    await user.type(input, '123456789');
    
    expect(input.value).toBe('123-45-6789');
    
    // Focus the input to show the helper text
    await user.click(input);
    
    // Click the toggle visibility button
    const toggleButton = screen.getByRole('button', { name: /toggle value visibility/i });
    await user.click(toggleButton);
    
    expect(input.value).toBe('***-**-6789');
  });

  test('starts masked with partial mask when initial value is provided', () => {
    render(
      <TestWrapper formOptions={{ defaultValues: { ssn: '123456789' } }}>
        <TextMask 
          name="ssn" 
          label="SSN" 
          mask="ssn"
          showLast={4}
        />
      </TestWrapper>
    );
    
    const input = screen.getByLabelText('SSN');
    
    expect(input.value).toBe('***-**-6789');
  });

  test('shows only last 3 characters for custom pattern when masked', async () => {
    render(
      <TestWrapper>
        <TextMask 
          name="custom" 
          label="Custom" 
          mask="##-##-####"
          showLast={3}
        />
      </TestWrapper>
    );
    
    const input = screen.getByLabelText('Custom');
    await user.type(input, '12345678');
    
    // When visible, should show full formatted value
    expect(input.value).toBe('12-34-5678');
    
    // Focus the input to show the helper text
    await user.click(input);
    
    // Click the toggle visibility button
    const toggleButton = screen.getByRole('button', { name: /toggle value visibility/i });
    await user.click(toggleButton);
    
    // When hidden, should show asterisks with last 3 characters
    expect(input.value).toBe('**-**-*678');
  });

  test('shows only last 4 characters for phone when masked', async () => {
    render(
      <TestWrapper>
        <TextMask 
          name="phone" 
          label="Phone" 
          mask="phone"
          showLast={4}
        />
      </TestWrapper>
    );
    
    const input = screen.getByLabelText('Phone');
    await user.type(input, '5551234567');
    
    // When visible, should show full formatted value
    expect(input.value).toBe('(555) 123-4567');
    
    // Focus the input to show the helper text
    await user.click(input);
    
    // Click the toggle visibility button
    const toggleButton = screen.getByRole('button', { name: /toggle value visibility/i });
    await user.click(toggleButton);
    
    // When hidden, should show asterisks with last 4 characters
    expect(input.value).toBe('(***) ***-4567');
  });

  test('handles short values correctly', async () => {
    render(
      <TestWrapper>
        <TextMask 
          name="short" 
          label="Short" 
          mask="####"
          showLast={4}
        />
      </TestWrapper>
    );
    
    const input = screen.getByLabelText('Short');
    await user.type(input, '123');
    
    // When visible, should show full formatted value
    expect(input.value).toBe('123');
    
    // Focus the input to show the helper text
    await user.click(input);
    
    // Click the toggle visibility button
    const toggleButton = screen.getByRole('button', { name: /toggle value visibility/i });
    await user.click(toggleButton);
    
    // When hidden, should show all characters since value is shorter than showLast
    expect(input.value).toBe('123');
  });

  test('persistent fields ignore showLast prop', async () => {
    render(
      <TestWrapper>
        <TextMask 
          name="persistent" 
          label="Persistent" 
          mask="creditCard"
          showLast={4}
          persistent
        />
      </TestWrapper>
    );
    
    const input = screen.getByLabelText('Persistent');
    await user.type(input, '1234567890123456');
    
    // Should always show full formatted value when persistent
    expect(input.value).toBe('1234 5678 9012 3456');
    
    // No helper text should be present when persistent
    expect(screen.queryByText('Hide')).not.toBeInTheDocument();
  });
}); 