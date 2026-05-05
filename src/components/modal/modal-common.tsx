import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { ReactNode, CSSProperties } from 'react';
import type { DialogProps } from '@mui/material';

interface ModalCommonProps extends Omit<DialogProps, 'open'> {
  children?: ReactNode;
  isModalOpen: boolean;
  toggleModal?: () => void;
  header?: ReactNode;
  hideCloseIcon?: boolean;
  titleStyle?: CSSProperties;
  width?: string | number;
  height?: string | number;
}

export const ModalCommon = ({
  children,
  isModalOpen,
  toggleModal,
  header,
  hideCloseIcon,
  titleStyle,
  width,
  height,
  ...rest
}: ModalCommonProps) => {
  return (
    <Dialog
      open={isModalOpen}
      slotProps={{
        paper: {
          style: { ...(width && { width }), ...(height && { height }) },
        },
      }}
      {...rest}
    >
      <DialogTitle style={titleStyle ?? {}} sx={{ m: 0, p: 2 }} color="primary">
        {header}
        {!hideCloseIcon && (
          <IconButton
            aria-label="close"
            onClick={toggleModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent dividers>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ModalCommon;
