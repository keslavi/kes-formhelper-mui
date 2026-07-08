import * as yup from 'yup';
import { TestHarness } from './test/testHarness';
import { Input } from './input';
import { Row } from '../grid';

describe('TextField', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  const testData = () => ({
    item: {
      name: 'John Doe',
      email: 'john@example.com',
      description: 'A test description',
    },
  });

  it('loads with initial value', async () => {
    const data = testData();
    render(
      <TestHarness item={data.item}>
        <Input name="name" label="Name" data-testid="name-field" />
      </TestHarness>
    );
    await waitFor(() => {
      expect(screen.getByDisplayValue('John Doe')).toBeVisible();
    });
  });

  it('renders with no initial value and shows placeholder', () => {
    render(
      <TestHarness item={{}}>
        <Input name="name" label="Name" placeholder="Enter your name" data-testid="name-field" />
      </TestHarness>
    );
    const input = screen.getByTestId('name-field').querySelector('input');
    expect(input).toBeVisible();
    expect(input).toHaveAttribute('placeholder', 'Enter your name');
  });

  it('uses label as placeholder when no placeholder provided', () => {
    render(
      <TestHarness item={{}}>
        <Input name="name" label="Name" data-testid="name-field" />
      </TestHarness>
    );
    const input = screen.getByTestId('name-field').querySelector('input');
    expect(input).toHaveAttribute('placeholder', 'Name');
    expect(input).toHaveValue('');
  });

  it('allows user input and calls onChange', async () => {
    const mockOnChange = vi.fn();
    render(
      <TestHarness item={{}}>
        <Input name="name" label="Name" onChange={mockOnChange} data-testid="name-field" />
      </TestHarness>
    );
    const input = screen.getByTestId('name-field').querySelector('input')!;
    await user.type(input, 'Jane Doe');
    expect(input).toHaveValue('Jane Doe');
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('calls onBlur when input loses focus', async () => {
    const mockOnBlur = vi.fn();
    render(
      <TestHarness item={{}}>
        <Input name="name" label="Name" onBlur={mockOnBlur} data-testid="name-field" />
      </TestHarness>
    );
    const input = screen.getByTestId('name-field').querySelector('input')!;
    await user.click(input);
    await user.tab();
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('displays multiple parent error messages', () => {
    render(
      <TestHarness item={{}} noResults>
        <Input
          name="email"
          label="Email"
          error={{ messages: ['Invalid email format', 'Must be unique'] }}
          data-testid="email-field"
        />
      </TestHarness>,
    );
    expect(screen.getByText('Invalid email format')).toBeVisible();
    expect(screen.getByText('Must be unique')).toBeVisible();
  });

  it('displays multiple yup validation errors on submit', async () => {
    const user = userEvent.setup();
    const schema = yup.object({
      email: yup.string().required('required').email('bad email').min(10, 'too short'),
    });
    render(
      <TestHarness item={{ email: 'a' }} schema={schema}>
        <Input name="email" label="Email" data-testid="email-field" />
      </TestHarness>,
    );
    await user.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText('bad email')).toBeVisible();
      expect(screen.getByText('too short')).toBeVisible();
    });
  });

  it('displays error message when error prop is passed', () => {
    render(
      <TestHarness item={{}}>
        <Input
          name="email"
          label="Email"
          error={{ message: 'Invalid email format' }}
          data-testid="email-field"
        />
      </TestHarness>
    );
    expect(screen.getByText('Invalid email format')).toBeVisible();
    const input = screen.getByTestId('email-field').querySelector('input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders info icon', async () => {
    render(
      <TestHarness item={{}}>
        <Input
          name="name"
          label="Name"
          info="Enter your full name as it appears on your ID"
          data-testid="name-field"
        />
      </TestHarness>
    );
    const infoIcon = screen.getByTestId('IconHelpRounded');
    expect(infoIcon).toBeInTheDocument();

    await user.click(infoIcon);
    await waitFor(() => {
      const popover = document.querySelector('[role="presentation"]');
      expect(popover).toBeInTheDocument();
      expect(popover).toHaveTextContent('Enter your full name as it appears on your ID');
    });
  });

  it('renders with unbound prop without crashing', () => {
    render(
      <TestHarness item={{}}>
        <Input name="name" label="Name" unbound="true" data-testid="name-field" />
      </TestHarness>
    );
    expect(screen.getByTestId('name-field').querySelector('input')).toBeVisible();
  });

  it('renders with defaultValue prop', () => {
    render(
      <TestHarness item={{}}>
        <Row>
          <Input name="name" label="Name" defaultValue="Default Name" data-testid="name-field" />
        </Row>
      </TestHarness>
      , { wrapper: undefined }
    );
    expect(screen.getByTestId('name-field').querySelector('input')).toBeVisible();
  });

  it('allows parent data-testid to override the default from field name', () => {
    render(
      <TestHarness item={{}}>
        <Input name="name" label="Name" data-testid="custom-test-id" />
      </TestHarness>
    );
    expect(screen.getByTestId('custom-test-id')).toHaveAttribute('data-testid', 'custom-test-id');
    expect(screen.queryByTestId('name')).not.toBeInTheDocument();
  });
});
