import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@mui/material';

import {
  Col,
  Fieldset,
  FormProvider,
  useFormProvider,
  Input,
  Info,
  InfoIcon,
  Label,
  Row,
  TextareaDebug,
  maskPattern,
} from '@formhelper';

const hiddenControl = { table: { disable: true } };

export default {
  title: 'Formhelper',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    name: hiddenControl,
    arrayInput: hiddenControl,
    select: hiddenControl,
    checkbox: hiddenControl,
    password: hiddenControl,
    textarea: hiddenControl,
    datepicker: hiddenControl,
    datemask: hiddenControl,
    mask: hiddenControl,
    charCount: hiddenControl,
    pattern: hiddenControl,
    format: hiddenControl,
    showLast: hiddenControl,
    persistent: hiddenControl,
    options: hiddenControl,
    optionsMulti: hiddenControl,
    optionsRadio: hiddenControl,
    optionsCheckbox: hiddenControl,
    control: hiddenControl,
    unbound: hiddenControl,
    defaultValue: hiddenControl,
    value: hiddenControl,
    error: hiddenControl,
    helperText: hiddenControl,
    autoFocus: hiddenControl,
    variant: hiddenControl,
    row: hiddenControl,
    minRows: hiddenControl,
    isChecked: hiddenControl,
    min: hiddenControl,
    max: hiddenControl,
    onChange: hiddenControl,
    onBlur: hiddenControl,
    onSubmit: hiddenControl,
    required: hiddenControl,
    type: hiddenControl,
    spellCheck: hiddenControl,
    inputMode: hiddenControl,
  },
};

// ─── shared options & initial data (modeled after legacy Task / option.task) ─

/** Option structure like store.use.option(): { task: { status: [], result: [], names: [] } } */
const option = {
  task: {
    status: [
      { key: 'new', text: 'New' },
      { key: 'inProgress', text: 'In Progress' },
      { key: 'done', text: 'Done' },
    ],
    result: [
      { key: 'success', text: 'Success' },
      { key: 'failure', text: 'Failure' },
      { key: 'unknown', text: 'Unknown' },
    ],
    names: [
      { key: 'steve', text: 'Steve' },
      { key: 'cindy', text: 'Cindy' },
      { key: 'riley', text: 'Riley' },
    ],
  },
};

const initialValues = {
  id: 'TASK-123',
  subject: 'Follow up with customer',
  body: 'Call customer to confirm requirements and next steps.',
  userAssigned: 'DOMAIN\\user.name',
  names: ['steve'],
  ssn: '123456789',
  status: 'new',
  result: 'unknown',
  dfrom: '2024-01-15',
  references: ['https://example.com/requirements'],
};

// ─── schema (modeled after validation-task.js) ───────────────────────────────

const schema = yup.object({
  id: yup.string().required('id is required'),
  subject: yup.string().required('please provide a subject'),
  body: yup.string().required('please provide a body'),
  dfrom: yup
    .date()
    .typeError('From date is required')
    .required('From date is required'),
  references: yup.array().of(yup.string()).default([]),
  names: yup.array().of(yup.string()).default([]),
  status: yup.string().required('Status is required'),
  result: yup.string().required('Result is required'),
});

// ─── Full Demo Form ───────────────────────────────────────────────────────────

const DemoForm = ({ readOnly = false }) => {
  const [data, setData] = useState(null);
  const formMethods = useFormProvider({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  const onSubmit = (data) => {
    console.log('Submitted:', data);
    setData(data);
  };

  return (
    <Fieldset legend="Task Example with validation">
      <Row>
        <Col size={12}>
          <h5>Note that Col, Input are size={3} by default. a Col is wrapped INSIDE Input</h5>
        </Col>
      </Row>

      <FormProvider formMethods={formMethods} onSubmit={onSubmit} readOnly={readOnly}>
        <Row>
          <div className="hidden"><Input name="id" label="Id" /></div>
          <Input name="userAssigned" label="Assigned To" disabled info="Auto-populated from Windows authentication" size={6} />
          <Input
            name="names"
            label="Names"
            optionsCheckbox={option.task.names}
            size={6}
          />
        </Row>
        <Row>
          <Input name="subject" label="Subject"/>
          <Input name="body" label="Body" textarea minRows={3} size={12} />
        </Row>
        <Row>
          <Input
            name="status"
            label="Status"
            options={option.task.status}
          />
          <Input
            name="result"
            label="Result"
            options={option.task.result}
          />

          <Input
            name="ssn"
            label="Social Security Number"
            mask={maskPattern.ssn}
            placeholder="123-45-6789"
          />

          <Input
            name="dfrom"
            label="From"
            datepicker
          />

          <Input
            name="references"
            label="References"
            arrayInput
            placeholder="Add a link or reference"
            info="Add URLs or reference links (e.g., documentation, maps)"
          />

          <Col size={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button type="submit" variant="contained">Submit</Button>
            <Button type="button" variant="outlined" onClick={() => formMethods.reset(initialValues)}>Reset</Button>
          </Col>
        </Row>
      </FormProvider>
      {data && (
        <Row>
          <Col size={12}>
            <TextareaDebug data={data} />
          </Col>
        </Row>
      )}
    </Fieldset>
  );
};

export const FullForm = {
  args: {
    readOnly: false,
  },
  argTypes: {
    readOnly: {
      control: 'boolean',
      description: '`<FormProvider readOnly />` toggles the entire `<form>`.',
    },
  },
  render: ({ readOnly }) => <DemoForm readOnly={readOnly} />,
  parameters: {
    docs: {
      source: {
        code: `
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@mui/material';
import {
  Col,
  Fieldset,
  FormProvider,
  useFormProvider,
  Input,
  Row,
  TextareaDebug,
  maskPattern,
} from '../components';

/** Option structure like store.use.option(): { task: { status: [], result: [], names: [] } } */
const option = {
  task: {
    status: [
      { key: 'new', text: 'New' },
      { key: 'inProgress', text: 'In Progress' },
      { key: 'done', text: 'Done' },
    ],
    result: [
      { key: 'success', text: 'Success' },
      { key: 'failure', text: 'Failure' },
      { key: 'unknown', text: 'Unknown' },
    ],
    names: [
      { key: 'steve', text: 'Steve' },
      { key: 'cindy', text: 'Cindy' },
      { key: 'riley', text: 'Riley' },
    ],
  },
};

const initialValues = {
  id: 'TASK-123',
  subject: 'Follow up with customer',
  body: 'Call customer to confirm requirements and next steps.',
  userAssigned: 'DOMAIN\\\\user.name',
  names: ['steve'],
  ssn: '123456789',
  status: 'new',
  result: 'unknown',
  dfrom: '2024-01-15',
  references: ['https://example.com/requirements'],
};

const schema = yup.object({
  id: yup.string().required('id is required'),
  subject: yup.string().required('please provide a subject'),
  body: yup.string().required('please provide a body'),
  dfrom: yup
    .date()
    .typeError('From date is required')
    .required('From date is required'),
  references: yup.array().of(yup.string()).default([]),
  names: yup.array().of(yup.string()).default([]),
  status: yup.string().required('Status is required'),
  result: yup.string().required('Result is required'),
});

const DemoForm = () => {
  const [data, setData] = useState(null);
  const formMethods = useFormProvider({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  const onSubmit = (data) => {
    console.log('Submitted:', data);
    setData(data);
  };

  return (
    <Fieldset legend="Task Example with validation">
      <Row>
        <Col size={12}>
          <h5>Note that Col, Input are size={3} by default. a Col is wrapped INSIDE Input</h5>
        </Col>
      </Row>

      <FormProvider formMethods={formMethods} onSubmit={onSubmit}>
        <Row>
          <div className="hidden"><Input name="id" label="Id" /></div>
          <Input name="userAssigned" label="Assigned To" disabled info="Auto-populated from Windows authentication" size={6} />
          <Input
            name="names"
            label="Names"
            optionsCheckbox={option.task.names}
            size={6}
          />
        </Row>
        <Row>
          <Input name="subject" label="Subject" />
          <Input name="body" label="Body" textarea minRows={3} size={12} />
        </Row>
        <Row>
          <Input
            name="status"
            label="Status"
            options={option.task.status}
          />
          <Input
            name="result"
            label="Result"
            options={option.task.result}
          />

          <Input
            name="ssn"
            label="Social Security Number"
            mask={maskPattern.ssn}
            placeholder="123-45-6789"
          />

          <Input
            name="dfrom"
            label="From"
            datepicker
          />

          <Input
            name="references"
            label="References"
            arrayInput
            placeholder="Add a link or reference"
            info="Add URLs or reference links (e.g., documentation, maps)"
          />

          <Col size={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button type="submit" variant="contained">Submit</Button>
            <Button type="button" variant="outlined" onClick={() => formMethods.reset(initialValues)}>Reset</Button>
          </Col>
        </Row>
      </FormProvider>
      {data && (
        <Row>
          <Col size={12}>
            <TextareaDebug data={data} />
          </Col>
        </Row>
      )}
    </Fieldset>
  );
};
        `,
      },
    },
  },
};

// ─── Individual component stories (showing Input variants) ───────────────────

const SimpleWrapper = ({ children, defaultValues = {}, onSubmit }) => {
  const formMethods = useFormProvider({ defaultValues });
  return (
    <FormProvider formMethods={formMethods} onSubmit={onSubmit ?? (d => alert(JSON.stringify(d)))}>
      <Row>
        {children}
        <Col size={12}>
          <Button type="submit" variant="contained" size="small">Submit</Button>
        </Col>
      </Row>
    </FormProvider>
  );
};

const hideArg = hiddenControl;
const shown = (argType) => ({ ...argType, table: { disable: false } });

const commonArgTypes = {
  label: { control: 'text' },
  info: { control: 'text' },
  readOnly: { control: 'boolean' },
  disabled: { control: 'boolean' },
  size: {
    control: { type: 'number', min: 1, max: 12, step: 1 },
    description: 'Grid column span (default 3). Responsive maps such as { xs: 12, md: 6 } are valid in code.',
  },
  sizeInput: {
    control: 'select',
    options: ['small', 'medium'],
    description: 'Visual size of the input control; independent of the Grid column size.',
  },
  xs: shown({
    control: { type: 'number', min: 1, max: 12, step: 1 },
    description: 'Deprecated; use size instead (for example, size={{ xs: 6 }}).',
  }),
  name: hideArg,
};

const textEntryArgTypes = {
  ...commonArgTypes,
  placeholder: { control: 'text' },
  maxLength: { control: 'number' },
  minLength: { control: 'number' },
};

const autocompleteArgTypes = {
  freeSolo: shown({ control: 'boolean' }),
  disableClearable: shown({ control: 'boolean' }),
  clearOnBlur: shown({ control: 'boolean' }),
  selectOnFocus: shown({ control: 'boolean' }),
  handleHomeEndKeys: shown({ control: 'boolean' }),
  filterSelectedOptions: shown({ control: 'boolean' }),
  includeInputInList: shown({ control: 'boolean' }),
  openOnFocus: shown({ control: 'boolean' }),
  autoHighlight: shown({ control: 'boolean' }),
  loading: shown({ control: 'boolean' }),
  loadingText: shown({ control: 'text' }),
  noOptionsText: shown({ control: 'text' }),
  forcePopupIcon: shown({ control: 'boolean' }),
  disablePortal: shown({ control: 'boolean' }),
  limitTags: shown({ control: 'number' }),
};

const commonArgs = {
  info: '',
  readOnly: false,
  disabled: false,
  xs: 6,
};

const textEntryArgs = {
  ...commonArgs,
  placeholder: '',
};

export const LabelStory = {
  name: 'Label',
  component: Label,
  args: {
    text: 'Example label',
    value: '',
  },
  argTypes: {
    text: { control: 'text' },
    value: { control: 'text' },
    children: hideArg,
  },
  render: (args) => <Label {...args} />,
};

export const InfoStory = {
  name: 'Info',
  component: Info,
  args: {
    id: 'example-info',
    info: 'Object',
  },
  argTypes: {
    id: hideArg,
    info: {
      control: 'select',
      options: ['JSX', 'Object', 'Header|body'],
      description: 'Click icon to view info.<br/>uses: <br/><ul><li>"Title|Message"</li><li>JSX</li><li>or <br/>InfoObject ({ label, message, content, messageList })</li></ul>',
      mapping: {
        JSX: <><strong>JSX header</strong><p>This is <em>rich JSX</em> passed directly to Info.</p></>,
        Object: {
          label: 'Help',
          message: 'Structured info supports a header, message, JSX content, and a list.',
          content: <><strong>JSX content</strong> can be included in the object.</>,
          messageList: ['First detail', 'Second detail'],
        },
        'Header|body': 'Header example|Body example',
      },
    },
  },
  render: (args) => <div style={{ position: 'relative', minHeight: 48 }}><Info {...args} /></div>,
};

export const InfoIconStory = {
  name: 'InfoIcon',
  component: InfoIcon,
  args: {
    id: 'example-info-icon',
    info: 'Help|Additional information about this field.',
    label: 'Field label',
  },
  argTypes: {
    id: { control: 'text' },
    info: { control: 'text' },
    label: { control: 'text' },
  },
  render: (args) => <div style={{ position: 'relative', minHeight: 48 }}><InfoIcon {...args} /></div>,
};

const InteractiveField = ({
  onSubmit,
  defaultValues = {},
  maxLength,
  minLength,
  ...inputArgs
}) => (
  <SimpleWrapper defaultValues={defaultValues} onSubmit={onSubmit}>
    <Input
      {...inputArgs}
      {...(maxLength === '' || maxLength == null ? {} : { maxLength: Number(maxLength) })}
      {...(minLength === '' || minLength == null ? {} : { minLength: Number(minLength) })}
    />
  </SimpleWrapper>
);

const InputTypesDemo = () => (
  <SimpleWrapper
    defaultValues={{
      demoText: 'TextField',
      demoPassword: 'secret123',
      demoCount: 'Hello',
      demoAgree: true,
      demoRadio: 'new',
      demoSelect: 'new',
      demoAutocomplete: 'done',
      demoMulti: ['steve'],
      demoCheckboxSelect: ['cindy'],
      demoTextarea: 'Textarea content',
      demoDate: '2026-09-29',
      demoDateMask: '1990-05-15',
      demoTextMask: '123456789',
      demoArray: ['First item'],
    }}
  >
    <Input name="demoText" label="Input (TextField)" size={6} />
    <Input name="demoPassword" label="Input (Password)" password size={6} />
    <Input name="demoCount" label="Input (CharCount)" charCount={10} size={6} />
    <Input name="demoAgree" label="Input (Checkbox)" checkbox size={6} />
    <Input name="demoRadio" label="Input (Radio)" optionsRadio={option.task.status} size={6} />
    <Input name="demoSelect" label="Input (Select)" select options={option.task.status} size={6} />
    <Input name="demoAutocomplete" label="Input (SelectAutocomplete)" options={option.task.status} size={6} />
    <Input name="demoMulti" label="Input (SelectMulti)" optionsMulti={option.task.names} size={6} />
    <Input name="demoCheckboxSelect" label="Input (SelectCheckbox)" optionsCheckbox={option.task.names} size={6} />
    <Input name="demoTextarea" label="Input (Textarea)" textarea minRows={2} size={6} />
    <Input name="demoDate" label="Input (Datepicker)" datepicker size={6} />
    <Input name="demoDateMask" label="Input (DateMask)" datemask size={6} />
    <Input name="demoTextMask" label="Input (TextMask)" mask={maskPattern.ssn} size={6} />
    <Input name="demoArray" label="Input (ArrayInput)" arrayInput size={6} />
  </SimpleWrapper>
);

export const InputTypesStory = {
  name: 'Input/Usage',
  parameters: {
    docs: {
      description: {
        story: 'Input selects its control from props: omit a type flag for TextField; use `password`, `charCount`, `checkbox`, `optionsRadio`, `select` + `options`, `options` alone, `optionsMulti`, `optionsCheckbox`, `textarea`, `datepicker`, `datemask`, `mask`, or `arrayInput` to choose the corresponding control.',
      },
    },
  },
  render: () => <InputTypesDemo />,
};

export const TextFieldStory = {
  name: 'Input (TextField)',
  args: {
    ...textEntryArgs,
    name: 'email',
    label: 'Email',
    placeholder: '',
  },
  argTypes: {
    ...textEntryArgTypes,
    autoComplete: shown({ control: 'text' }),
  },
  render: (args) => <InteractiveField {...args} />,
};

const multiErrorSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Must be a valid email address')
    .min(10, 'Must be at least 10 characters'),
});

const MultipleValidationErrorsDemo = () => {
  const formMethods = useFormProvider({
    resolver: yupResolver(multiErrorSchema),
    defaultValues: { email: 'a' },
  });

  return (
    <Fieldset legend="Multiple validation errors on one field">
      <Row>
        <Col size={12}>
          <p style={{ margin: '0 0 12px' }}>
            The email field has three yup rules. With the initial value <code>a</code>, click
            {' '}<strong>Submit</strong> to see every failing rule listed below the field.
          </p>
        </Col>
      </Row>
      <FormProvider formMethods={formMethods} onSubmit={(data) => alert(JSON.stringify(data))}>
        <Row>
          <Input name="email" label="Email" size={6} />
          <Col size={12}>
            <Button type="submit" variant="contained" size="small">Submit</Button>
          </Col>
        </Row>
      </FormProvider>
    </Fieldset>
  );
};

export const MultipleValidationErrorsStory = {
  name: 'Input (TextField) — Multiple Validation Errors',
  render: () => <MultipleValidationErrorsDemo />,
};

export const PasswordStory = {
  name: 'Input (Password)',
  args: {
    ...textEntryArgs,
    name: 'pwd',
    label: 'Password',
    placeholder: '',
    password: true,
  },
  argTypes: {
    ...textEntryArgTypes,
    autoComplete: shown({ control: 'text' }),
    password: hideArg,
  },
  render: (args) => <InteractiveField {...args} />,
};

export const CharCountStory = {
  name: 'Input (CharCount)',
  args: {
    ...textEntryArgs,
    name: 'msg',
    label: 'Message',
    placeholder: '',
    charCount: 5,
  },
  argTypes: {
    ...textEntryArgTypes,
    charCount: shown({ control: { type: 'number', min: 1 } }),
    autoComplete: shown({ control: 'text' }),
  },
  render: (args) => <InteractiveField {...args} />,
};

export const CheckboxStory = {
  name: 'Input (Checkbox)',
  args: {
    ...commonArgs,
    name: 'agree',
    label: 'I agree',
    checkbox: true,
    variant: '',
  },
  argTypes: {
    ...commonArgTypes,
    checkbox: hideArg,
    isChecked: shown({ control: 'boolean' }),
  },
  render: (args) => <InteractiveField {...args} />,
};

export const RadioStory = {
  name: 'Input (Radio)',
  args: {
    ...commonArgs,
    name: 'choice',
    label: 'Your choice',
    size: 12,
    row: true,
    optionsRadio: option.task.status,
    disabledKeys: ['inProgress'],
  },
  argTypes: {
    ...commonArgTypes,
    row: shown({ control: 'boolean' }),
    optionsRadio: shown({ control: 'object' }),
    disabledKeys: shown({ control: 'object' }),
  },
  render: (args) => <InteractiveField {...args} />,
};

export const SelectStory = {
  name: 'Input (Select)',
  args: {
    ...commonArgs,
    name: 'role',
    label: 'Role',
    placeholder: '',
    select: true,
    options: option.task.status,
  },
  argTypes: {
    ...commonArgTypes,
    placeholder: { control: 'text' },
    autoWidth: shown({ control: 'boolean' }),
    select: hideArg,
    options: shown({ control: 'object' }),
  },
  render: (args) => <InteractiveField {...args} />,
};

export const SelectMultiStory = {
  name: 'Input (SelectMulti)',
  args: {
    ...textEntryArgs,
    name: 'tags',
    label: 'Tags',
    placeholder: '',
    optionsMulti: option.task.names,
  },
  argTypes: {
    ...textEntryArgTypes,
    optionsMulti: shown({ control: 'object' }),
    ...autocompleteArgTypes,
  },
  render: (args) => <InteractiveField {...args} defaultValues={{ tags: [] }} />,
};

export const SelectAutocompleteStory = {
  name: 'Input (SelectAutocomplete)',
  args: {
    ...textEntryArgs,
    name: 'roleAuto',
    label: 'Role',
    placeholder: '',
    options: option.task.status,
  },
  argTypes: {
    ...textEntryArgTypes,
    options: shown({ control: 'object' }),
    ...autocompleteArgTypes,
  },
  render: (args) => <InteractiveField {...args} />,
};

export const SelectCheckboxStory = {
  name: 'Input (SelectCheckbox)',
  args: {
    ...textEntryArgs,
    name: 'tagsCb',
    label: 'Tags',
    placeholder: '',
    optionsCheckbox: option.task.names,
  },
  argTypes: {
    ...textEntryArgTypes,
    optionsCheckbox: shown({ control: 'object' }),
    ...autocompleteArgTypes,
  },
  render: (args) => <InteractiveField {...args} defaultValues={{ tagsCb: [] }} />,
};

export const TextareaStory = {
  name: 'Input (Textarea)',
  args: {
    ...textEntryArgs,
    name: 'bio',
    label: 'Bio',
    placeholder: '',
    size: 12,
    textarea: true,
    minRows: 3,
    charCount: 200,
  },
  argTypes: {
    ...textEntryArgTypes,
    textarea: hideArg,
    minRows: shown({ control: 'number' }),
    charCount: shown({ control: 'number' }),
  },
  render: (args) => <InteractiveField {...args} />,
};

export const DatepickerStory = {
  name: 'Input (Datepicker)',
  args: {
    ...textEntryArgs,
    name: 'date',
    label: 'Pick a Date',
    placeholder: '',
    datepicker: true,
  },
  argTypes: {
    ...textEntryArgTypes,
    datepicker: hideArg,
    min: shown({ control: 'text' }),
    max: shown({ control: 'text' }),
  },
  render: (args) => <InteractiveField {...args} />,
};

export const DateMaskStory = {
  name: 'Input (DateMask)',
  args: {
    ...textEntryArgs,
    name: 'dob',
    label: 'Date of Birth',
    placeholder: '',
    datemask: true,
  },
  argTypes: {
    ...textEntryArgTypes,
    datemask: hideArg,
    min: shown({ control: 'text' }),
    max: shown({ control: 'text' }),
  },
  render: (args) => <InteractiveField {...args} defaultValues={{ dob: '1990-05-15' }} />,
};

export const TextMaskStory = {
  name: 'Input (TextMask)',
  args: {
    ...textEntryArgs,
    name: 'ssn',
    label: 'SSN',
    placeholder: '',
    mask: maskPattern.ssn,
  },
  argTypes: {
    ...textEntryArgTypes,
    mask: shown({ control: 'text' }),
    format: shown({ control: 'text' }),
    showLast: shown({ control: 'number' }),
    persistent: shown({ control: 'boolean' }),
  },
  render: (args) => <InteractiveField {...args} />,
};

export const ArrayInputStory = {
  name: 'Input (ArrayInput)',
  args: {
    ...textEntryArgs,
    name: 'aliases',
    label: 'Aliases',
    placeholder: '',
    size: 12,
    arrayInput: true,
  },
  argTypes: {
    ...textEntryArgTypes,
    arrayInput: hideArg,
  },
  render: (args) => <InteractiveField {...args} defaultValues={{ aliases: [] }} />,
};

export const PatternStory = {
  name: 'Pattern & Mask Examples',
  render: () => (
    <SimpleWrapper defaultValues={{
      ssn: '123456789',
      ein: '123456789',
      zip: '12345',
    }}>
      <Input
        name="ssn"
        label="SSN (pattern + mask example)"
        pattern={maskPattern.ssn}
        placeholder="123-45-6789"
        info="Mask pattern (maskPattern.ssn): ###-##-#### · HTML pattern example: \\d{3}-\\d{2}-\\d{4}"
        mask={maskPattern.ssn}
      />
      <Input
        name="ein"
        label="EIN"
        pattern={maskPattern.ein}
        placeholder="12-3456789"
        info="Mask pattern (maskPattern.ein): ##-####### · HTML pattern example: \\d{2}-\\d{7}"
        mask={maskPattern.ein}
      />
      <Input
        name="zip"
        label="ZIP Code"
        pattern={maskPattern.zipCode}
        placeholder="12345"
        info="Mask pattern (maskPattern.zipCode): ##### · HTML pattern example: \\d{5}"
        mask={maskPattern.zipCode}
      />
    </SimpleWrapper>
  ),
};
