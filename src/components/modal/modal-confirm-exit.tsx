import { Button, Typography } from '@mui/material';
import { ModalCommon } from './modal-common';

interface ModalConfirmExitProps {
  isOpen: boolean;
  toggle: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export const ModalConfirmExit = ({
  isOpen,
  toggle,
  onCancel,
  onConfirm,
}: ModalConfirmExitProps) => {
  const onClickCancel = () => {
    toggle();
    onCancel?.();
  };

  const onClickConfirm = () => {
    toggle();
    if (typeof onConfirm === 'function') {
      onConfirm();
    } else {
      console.warn('ModalConfirmExit: onConfirm is not defined');
    }
  };

  return (
    <ModalCommon
      isModalOpen={isOpen}
      toggleModal={toggle}
      header="Exit Application"
      hideCloseIcon
      width="400px"
      height="200px"
    >
      <Typography variant="h6">
        Any recent updates may not be saved. Are you sure you want to continue?
      </Typography>
      <br /><br />
      <Button variant="contained" onClick={onClickConfirm}>Yes</Button>
      &nbsp;&nbsp;
      <Button variant="outlined" onClick={onClickCancel}>No</Button>
    </ModalCommon>
  );
};

export default ModalConfirmExit;
