import { Button, Typography } from '@mui/material';
import { NavSticky } from '../components/nav-sticky/nav-sticky';

export default {
  title: 'Components/NavSticky',
  component: NavSticky,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    top:      { control: 'text' },
    bgcolor:  { control: 'color' },
    divider:  { control: 'boolean' },
    elevation:{ control: { type: 'number', min: 0, max: 24 } },
    zIndex:   { control: 'number' },
    px:       { control: 'number' },
  },
};

const PageFiller = () => (
  <div style={{ padding: '0 16px' }}>
    {Array.from({ length: 30 }, (_, i) => (
      <p key={i} style={{ borderBottom: '1px solid #eee', margin: '8px 0' }}>
        Row {i + 1} — scroll to see the sticky bar stay in place
      </p>
    ))}
  </div>
);

export const Default = {
  render: (args) => (
    <>
      <NavSticky {...args}>
        <Button variant="contained" size="small" sx={{ mr: 1 }}>Save</Button>
        <Button variant="outlined" size="small">Cancel</Button>
      </NavSticky>
      <NavSticky.Spacer />
      <PageFiller />
    </>
  ),
  args: { top: '0px', divider: true, elevation: 0 },
};

export const WithShadow = {
  render: (args) => (
    <>
      <NavSticky {...args}>
        <Button variant="contained" size="small" sx={{ mr: 1 }}>Save</Button>
        <Button variant="outlined" size="small">Cancel</Button>
        <Typography variant="body2" sx={{ ml: 'auto', alignSelf: 'center', color: 'text.secondary' }}>
          Last saved: just now
        </Typography>
      </NavSticky>
      <NavSticky.Spacer />
      <PageFiller />
    </>
  ),
  args: { top: '0px', divider: false, elevation: 2 },
};

export const SpacerDemo = {
  name: 'Spacer — prevents content overlap',
  render: () => (
    <>
      <NavSticky top="0px">
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          ↑ Fixed sticky bar
        </Typography>
      </NavSticky>
      <NavSticky.Spacer />
      <div style={{ padding: '0 16px' }}>
        <p>↑ This content starts immediately below the bar thanks to <code>NavSticky.Spacer</code>.</p>
        <PageFiller />
      </div>
    </>
  ),
};
