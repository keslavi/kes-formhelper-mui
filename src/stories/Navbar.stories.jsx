import { Button } from '@mui/material';
import { Navbar } from '../components/navbar/navbar';

export default {
  title: 'Components/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export const Default = {
  render: (args) => (
    <Navbar {...args}>
      <Button variant="text" size="small">Home</Button>
      <Button variant="text" size="small">Tasks</Button>
      <Button variant="text" size="small">Reports</Button>
    </Navbar>
  ),
};

export const WithAlignRight = {
  name: 'With alignRight content',
  render: () => (
    <Navbar
      alignRight={
        <Button variant="contained" size="small">+ New</Button>
      }
    >
      <Button variant="text" size="small">Home</Button>
      <Button variant="text" size="small">Tasks</Button>
    </Navbar>
  ),
};

export const Empty = {
  render: () => <Navbar />,
};
