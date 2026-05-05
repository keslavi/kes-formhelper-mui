import { fn } from 'storybook/test';
import { Icon, iconType } from '../components/icon/icon';

export default {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size:         { control: 'radio', options: ['sm', 'md', 'lg'] },
    textPosition: { control: 'radio', options: ['left', 'right'] },
    colorIcon:    { control: 'color' },
    color:        { control: 'color' },
    bold:         { control: 'boolean' },
  },
};

export const Forward    = { render: () => <Icon src={iconType.arrowForward}  size="md" /> };
export const Back       = { render: () => <Icon src={iconType.arrowBack}     size="md" /> };
export const Complete   = { render: () => <Icon src={iconType.complete}      size="lg" /> };
export const Incomplete = { render: () => <Icon src={iconType.uncomplete}    size="lg" /> };
export const Add        = { render: () => <Icon src={iconType.add}           size="md" /> };
export const Remove     = { render: () => <Icon src={iconType.remove}        size="md" /> };

export const Accordion = {
  render: () => <Icon src={iconType.accordion} size="md" expanded={false} onClick={fn()} />,
};

export const WithText = {
  render: () => <Icon src={iconType.arrowForward} text="Continue" size="md" bold onClick={fn()} />,
};

export const TextLeft = {
  render: () => <Icon src={iconType.arrowBack} text="Back" size="md" textPosition="left" onClick={fn()} />,
};

export const AllIcons = {
  name: 'All Icons',
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', padding: 16 }}>
      {Object.entries(iconType).map(([key, IconComp]) => (
        <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 80 }}>
          <Icon src={IconComp} size="md" />
          <span style={{ fontSize: 11, color: '#666' }}>{key}</span>
        </div>
      ))}
    </div>
  ),
};
