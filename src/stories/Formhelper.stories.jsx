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

export default {
  title: 'Formhelper',
  component: Input,
  tags: ['autodocs'],
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
  render: () => <DemoForm />,
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

const SimpleWrapper = ({ children, defaultValues = {} }) => {
  const formMethods = useFormProvider({ defaultValues });
  return (
    <FormProvider formMethods={formMethods} onSubmit={d => alert(JSON.stringify(d))}>
      <Row>
        {children}
        <Col size={12}>
          <Button type="submit" variant="contained" size="small">Submit</Button>
        </Col>
      </Row>
    </FormProvider>
  );
};

export const ReadOnlyStory = {
  name: 'ReadOnly',
  render: () => (
    <SimpleWrapper
      defaultValues={{
        emailReadOnly: 'readonly@example.com',
        roleReadOnly: 'inProgress',
        roleAutoReadOnly: 'done',
        tagsReadOnly: ['steve', 'riley'],
        tagsCbReadOnly: ['cindy', 'riley'],
        dateReadOnly: '2024-10-21',
        dobReadOnly: '1990-05-15',
      }}
    >
      <Input name="emailReadOnly" label="Email (ReadOnly)" readOnly/>
      <Input name="roleReadOnly" label="Role Select (ReadOnly)" select readOnly options={option.task.status}/>
      <Input name="roleAutoReadOnly" label="Role Auto (ReadOnly)" readOnly options={option.task.status}/>
      <Input name="tagsReadOnly" label="Tags Multi (ReadOnly)" readOnly optionsMulti={option.task.names}/>
      <Input name="tagsCbReadOnly" label="Tags Checkbox (ReadOnly)" readOnly optionsCheckbox={option.task.names}/>
      <Input name="dateReadOnly" label="Pick a Date (ReadOnly)" readOnly datepicker/>
      <Input name="dobReadOnly" label="Date of Birth Mask (ReadOnly)" readOnly datemask/>
    </SimpleWrapper>
  ),
};

export const TextFieldStory = {
  name: 'TextField',
  render: () => (
    <SimpleWrapper>
      <Input name="email" label="Email"/>
    </SimpleWrapper>
  ),
};

export const PasswordStory = {
  name: 'Password',
  render: () => (
    <SimpleWrapper>
      <Input name="pwd" label="Password" password/>
    </SimpleWrapper>
  ),
};

export const CharCountStory = {
  name: 'CharCount',
  render: () => (
    <SimpleWrapper>
      <Input name="msg" label="Message (5 chars)" charCount={5} />
    </SimpleWrapper>
  ),
};

export const CheckboxStory = {
  name: 'Checkbox',
  render: () => (
    <SimpleWrapper>
      <Input name="agree" label="I agree" checkbox/>
      <Input name="notify" label="Notify me (h1)" checkbox variant="h1"/>
    </SimpleWrapper>
  ),
};

export const RadioStory = {
  name: 'Radio',
  render: () => (
    <SimpleWrapper>
      <Input name="choice" label="Your choice" optionsRadio={option.task.status} row size={12} />
    </SimpleWrapper>
  ),
};

export const SelectStory = {
  name: 'Select',
  render: () => (
    <SimpleWrapper>
      <Input name="role" label="Role" select options={option.task.status}/>
    </SimpleWrapper>
  ),
};

export const SelectMultiStory = {
  name: 'SelectMulti',
  render: () => (
    <SimpleWrapper defaultValues={{ tags: [] }}>
      <Input name="tags" label="Tags" optionsMulti={option.task.names} size={6} />
    </SimpleWrapper>
  ),
};

export const SelectAutocompleteStory = {
  name: 'SelectAutocomplete',
  render: () => (
    <SimpleWrapper>
      <Input name="roleAuto" label="Role" options={option.task.status}/>
    </SimpleWrapper>
  ),
};

export const SelectCheckboxStory = {
  name: 'SelectCheckbox',
  render: () => (
    <SimpleWrapper defaultValues={{ tags: [] }}>
      <Input name="tagsCb" label="Tags" optionsCheckbox={option.task.names} size={6} />
    </SimpleWrapper>
  ),
};

export const TextareaStory = {
  name: 'Textarea',
  render: () => (
    <SimpleWrapper>
      <Input name="bio" label="Bio" textarea minRows={3} charCount={200} size={12} />
    </SimpleWrapper>
  ),
};

export const DatepickerStory = {
  name: 'Datepicker',
  render: () => (
    <SimpleWrapper>
      <Input name="date" label="Pick a Date" datepicker/>
    </SimpleWrapper>
  ),
};

export const DateMaskStory = {
  name: 'DateMask',
  render: () => (
    <SimpleWrapper defaultValues={{ dob: '1990-05-15' }}>
      <Input name="dob" label="Date of Birth" datemask/>
    </SimpleWrapper>
  ),
};

export const ArrayInputStory = {
  name: 'ArrayInput',
  render: () => (
    <SimpleWrapper defaultValues={{ aliases: [] }}>
      <Input 
        name="aliases" 
        label="Aliases" 
        arrayInput 
        placeholder="Enter alias..." size={12} 
      />
    </SimpleWrapper>
  ),
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
