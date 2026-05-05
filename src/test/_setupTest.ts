import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// expose testing-library helpers on the global test environment
// use globalThis to avoid TS/ESM "cannot find global" issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as any;

g.act = act;
g.fireEvent = fireEvent;
g.render = render;
g.screen = screen;
g.userEvent = userEvent;
g.waitFor = waitFor;
g.within = within;
g.vi = vi;
