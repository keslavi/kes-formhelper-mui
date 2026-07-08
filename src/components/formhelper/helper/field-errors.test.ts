import {
  buildFieldErrorState,
  collectFieldErrorMessages,
  collectParentErrorMessages,
} from './field-errors';

describe('field-errors', () => {
  it('collects multiple messages from field error types', () => {
    expect(
      collectFieldErrorMessages({
        type: 'required',
        message: 'required',
        types: {
          required: 'required',
          min: 'too short',
        },
      }),
    ).toEqual(['required', 'too short']);
  });

  it('dedupes message when it appears in types', () => {
    expect(
      collectFieldErrorMessages({
        type: 'email',
        message: 'bad email',
        types: {
          email: 'bad email',
          min: 'too short',
        },
      }),
    ).toEqual(['bad email', 'too short']);
  });

  it('collects parent messages array', () => {
    expect(
      collectParentErrorMessages({
        messages: ['Server rejected value', 'Must be unique'],
      }),
    ).toEqual(['Server rejected value', 'Must be unique']);
  });

  it('prefers parent errors over field errors', () => {
    const { messages } = buildFieldErrorState(
      {
        type: 'required',
        message: 'required',
        types: { required: 'required', min: 'too short' },
      },
      { messages: ['parent error'] },
    );

    expect(messages).toEqual(['parent error']);
  });
});
