import type { RenderResult } from '@testing-library/react';
import type { Screen, FireEvent, waitFor, within } from '@testing-library/react';
import type userEvent from '@testing-library/user-event';
import type { vi } from 'vitest';

declare global {
  const render: typeof import('@testing-library/react').render;
  const screen: typeof import('@testing-library/react').screen;
  const waitFor: typeof import('@testing-library/react').waitFor;
  const fireEvent: typeof import('@testing-library/react').fireEvent;
  const within: typeof import('@testing-library/react').within;
  const act: typeof import('@testing-library/react').act;
  const userEvent: typeof import('@testing-library/user-event').default;
}
