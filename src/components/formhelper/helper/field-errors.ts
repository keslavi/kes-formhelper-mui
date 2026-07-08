import { ReactNode, createElement } from 'react';
import type { FieldError } from 'react-hook-form';

export type FieldErrorProp =
  | string
  | {
      message?: string;
      messages?: string[];
    };

function appendUnique(messages: string[], value: unknown) {
  if (typeof value !== 'string' || !value) {
    return;
  }
  if (!messages.includes(value)) {
    messages.push(value);
  }
}

/** Collect validation messages from a react-hook-form field error. */
export function collectFieldErrorMessages(error?: FieldError | null): string[] {
  if (!error) {
    return [];
  }

  const messages: string[] = [];

  if (error.types && typeof error.types === 'object') {
    for (const value of Object.values(error.types)) {
      if (Array.isArray(value)) {
        value.forEach(item => appendUnique(messages, item));
      } else {
        appendUnique(messages, value);
      }
    }
  }

  appendUnique(messages, error.message);

  return messages;
}

/** Collect messages passed from a parent via the error prop. */
export function collectParentErrorMessages(
  error?: FieldErrorProp,
  helperText?: string,
  fieldName?: string,
): string[] {
  if (typeof error === 'string') {
    return error ? [error] : [];
  }

  if (error?.messages?.length) {
    return error.messages.filter((message): message is string => Boolean(message));
  }

  if (error?.message) {
    return [error.message];
  }

  if (helperText) {
    return [helperText];
  }

  if (error) {
    return [`${fieldName ?? 'field'}: custom error`];
  }

  return [];
}

export function renderFieldErrorMessages(messages: string[]): ReactNode {
  if (messages.length === 0) {
    return undefined;
  }

  if (messages.length === 1) {
    return messages[0];
  }

  return createElement(
    'span',
    { style: { display: 'block' } },
    ...messages.map((message, index) =>
      createElement('span', { key: index, style: { display: 'block' } }, message),
    ),
  );
}

export function buildFieldErrorState(
  fieldError: FieldError | undefined,
  parentError?: FieldErrorProp,
  helperText?: string,
  fieldName?: string,
) {
  const messages =
    parentError !== undefined && parentError !== null
      ? collectParentErrorMessages(parentError, helperText, fieldName)
      : collectFieldErrorMessages(fieldError);

  if (messages.length === 0) {
    return {
      messages: [] as string[],
      errorMui: {} as { error?: boolean; helperText?: ReactNode },
    };
  }

  return {
    messages,
    errorMui: {
      error: true,
      helperText: renderFieldErrorMessages(messages),
    },
  };
}
