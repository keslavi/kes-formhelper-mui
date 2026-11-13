import { TestHarness } from './test/testHarness';
import { Input } from './input';
import { color } from '../../theme-material';

describe('Formhelper-CharCount', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('renders char count input with character count', () => {
    render(
      <TestHarness item={{}}>
        <Input name="description" label="Description" charCount={50} data-testid="description-charcount" />
      </TestHarness>
    );
    const input = screen.getByRole('textbox', { name: /description/i });
    const charCountText = screen.getByText('0 / 50 characters');
    expect(input).toBeVisible();
    expect(charCountText).toBeVisible();
    expect(charCountText).not.toHaveStyle({ color: color.primary.red });
  });

  it('shows count in non-red when under the limit', async () => {
    render(
      <TestHarness item={{}}>
        <Input name="description" label="Description" charCount={50} data-testid="description-charcount" />
      </TestHarness>
    );
    const input = screen.getByRole('textbox', { name: /description/i });
    expect(screen.getByText('0 / 50 characters')).not.toHaveStyle({ color: color.primary.red });

    await user.type(input, 'This is a test message');
    expect(screen.getByText('22 / 50 characters')).not.toHaveStyle({ color: color.primary.red });
  });

  it('turns the label and border red when exceeding the limit without coloring the count', async () => {
    render(
      <TestHarness item={{}}>
        <Input name="description" label="Description" charCount={20} data-testid="description-charcount" />
      </TestHarness>
    );
    const input = screen.getByRole('textbox', { name: /description/i });
    await user.type(input, 'This is a very long message that exceeds the character limit');

    const charCountEl = screen.getByText((_, el) => el?.textContent === '60 / 20 characters' && el?.tagName === 'SPAN');
    expect(charCountEl).toHaveStyle({ color: 'rgb(117, 117, 117)' });
    expect(charCountEl).not.toHaveStyle({ color: 'rgb(211, 47, 47)' });
    expect(charCountEl).not.toHaveStyle({ color: 'rgb(2, 65, 206)' });

    expect(input).toHaveAttribute('aria-invalid', 'true');
    const field = input.closest('.MuiFormControl-root');
    const label = field?.querySelector('.MuiInputLabel-root');
    const outline = field?.querySelector('.MuiOutlinedInput-notchedOutline');
    expect(label).toHaveClass('Mui-error');
    expect(label).toHaveStyle({ color: 'rgb(211, 47, 47)' });
    expect(outline).toHaveStyle({ borderColor: 'rgb(211, 47, 47)' });
  });

  it('prevents form submission when character count exceeds limit', async () => {
    const onSubmitSpy = vi.fn();
    render(
      <TestHarness item={{}} onSubmit={onSubmitSpy}>
        <Input name="description" label="Description" charCount={20} data-testid="description-charcount" />
      </TestHarness>
    );
    const input = screen.getByRole('textbox', { name: /description/i });
    await user.type(input, 'This is a very long message that exceeds the character limit');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(onSubmitSpy).not.toHaveBeenCalled();
    expect(screen.getByLabelText('submit results')).toHaveValue('');
  });

  it('allows form submission when within limit', async () => {
    render(
      <TestHarness item={{}}>
        <Input name="description" label="Description" charCount={50} data-testid="description-charcount" />
      </TestHarness>
    );
    const input = screen.getByRole('textbox', { name: /description/i });
    await user.type(input, 'Short text');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByLabelText('submit results')).not.toHaveValue('');
    });
  });
});
