import { TestHarness } from './test/testHarness';
import { DateMask } from './date-mask';
import { Row } from '../grid';

/** Helper: find the visible FormControl for a label text (DateMask renders 3 fields) */
const getVisibleInput = (labelText: string, type: string) => {
  const allLabels = screen.getAllByText(labelText);
  const visibleLabel = allLabels.find(label => {
    const fc = label.closest('div[class*="MuiFormControl"]');
    return fc && !fc.className.includes('hidden');
  });
  const fc = visibleLabel!.closest('div[class*="MuiFormControl"]')!;
  return fc.querySelector(`input[type="${type}"]`);
};

/** Visibility toggle in the non-hidden FormControl */
const getVisibleVisibilityToggle = () => {
  const buttons = screen.getAllByRole('button', { name: /toggle date visibility/i });
  const visible = buttons.find(btn => {
    const fc = btn.closest('div[class*="MuiFormControl"]');
    return fc && !fc.className.includes('hidden');
  });
  if (!visible) throw new Error('Expected a visible date visibility toggle');
  return visible;
};

describe('DateMask', () => {
  it('when empty, renders date input visible and masked as hidden', () => {
    render(
      <TestHarness item={{}}>
        <Row>
          <DateMask name="testDate" label="Test Date" />
        </Row>
      </TestHarness>
    );

    const dateInput = getVisibleInput('Test Date', 'date');
    expect(dateInput).toBeInTheDocument();
    expect(dateInput).toHaveAttribute('type', 'date');

    const maskedInput = screen.getByDisplayValue('**/**/****');
    expect(maskedInput).toBeInTheDocument();

    expect(getVisibleVisibilityToggle()).toBeInTheDocument();
  });

  it('accepts a date value', async () => {
    const user = userEvent.setup();
    render(
      <TestHarness item={{}}>
        <Row>
          <DateMask name="testDate" label="Test Date" />
        </Row>
      </TestHarness>
    );
    const dateInput = getVisibleInput('Test Date', 'date') as HTMLInputElement;
    await user.click(dateInput);
    await user.type(dateInput, '2023-12-01');
    expect(dateInput).toHaveValue('2023-12-01');
  });

  it('toggles masked vs unmasked via visibility control', async () => {
    const user = userEvent.setup();
    render(
      <TestHarness item={{}}>
        <Row>
          <DateMask name="testDate" label="Test Date" />
        </Row>
      </TestHarness>
    );

    await user.click(getVisibleVisibilityToggle());
    expect(getVisibleInput('Test Date', 'date')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('**/**/****')).toBeInTheDocument();

    await user.click(getVisibleVisibilityToggle());
    expect(getVisibleInput('Test Date', 'date')).toBeInTheDocument();
  });

  it('readOnly: unmasked shows formatted text, visibility toggle, and no visible type=date input', async () => {
    const user = userEvent.setup();
    render(
      <TestHarness item={{ testDate: '2023-06-15' }}>
        <Row>
          <DateMask name="testDate" label="Test Date" readOnly />
        </Row>
      </TestHarness>
    );

    expect(getVisibleVisibilityToggle()).toBeInTheDocument();

    await user.click(getVisibleVisibilityToggle());

    expect(screen.getByDisplayValue('06/15/2023')).toBeInTheDocument();
    expect(getVisibleInput('Test Date', 'date')).toBeNull();
    expect(getVisibleVisibilityToggle()).toBeInTheDocument();
  });

  it('applies min date attribute', async () => {
    const user = userEvent.setup();
    render(
      <TestHarness item={{}}>
        <Row>
          <DateMask name="testDate" label="Test Date" min="2023-01-01" />
        </Row>
      </TestHarness>
    );
    const dateInput = getVisibleInput('Test Date', 'date') as HTMLInputElement;
    await user.click(dateInput);
    await user.type(dateInput, '2023-12-01');
    expect(dateInput).toHaveValue('2023-12-01');
  });

  it('applies max date attribute', async () => {
    const user = userEvent.setup();
    render(
      <TestHarness item={{}}>
        <Row>
          <DateMask name="testDate" label="Test Date" max="2023-12-31" />
        </Row>
      </TestHarness>
    );
    const dateInput = getVisibleInput('Test Date', 'date') as HTMLInputElement;
    expect(dateInput).toHaveAttribute('max', '2023-12-31');
    await user.click(dateInput);
    await user.type(dateInput, '2023-06-15');
    expect(dateInput).toHaveValue('2023-06-15');
  });
});
