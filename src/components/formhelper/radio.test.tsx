import { TestHarness } from './test/testHarness';
import { Input } from './input';

const statusOptions = [
  { key: 'new', text: 'New' },
  { key: 'done', text: 'Done' },
];

describe('Radio', () => {
  it('loads with initial selected value', () => {
    render(
      <TestHarness item={{ choice: 'new' }} noResults>
        <Input name="choice" label="Status" optionsRadio={statusOptions} />
      </TestHarness>,
    );
    expect(screen.getByLabelText('New')).toBeChecked();
    expect(screen.getByLabelText('Done')).not.toBeChecked();
  });

  it('allows selecting a different option', async () => {
    const user = userEvent.setup();
    render(
      <TestHarness item={{ choice: 'new' }} noResults>
        <Input name="choice" label="Status" optionsRadio={statusOptions} />
      </TestHarness>,
    );
    await user.click(screen.getByLabelText('Done'));
    expect(screen.getByLabelText('Done')).toBeChecked();
    expect(screen.getByLabelText('New')).not.toBeChecked();
  });

  it('calls onChange when selection changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TestHarness item={{ choice: 'new' }} noResults>
        <Input
          name="choice"
          label="Status"
          optionsRadio={statusOptions}
          onChange={onChange}
        />
      </TestHarness>,
    );
    await user.click(screen.getByLabelText('Done'));
    expect(onChange).toHaveBeenCalled();
  });

  it('disables all options when disabled is set', () => {
    render(
      <TestHarness item={{ choice: 'new' }} noResults>
        <Input name="choice" label="Status" optionsRadio={statusOptions} disabled />
      </TestHarness>,
    );
    expect(screen.getByLabelText('New')).toBeDisabled();
    expect(screen.getByLabelText('Done')).toBeDisabled();
  });
});
