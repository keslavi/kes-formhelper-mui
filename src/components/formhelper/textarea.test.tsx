import { TestHarness } from './test/testHarness';
import { Input } from './input';
import { color } from '../../theme-material';

describe('Formhelper-TextArea', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('renders textarea with character count', () => {
    render(
      <TestHarness item={{}}>
        <Input name="description" label="Description" textarea charCount={50} data-testid="description-textarea" />
      </TestHarness>
    );
    expect(screen.getByRole('textbox', { name: /description/i })).toBeVisible();
    expect(screen.getByText('0 / 50 characters')).toHaveClass('primaryText');
  });

  it('shows count in primaryText when under limit', async () => {
    render(
      <TestHarness item={{}}>
        <Input name="description" label="Description" textarea charCount={50} data-testid="description-textarea" />
      </TestHarness>
    );
    const textarea = screen.getByRole('textbox', { name: /description/i });
    expect(screen.getByText('0 / 50 characters')).toHaveClass('primaryText');
    await user.type(textarea, 'This is a test message');
    expect(screen.getByText('22 / 50 characters')).toHaveClass('primaryText');
  });

  it('shows count in red when exceeding the limit', async () => {
    render(
      <TestHarness item={{}}>
        <Input name="description" label="Description" textarea charCount={20} data-testid="description-textarea" />
      </TestHarness>
    );
    const textarea = screen.getByRole('textbox', { name: /description/i });
    await user.type(textarea, 'This is a very long message that exceeds the character limit');

    const charCountEl = screen.getByText((_, el) => el?.textContent === '60 / 20 characters');
    expect(charCountEl).toHaveClass('Mui-error');
    expect(textarea).toHaveStyle({ color: color.primary.red });
    // border uses inline style with CSS var — verify the attribute exists with the error color token
    expect(textarea).toHaveAttribute('style', expect.stringContaining(color.primary.red));
  });

  it('prevents form submission when character count exceeds limit', async () => {
    const onSubmitSpy = vi.fn();
    render(
      <TestHarness item={{}} onSubmit={onSubmitSpy}>
        <Input name="description" label="Description" textarea charCount={20} data-testid="description-textarea" />
      </TestHarness>
    );
    const textarea = screen.getByRole('textbox', { name: /description/i });
    await user.type(textarea, 'This is a very long message that exceeds the character limit');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(onSubmitSpy).not.toHaveBeenCalled();
    expect(screen.getByLabelText('submit results')).toHaveValue('');
  });

  it('allows form submission when within limit', async () => {
    render(
      <TestHarness item={{}}>
        <Input name="description" label="Description" textarea charCount={50} data-testid="description-textarea" />
      </TestHarness>
    );
    const textarea = screen.getByRole('textbox', { name: /description/i });
    await user.type(textarea, 'Short text');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByLabelText('submit results')).not.toHaveValue('');
    });
  });

  it('renders textarea without charCount', () => {
    render(
      <TestHarness item={{ notes: 'some notes' }}>
        <Input name="notes" label="Notes" textarea data-testid="notes-textarea" />
      </TestHarness>
    );
    expect(screen.getByRole('textbox', { name: /notes/i })).toBeVisible();
    expect(screen.queryByText(/characters/i)).not.toBeInTheDocument();
  });
});
