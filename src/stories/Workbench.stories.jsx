import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Typography } from '@mui/material';

import {
  Col,
  Fieldset,
  FormProvider,
  useFormProvider,
  Input,
  Row,
  TextareaDebug,
} from '../components';

export default {
  title: 'Formhelper/Workbench',
  component: Input,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

const options = {
  status: [
    { key: 'draft', text: 'Draft' },
    { key: 'review', text: 'In Review' },
    { key: 'done', text: 'Done' },
  ],
  owners: [
    { key: 'alex', text: 'Alex' },
    { key: 'casey', text: 'Casey' },
    { key: 'jordan', text: 'Jordan' },
  ],
};

const defaultValues = {
  title: 'Workbench example',
  owner: 'alex',
  status: 'draft',
  needsFollowUp: true,
  notes: 'Use this story as a local scratchpad for the control you are shaping.',
};

const schema = yup.object({
  title: yup.string().required('Title is required'),
  owner: yup.string().required('Owner is required'),
  status: yup.string().required('Status is required'),
  needsFollowUp: yup.boolean().default(false),
  notes: yup.string().required('Notes are required'),
});

const WorkbenchDemo = () => {
  const [submitted, setSubmitted] = useState(null);
  const formMethods = useFormProvider({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const onSubmit = (data) => {
    setSubmitted(data);
  };

  return (
    <Fieldset legend="Formhelper Workbench">
      <Row>
        <Col size={12}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Keep common form plumbing here, then swap the focused control under test into the target area below.
          </Typography>
        </Col>
      </Row>

      <FormProvider formMethods={formMethods} onSubmit={onSubmit}>
        <Row>
          <Input name="title" label="Title" size={6} />
          <Input name="owner" label="Owner" options={options.owners} size={6} />
        </Row>

        <Row>
          <Input name="status" label="Status" options={options.status} />
          <Input name="needsFollowUp" label="Needs Follow Up" checkbox />
        </Row>

        <Row>
          <Input
            name="notes"
            label="Target Area"
            textarea
            minRows={5}
            size={12}
            info="Replace this field with the specific component variant you are shaping."
          />
        </Row>

        <Row>
          <Col size={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button type="button" variant="outlined" onClick={() => formMethods.reset(defaultValues)}>
              Reset
            </Button>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Col>
        </Row>
      </FormProvider>

      <Row>
        <Col size={12}>
          <TextareaDebug data={{ values: formMethods.getValues(), submitted }} />
        </Col>
      </Row>
    </Fieldset>
  );
};

export const Default = {
  render: () => <WorkbenchDemo />,
};
