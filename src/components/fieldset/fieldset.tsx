import { Box } from '@mui/material';
import { color } from '../../theme-material';
import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material';

export interface FieldsetProps {
  children?: ReactNode;
  /** Optional legend text displayed at the top-left of the fieldset border */
  legend?: string;
  sx?: SxProps<Theme>;
  [key: string]: any;
}

export const Fieldset = ({ children, legend, sx, ...props }: FieldsetProps) => (
  <Box
    component="fieldset"
    sx={{
      boxShadow: '0px 0px 12px rgba(0,0,0,0.2)',
      backgroundColor: 'background.paper',
      borderRadius: '8px',
      border: `1px solid ${color.gray300}`,
      padding: '32px',
      marginBottom: '24px',
      '& .MuiButton-root': {
        fontSize: '1.25rem !important',
      },
      '& .MuiButton-root.Mui-disabled': {
        fontSize: '1.25rem !important',
      },
      ...sx,
    }}
    {...props}
  >
    {legend && <legend>{legend}</legend>}
    {children}
  </Box>
);

export default Fieldset;
