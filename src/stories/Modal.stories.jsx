import { fn } from 'storybook/test';
import { useState } from 'react';
import { Button } from '@mui/material';
import { ModalCommon } from '../components/modal/modal-common';
import { ModalConfirmExit } from '../components/modal/modal-confirm-exit';

export default {
  title: 'Components/Modal',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

// ── ModalCommon ───────────────────────────────────────────────────────────────

export const Common = {
  name: 'ModalCommon',
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>Open Modal</Button>
        <ModalCommon {...args} isModalOpen={open} toggleModal={() => setOpen(false)} />
      </>
    );
  },
  args: {
    header: 'Modal Title',
    children: <p>This is the modal body content.</p>,
    hideCloseIcon: false,
  },
  argTypes: {
    hideCloseIcon: { control: 'boolean' },
  },
};

export const CommonNoClose = {
  name: 'ModalCommon – No Close Icon',
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>Open</Button>
        <ModalCommon {...args} isModalOpen={open} toggleModal={() => setOpen(false)} />
      </>
    );
  },
  args: {
    header: 'Locked Dialog',
    hideCloseIcon: true,
    children: (
      <>
        <p>This modal can only be dismissed via the buttons below.</p>
        <Button variant="outlined" onClick={fn()}>Dismiss</Button>
      </>
    ),
  },
};

// ── ModalConfirmExit ──────────────────────────────────────────────────────────

export const ConfirmExit = {
  name: 'ModalConfirmExit',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="contained" color="warning" onClick={() => setOpen(true)}>
          Trigger Exit
        </Button>
        <ModalConfirmExit
          isOpen={open}
          toggle={() => setOpen(false)}
          onConfirm={() => alert('Confirmed exit')}
          onCancel={() => alert('Cancelled')}
        />
      </>
    );
  },
};
