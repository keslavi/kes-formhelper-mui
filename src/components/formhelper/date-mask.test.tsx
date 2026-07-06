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

const isTestIdVisible = (testId: string): boolean => {
  const el = screen.getByTestId(testId);
  const fc = el.closest('div[class*="MuiFormControl"]');
  return !!fc && !fc.className.includes('hidden');
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

  it('sets suffixed data-testid on masked and readonly fields', async () => {
    const user = userEvent.setup();
    render(
      <TestHarness item={{}}>
        <Row>
          <DateMask name="testDate" label="Test Date" data-testid="dob" />
        </Row>
      </TestHarness>
    );

    expect(screen.getByTestId('dob')).toHaveAttribute('data-testid', 'dob');
    expect(isTestIdVisible('dob')).toBe(true);
    expect(isTestIdVisible('dob-masked')).toBe(false);

    await user.click(getVisibleVisibilityToggle());

    expect(screen.getByTestId('dob-masked')).toHaveAttribute('data-testid', 'dob-masked');
    expect(isTestIdVisible('dob-masked')).toBe(true);
    expect(isTestIdVisible('dob')).toBe(false);

    await user.click(getVisibleVisibilityToggle());
    expect(isTestIdVisible('dob')).toBe(true);
    expect(isTestIdVisible('dob-masked')).toBe(false);
  });

  it('sets suffixed data-testid on readonly field when readOnly', async () => {
    const user = userEvent.setup();
    render(
      <TestHarness item={{ testDate: '2023-06-15' }}>
        <Row>
          <DateMask name="testDate" label="Test Date" readOnly data-testid="dob" />
        </Row>
      </TestHarness>
    );

    expect(isTestIdVisible('dob-masked')).toBe(true);

    await user.click(getVisibleVisibilityToggle());

    expect(screen.getByTestId('dob-readonly')).toHaveAttribute('data-testid', 'dob-readonly');
    expect(isTestIdVisible('dob-readonly')).toBe(true);
    expect(isTestIdVisible('dob-masked')).toBe(false);
    expect(isTestIdVisible('dob')).toBe(false);
  });

  it('registers only one named input in the DOM', () => {
    render(
      <TestHarness item={{ testDate: '2023-06-15' }}>
        <Row>
          <DateMask name="testDate" label="Test Date" />
        </Row>
      </TestHarness>
    );

    const namedInputs = document.querySelectorAll('input[name="testDate"]');
    expect(namedInputs).toHaveLength(1);
  });

  it('submits a single scalar value, not an array', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <TestHarness item={{}} onSubmit={onSubmit}>
        <Row>
          <DateMask name="testDate" label="Test Date" />
        </Row>
      </TestHarness>
    );

    const dateInput = getVisibleInput('Test Date', 'date') as HTMLInputElement;
    await user.click(dateInput);
    await user.type(dateInput, '2023-12-01');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const submitted = onSubmit.mock.calls[0][0];
    expect(submitted.testDate).toBe('2023-12-01');
    expect(Array.isArray(submitted.testDate)).toBe(false);
  });

  it('submits a single scalar value when masked', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <TestHarness item={{ testDate: '2023-12-01' }} onSubmit={onSubmit}>
        <Row>
          <DateMask name="testDate" label="Test Date" />
        </Row>
      </TestHarness>
    );

    await user.click(getVisibleVisibilityToggle());
    expect(screen.getByDisplayValue('**/**/****')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const submitted = onSubmit.mock.calls[0][0];
    expect(submitted.testDate).toBe('2023-12-01');
    expect(Array.isArray(submitted.testDate)).toBe(false);
  });
});
