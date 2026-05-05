import { Typography } from '@mui/material';
import { ReactNode } from 'react';

export interface LabelProps {
  children?: ReactNode;
  text?: string;
  value?: string;
}

export const Label = ({ children, text, value }: LabelProps) => (
  <Typography color="primary" style={{ fontWeight: 450 }}>
    {children ?? text ?? value}
  </Typography>
);

Label.displayName = 'Label';
