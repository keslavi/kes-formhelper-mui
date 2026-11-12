import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@mui/material';
import './App.css';
import {
  Col,
  ContainerFullWidth,
  Fieldset,
  FormProvider,
  Input,
  Row,
  TextareaDebug,
  maskPattern,
  useFormProvider,
} from './components';
import { sampleSsn } from './stories/sample-data';

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
  ssn: sampleSsn,
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

const addNewStatusSchema = yup.object({
  key: yup.string().trim(),
  text: yup.string().trim().required('Text is required'),
});

const AddNewDropdownExample = props => {
  const formMethods = useFormProvider({
    resolver: yupResolver(addNewStatusSchema),
  });

  // Stop propagation on the raw submit event: this form renders in a modal that is still inside
  // the parent form's React tree, and FormProvider's onSubmit runs only after async validation.
  const onSubmit = e => {
    e.stopPropagation();
    return formMethods.handleSubmit(values => props.onSubmit?.(values))(e);
  };

  return (
    <FormProvider formMethods={formMethods} formProps={{ onSubmit }}>
      <Row>
        <Input name="key" label="Key" placeholder="Defaults to Text when blank" size={12} />
        <Input name="text" label="Text" size={12} />
        <Col size={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">Save</Button>
        </Col>
      </Row>
    </FormProvider>
  );
};

const App = () => {
  const [data, setData] = useState(null);
  const formMethods = useFormProvider({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  const onSubmit = submittedData => setData(submittedData);

  return (
    <ContainerFullWidth>
      <Fieldset legend="Task Example with validation">
        <FormProvider formMethods={formMethods} onSubmit={onSubmit}>
          <Row>
            <div className="hidden"><Input name="id" label="Id" /></div>
            <Input
              name="userAssigned"
              label="Assigned To"
              disabled
              info="Auto-populated from Windows authentication"
              size={6}
            />
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
              addNew={
                <AddNewDropdownExample
                  onSubmit={values => ({ key: values.key || values.text, text: values.text })}
                />
              }
            />
            <Input name="result" label="Result" options={option.task.result} />
            <Input
              name="ssn"
              label="Social Security Number"
              mask={maskPattern.ssn}
              placeholder="###-##-####"
            />
            <Input name="dfrom" label="From" datepicker />
            <Input
              name="references"
              label="References"
              arrayInput
              placeholder="Add a link or reference"
              info="Add URLs or reference links (e.g., documentation, maps)"
            />
            <Col size={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button type="submit" variant="contained">Submit</Button>
              <Button
                type="button"
                variant="outlined"
                onClick={() => {
                  formMethods.reset(initialValues);
                  setData(null);
                }}
              >
                Reset
              </Button>
            </Col>
          </Row>
        </FormProvider>
        {data && (
          <Row>
            <Col size={12}>
              <TextareaDebug value={data} />
            </Col>
          </Row>
        )}
      </Fieldset>
    </ContainerFullWidth>
  );
};

export default App;
