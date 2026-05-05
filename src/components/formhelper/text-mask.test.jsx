import React from 'react';
import { FormProvider, useFormProvider } from './form-provider';
import { TextMask } from './text-mask';

// Test wrapper component
const TestWrapper = ({ children, formOptions = {} }) => {
  const methods = useFormProvider(formOptions);
  return (
    <FormProvider formMethods={methods}>
      {children}
    </FormProvider>
  );
};

describe('TextMask Component', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  test('renders with SSN mask', () => {
    render(
      <TestWrapper>
        <TextMask 
          name="ssn" 
          label="Social Security Number" 
          mask="ssn"
        />
      </TestWrapper>
    );
    
    const input = screen.getByLabelText('Social Security Number');
    expect(input).toBeInTheDocument();
  });

  test('starts unmasked when no initial value is provided', async () => {
    render(
      <TestWrapper>
        <TextMask 
          name="ssn" 
          label="SSN" 
          mask="ssn"
        />
      </TestWrapper>
    );
    
    const input = screen.getByLabelText('SSN');
    await user.type(input, '123456789');
    
    // Should show formatted value initially when user types (no initial value)
    expect(input.value).toBe('123-45-6789');
  });

  test('starts masked when initial value is provided', () => {
    render(
      <TestWrapper formOptions={{ defaultValues: { ssn: '123456789' } }}>
        <TextMask 
          name="ssn" 
          label="SSN" 
          mask="ssn"
        />
      </TestWrapper>
    );
    
    const input = screen.getByLabelText('SSN');
    
    // Should show masked value initially when value is provided
    expect(input.value).toBe('***-**-****');
  });

  test('prevents keyboard input when masked', async () => {
    render(
      <TestWrapper formOptions={{ defaultValues: { ssn: '123456789' } }}>
        <TextMask 
          name="ssn" 
          label="SSN" 
          mask="ssn"
        />
      </TestWrapper>
    );
    
    const input = screen.getByLabelText('SSN');
    
    // Should show masked value initially
    expect(input.value).toBe('***-**-****');
    
    // Try to type - should not change the value
    await user.keyboard('1');
    
    // Value should remain masked
    expect(input.value).toBe('***-**-****');
  });

  test('allows keyboard input when unmasked', async () => {
    render(
      <TestWrapper>
        <TextMask 
          name="ssn" 
          label="SSN" 
          mask="ssn"
        />
      </TestWrapper>
    );
    
    const input = screen.getByLabelText('SSN');
    
    // Type a value - should be allowed
    await user.type(input, '123456789');
    
    // Value should be formatted
    expect(input.value).toBe('123-45-6789');
  });

  test('displays info icon when info prop is provided', () => {
    render(
      <TestWrapper>
        <TextMask 
          name="ssn" 
          label="SSN" 
          mask="ssn"
          info="Enter your 9-digit SSN"
        />
      </TestWrapper>
    );
    
    const helpIcon = screen.getByTestId('IconHelpRounded');
    expect(helpIcon).toBeInTheDocument();
  });

  test('does not display info icon when info prop is not provided', () => {
    render(
      <TestWrapper>
        <TextMask 
          name="ssn" 
          label="SSN" 
          mask="ssn"
        />
      </TestWrapper>
    );
    
    const helpIcon = screen.queryByTestId('IconHelpRounded');
    expect(helpIcon).not.toBeInTheDocument();
  });

  test('shows info popover when info icon is clicked', async () => {
    render(
      <TestWrapper>
        <TextMask 
          name="ssn" 
          label="SSN" 
          mask="ssn"
          info="Enter your 9-digit SSN"
        />
      </TestWrapper>
    );
    
    const helpIcon = screen.getByTestId('IconHelpRounded');
    await user.click(helpIcon);
    
    expect(screen.getByText('Enter your 9-digit SSN')).toBeInTheDocument();
  });

  test('handles info with header and body separated by pipe', async () => {
    render(
      <TestWrapper>
        <TextMask 
          name="ssn" 
          label="SSN" 
          mask="ssn"
          info="SSN Information|Enter your 9-digit Social Security Number"
        />
      </TestWrapper>
    );
    
    const helpIcon = screen.getByTestId('IconHelpRounded');
    await user.click(helpIcon);
    
    expect(screen.getByText('SSN Information')).toBeInTheDocument();
    expect(screen.getByText('Enter your 9-digit Social Security Number')).toBeInTheDocument();
  });

  // test('applies phone mask correctly', () => {
  //   render(
  //     <TestWrapper>
  //       <TextMask 
  //         name="phone" 
  //         label="Phone" 
  //         mask="phone"
  //       />
  //     </TestWrapper>
  //   );
  //   
  //   const input = screen.getByLabelText('Phone');
  //   fireEvent.change(input, { target: { value: '5551234567' } });
  //   
  //   // Should show masked value by default
  //   expect(input.value).toBe('(***) ***-****');
  // });

  // test('applies custom mask pattern', () => {
  //   render(
  //     <TestWrapper>
  //       <TextMask 
  //         name="custom" 
  //         label="Custom" 
  //         mask="##-##-##"
  //       />
  //     </TestWrapper>
  //   );
  //   
  //   const input = screen.getByLabelText('Custom');
  //   fireEvent.change(input, { target: { value: '123456' } });
  //   
  //   // Should show masked value by default
  //   expect(input.value).toBe('**-**-**');
  // });

  // test('applies format pattern', () => {
  //   render(
  //     <TestWrapper>
  //       <TextMask 
  //         name="formatted" 
  //         label="Formatted" 
  //         format="####-####"
  //       />
  //     </TestWrapper>
  //   );
  //   
  //   const input = screen.getByLabelText('Formatted');
  //   fireEvent.change(input, { target: { value: '12345678' } });
  //   
  //   // Should show masked value by default
  //   expect(input.value).toBe('****-****');
  // });

  // test('handles credit card mask', () => {
  //   render(
  //     <TestWrapper>
  //       <TextMask 
  //         name="card" 
  //         label="Credit Card" 
  //         mask="creditCard"
  //       />
  //     </TestWrapper>
  //   );
  //   
  //   const input = screen.getByLabelText('Credit Card');
  //   fireEvent.change(input, { target: { value: '1234567890123456' } });
  //   
  //   // Should show masked value by default
  //   expect(input.value).toBe('**** **** **** ****');
  // });

  // test('handles zip code mask', () => {
  //   render(
  //     <TestWrapper>
  //       <TextMask 
  //         name="zip" 
  //         label="Zip Code" 
  //         mask="zipCodePlus4"
  //       />
  //     </TestWrapper>
  //   );
  //   
  //   const input = screen.getByLabelText('Zip Code');
  //   fireEvent.change(input, { target: { value: '123456789' } });
  //   
  //   // Should show masked value by default
  //   expect(input.value).toBe('*****-****');
  // });
}); 