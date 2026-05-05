import { LabelMask, maskPattern } from '../components';

export default {
  title: 'Components/LabelMask',
  component: LabelMask,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    mask: {
      control: 'select',
      options: ['', ...Object.keys(maskPattern)],
    },
    showLast: { control: { type: 'number', min: 0, max: 10 } },
  },
};

export const SSN = {
  args: { text: '123456789', mask: 'ssn' },
};

export const Phone = {
  args: { text: '5551234567', mask: 'phone' },
};

export const EIN = {
  args: { text: '123456789', mask: 'ein' },
};

export const ShowLast4 = {
  name: 'SSN – Show Last 4',
  args: { text: '123456789', mask: 'ssn', showLast: 4 },
};

export const AlwaysVisible = {
  args: { text: '123456789', mask: 'ssn', persistent: true },
};

export const NoMask = {
  args: { text: 'Plain text value' },
};

export const AllMasks = {
  name: 'All Mask Patterns',
  parameters: { layout: 'padded' },
  render: () => (
    <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 14 }}>
      <thead>
        <tr>
          {['Mask key', 'Pattern', 'Hidden', 'Visible'].map(h => (
            <th key={h} style={{ padding: '6px 16px', borderBottom: '1px solid #ccc', textAlign: 'left' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.entries(maskPattern).map(([key, pattern]) => (
          <tr key={key}>
            <td style={{ padding: '4px 16px' }}>{key}</td>
            <td style={{ padding: '4px 16px', color: '#888' }}>{pattern}</td>
            <td style={{ padding: '4px 16px' }}>
              <LabelMask mask={key} text={'12345678901234'} />
            </td>
            <td style={{ padding: '4px 16px' }}>
              <LabelMask mask={key} text={'12345678901234'} persistent />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};
