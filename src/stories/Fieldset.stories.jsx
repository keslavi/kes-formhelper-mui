import { Button, Typography } from '@mui/material';
import { Fieldset } from '../components/fieldset/fieldset';

export default {
  title: 'Components/Fieldset',
  component: Fieldset,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    legend: { control: 'text' },
  },
};

export const Default = {
  render: () => (
    <div>
      <Fieldset legend="Section Title">
        <Typography variant="body1" sx={{ mb: 2 }}>(note button size inside fieldset vs outside)</Typography>
        <Button variant="contained">Button</Button>
      </Fieldset>
      <Button variant="contained">Button</Button>
    </div>
  ),
};

export const NoLegend = {
  render: () => (
    <div>
      <Fieldset>
        <Typography variant="body1" sx={{ mb: 2 }}>Fieldset with no legend.</Typography>
        <Button variant="contained">Button</Button>
      </Fieldset>
      <Button variant="contained">Button</Button>
    </div>
  ),
};

export const Disabled = {
  render: () => (
    <div>
      <Fieldset legend="Disabled State">
        <Typography variant="body1" sx={{ mb: 2 }}>Disabled button inside fieldset gets 1.25rem font size.</Typography>
        <Button variant="contained" disabled>Button</Button>
      </Fieldset>
      <Button variant="contained" disabled>Button</Button>
    </div>
  ),
};
