import { TestHarness } from './test/testHarness';
import { Input } from './input';

const nameOptions = [
  { key: 1, text: 'aaa1' },
  { key: 2, text: 'bbb2' },
  { key: 3, text: 'ccc3' },
];

describe('Formhelper-Multiselect', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('loads correctly', () => {
    render(
      <TestHarness item={{ names2: [1, 2] }}>
        <Input name="names2" label="Names2" optionsMulti={nameOptions} data-testid="multiselect" />
      </TestHarness>
    );
    const input = screen.getByTestId('multiselect').querySelector('input');
    expect(input).toHaveValue('');
  });

  it('renders with empty options without crashing', () => {
    render(
      <TestHarness item={{}}>
        <Input name="names2" label="Names2" optionsMulti={[]} data-testid="multiselect" />
      </TestHarness>
    );
    expect(screen.getByTestId('multiselect').querySelector('input')).toBeVisible();
  });

  it('opens dropdown and allows selection', async () => {
    const singleOption = [{ key: 99, text: 'only option' }];
    render(
      <TestHarness item={{}}>
        <Input name="names2" label="Names2" optionsMulti={singleOption} data-testid="multiselect" />
      </TestHarness>
    );
    const input = screen.getByTestId('multiselect').querySelector('input')!;
    await user.click(input);

    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent('only option');
    });

    await user.click(screen.getAllByRole('option')[0]);

    await waitFor(() => {
      const chip = screen.getByRole('button', { name: /only option/i });
      expect(chip).toBeInTheDocument();
      expect(chip).toHaveClass('MuiChip-root');
    });
  });

  it('allows multiple selections', async () => {
    render(
      <TestHarness item={{}}>
        <Input name="names2" label="Names2" optionsMulti={nameOptions} data-testid="multiselect" />
      </TestHarness>
    );
    const input = screen.getByTestId('multiselect').querySelector('input')!;
    await user.click(input);

    await waitFor(() => expect(screen.getAllByRole('option').length).toBeGreaterThan(0));
    await user.click(screen.getAllByRole('option')[0]);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /aaa1/i })).toHaveClass('MuiChip-root');
    });

    await user.click(input);
    await waitFor(() => expect(screen.getAllByRole('option').length).toBeGreaterThan(0));
    await user.click(screen.getAllByRole('option')[0]);

    await waitFor(() => {
      const chips = screen.getAllByRole('button', { name: /aaa1|bbb2|ccc3/i });
      expect(chips.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('calls onChange and onBlur', async () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();
    render(
      <TestHarness item={{}}>
        <Input
          name="names2"
          label="Names2"
          optionsMulti={nameOptions}
          data-testid="multiselect"
          onChange={onChange}
          onBlur={onBlur}
        />
      </TestHarness>
    );
    const input = screen.getByTestId('multiselect').querySelector('input')!;
    await user.click(input);
    await waitFor(() => expect(screen.getAllByRole('option').length).toBeGreaterThan(0));
    await user.click(screen.getAllByRole('option')[0]);
    expect(onChange).toHaveBeenCalled();
    await user.tab();
    expect(onBlur).toHaveBeenCalled();
  });

  it('shows error and info icon together', () => {
    render(
      <TestHarness item={{}}>
        <Input
          name="names2"
          label="Names2"
          optionsMulti={nameOptions}
          data-testid="multiselect"
          info="Some info"
          error={{ message: 'Some error' }}
        />
      </TestHarness>
    );
    expect(screen.getByText('Some error')).toBeInTheDocument();
    expect(screen.getByTestId('IconHelpRounded')).toBeInTheDocument();
  });
});
