import { TestHarness } from './test/testHarness';
import { Input } from './input';
import { Row } from '../grid';

const statusOptions = [
  { key: 0, text: 'pending' },
  { key: 1, text: 'in progress' },
  { key: 2, text: 'completed' },
  { key: 3, text: 'cancelled' },
];

describe('Formhelper-Select', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('loads with initial selected value', async () => {
    render(
      <TestHarness item={{ status: 1 }}>
        <Row>
          <Input name="status" label="Status" select options={statusOptions} data-testid="status-select" />
        </Row>
      </TestHarness>
    );
    await waitFor(() => {
      expect(screen.getByText('in progress')).toBeVisible();
    });
  });

  it('shows custom placeholder when no value selected', () => {
    render(
      <TestHarness item={{}}>
        <Row>
          <Input
            name="status"
            label="Status"
            select
            options={statusOptions}
            placeholder="Select a status"
            data-testid="status-select"
          />
        </Row>
      </TestHarness>
    );
    expect(screen.getByRole('combobox', { name: /status/i })).toHaveTextContent('Select a status');
  });

  it('shows default "Please Select" placeholder', () => {
    render(
      <TestHarness item={{}}>
        <Row>
          <Input name="status" label="Status" select options={statusOptions} data-testid="status-select" />
        </Row>
      </TestHarness>
    );
    expect(screen.getByRole('combobox', { name: /status/i })).toHaveTextContent('Please Select');
  });

  it('does not include placeholder option in dropdown', async () => {
    render(
      <TestHarness item={{}}>
        <Row>
          <Input
            name="status"
            label="Status"
            select
            options={statusOptions}
            placeholder="Select a status"
            data-testid="status-select"
          />
        </Row>
      </TestHarness>
    );
    const select = screen.getByRole('combobox', { name: /status/i });
    await user.click(select);

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
    expect(screen.getByRole('listbox')).not.toHaveTextContent('Select a status');
  });

  it('allows user to select an option', async () => {
    render(
      <TestHarness item={{}}>
        <Row>
          <Input name="status" label="Status" select options={statusOptions} data-testid="status-select" />
        </Row>
      </TestHarness>
    );
    const select = screen.getByRole('combobox', { name: /status/i });
    await user.click(select);
    await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument());
    await user.click(screen.getByText('completed'));
    await waitFor(() => expect(select).toHaveTextContent('completed'));
  });

  it('handles empty options array', () => {
    render(
      <TestHarness item={{}}>
        <Row>
          <Input
            name="status"
            label="Status"
            select
            options={[]}
            placeholder="Select a status"
            data-testid="status-select"
          />
        </Row>
      </TestHarness>
    );
    // When options are empty, MUI renders a textbox
    const input = screen.getByRole('textbox', { name: /status/i });
    expect(input).toHaveAttribute('placeholder', 'Select a status');
  });

  it('calls onChange and onBlur', async () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();
    render(
      <TestHarness item={{}}>
        <Row>
          <Input
            name="status"
            label="Status"
            select
            options={statusOptions}
            onChange={onChange}
            onBlur={onBlur}
            data-testid="status-select"
          />
        </Row>
      </TestHarness>
    );
    const select = screen.getByRole('combobox', { name: /status/i });
    await user.click(select);
    await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument());
    await user.click(screen.getByText('pending'));
    expect(onChange).toHaveBeenCalled();
    await user.tab();
    expect(onBlur).toHaveBeenCalled();
  });
});
