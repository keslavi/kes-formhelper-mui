import { cleanParentProps } from './clean-parent-props';

describe('cleanParentProps', () => {
  it('passes event handlers through to textField', () => {
    const onClick = vi.fn();
    const onMouseEnter = vi.fn();
    expect(
      cleanParentProps({ name: 'email', label: 'Email', onClick, onMouseEnter }, 'textField'),
    ).toEqual({ onClick, onMouseEnter, placeholder: 'Email' });
  });

  it('passes event handlers through to checkbox', () => {
    const onClick = vi.fn();
    expect(cleanParentProps({ name: 'agree', onClick }, 'checkbox')).toEqual({ onClick });
  });

  it('does not pass onChange or onBlur (wired by field components)', () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();
    const onClick = vi.fn();
    const result = cleanParentProps({ name: 'email', onChange, onBlur, onClick }, 'textField');
    expect(result).toEqual({ onClick });
    expect(result).not.toHaveProperty('onChange');
    expect(result).not.toHaveProperty('onBlur');
  });

  it('passes disabled through to radioGroup', () => {
    expect(
      cleanParentProps({ name: 'choice', disabled: true }, 'radioGroup'),
    ).toEqual({ disabled: true });
  });

  it('strips grid col props and form-only props', () => {
    const onClick = vi.fn();
    expect(
      cleanParentProps({ name: 'email', xs: 6, options: [], onClick }, 'textField'),
    ).toEqual({ onClick });
  });
});
