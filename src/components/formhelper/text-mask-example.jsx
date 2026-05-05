import React from 'react';
import { FormProvider, useFormProvider } from './form-provider';
import { TextMask, maskPattern } from './text-mask';
import { Button } from '@mui/material';

export const TextMaskExample = () => {
  const methods = useFormProvider({
    defaultValues: {
      ssn: '',
      ssn2: '',
      licensePlate: ''
    }
  });

  const onSubmit = (data) => {
    console.log(["mask"],'Form data:', data);
    // Note: The stored values will be clean (without mask characters)
    // e.g., ssn: "123456789" instead of "123-45-6789"
  };

  return (
    <FormProvider formMethods={methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <h2>TextMask Component Examples</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>SSN Masks</h3>
          
          <TextMask
            name="ssn"
            label="Social Security Number"
            mask={maskPattern.ssn}
            info="Enter your 9-digit SSN"
            size={6}
          />
          
          <TextMask
            name="ssn2"
            label="Social Security Number 2"
            mask={maskPattern.ssn}
            info="Enter your 9-digit SSN"
            size={6}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Alphabetic Mask Example</h3>
          
          <TextMask
            name="licensePlate"
            label="License Plate"
            mask={maskPattern.licensePlate}
            info="Enter license plate in format AAA-1234 (3 letters, dash, 4 numbers)"
            size={6}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Available Predefined Patterns</h3>
          <ul>
            <li><strong>ssn:</strong> ###-##-####</li>
            <li><strong>licensePlate:</strong> AAA-####</li>
          </ul>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Mask Characters</h3>
          <ul>
            <li><strong>#:</strong> Only allows digits (0-9)</li>
            <li><strong>A:</strong> Only allows letters (a-z, A-Z)</li>
            <li><strong>*:</strong> Allows any character</li>
            <li><strong>Any other character:</strong> Static character that appears in the mask</li>
          </ul>
        </div>

        <Button type="submit" variant="contained" color="primary">
          Submit Form
        </Button>
      </form>
    </FormProvider>
  );
};

export default TextMaskExample; 