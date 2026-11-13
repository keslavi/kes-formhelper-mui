import { Box, Typography } from '@mui/material';
import { Col, ColPadded, Row, TableRows } from '@formhelper';

export default {
  title: 'Components/Grid',
  component: Row,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '`Col` (and `Input`, which wraps a `Col`) accepts both syntaxes: MUI v9 `size` (a number or a responsive map, e.g. `size={6}` or `size={{ xs: 12, md: 6 }}`) and MUI v5 breakpoint props (e.g. `xs={12} md={6}`). If both are given, `size` takes precedence.',
      },
    },
  },
};

const Panel = ({ title, children }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h6" sx={{ mb: 1 }}>{title}</Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>{children}</Box>
  </Box>
);

const Tile = ({ label }) => (
  <Box
    sx={{
      border: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper',
      borderRadius: 1,
      p: 1.5,
      minHeight: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      fontWeight: 600,
    }}
  >
    {label}
  </Box>
);

export const ColControls = {
  name: 'Col (size / breakpoints)',
  args: { size: { xs: 12, md: 6 }, xs: undefined, sm: undefined, md: undefined, lg: undefined, xl: undefined },
  argTypes: {
    size: {
      control: 'object',
      description: 'v9 syntax: number (6) or responsive map ({ "xs": 12, "md": 6 }). Takes precedence over xs..xl.',
    },
    ...Object.fromEntries(
      ['xs', 'sm', 'md', 'lg', 'xl'].map((bp) => [
        bp,
        {
          control: { type: 'number', min: 1, max: 12, step: 1 },
          description: `v5>latest syntax: ${bp} breakpoint span; ignored when size is set.`,
        },
      ]),
    ),
  },
  render: (args) => (
    <Row>
      <Col {...args}><Tile label="Col" /></Col>
      <Col {...args}><Tile label="Col" /></Col>
    </Row>
  ),
};

export const BackwardCompatibility = {
  render: () => (
    <Box>
      <Panel title="Default Col sizing">
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Col defaults to size=3, so four columns fit in the default 12-column Row.
        </Typography>
        <Row>
          <Col><Tile label="Default 1" /></Col>
          <Col><Tile label="Default 2" /></Col>
          <Col><Tile label="Default 3" /></Col>
          <Col><Tile label="Default 4" /></Col>
        </Row>
      </Panel>

      <Panel title="Legacy breakpoint props remain supported">
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          xs/sm/md/lg/xl props are converted into the newer size shape automatically.
        </Typography>
        <Row>
          <Col xs={2} sm={2} md={6}><Tile label="Legacy xs=2 sm=2 md=6" /></Col>
          <Col xs={2} sm={2} md={6}><Tile label="Legacy xs=2 sm=2 md=6" /></Col>
          <Col xs={2} sm={4} md={12}><Tile label="Legacy xs=2 sm=4 md=12" /></Col>
        </Row>
      </Panel>

      <Panel title="Unified size and flex support">
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Modern size works alongside flex auto-sizing for toolbars and mixed layouts.
        </Typography>
        <Row>
          <Col size={3}><Tile label="size=3" /></Col>
          <Col flex><Tile label="flex=true" /></Col>
          <Col size={{ xs: 2, md: 3 }}><Tile label="size={{ xs: 2, md: 3 }}" /></Col>
        </Row>
      </Panel>

      <Panel title="ColPadded and table-style rows">
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          ColPadded keeps the inner Item padding, and TableRows preserves the older row-separator presentation.
        </Typography>
        <TableRows>
          <Row>
            <ColPadded size={6}><Tile label="ColPadded A" /></ColPadded>
            <ColPadded size={6}><Tile label="ColPadded B" /></ColPadded>
          </Row>
          <Row>
            <ColPadded size={4}><Tile label="Row 2 / Col 1" /></ColPadded>
            <ColPadded size={4}><Tile label="Row 2 / Col 2" /></ColPadded>
            <ColPadded size={4}><Tile label="Row 2 / Col 3" /></ColPadded>
          </Row>
        </TableRows>
      </Panel>
    </Box>
  ),
};
