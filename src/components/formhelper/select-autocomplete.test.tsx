import { TestHarness } from './test/testHarness';
import { Input } from './input';

const statusOptions = [
  { key: 0, text: 'pending' },
  { key: 1, text: 'in progress' },
  { key: 2, text: 'completed' },
  { key: 3, text: 'cancelled' },
];

describe('Formhelper-SelectAutocomplete', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('loads with initial value', async () => {
    render(
      <TestHarness item={{ status: '3' }}>
        <Input name="status" label="Status" options={statusOptions} data-testid="status-select" />
      </TestHarness>
    );
    const input = screen.getByTestId('status-select').querySelector('input')!;
    await waitFor(() => {
      expect(input).toHaveValue('cancelled');
    }, { timeout: 5000 });
  });

  it('shows placeholder when no value selected', () => {
    render(
      <TestHarness item={{}}>
        <Input name="status" label="Status" options={statusOptions} data-testid="status-select" />
      </TestHarness>
    );
    const input = screen.getByTestId('status-select').querySelector('input')!;
    expect(input).toHaveAttribute('placeholder', 'Please Select');
  });

  it('allows selecting a value', async () => {
    render(
      <TestHarness item={{}}>
        <Input name="status" label="Status" options={statusOptions} data-testid="status-select" />
      </TestHarness>
    );
    const input = screen.getByTestId('status-select').querySelector('input')!;
    await user.click(input);
    await user.type(input, 'completed');
    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options.find(o => o.textContent === 'completed')).toBeTruthy();
    });
    const option = screen.getAllByRole('option').find(o => o.textContent === 'completed')!;
    await user.click(option);
    expect(input).toHaveValue('completed');
  });

  it('allows clearing a value', async () => {
    render(
      <TestHarness item={{ status: '3' }}>
        <Input name="status" label="Status" options={statusOptions} data-testid="status-select" />
      </TestHarness>
    );
    const input = screen.getByRole('combobox', { name: /status/i });
    await user.click(input);

    const clearButton = input.closest('.MuiAutocomplete-root')?.querySelector('button[title="Clear"]') as HTMLElement;
    expect(clearButton).toBeTruthy();
    await user.click(clearButton);
    expect(input).toHaveValue('');
  });

  it('maintains cleared state after blur', async () => {
    render(
      <TestHarness item={{}}>
        <Input name="status" label="Status" options={statusOptions} data-testid="status-select" />
      </TestHarness>
    );
    const input = screen.getByTestId('status-select').querySelector('input')!;
    await user.click(input);
    await user.type(input, 'completed');
    await waitFor(() => {
      expect(screen.getAllByRole('option').find(o => o.textContent === 'completed')).toBeTruthy();
    });
    await user.click(screen.getAllByRole('option').find(o => o.textContent === 'completed')!);

    const clearButton = input.closest('.MuiAutocomplete-root')?.querySelector('button[title="Clear"]') as HTMLElement;
    await user.click(clearButton);
    await user.tab();
    expect(input).toHaveValue('');
  });
});
