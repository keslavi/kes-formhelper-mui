import { Container as ContainerMui } from '@mui/material';
import type { ContainerProps } from '@mui/material';

type ContainerWrapperProps = Pick<ContainerProps, 'children'>;

export const Container = ({ children }: ContainerWrapperProps) => (
  <ContainerMui maxWidth={false}>{children}</ContainerMui>
);

export const ContainerFullWidth = ({ children }: ContainerWrapperProps) => (
  <ContainerMui maxWidth={false} sx={{ maxWidth: '100% !important' }}>
    {children}
  </ContainerMui>
);
