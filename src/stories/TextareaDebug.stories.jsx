import { TextareaDebug } from '../components/textarea-debug/textarea-debug';

const sampleValue = {
  id: 42,
  name: 'Jane Smith',
  email: 'jane@example.com',
  address: { street: '123 Main St', city: 'Springfield', zip: '62701' },
  tags: ['admin', 'user'],
  active: true,
};

export default {
  title: 'Components/TextareaDebug',
  component: TextareaDebug,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    debug:  { control: 'boolean' },
    hidden: { control: 'boolean' },
    rows:   { control: { type: 'number', min: 2, max: 30 } },
    cols:   { control: { type: 'number', min: 20, max: 200 } },
  },
};

export const Default = {
  args: {
    value: sampleValue,
    debug: true,
    rows: 12,
    cols: 60,
  },
};

export const Hidden = {
  args: {
    value: sampleValue,
    debug: true,
    hidden: true,
  },
};

export const DebugOff = {
  name: 'debug=false (renders nothing)',
  args: {
    value: sampleValue,
    debug: false,
  },
};

export const NestedObject = {
  args: {
    debug: true,
    rows: 18,
    cols: 70,
    value: {
      form: {
        personal: { firstName: 'John', lastName: 'Doe', dob: '1990-01-15' },
        contact:  { phone: '555-1234', email: 'john@example.com' },
        meta:     { createdAt: '2024-01-01', updatedBy: 'admin', version: 3 },
      },
      dirty: true,
      errors: { phone: 'Invalid format' },
    },
  },
};
