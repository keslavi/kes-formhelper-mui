import { TestHarness } from './test/testHarness';
import { Input } from './input';

describe('Datepicker', () => {
  it('forwards a custom placeholder to the date input', () => {
    render(
      <TestHarness item={{}}>
        <Input
          name="date"
          label="Date"
          datepicker
          placeholder="Choose date"
          data-testid="date-picker"
        />
      </TestHarness>,
    );

    expect(screen.getByTestId('date-picker').querySelector('input'))
      .toHaveAttribute('placeholder', 'Choose date');
  });

  it('allows an empty placeholder to override the label default', () => {
    render(
      <TestHarness item={{}}>
        <Input
          name="date"
          label="Date"
          datepicker
          placeholder=""
          data-testid="date-picker"
        />
      </TestHarness>,
    );

    expect(screen.getByTestId('date-picker').querySelector('input'))
      .toHaveAttribute('placeholder', '');
  });
});
