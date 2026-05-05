import { TestHarness } from './test/testHarness';
import { Input } from './input';

const categoryOptions = [
  { key: 0, text: 'pending' },
  { key: 1, text: 'in progress' },
  { key: 2, text: 'completed' },
  { key: 3, text: 'cancelled' },
];

describe('SelectCheckbox', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('loads with initial values', async () => {
    render(
      <TestHarness item={{ categories: [1, 3] }}>
        <Input name="categories" label="Categories" optionsCheckbox={categoryOptions} data-testid="categories-select" />
      </TestHarness>
    );
    await waitFor(() => {
      expect(screen.getByText(/in progress/i)).toBeVisible();
    });
  });

  it('renders with empty options without crashing', () => {
    render(
      <TestHarness item={{}}>
        <Input name="categories" label="Categories" optionsCheckbox={[]} data-testid="categories-select" />
      </TestHarness>
    );
    expect(screen.getByTestId('categories-select').querySelector('input')).toBeVisible();
  });

  it('opens dropdown with single option and allows selection', async () => {
    render(
      <TestHarness item={{}}>
        <Input
          name="categories"
          label="Categories"
          optionsCheckbox={[{ key: 99, text: 'only option' }]}
          data-testid="categories-select"
        />
      </TestHarness>
    );
    const input = screen.getByTestId('categories-select').querySelector('input')!;
    await user.click(input);

    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent('only option');
    });

    const checkbox = screen.getAllByRole('option')[0].querySelector('input[type="checkbox"]') as HTMLElement;
    await user.click(checkbox);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /only option/i })).toHaveClass('MuiChip-root');
    });
    expect(input).toHaveAttribute('placeholder', '');
  });

  it('calls onChange and onBlur', async () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();
    render(
      <TestHarness item={{}}>
        <Input
          name="categories"
          label="Categories"
          optionsCheckbox={categoryOptions}
          data-testid="categories-select"
          onChange={onChange}
          onBlur={onBlur}
        />
      </TestHarness>
    );
    const input = screen.getByTestId('categories-select').querySelector('input')!;
    await user.click(input);
    await waitFor(() => expect(screen.getAllByRole('option').length).toBeGreaterThan(0));
    await user.click(screen.getAllByRole('option')[0]);
    expect(onChange).toHaveBeenCalled();
    await user.tab();
    expect(onBlur).toHaveBeenCalled();
  });

  it('renders info and error together', () => {
    render(
      <TestHarness item={{}}>
        <Input
          name="categories"
          label="Categories"
          optionsCheckbox={categoryOptions}
          data-testid="categories-select"
          info="Some info"
          error={{ message: 'Some error' }}
        />
      </TestHarness>
    );
    expect(screen.getByText('Some error')).toBeInTheDocument();
    expect(screen.getByTestId('IconHelpRounded')).toBeInTheDocument();
  });
});
