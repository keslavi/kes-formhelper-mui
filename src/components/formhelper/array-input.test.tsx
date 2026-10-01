import { TestHarness } from './test/testHarness';
import { Input } from './input';

describe('ArrayInput provider readOnly', () => {
  it('makes the entries read-only and disables array controls', () => {
    render(
      <TestHarness item={{ items: ['First item'] }} readOnly>
        <Input
          name="items"
          label="Items"
          arrayInput
          placeholder="Enter item"
          data-testid="items-array"
        />
      </TestHarness>
    );

    expect(screen.getByPlaceholderText('Enter item')).toHaveAttribute('readonly');
    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();
    expect(screen.getByTestId('DeleteIcon').closest('button')).toBeDisabled();
  });

  it('lets a field-level readOnly=false override the provider', () => {
    render(
      <TestHarness item={{ items: ['First item'] }} readOnly>
        <Input
          name="items"
          label="Items"
          arrayInput
          readOnly={false}
          placeholder="Enter item"
          data-testid="items-array"
        />
      </TestHarness>
    );

    expect(screen.getByPlaceholderText('Enter item')).not.toHaveAttribute('readonly');
    expect(screen.getByRole('button', { name: 'Add' })).toBeEnabled();
    expect(screen.getByTestId('DeleteIcon').closest('button')).toBeEnabled();
  });
});
